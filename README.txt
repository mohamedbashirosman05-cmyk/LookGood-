LOOK GOOD - Paket für Claude Code

WAS IST DRIN
- CLAUDE.md          Projektbeschreibung für Claude Code (zuerst lesen lassen)
- LookGood.html Die App. Per Doppelklick im Browser öffnen.
- server/            Kleiner Server für die KI (server.js, package.json, index.html)

SO GEHST DU VOR
1. Entpacke den Ordner.
2. Öffne Claude Code in diesem Ordner und schreibe zum Beispiel:
   "Lies CLAUDE.md und mach dich mit dem Projekt vertraut. Dann sag mir kurz auf Deutsch, was fertig ist und was fehlt."
3. Danach sagst du Claude Code, was als Nächstes kommt.

APP MIT ECHTEN KONTEN ONLINE STELLEN (Server + Datenbank + KI)
Ohne Server läuft die App auch (z. B. über die GitHub-Seite), dann bleiben Konten nur auf dem Gerät.
Mit Server liegen Konten und alle Daten in der Datenbank: Abmelden, App löschen, Handy wechseln -> alles bleibt.

1. Datenbank (kostenlos): neon.tech -> Konto erstellen -> neues Projekt "lookgood" (Region Frankfurt).
   Dort "Connection string" kopieren (beginnt mit postgresql://...). Das ist dein DATABASE_URL.
2. KI-Schlüssel: console.anthropic.com -> API Keys -> Schlüssel erstellen, etwas Guthaben aufladen.
3. render.com -> New -> Web Service -> GitHub-Repository "LookGood-" wählen
   Branch:          claude/wardrobe-feature-planning-m0w8o1
   Root Directory:  server
   Build Command:   npm install
   Start Command:   npm start
   Environment Variables:
     DATABASE_URL       = der Connection string von Neon
     ANTHROPIC_API_KEY  = dein KI-Schlüssel
     AI_MODEL           = claude-sonnet-5-5   (optional, günstiger)
4. "Create Web Service". Nach 2-3 Minuten bekommst du einen Link wie https://look-good.onrender.com
   Test: https://DEIN-LINK/api/health  -> dort muss "db":true stehen (und "chat":true für die KI).
5. Die App ab jetzt über diesen Link öffnen. In Safari: Teilen -> "Zum Home-Bildschirm".

SPÄTER, VOR DER VERÖFFENTLICHUNG (jeweils als Environment Variable auf render.com)
- Echte E-Mail-Codes: resend.com -> RESEND_API_KEY und MAIL_FROM (z. B. LOOK GOOD <code@deine-domain.de>)
- Echte SMS-Codes: twilio.com -> TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM (kostet pro SMS)
- Echtes "Mit Google anmelden": GOOGLE_CLIENT_ID (Google Cloud Console)
- Echtes "Mit Apple anmelden": APPLE_CLIENT_ID (Apple Developer, 99 $/Jahr)
- Danach STRICT_AUTH = 1 setzen: dann gibt es keine Test-Codes mehr.
Solange diese fehlen, läuft der Testbetrieb: Codes erscheinen als Nachricht in der App.

ALT: KI ONLINE STELLEN (nur KI, ohne Konten)
1. API-Schlüssel erstellen: console.anthropic.com -> API Keys. Etwas Guthaben aufladen.
   Den Schlüssel nie in die HTML-Datei schreiben und nie weitergeben.
2. Der Code liegt schon auf GitHub (Repository LookGood-).
3. Auf render.com: New -> Web Service -> Repository LookGood- wählen.
   Root Directory: server
   Start command: npm start
   Environment: ANTHROPIC_API_KEY = dein Schlüssel
   (optional) AI_MODEL = claude-sonnet-5-5   (günstiger und schneller)
4. Deploy klicken. Du bekommst einen Link wie https://look-good.onrender.com
   Öffne die App über diesen Link auf dem Handy. Test: https://DEIN-LINK/api/health

HINWEIS
- Mit Server werden Kleidung und Fotos in der Datenbank gespeichert, ohne Server nur auf dem Gerät.
- Nach jeder Änderung muss server/index.html eine genaue Kopie von LookGood.html sein.
- Auf dem kostenlosen Render-Tarif schläft der Server, die erste Nachricht kann ca. 30 Sekunden dauern.
