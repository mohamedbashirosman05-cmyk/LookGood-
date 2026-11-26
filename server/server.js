// LOOK GOOD server
// - serves the app (index.html)
// - forwards AI chat requests to Anthropic (the key stays on the server)
// - accounts + database (PostgreSQL): one account per Apple ID, e-mail/Google address and phone number;
//   profile, settings, cities, figure, outfit, looks, AI chat and wardrobe items (with photos) are stored per account.
// Needs Node 18+ and the package "pg" (npm install).
//
// Environment variables (set them on render.com, never in the code):
//   ANTHROPIC_API_KEY   AI chat
//   AI_MODEL            optional, default claude-opus-5-5
//   DATABASE_URL        PostgreSQL connection string (Neon, Supabase, Render …). Without it: no accounts on the server.
//   RESEND_API_KEY, MAIL_FROM            real e-mail codes (resend.com), e.g. MAIL_FROM="LOOK GOOD <code@deine-domain.de>"
//   TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM real SMS codes (twilio.com)
//   GOOGLE_CLIENT_ID    real "Sign in with Google" (Google Cloud console)
//   APPLE_CLIENT_ID     real "Sign in with Apple" (Apple Developer, Services ID)
//   STRICT_AUTH=1       for the store release: no test codes, no test Apple/Google logins
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ENV = process.env;
const PORT = ENV.PORT || 3000;
const KEY = ENV.ANTHROPIC_API_KEY;
const MODEL = ENV.AI_MODEL || "claude-opus-5-5"; // chosen here, never by the browser
const STRICT = ENV.STRICT_AUTH === "1";
const MAIL_OK = !!(ENV.RESEND_API_KEY && ENV.MAIL_FROM);
const SMS_OK = !!(ENV.TWILIO_SID && ENV.TWILIO_TOKEN && ENV.TWILIO_FROM);
const MAX_BODY = 8 * 1024 * 1024; // photos are sent as base64
const LIMIT = 30, WINDOW = 60 * 1000; // 30 AI messages per minute per visitor

if (!KEY) console.warn("WARNING: ANTHROPIC_API_KEY is not set. The AI will not answer.");
if (!ENV.DATABASE_URL) console.warn("WARNING: DATABASE_URL is not set. Accounts stay on the device only.");
if (!MAIL_OK) console.warn("NOTE: no e-mail service set (RESEND_API_KEY, MAIL_FROM). E-mail codes are shown in the app (test mode).");
if (!SMS_OK) console.warn("NOTE: no SMS service set (TWILIO_*). SMS codes are shown in the app (test mode).");

