// Look Good server: serves the app and forwards AI chat requests to Anthropic.
// No dependencies. Needs Node 18 or newer.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.AI_MODEL || "claude-opus-5-5"; // chosen here, never by the browser
const MAX_BODY = 8 * 1024 * 1024; // photos are sent as base64
const LIMIT = 30, WINDOW = 60 * 1000; // 30 messages per minute per visitor

if (!KEY) console.warn("WARNING: ANTHROPIC_API_KEY is not set. The AI will not answer.");

const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter(t => now - t < WINDOW);
  list.push(now); hits.set(ip, list);
  return list.length > LIMIT;
}
setInterval(() => hits.clear(), 10 * WINDOW).unref();

function send(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json" });
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

async function chat(req, res) {
  if (!KEY) return send(res, 500, { error: "no_key" });
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
  if (limited(ip)) return send(res, 429, { error: "slow down" });
  let data;
  try { data = JSON.parse(await readBody(req)); } catch { return send(res, 400, { error: "bad request" }); }
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

http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/api/health") return send(res, 200, { ok: true, chat: !!KEY });
  if (req.method === "POST" && req.url === "/api/chat") return chat(req, res);
  if (req.method === "GET" && (req.url === "/" || req.url.startsWith("/?"))) {
    return fs.readFile(path.join(__dirname, "index.html"), (err, html) => {
      if (err) return send(res, 500, { error: "index.html missing" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
  }
  send(res, 404, { error: "not found" });
}).listen(PORT, () => console.log("Look Good runs on http://localhost:" + PORT));
