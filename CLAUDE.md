# LOOK GOOD – project brief for Claude Code

Read this file first. It describes what exists, how it is built, what is deliberately NOT built yet, and how to work with the owner.

## 1. How to work with the owner
- **After every change, send the owner the updated `LookGood.html`** (SendUserFile, display attach) **and** the GitHub download link `https://github.com/mohamedbashirosman05-cmyk/LookGood-/blob/claude/wardrobe-feature-planning-m0w8o1/LookGood.html`. Always, without being asked. Also republish the online view (Artifact `https://claude.ai/artifact/XDcLByMdaw4Mtk8vMtL5zx`, file `dist/look-good-app-online.html` = LookGood.html without doctype/html/head/body tags) and send `dist/LookGood.zip` (the 10 MB HTML may be too big for the file card).
- **Profile pictures of people** = their own photo; without a photo the first letter of their name. **Animals (Panda, Fuchs, Hase) are only for the AI's picture**, never for people.
- The owner is a non-programmer and writes in **German** (often dictated, informal). Reply in German, short and plain. No jargon without explanation.
- He wants **short answers, concrete results, and things that actually run**. Test in a real browser (Playwright) before saying something works. Never claim a feature works if you did not run it.
- Do not rebuild or restyle things that are already approved (see section 3). Change only what he asks.
- Ask one short question when a request is genuinely ambiguous; otherwise just build.
- Never put API keys in the HTML or in git. Keys live in server environment variables.

## 2. What the app is
**LOOK GOOD** – a mobile-first personal-stylist app (a "personal stylist, every day"). One self-contained file, `LookGood.html` (vanilla HTML/CSS/JS, no framework, no build step, about 10 MB because the 3D figure engine and its MakeHuman data are embedded). It is a prototype: sign-in and profile are stored only in the browser (`localStorage`), nothing is connected to a user database yet.

Files in this package:
- `LookGood.html` – the app. Opens directly by double-click (AI chat shows "not connected" until a server is set).
- `server/` – tiny Node server (no dependencies, Node 18+): `server.js`, `package.json`, `index.html` (exact copy of the app). It serves the app and forwards chat requests to the Anthropic API so the key stays secret.
- `README.txt` – deploy steps for the owner (Render + GitHub).
- `CLAUDE.md` – this file.

Keep `server/index.html` an exact copy of `LookGood.html` (`cp LookGood.html server/index.html`). `AI_URL` is chosen automatically: `/api/chat` when the page is served over http(s), empty when opened as a file.

