# LOOK GOOD – project brief for Claude Code

Read this file first. It describes what exists, how it is built, what is deliberately NOT built yet, and how to work with the owner.

## 1. How to work with the owner
- The owner is a non-programmer and writes in **German** (often dictated, informal). Reply in German, short and plain. No jargon without explanation.
- He wants **short answers, concrete results, and things that actually run**. Test in a real browser (Playwright) before saying something works. Never claim a feature works if you did not run it.
- Do not rebuild or restyle things that are already approved (see section 3). Change only what he asks.
- Ask one short question when a request is genuinely ambiguous; otherwise just build.
- Never put API keys in the HTML or in git. Keys live in server environment variables.

## 2. What the app is
**LOOK GOOD** – a mobile-first personal-stylist app (a "personal stylist, every day"). One self-contained file, `look-good-app.html` (vanilla HTML/CSS/JS, no framework, no build step, about 100 KB). It is a prototype: sign-in and profile are stored only in the browser (`localStorage`), nothing is connected to a user database yet.

Files in this package:
- `look-good-app.html` – the app. Opens directly by double-click (AI chat shows "not connected" until a server is set).
- `server/` – tiny Node server (no dependencies, Node 18+): `server.js`, `package.json`, `index.html` (same app, but `AI_URL="/api/chat"`). It serves the app and forwards chat requests to the Anthropic API so the key stays secret.
- `README.txt` – deploy steps for the owner (Render + GitHub).
- `CLAUDE.md` – this file.

Keep `server/index.html` in sync with `look-good-app.html`; the only difference is the line `var AI_URL=""` vs `var AI_URL="/api/chat"`.

## 3. What is DONE and approved by the owner (do not change unless asked)
1. **Start animation** and logo (LOOK GOOD wordmark, the two "OO" are pink eyes).
2. **Welcome screen**: "Create account" / "Log in". Sign up or log in with Apple, Google or phone number (prototype only, no real auth).
3. **Onboarding** (2 steps): first name, last name, date of birth (age is calculated, minimum 13 years), gender (Male / Female / Other / Prefer not to say), then "Let's go".
4. **City + real weather** on Home: choose a city (online city search, offline fallback list), weather from Open-Meteo (current, next 4 hours, today/tomorrow/day after), a friendly daily message based on the weather (rain, snow, heat, cold, wind, sun, generic compliments), city photo background.
5. **Bottom tabs**: Home, Wardrobe, Friends, AI.
6. **Profile / settings** (opens from the round avatar top right): profile photo, edit profile (name, username), account (login details, email add/change, change password, forgot-password flow with 6-digit code – all prototype, no server), who sees the profile, notifications, privacy ("AI may use my location"), appearance light/dark, **language**, log out, delete account. Chat history entry (empty list for now).
7. **8 languages**, whole app translates instantly: Deutsch, English, Français, Español, Português, العربية (right-to-left layout), हिन्दी, 中文. See section 5.
8. **AI chat page** (tab "AI"): greeting "Hi, ich bin dein Stylish KI. Wie kann ich dir helfen heute?" (translated), message bubbles, send photo, dictation (microphone) and voice conversation (wave button), AI profile picture at the top that can be tapped to switch between **Mo** (boy) / **Sarah** (girl) and the characters **Panda, Fuchs (fox), Hase (rabbit)**. Voice: Sarah = female voice, Mo = male voice (picked from the device's speech voices).
9. **AI personality** (system prompt in `sys()`): one of the smartest assistants; expert in fashion/outfits/weather but able to talk about anything; **very short answers (2–3 sentences)**; asks ONE concrete follow-up question when the request is vague; **mirrors the user's way of writing** (replies in the user's language, adapts to casual/slang like "wallah", "hey bro" only after observing a few messages, never mocking); remembers what the user says; judges photos concretely; replies may be read aloud so no emoji spam.

## 4. What is deliberately NOT built (placeholder only)
- **Wardrobe tab ("Garderobe")**: currently only an empty placeholder screen ("Your clothes will land here soon."). An earlier attempt was thrown away on purpose. **Do not build any wardrobe, avatar, try-on or dressing-room feature until the owner describes it again.** When he does, ask him questions first and show him a visual reference before building.
- **Friends tab**: empty placeholder too.
- Real accounts / database / real login / real email or SMS codes.
- The "Chat history" list in the profile (empty by design for now).

