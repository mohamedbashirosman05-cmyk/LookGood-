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
- `server/` – tiny Node server (no dependencies, Node 18+): `server.js`, `package.json`, `index.html` (exact copy of the app). It serves the app and forwards chat requests to the Anthropic API so the key stays secret.
- `README.txt` – deploy steps for the owner (Render + GitHub).
- `CLAUDE.md` – this file.

Keep `server/index.html` an exact copy of `look-good-app.html` (`cp look-good-app.html server/index.html`). `AI_URL` is chosen automatically: `/api/chat` when the page is served over http(s), empty when opened as a file.

## 3. What is DONE and approved by the owner (do not change unless asked)
1. **Start animation** and logo (LOOK GOOD wordmark, the two "OO" are pink eyes).
2. **Welcome screen + sign-in** (reworked Nov 2026): "Create account" / "Log in". Methods: Apple, Google (system-style confirmation sheet), email + password (password rules checklist, email verification code, "forgot password" via code), phone number with country picker + 6-digit SMS code (resend timer, code boxes, wrong-code shake). Prototype: the account lives only on this device (`prof.acc` = {t,id,pw-hash}); codes are shown as an in-app iOS-style notification banner (tap fills the code). Logging in with unknown details shows "No account found → create one". **Stays logged in** (`prof.session`): after the splash the app goes straight to Home; "Log out" clears the session.
3. **Onboarding** (2 steps): first name, last name, date of birth (age is calculated, minimum 13 years), gender (Male / Female / Other / Prefer not to say), then "Let's go".
4. **City + real weather** on Home: choose a city (online city search, offline fallback list), weather from Open-Meteo (current, next 4 hours, today/tomorrow/day after), a friendly daily message based on the weather (rain, snow, heat, cold, wind, sun, generic compliments), city photo background.
5. **Bottom tabs**: Home, Wardrobe, Friends, AI.
6. **Profile / settings** (opens from the round avatar top right): profile photo, edit profile (name, username), account (login details, email add/change, change password, forgot-password flow with 6-digit code – all prototype, no server), who sees the profile, notifications, privacy ("AI may use my location"), appearance light/dark, **language**, log out, delete account. Chat history entry (empty list for now).
7. **8 languages**, whole app translates instantly: Deutsch, English, Français, Español, Português, العربية (right-to-left layout), हिन्दी, 中文. See section 5.
8. **AI chat page** (tab "AI"): greeting "Hi, ich bin Mo/Sarah. Wie kann ich dir helfen?" (translated), message bubbles, **typing + photo from gallery + take photo (camera) only. No microphone, no voice conversation (removed on purpose by the owner).** The avatar at the top can be tapped to switch the picture (Mo, Sarah, Panda, Fuchs, Hase); the AI's **name is always Mo or Sarah** (`prof.ai`).
9. **AI personality** (system prompt in `sys()`): name is only Mo or Sarah, never ChatGPT/Claude/Gemini or any model/company (honest that it is the app's AI stylist if sincerely asked). Texts like a friend on WhatsApp: **1–2 short sentences, max 3**, no lists/markdown. **Mirrors the person from the first message** (language, slang like "bro", "digga", "wallah", "girly", tone, age; polite with formal/older users). For outfits: first asks ONE short question about the person's day, then a concrete outfit that fits the day and the **weather** (`LW` = now, feels-like, wind, today min/max + rain chance, tomorrow; only if location is allowed). Knows name, age, gender, local time.

## 4. Wardrobe (built Nov 2026, owner chose "Weg A": 3D avatar in the app)
- Layout like the owner's reference image: 6 category buttons left (Tops, Hosen, Schuhe, Jacken, Accessoires, Socken), 3D stage in the middle (drag to rotate 360°, arrow buttons turn 45°), 6 right (Schmuck, Uhren, Brillen, Taschen, Unterwäsche, Mehr). Below: "Dein Outfit (n)" thumbnails with ×, "Alles löschen", "Look speichern".
- Category tap opens a bottom sheet: sub-type chips, 3-column grid of the user's items (tap = put on/take off), "Bearbeiten" (delete), "+ hinzufügen". Empty category shows only the add prompt (no fake items).
- Adding an item: photo (camera or gallery) → background removed by flood-fill from the border (works best on plain light background) → main colour detected → form (type, colour, optional name) → saved and put on. If the server/AI is connected, Claude vision pre-fills type, name and colour.
- Avatar: intro card "Erstelle deine Figur" → "Mit Selfie" (AI reads skin/hair/eyes/beard/build from the selfie if the server is connected, otherwise local colour sampling; photo is not stored) or "Selbst gestalten". Editor tabs Körper (body shape m/f, height, build, shoulders, legs, skin tone), Gesicht (eye colour/size/shape, nose, lips, face shape, brows), Haare (11 styles, colour, beard).
- 3D: three.js r149 subset inlined at the end of the HTML (MIT, ~450 KB, works offline). Body and garments are signed-distance fields meshed with surface nets (one smooth surface, no visible joints); garments are offset shells of selected body parts with clip planes (hems, sleeve length). Head/face/hair are parametric meshes. Cloth sways with rotation inertia and with wind.
- Background: street (procedural buildings, lamps) matched to the Home weather (`WX`: sun/cloud/rain/snow/fog/storm, night with lit windows, snow/rain particles, wet ground) or a dark studio when no city is chosen or the user picks "Hintergrund: Studio" (`prof.wbg`).
- Storage: items with photos in IndexedDB `lookgood/items`; `lg_avatar`, `lg_outfit`, `lg_looks` in localStorage. "Konto löschen" clears all of it.
- The AI chat gets the wardrobe list and the current outfit in its system prompt (`wdForAI()`), so Mo/Sarah can suggest outfits from the user's own clothes.
- Source of the wardrobe code lives inside look-good-app.html (search "Garderobe: 3D-Figur" and "Garderobe: Bedienung").

## 4b. Still deliberately NOT built
- **Friends tab**: empty placeholder too.
- Real accounts / database / real login / real email or SMS codes.
- The "Chat history" list in the profile (empty by design for now).

## 5. Architecture notes (so you do not break things)
- Everything is in `look-good-app.html`: CSS in one `<style>`, JS in one `<script>`. Consider splitting into files only if the owner agrees.
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
The current app is look-good-app.html (+ server/index.html).

## 10. New avatar (in progress, Nov 2026)
- Owner rejected the procedural SDF figure as ugly. New approach approved by owner ("nimm das Risiko"): realistic MakeHuman characters generated with the `ara3d` library (MIT, npm ara3d@0.16.0) and `ara3d-data` (CC0, MakeHuman). Characters are generated in a headless browser, exported as GLB, compressed with gltf-transform (meshopt + webp, 1024 px textures, ~2.3 MB each) and embedded as base64, so the HTML works offline in the owner's code app.
- `figur-test.html` = standalone test of the figure only (male/female, drag 360°, idle animation, blinking, dark studio). Not yet in the app; wait for the owner's verdict.
- Owner's plan: new users first see a short intro with a default figure, then either take a selfie (AI picks the ara3d parameters so the figure looks similar) or build it themselves (face, hair, body, skin, height). Default clothes: men shorts only, women shorts + top.