/* ---------- small helpers ---------- */
const hits = new Map();
function limited(key, max, win) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter(t => now - t < win);
  list.push(now); hits.set(key, list);
  return list.length > max;
}
setInterval(() => { const now = Date.now(); for (const [k, l] of hits) if (!l.some(t => now - t < 3600e3)) hits.delete(k); }, 600e3).unref();
function ipOf(req) { return (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim(); }
function send(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(obj));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on("data", c => { size += c.length; if (size > MAX_BODY) { reject(new Error("too big")); req.destroy(); } else chunks.push(c); });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
async function json(req) { try { return JSON.parse(await readBody(req) || "{}"); } catch { return null; } }
const sha = s => crypto.createHash("sha256").update(s).digest("hex");
const newId = () => "u" + crypto.randomBytes(9).toString("base64url");
const mailOk = v => typeof v === "string" && v.length <= 200 && /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v);
const phoneOk = v => typeof v === "string" && /^\+\d{7,16}$/.test(v);
const pwStrong = p => typeof p === "string" && p.length >= 8 && p.length <= 200 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p) && /[^\w\s]/.test(p);
function pwHash(p) { const salt = crypto.randomBytes(16).toString("hex"); return "s1$" + salt + "$" + crypto.scryptSync(p, salt, 32).toString("hex"); }
function pwCheck(p, h) {
  if (typeof p !== "string" || !h) return false;
  const [, salt, hex] = h.split("$"); const a = crypto.scryptSync(p, salt, 32), b = Buffer.from(hex, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ---------- database ---------- */
let db = null;
async function dbInit() {
  if (!ENV.DATABASE_URL) return;
  const { Pool } = require("pg");
  const local = /@(localhost|127\.0\.0\.1)[:/]|host=\/|^postgres(ql)?:\/\/\/?[^@]*$/.test(ENV.DATABASE_URL);
  db = new Pool({ connectionString: ENV.DATABASE_URL, max: 5, ssl: local ? false : { rejectUnauthorized: false } });
  await db.query(`
    create table if not exists users(
      id text primary key, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
      login text not null, pw_hash text, data jsonb not null default '{}', ver integer not null default 0);
    create table if not exists identities(
      key text primary key, user_id text not null references users(id) on delete cascade, kind text not null default 'main',
      created_at timestamptz not null default now());
    create index if not exists identities_user on identities(user_id);
    create table if not exists sessions(
      token_hash text primary key, user_id text not null references users(id) on delete cascade,
      created_at timestamptz not null default now(), last_seen timestamptz not null default now());
    create table if not exists codes(
      target text primary key, code_hash text not null, expires_at timestamptz not null, tries integer not null default 0);
    create table if not exists items(
      user_id text not null references users(id) on delete cascade, id text not null, item jsonb not null,
      updated_at timestamptz not null default now(), primary key(user_id, id));`);
  console.log("Database ready.");
}
const q = (sql, args) => db.query(sql, args);

/* ---------- codes (e-mail / SMS) ---------- */
async function deliver(kind, to, code) {
  const text = code + " ist dein LOOK GOOD Code. Teile ihn mit niemandem. / " + code + " is your LOOK GOOD code. Don't share it.";
  if (kind === "email" && MAIL_OK) {
    const r = await fetch("https://api.resend.com/emails", { method: "POST",
      headers: { Authorization: "Bearer " + ENV.RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ from: ENV.MAIL_FROM, to: [to], subject: "LOOK GOOD Code: " + code, text }) });
    if (!r.ok) throw new Error("mail " + r.status + " " + await r.text());
    return true;
  }
  if (kind === "sms" && SMS_OK) {
    const r = await fetch("https://api.twilio.com/2010-04-01/Accounts/" + ENV.TWILIO_SID + "/Messages.json", { method: "POST",
      headers: { Authorization: "Basic " + Buffer.from(ENV.TWILIO_SID + ":" + ENV.TWILIO_TOKEN).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ To: to, From: ENV.TWILIO_FROM, Body: text }) });
    if (!r.ok) throw new Error("sms " + r.status + " " + await r.text());
    return true;
  }
  return false;
}
async function makeCode(target, kind) {
  const code = String(crypto.randomInt(100000, 1000000));
  await q(`insert into codes(target, code_hash, expires_at, tries) values($1,$2, now() + interval '10 minutes', 0)
           on conflict(target) do update set code_hash = excluded.code_hash, expires_at = excluded.expires_at, tries = 0`, [target, sha(target + "|" + code)]);
  const sent = await deliver(kind, target, code);
  if (!sent && STRICT) throw new Error("no_delivery");
  return sent ? null : code; // without e-mail/SMS service the code is shown in the app (test mode)
}
async function useCode(target, code) {
  const r = await q("select code_hash, expires_at, tries from codes where target = $1", [target]);
  const c = r.rows[0];
  if (!c || c.expires_at < new Date() || c.tries >= 5) return false;
  if (sha(target + "|" + String(code || "")) !== c.code_hash) { await q("update codes set tries = tries + 1 where target = $1", [target]); return false; }
  await q("delete from codes where target = $1", [target]);
  return true;
}

/* ---------- Google / Apple tokens (only used when the client IDs are set) ---------- */
const jwksCache = new Map();
async function jwks(url) {
  const c = jwksCache.get(url);
  if (c && Date.now() - c.at < 3600e3) return c.keys;
  const r = await fetch(url); const keys = (await r.json()).keys || [];
  jwksCache.set(url, { at: Date.now(), keys }); return keys;
}
async function verifyJwt(token, url, issuers, aud) {
  const [h, p, s] = String(token || "").split(".");
  if (!s) throw new Error("bad token");
  const head = JSON.parse(Buffer.from(h, "base64url")), body = JSON.parse(Buffer.from(p, "base64url"));
  if (head.alg !== "RS256") throw new Error("bad alg");
  const jwk = (await jwks(url)).find(k => k.kid === head.kid);
  if (!jwk) throw new Error("unknown key");
  const ok = crypto.verify("RSA-SHA256", Buffer.from(h + "." + p), crypto.createPublicKey({ key: jwk, format: "jwk" }), Buffer.from(s, "base64url"));
  if (!ok) throw new Error("bad signature");
  if (!issuers.includes(body.iss)) throw new Error("bad issuer");
  if (body.aud !== aud) throw new Error("bad audience");
  if (!body.exp || body.exp * 1000 < Date.now()) throw new Error("expired");
  return body;
}

