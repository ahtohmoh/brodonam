# Brodonam Companion — Browser Extension

Detects what's playing on Netflix or Prime Video, asks the Brodonam backend
whether the title matches a curated film, and surfaces insights at the right
scene moments via a small chip overlay in the player.

## Install (developer mode)
1. Open `chrome://extensions/`
2. Toggle **Developer mode** on (top-right)
3. Click **Load unpacked** → select this `extension/` folder
4. Click the puzzle-piece icon and pin "Brodonam Companion"
5. Open the popup, set the API base URL (default `http://localhost:3001`)
6. Click **Test connection** — should report "✓ Connected"

## Backend requirements
The extension calls these Brodonam endpoints:
- `POST /api/extension/identify { source, title, url }` →
  `{ filmId, companionUrl }` if matched, `{}` if not
- `GET /api/film/:id` → returns `insights[]` with `pct` markers
- `GET /api/health` → for the connection test

`/api/extension/identify` is scaffolded in `server.js`. Title matching is
case-insensitive fuzzy. Extend with a richer lookup (year, runtime) when
catalog overlap grows.

## Production packaging
1. Replace `icon-128.png` with the real brand icon (currently missing).
2. Update `manifest.json` `host_permissions` to your production API host.
3. Zip the folder and upload to the Chrome Web Store.
4. For Safari, repackage with `xcrun safari-web-extension-converter`.
5. For Firefox, change `background.service_worker` to `background.scripts`.

## Privacy posture
- The extension reads titles + URL from the player tab only.
- It sends those to your Brodonam backend with `credentials: 'include'` so
  the user's existing session cookie carries through.
- It never reads page content beyond the title; never touches forms, mail,
  or other tabs.
- Document this clearly in your store listing privacy section.
