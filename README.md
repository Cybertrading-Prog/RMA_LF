# Cybertrading Lieferanten-RMA Workspace – Cloud Version

Diese Version behält die HTML-Oberfläche bei, speichert aber zentral online über **Vercel + Supabase**.

## Struktur
- `index.html` – Frontend
- `api/workspace.js` – Vercel Function für Laden/Speichern
- `vercel.json` – Vercel-Konfiguration
- `supabase.sql` – Tabelle in Supabase anlegen

## Was du im Browser machen musst

### 1) GitHub
- Neues Repository anlegen
- Diese Dateien hochladen

### 2) Supabase
- Neues Projekt anlegen
- Im SQL Editor den Inhalt aus `supabase.sql` ausführen
- Danach brauchst du:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 3) Vercel
- GitHub-Repository importieren
- In **Project Settings > Environment Variables** anlegen:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `WORKSPACE_PIN` (frei wählbar, z. B. ein Team-PIN)

## Nutzung
- Website öffnen
- Oben die Cloud-PIN eingeben
- **Cloud laden** drücken
- bearbeiten
- **Cloud speichern** drücken

## Wichtig
- Die `SERVICE_ROLE_KEY` kommt **nur** in Vercel als Server-Variable, nicht ins Frontend.
- Alle mit URL + richtiger PIN arbeiten auf demselben Datenstand.
- Für mehr Sicherheit kann man später Login ergänzen.