/* ---------- who is it? method -> identity key ---------- */
const LABEL = { email: "E-Mail", phone: "Telefonnummer", google: "Google", apple: "Apple" };
async function identity(b) {
  if (b.method === "email") { const e = String(b.email || "").trim().toLowerCase(); if (!mailOk(e)) throw { code: 400, error: "bad_email" }; return { key: "mail:" + e, target: e, email: e }; }
  if (b.method === "phone") { const t = String(b.phone || "").replace(/[^\d+]/g, ""); if (!phoneOk(t)) throw { code: 400, error: "bad_phone" }; return { key: "tel:" + t, target: t }; }
  if (b.method === "google") {
    if (ENV.GOOGLE_CLIENT_ID && b.idToken) {
      const t = await verifyJwt(b.idToken, "https://www.googleapis.com/oauth2/v3/certs", ["accounts.google.com", "https://accounts.google.com"], ENV.GOOGLE_CLIENT_ID).catch(() => null);
      if (!t || !t.email || t.email_verified === false) throw { code: 401, error: "bad_token" };
      return { key: "mail:" + t.email.toLowerCase(), email: t.email.toLowerCase(), verified: true };
    }
    if (STRICT) throw { code: 401, error: "bad_token" };
    const e = String(b.email || "").trim().toLowerCase(); if (!mailOk(e)) throw { code: 400, error: "bad_email" };
    return { key: "mail:" + e, email: e, verified: true }; // test mode
  }
  if (b.method === "apple") {
    if (ENV.APPLE_CLIENT_ID && b.idToken) {
      const t = await verifyJwt(b.idToken, "https://appleid.apple.com/auth/keys", ["https://appleid.apple.com"], ENV.APPLE_CLIENT_ID).catch(() => null);
      if (!t || !t.sub) throw { code: 401, error: "bad_token" };
      return { key: "apple:" + t.sub, email: t.email ? String(t.email).toLowerCase() : "", verified: true };
    }
    if (STRICT) throw { code: 401, error: "bad_token" };
    const d = String(b.devId || ""); if (!/^[\w-]{8,64}$/.test(d)) throw { code: 400, error: "bad_device" };
    return { key: "apple:" + d, verified: true }; // test mode: the Apple ID of this device
  }
  throw { code: 400, error: "bad_method" };
}
async function ownerOf(key) { const r = await q("select u.id, u.login, u.pw_hash from identities i join users u on u.id = i.user_id where i.key = $1", [key]); return r.rows[0] || null; }
async function session(uid) {
  const token = crypto.randomBytes(32).toString("base64url");
  await q("insert into sessions(token_hash, user_id) values($1,$2)", [sha(token), uid]);
  return token;
}
async function payload(uid, token) {
  const u = (await q("select id, login, data, ver, pw_hash from users where id = $1", [uid])).rows[0];
  const items = (await q("select item from items where user_id = $1 order by updated_at", [uid])).rows.map(r => r.item);
  const ids = (await q("select key, kind from identities where user_id = $1", [uid])).rows;
  return { token, uid: u.id, login: u.login, data: u.data, ver: u.ver, items, hasPw: !!u.pw_hash, ids };
}
async function userOf(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || "");
  if (!m) return null;
  const r = await q("update sessions set last_seen = now() where token_hash = $1 returning user_id", [sha(m[1])]);
  return r.rows[0] ? { uid: r.rows[0].user_id, th: sha(m[1]) } : null;
}