## 5. Architecture notes (so you do not break things)
- Everything is in `look-good-app.html`: CSS in one `<style>`, JS in one `<script>`. Consider splitting into files only if the owner agrees.
- **Translations**: German is the source language. All visible texts are German strings; the dictionary `D` maps each German string to an array of 7 translations in the order `en, fr, es, pt, ar, hi, zh`. `tr(s)` returns the translation for the current language (`prof.lang`), falling back to the German string. Helpers `el()`, `say()` (toast), `ts()` and form labels already pass through `tr()`. Static HTML texts are collected once at startup into the list `ST` and re-applied by `applyLang()` (ids listed in `SKIP` and some containers are excluded). **When you add any new visible text: add it to `D` with all 7 translations, and make sure it goes through `tr()`.** Language lists: `LN` (names), `LC` (codes, `ar` switches `dir="rtl"`), `LOC` (speech locales).
- **RTL**: CSS has `[dir=rtl]` rules; use logical properties where possible. Test Arabic after UI changes.
- **State**: `prof` (profile object, saved with `saveProf()` under `localStorage` key `lg_prof`), `cities` (key `lg_cities`), helper `ls(key,value)`. `prof.ai` = "Mo" or "Sarah" (voice and persona), `prof.skin` = displayed character (Mo/Sarah/Panda/Fuchs/Hase), `prof.lang`, `prof.theme`, `prof.loc` (AI may use location).
- **AI chat**: `AI_URL` is the server endpoint (POST, Anthropic Messages format, body `{model,max_tokens,system,messages}`; response `{content:[{type:"text",text}]}`). History is in `H`; photos are sent as base64 JPEG (max 1024 px). The server ignores the model sent by the client and uses its own `AI_MODEL` env variable (default `claude-opus-5-5`; the owner can switch to `claude-sonnet-5-5` to save cost). The current weather string `LW` is added to the system prompt only if the user allowed location use.
- **Voice**: `SpeechRecognition`/`webkitSpeechRecognition` (works in Chrome, Edge, Safari) for dictation and conversation loop; `speechSynthesis` for the AI voice. Not supported everywhere – the app shows a message instead of failing.
- **Server**: per-visitor rate limit 30 messages/minute, max request 8 MB. `GET /api/health` returns `{ok:true,chat:<key set?>}`.
- Weather and city search call Open-Meteo / photo sources from the browser; they do not work inside sandboxed previews, only in a normal browser.

## 6. Known limitations / honest status
- Tested with a headless Chromium on a phone-sized viewport (login, tabs, language switch incl. Arabic, chat greeting). **Not yet tested on real iPhone/Android devices**, and the live AI answers were never tested with a real API key (no network in the build environment). First thing to verify with the owner: deploy, add `ANTHROPIC_API_KEY`, send a message.
- Voice conversation and dictation depend on the browser; female/male voice choice depends on the voices installed on the device.
- City names from the built-in list stay German (e.g. "Kopenhagen").
- Login, password change and codes are fake prototype screens.

## 7. Deploy (summary, details in README.txt)
1. API key at console.anthropic.com (add credit). 2. Upload `server/` files to a GitHub repo. 3. Render.com → Web Service → start command `npm start` → environment variable `ANTHROPIC_API_KEY`. 4. Open the Render link on the phone (not the local HTML file) so the AI works.

## 8. Suggested next steps (ask the owner which one first)
1. Verify the deployed AI chat with a real key; tune the personality prompt from his real conversations.
2. Re-describe and then design the **Wardrobe** (he will explain; see section 4).
3. Real accounts (database + login), then store chat history.
4. Friends tab.
5. Package as an installable app (PWA or Capacitor) once the features are stable.

## 9. Archive (reference only, do not edit)
archiv/ holds earlier versions the owner shared, for context only:
- 1-anfang.html – first version.
- 2-mitte-live_6_2.html, 3-mitte-live_6_3-alte-garderobe.html – middle versions incl. the discarded wardrobe attempt (category buttons Tops/Hosen/Schuhe/Jacken/Kappen/Ketten/Uhren/Brillen/Taschen/Armbänder around a grey mannequin, "Person erstellen", "Dein Outfit", "Anprobieren"). Only use as a reference if the owner asks.
The current app is look-good-app.html (+ server/index.html).
