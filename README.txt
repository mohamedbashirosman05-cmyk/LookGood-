LOOK GOOD - Paket für Claude Code

WAS IST DRIN
- CLAUDE.md          Projektbeschreibung für Claude Code (zuerst lesen lassen)
- look-good-app.html Die App. Per Doppelklick im Browser öffnen.
- server/            Kleiner Server für die KI (server.js, package.json, index.html)

SO GEHST DU VOR
1. Entpacke den Ordner.
2. Öffne Claude Code in diesem Ordner und schreibe zum Beispiel:
   "Lies CLAUDE.md und mach dich mit dem Projekt vertraut. Dann sag mir kurz auf Deutsch, was fertig ist und was fehlt."
3. Danach sagst du Claude Code, was als Nächstes kommt.

KI ONLINE STELLEN (damit der Chat antwortet)
1. API-Schlüssel erstellen: console.anthropic.com -> API Keys. Etwas Guthaben aufladen.
   Den Schlüssel nie in die HTML-Datei schreiben und nie weitergeben.
2. Die 3 Dateien aus server/ in ein neues GitHub-Repository hochladen.
3. Auf render.com: New -> Web Service -> Repository wählen.
   Start command: npm start
   Environment: ANTHROPIC_API_KEY = dein Schlüssel
   (optional) AI_MODEL = claude-sonnet-5-5   (günstiger und schneller)
4. Deploy klicken. Du bekommst einen Link wie https://look-good.onrender.com
   Öffne die App über diesen Link auf dem Handy. Test: https://DEIN-LINK/api/health

HINWEIS
- Die Garderobe ist absichtlich nur ein leerer Platzhalter.
- Auf dem kostenlosen Render-Tarif schläft der Server, die erste Nachricht kann ca. 30 Sekunden dauern.