/* ---------- account routes ---------- */
async function api(req, res, url) {
  if (!db) return send(res, 503, { error: "no_db" });
  const ip = ipOf(req);
  if (url.startsWith("/api/auth") && limited("auth:" + ip, 40, 60e3)) return send(res, 429, { error: "slow_down" });
  const M = req.method;
  const b = M === "GET" || M === "DELETE" ? {} : await json(req);
  if (b === null) return send(res, 400, { error: "bad_request" });
  try {
    // Is this e-mail / number / Apple ID already in use?
    if (M === "POST" && url === "/api/auth/check") {
      const id = await identity(b), o = await ownerOf(id.key);
      return send(res, 200, { exists: !!o, login: o ? o.login : null, hasPw: o ? !!o.pw_hash : false });
    }
    // Send a 6-digit code by e-mail or SMS
    if (M === "POST" && url === "/api/auth/code") {
      const id = await identity(b);
      if (b.method !== "email" && b.method !== "phone") return send(res, 400, { error: "bad_method" });
      if (limited("code:" + id.target, 5, 3600e3) || limited("codeip:" + ip, 20, 3600e3)) return send(res, 429, { error: "slow_down" });
      const dev = await makeCode(id.target, b.method === "phone" ? "sms" : "email");
      return send(res, 200, dev ? { sent: false, dev } : { sent: true });
    }
    // Create an account or log in
    if (M === "POST" && url === "/api/auth") {
      const id = await identity(b), o = await ownerOf(id.key);
      if (b.mode === "signup") {
        if (o) return send(res, 409, { error: "exists", login: o.login });
        if (b.method === "email" && !pwStrong(b.password)) return send(res, 400, { error: "weak_password" });
        if ((b.method === "email" || b.method === "phone") && !(await useCode(id.target, b.code))) return send(res, 401, { error: "bad_code" });
        const uid = newId();
        await q("insert into users(id, login, pw_hash) values($1,$2,$3)", [uid, LABEL[b.method], b.method === "email" ? pwHash(b.password) : null]);
        try { await q("insert into identities(key, user_id) values($1,$2)", [id.key, uid]); }
        catch { await q("delete from users where id = $1", [uid]); return send(res, 409, { error: "exists" }); }
        if (id.email && id.key !== "mail:" + id.email) await q("insert into identities(key, user_id, kind) values($1,$2,'email') on conflict do nothing", ["mail:" + id.email, uid]);
        return send(res, 200, await payload(uid, await session(uid)));
      }
      if (b.mode === "login") {
        if (!o) return send(res, 404, { error: "no_account" });
        if (b.method === "email") {
          if (!o.pw_hash) return send(res, 409, { error: "uses_other", login: o.login });
          if (limited("pw:" + o.id, 10, 900e3)) return send(res, 429, { error: "slow_down" });
          if (!pwCheck(b.password, o.pw_hash)) return send(res, 401, { error: "wrong_password" });
        }
        if (b.method === "phone" && !(await useCode(id.target, b.code))) return send(res, 401, { error: "bad_code" });
        return send(res, 200, await payload(o.id, await session(o.id)));
      }
      return send(res, 400, { error: "bad_mode" });
    }
    // Forgot password: code by e-mail + new password
    if (M === "POST" && url === "/api/auth/reset") {
      const id = await identity({ method: "email", email: b.email }), o = await ownerOf(id.key);
      if (!o) return send(res, 404, { error: "no_account" });
      if (!pwStrong(b.password)) return send(res, 400, { error: "weak_password" });
      if (!(await useCode(id.target, b.code))) return send(res, 401, { error: "bad_code" });
      await q("update users set pw_hash = $1 where id = $2", [pwHash(b.password), o.id]);
      await q("delete from sessions where user_id = $1", [o.id]);
      return send(res, 200, await payload(o.id, await session(o.id)));
    }

    const me = await userOf(req);
    if (!me) return send(res, 401, { error: "login_required" });
    if (M === "POST" && url === "/api/auth/logout") { await q("delete from sessions where token_hash = $1", [me.th]); return send(res, 200, { ok: true }); }
    if (M === "GET" && url === "/api/me") return send(res, 200, await payload(me.uid));
    if (M === "PUT" && url === "/api/me/data") {
      if (!b.data || typeof b.data !== "object") return send(res, 400, { error: "bad_data" });
      const clean = {};
      for (const k of ["lg_prof", "lg_cities", "lg_avatar", "lg_outfit", "lg_looks", "lg_aichat"]) if (typeof b.data[k] === "string") clean[k] = b.data[k];
      const r = await q("update users set data = $1, ver = ver + 1, updated_at = now() where id = $2 returning ver", [clean, me.uid]);
      return send(res, 200, { ver: r.rows[0].ver });
    }
    let m = /^\/api\/me\/items\/([\w-]{1,40})$/.exec(url);
    if (m && M === "PUT") {
      if (!b.item || b.item.id !== m[1]) return send(res, 400, { error: "bad_item" });
      const n = (await q("select count(*)::int as n from items where user_id = $1", [me.uid])).rows[0].n;
      if (n >= 500) return send(res, 400, { error: "too_many" });
      await q(`insert into items(user_id, id, item) values($1,$2,$3) on conflict(user_id, id) do update set item = excluded.item, updated_at = now()`, [me.uid, m[1], b.item]);
      return send(res, 200, { ok: true });
    }
    if (m && M === "DELETE") { await q("delete from items where user_id = $1 and id = $2", [me.uid, m[1]]); return send(res, 200, { ok: true }); }
    // Add or change the e-mail of an account (with code)
    if (M === "POST" && url === "/api/me/email") {
      const id = await identity({ method: "email", email: b.email }), o = await ownerOf(id.key);
      if (o && o.id !== me.uid) return send(res, 409, { error: "exists" });
      if (!(await useCode(id.target, b.code))) return send(res, 401, { error: "bad_code" });
      if (!o) {
        const login = (await q("select login from users where id = $1", [me.uid])).rows[0].login;
        // account made with e-mail: the login e-mail moves; otherwise the e-mail is an extra address of the account
        if (login === "E-Mail") await q("update identities set key = $1 where user_id = $2 and kind = 'main'", [id.key, me.uid]);
        else { await q("delete from identities where user_id = $1 and kind = 'email'", [me.uid]); await q("insert into identities(key, user_id, kind) values($1,$2,'email')", [id.key, me.uid]); }
      }
      return send(res, 200, { ok: true });
    }
    if (M === "PUT" && url === "/api/me/password") {
      const u = (await q("select pw_hash from users where id = $1", [me.uid])).rows[0];
      if (u.pw_hash && !pwCheck(b.old, u.pw_hash)) return send(res, 401, { error: "wrong_password" });
      if (!pwStrong(b.password)) return send(res, 400, { error: "weak_password" });
      await q("update users set pw_hash = $1 where id = $2", [pwHash(b.password), me.uid]);
      return send(res, 200, { ok: true });
    }
    if (M === "DELETE" && url === "/api/me") { await q("delete from users where id = $1", [me.uid]); return send(res, 200, { ok: true }); }
    return send(res, 404, { error: "not_found" });
  } catch (e) {
    if (e && e.code && e.error) return send(res, e.code, { error: e.error });
    console.error(e);
    return send(res, e && e.message === "no_delivery" ? 503 : 500, { error: e && e.message === "no_delivery" ? "no_delivery" : "server" });
  }
}