## 3. What is DONE and approved by the owner (do not change unless asked)
1. **Start animation** and logo (LOOK GOOD wordmark, the two "OO" are pink eyes).
2. **Welcome screen + sign-in** (reworked Nov 2026): "Create account" / "Log in". Methods: Apple, Google (system-style confirmation sheet), email + password (password rules checklist, email verification code, "forgot password" via code), phone number with country picker + 6-digit SMS code (resend timer, code boxes, wrong-code shake). Prototype: the account lives only on this device (`prof.acc` = {t,id,pw-hash}); codes are shown as an in-app iOS-style notification banner (tap fills the code). Logging in with unknown details shows "No account found → create one". **Stays logged in** (`prof.session`): after the splash the app goes straight to Home; "Log out" clears the session.
3. **Onboarding** (3 steps): first name, last name → **username** (`prof.user`, unique, 3–20 chars a–z 0–9 . _) + optional **nickname** (`prof.nick`) → date of birth (age is calculated, minimum 13 years), gender (Male / Female / Other / Prefer not to say), then "Let's go".
4. **City + real weather** on Home: choose a city (online city search, offline fallback list), weather from Open-Meteo (current, next 4 hours, today/tomorrow/day after), a friendly daily message based on the weather (rain, snow, heat, cold, wind, sun, generic compliments), city photo background.
5. **Bottom tabs** (since 26 Nov 2026): Home · Garderobe · **Flash** (round camera button in the middle, opens the camera) · **Chat** (inbox, friends, stories; badge with unread count) · AI.
6. **Profile / settings** (opens from the round avatar top right): profile photo, edit profile (name, username), account (login details, email add/change, change password, forgot-password flow with 6-digit code – all prototype, no server), who sees the profile, notifications, privacy ("AI may use my location"), appearance light/dark, **language**, log out, delete account. Chat history entry (empty list for now).
7. **8 languages**, whole app translates instantly: Deutsch, English, Français, Español, Português, العربية (right-to-left layout), हिन्दी, 中文. See section 5.
8. **AI chat page** (tab "AI"): greeting "Hi, ich bin Mo/Sarah. Wie kann ich dir helfen?" (translated), message bubbles, **typing + photo from gallery + take photo (camera) only. No microphone, no voice conversation (removed on purpose by the owner).** The avatar at the top can be tapped to switch the picture (Mo, Sarah, Panda, Fuchs, Hase); the AI's **name is always Mo or Sarah** (`prof.ai`).
9. **AI personality** (system prompt in `sys()`): name is only Mo or Sarah, never ChatGPT/Claude/Gemini or any model/company (honest that it is the app's AI stylist if sincerely asked). Texts like a friend on WhatsApp: **1–2 short sentences, max 3**, no lists/markdown. **Mirrors the person from the first message** (language, slang like "bro", "digga", "wallah", "girly", tone, age; polite with formal/older users). For outfits: first asks ONE short question about the person's day, then a concrete outfit that fits the day and the **weather** (`LW` = now, feels-like, wind, today min/max + rain chance, tomorrow; only if location is allowed). Knows name, age, gender, local time.

## 4. Wardrobe (built Nov 2026, owner chose "Weg A": 3D avatar in the app)
- Layout like the owner's reference image: 6 category buttons left (Tops, Hosen, Schuhe, Jacken, Accessoires, Socken), 3D stage in the middle (drag to rotate 360°, arrow buttons turn 45°), 6 right (Schmuck, Uhren, Brillen, Taschen, Unterwäsche, Mehr). Below: "Dein Outfit (n)" thumbnails with ×, "Alles löschen", "Look speichern".
- Category tap opens a bottom sheet: sub-type chips, 3-column grid of the user's items (tap = put on/take off), "Bearbeiten" (delete), "+ hinzufügen". Empty category shows only the add prompt (no fake items).
- Adding an item: photo (camera or gallery) → background removed by flood-fill from the border (works best on plain light background) → main colour detected → form (type, colour, optional name) → saved and put on. If the server/AI is connected, Claude vision pre-fills type, name and colour.
- Avatar creator (owner's plan, built 26 Nov 2026): wardrobe starts without a figure ("Erstelle deine Figur" → "Los geht's"). Steps: 1 man/woman, 2 face + skin tone (Dunkelbraun, Braun, Olive, Hell, Ginger; all bald, no beard; fine-tune slider), 3 hair type 1A–4C (filters the styles), 4 hairstyle (15 incl. bald), 5 hair colour (big colour field + 16 presets, live), 6 beard (men: 7 incl. none, beard colour), 7 eyes (11), eyebrow shape (12) + colour, eyelashes (4) → save. Stored as `lg_avatar2`; "Mehr → Figur bearbeiten".
- Figure engine: ara3d 0.16 (MIT) + three.js r160, bundled and patched: (a) the "opened as a file" block removed, (b) when opened as a file the worker code runs inline in the page (browsers block workers on file://), (c) worker/page fetches of `https://lg.assets/…` are served from `window.LG_ASSETS` (86 MakeHuman files, CC0; hair/eyebrow textures converted to bright grayscale so `hairTint` gives true colours; ~7.8 MB). Body values fixed (age/muscle/weight/height 0.5) because only those morph targets are embedded. Default clothes: men loose shorts, women shorts + tank top.
- Live colours (hair, beard, brows) change materials instantly; other changes rebuild the figure (~2–4 s, spinner "Figur wird gebaut …"). Long hair sways with rotation inertia and wind via a vertex-shader patch (`hairMat`). Idle animation + blinking (`hero.update`).
- **The user's clothes are not yet shown on the figure** (next step). Honest limits told to owner: ~15 hairstyles instead of 25+25, 6 beards instead of 15, no freckles/hairline/parting.
- Background: street (procedural buildings, lamps) matched to the Home weather (`WX`: sun/cloud/rain/snow/fog/storm, night with lit windows, snow/rain particles, wet ground) or a dark studio when no city is chosen or the user picks "Hintergrund: Studio" (`prof.wbg`).
- Storage: items with photos in IndexedDB `lookgood/items`; `lg_avatar`, `lg_outfit`, `lg_looks` in localStorage. "Konto löschen" clears all of it.
- The AI chat gets the wardrobe list and the current outfit in its system prompt (`wdForAI()`), so Mo/Sarah can suggest outfits from the user's own clothes.
- Source of the wardrobe code lives inside LookGood.html (search "Garderobe: 3D-Figur" and "Garderobe: Bedienung").

## 4c. Flash & Chat (built 26 Nov 2026, owner's spec "Flash-System")
- **Demo mode until a real server exists.** Everything is stored on the device: `lg_social` (friends, requests, blocked, chats, stories, seen state) and media blobs in IndexedDB `lookgood` v2, store `media`. Eight **test friends** (Lina, Jay, Sami, Nora, Elif, Ben, Maya, Tom; marked "Test"; avatar = first letter, never animals) reply automatically (`bot()`), mark your flashes as opened, sometimes send a Flash back, accept requests after 4 s; Nora sends a Flash ~25 s after first start. The data functions (`soInit`, `sendTo`, `chat`, `acceptReq` …) are the seam to replace with a real backend later.
- **Flash camera** (`openCam`): live camera via getUserMedia (front/back, torch / front screen-flash), tap = photo, hold = video up to 10 s (MediaRecorder, sound if mic allowed), gallery; fallback buttons to the phone camera if live camera is unavailable (e.g. inside some apps).
- **Editor** (`openEditor2`): text bar (drag up/down, tap to cycle 3 styles, drag to trash), emoji stickers (drag, pinch/scroll to resize), drawing (8 colours, undo), 7 filters, timer 3/5/10 s/∞. Photos are flattened to JPEG; videos keep an overlay PNG + filter.
- **Send**: to friends and/or "Meine Story" (24 h). **Viewer** (`player`): progress bars, tap right/left = next/previous, hold = pause, swipe down = close, story reply field (reply appears quoted in chat), "Im Chat speichern", my story shows "Angesehen von …".
- **Inbox**: stories row with gradient ring (unseen) / grey (seen), friend requests (accept/decline), chat rows sorted by activity with status icons: filled square = new Flash (pink photo / violet video), filled bubble = new chat (blue), arrow filled = delivered, arrow outline = opened/read, outline square/bubble = viewed/received; "schreibt gerade …". In-app push banner (`notify2`) for new Flashes/messages.
- **1-to-1 chat**: bubbles, day separators, Flash chips, gallery photos, **outfit card** (current wardrobe outfit + weather, also from Garderobe → Mehr → "Outfit an Freunde schicken"), voice messages (hold mic), story-reply quotes, long press = save / copy / delete own, per-chat "delete after reading" option.
- **Friends** screen: search by username/name, add → "Anfrage gesendet" → accepted, accept/decline requests, remove, block/unblock; only friends can send/see Flashes and stories.
- Design (owner, 26 Nov): **not a Snapchat copy, calm and adult.** Avatars = card-coloured circle with dark ink outline and the first letter (or the person's photo); new story = thin ink double ring. Flash button, my chat bubbles, send/camera buttons = app ink (aubergine). Only accent: app pink for "new" (dot at the right, bold preview). Row status in words: preview of last message, "Du: … · gesendet/gesehen", "Neuer Flash". **Outfit-Serie** (streak): hanger icon + days in a row with Flashes both ways (`streak()`; demo seeds Lina 12, Jay 3). No pink/violet/blue colour coding, no squares/arrows.
- Watch out: everything runs inside one IIFE; top-level names must not clash with the app (`finish`, `done`, `sv` and the CSS class `.st` were already taken — use `edFinish`, `edDone`, `SV`, `.sti`).

## 4b. Still deliberately NOT built
- Real server for Flash/Chat (accounts, delivery between phones, real push notifications).
- Real accounts / database / real login / real email or SMS codes.
- The "Chat history" list in the profile (empty by design for now).

## 5. Architecture notes (so you do not break things)
- Everything is in `LookGood.html`: CSS in one `<style>`, JS in one `<script>`. Consider splitting into files only if the owner agrees.
- **Translations**: German is the source language. All visible texts are German strings; the dictionary `D` maps each German string to an array of 7 translations in the order `en, fr, es, pt, ar, hi, zh`. `tr(s)` returns the translation for the current language (`prof.lang`), falling back to the German string. Helpers `el()`, `say()` (toast), `ts()` and form labels already pass through `tr()`. Static HTML texts are collected once at startup into the list `ST` and re-applied by `applyLang()` (ids listed in `SKIP` and some containers are excluded). **When you add any new visible text: add it to `D` with all 7 translations, and make sure it goes through `tr()`.** Language lists: `LN` (names), `LC` (codes, `ar` switches `dir="rtl"`), `LOC` (speech locales).
- **RTL**: CSS has `[dir=rtl]` rules; use logical properties where possible. Test Arabic after UI changes.
- **State**: `prof` (profile object, saved with `saveProf()` under `localStorage` key `lg_prof`), `cities` (key `lg_cities`), helper `ls(key,value)`. `prof.ai` = "Mo" or "Sarah" (voice and persona), `prof.skin` = displayed character (Mo/Sarah/Panda/Fuchs/Hase), `prof.lang`, `prof.theme`, `prof.loc` (AI may use location).
- **AI chat**: `AI_URL` is the server endpoint (POST, Anthropic Messages format, body `{model,max_tokens,system,messages}`; response `{content:[{type:"text",text}]}`). History is in `H`; photos are sent as base64 JPEG (max 1024 px). The server ignores the model sent by the client and uses its own `AI_MODEL` env variable (default `claude-opus-5-5`; the owner can switch to `claude-sonnet-5-5` to save cost). The current weather string `LW` is added to the system prompt only if the user allowed location use.
- **Server**: per-visitor rate limit 30 messages/minute, max request 8 MB. `GET /api/health` returns `{ok:true,chat:<key set?>}`.
- Weather and city search call Open-Meteo / photo sources from the browser; they do not work inside sandboxed previews, only in a normal browser.

## 6. Known limitations / honest status
- Tested with a headless Chromium on a phone-sized viewport (login, tabs, language switch incl. Arabic, chat greeting). **Not yet tested on real iPhone/Android devices**, and the live AI answers were never tested with a real API key (no network in the build environment). First thing to verify with the owner: deploy, add `ANTHROPIC_API_KEY`, send a message.
- City names from the built-in list stay German (e.g. "Kopenhagen").
- Login, password change and codes are prototype screens (realistic flow, but no real SMS/email and no server account).

## 7. Deploy (summary, details in README.txt)
1. API key at console.anthropic.com (add credit). 2. Upload `server/` files to a GitHub repo. 3. Render.com → Web Service → start command `npm start` → environment variable `ANTHROPIC_API_KEY`. 4. Open the Render link on the phone (not the local HTML file) so the AI works.

## 8. Suggested next steps (ask the owner which one first)
1. Verify the deployed AI chat with a real key; tune the personality prompt from his real conversations.
3. Real accounts (database + login), then store chat history.
4. Friends tab.
5. Package as an installable app (PWA or Capacitor) once the features are stable.

## 9. Archive (reference only, do not edit)
archiv/ holds earlier versions the owner shared, for context only:
- 1-anfang.html – first version.
- 2-mitte-live_6_2.html, 3-mitte-live_6_3-alte-garderobe.html – middle versions incl. the discarded wardrobe attempt (category buttons Tops/Hosen/Schuhe/Jacken/Kappen/Ketten/Uhren/Brillen/Taschen/Armbänder around a grey mannequin, "Person erstellen", "Dein Outfit", "Anprobieren"). Only use as a reference if the owner asks.
The current app is LookGood.html (+ server/index.html).

## 10. Structure and plan (from 26 Nov 2026, owner's "Tag 1")
- `LookGood.html` = the one complete app file (download this). `server/index.html` must be an exact copy.
- `docs/Tag1-Bestandsaufnahme.html` = inventory: every file, what works, what we keep, what must be rebuilt for a real store app (server accounts + database so updates never lose user data, real login, App/Play Store packaging, bug reports).
- `sicherung/2026-11-26_vor-tag1/` = backups (old app with procedural figure, figure test). `archiv/` = owner's first versions. Never delete these.
- Owner's avatar plan (next): male/female → 5 base faces (dark brown, brown, olive, light, ginger; bald, no beard) → hair type filter 1A–4C → hairstyle → hair colour picker field (live) → beard (male) → eyes/brows. Honest limits told to owner: ara3d offers ~14 hairstyles (not 25+25), 6 beards (not 15), no freckles/hairline/parting; more hairstyles would have to be bought.
- Downloads: the Claude app cannot save files sent from this cloud session. Give the owner GitHub links: file page `github.com/<repo>/blob/<branch>/LookGood.html` (download icon) and the branch ZIP `github.com/<repo>/archive/refs/heads/<branch>.zip`. Creating GitHub releases is not allowed from this session.
- Build sources for the 3D parts live outside the repo (scratchpad); if they are lost, regenerate figures with ara3d in a headless browser and compress with gltf-transform (meshopt, webp, 1024 px).