/* ---------- AI chat ---------- */
async function chat(req, res) {
  if (!KEY) return send(res, 500, { error: "no_key" });
  if (limited("chat:" + ipOf(req), LIMIT, WINDOW)) return send(res, 429, { error: "slow down" });
  const data = await json(req);
  if (!data) return send(res, 400, { error: "bad request" });
  if (!Array.isArray(data.messages) || !data.messages.length || data.messages.length > 40) return send(res, 400, { error: "bad messages" });
  const system = typeof data.system === "string" ? data.system.slice(0, 6000) : "";
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 600, system, messages: data.messages })
    });
    const out = await r.json();
    if (!r.ok) { console.error("Anthropic error:", JSON.stringify(out)); return send(res, 502, { error: "upstream" }); }
    send(res, 200, { content: out.content });
  } catch (e) { console.error(e); send(res, 502, { error: "upstream" }); }
}

/* ---------- start ---------- */
const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  if (req.method === "GET" && url === "/api/health")
    return send(res, 200, { ok: true, chat: !!KEY, db: !!db, mail: MAIL_OK, sms: SMS_OK, google: ENV.GOOGLE_CLIENT_ID || null, apple: !!ENV.APPLE_CLIENT_ID, strict: STRICT });
  if (req.method === "POST" && url === "/api/chat") return chat(req, res);
  if (url.startsWith("/api/")) return api(req, res, url).catch(e => { console.error(e); send(res, 500, { error: "server" }); });
  if (req.method === "GET" && (url === "/" || url === "/index.html" || url === "/LookGood.html")) {
    return fs.readFile(path.join(__dirname, "index.html"), (err, html) => {
      if (err) return send(res, 500, { error: "index.html missing" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
      res.end(html);
    });
  }
  send(res, 404, { error: "not found" });
});
dbInit().catch(e => { console.error("Database error:", e.message); db = null; })
  .finally(() => server.listen(PORT, () => console.log("Look Good runs on http://localhost:" + PORT)));
