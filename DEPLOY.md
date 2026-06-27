# Brodonam — Deployment

## Local development
```sh
cp .env.example .env       # then fill ANTHROPIC_API_KEY at minimum
npm install
node server.js             # http://localhost:3001
```
Magic links print to stdout when SMTP is unset.

## Production (Docker)
```sh
cp .env.example .env       # set ANTHROPIC_API_KEY, COOKIE_SECRET, APP_URL, SMTP_*
docker compose up -d
docker compose logs -f brodonam
```
SQLite data persists in the `brodonam_data` named volume.

## Required environment

| Var | Required | Notes |
|-----|----------|-------|
| `ANTHROPIC_API_KEY` | yes | from console.anthropic.com |
| `COOKIE_SECRET` | yes in prod | long random string |
| `APP_URL` | yes in prod | public URL used in magic-link emails |
| `NODE_ENV` | recommended | set to `production` |
| `PORT` | optional | default 3001 |
| `DAILY_SPEND_CAP_USD` | optional | default 10 |
| `CLAUDE_MODEL_MAIN` | optional | default `claude-opus-4-5` |
| `CLAUDE_MODEL_CLASSIFIER` | optional | default `claude-haiku-4-5` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | yes in prod | for real magic-link emails |
| `BRODONAM_DB_PATH` | optional | default `./data/brodonam.db` |
| `LOG_LEVEL` | optional | `debug`, `info`, `warn`, `error`, `fatal` |

## Observability
- Structured JSON logs in production via pino.
- Ship to your log aggregator (Datadog, Loki, CloudWatch).
- Filter `msg = "CRISIS detected"` for the crisis review queue.
- `GET /api/health` returns spend, model, conversation counts, unreviewed crisis count.

## Postgres migration path

SQLite handles low-to-medium production traffic comfortably. Migrate when:
- DB size approaches ~10 GB
- You need horizontal app scaling (SQLite WAL is single-writer)
- You need streaming replication / read replicas

Steps:
1. Provision Postgres 15+. Apply `data/schema-postgres.sql`.
2. Export SQLite → CSV → COPY into Postgres (or use `pgloader`).
3. Refactor `db.js` to use `pg.Pool` with async/await. Every prepared statement
   becomes `pool.query()`. Most SQL is portable; the few non-portable items:
   - `INTEGER PRIMARY KEY AUTOINCREMENT` → `BIGSERIAL`
   - `ON CONFLICT(col) DO UPDATE SET col = excluded.col` → works in both
   - Boolean-as-INTEGER stays as `INTEGER` (CHECK constraints already in DDL)
4. Set `DATABASE_URL=postgres://…` in env.
5. Smoke test on staging before flipping prod.

## Security hardening before public traffic
- [ ] Rotate `ANTHROPIC_API_KEY` (the original was transmitted in chat)
- [ ] Set a real `COOKIE_SECRET` (>= 32 random bytes)
- [ ] Set `BRODONAM_ADMIN_EMAILS=alice@…,bob@…` for the clinician approval queue
- [ ] Put a TLS terminator in front (Cloudflare / NGINX / Caddy)
- [ ] Enable HSTS at the TLS layer
- [ ] Configure SPF/DKIM/DMARC for the sender domain
- [ ] Run `npm audit fix` and review remaining advisories
- [ ] Set up an error tracker (Sentry / Honeybadger) — `unhandledRejection` is already piped to `pino`
- [ ] Switch to strict CSP (see below)
- [ ] **Have a digital-health attorney review the product** before launch in any regulated market (EU MDR, FDA, UK MHRA)

## Strict CSP
The default production CSP allows `'unsafe-inline'` for `script-src` because
`index.html` and `player.html` still use inline `<script>` blocks and inline
`onclick=` handlers. The nonce-based strict path is wired (`STRICT_CSP=1`)
but requires:

1. Extract every `<script>` block from `index.html` and `player.html` into
   external files under `public/` and reference them via `<script src>`.
2. Convert every inline event handler (`onclick="foo()"`, `onkeydown="…"`,
   etc.) into `addEventListener` calls in those external files.
3. Add `<script nonce="<%- nonce %>" src="…"></script>` if you want the
   nonce to also apply (via a small templating step at static-serve time).
4. Set `STRICT_CSP=1` and confirm in DevTools → Network → response headers
   that `script-src` no longer contains `'unsafe-inline'`.

Until that refactor lands, leaving `STRICT_CSP` unset is the safe choice
— inline blocks would silently stop executing under strict CSP.

## Voice companion
- `OPENAI_API_KEY` enables `POST /api/voice/transcribe` (Whisper).
- `ELEVENLABS_API_KEY` enables `POST /api/voice/speak`. Default voice
  ID is `EXAVITQu4vr4xnSDxMaL`; override with `ELEVENLABS_VOICE_ID`.
- Frontend already wires the mic + auto-speak toggle in the player sidebar.

## Clinician workflow
- A signed-in user POSTs `/api/clinician/request` with credential text + organisation.
- Admins (listed in `BRODONAM_ADMIN_EMAILS`) review with `GET /api/admin/clinicians`,
  approve with `POST /api/admin/clinicians/:id/verify`.
- Verified clinicians issue prescriptions via `POST /api/clinician/prescribe`
  (clients must already have a Brodonam account).
- Clients see their prescriptions at `GET /me/prescriptions`.

## Follow-ups
- Auto-scheduled when a persisted conversation reaches 5+ messages
  (week-1 / month-1 / month-3 nudges tied to the watched film).
- In-process scheduler (`followups.js`) runs every `FOLLOWUP_TICK_MS`
  (default 5 min). Disable with `FOLLOWUPS_ENABLED=0`.
- For multi-instance deployments, replace with BullMQ + Redis or an
  external scheduler (Cloudflare Cron, AWS EventBridge).

## Browser extension
- Build the extension with `node extension/build.js` — outputs
  `dist/brodonam-companion-x.y.z.zip` ready for the Chrome Web Store.
- Update `manifest.json` `host_permissions` to your production API host
  before publishing.

## Crisis review workflow
Each crisis detection writes to `crisis_events` with `reviewed_at = NULL`.
Build a clinician-only review surface that:
1. Lists unreviewed events oldest-first.
2. Shows the message excerpt + conversation context.
3. Records the reviewer's notes and outcome.
4. Sets `reviewed_at`.

`GET /api/health` reports `crisis_unreviewed` so you can page when it grows.

## Backups
SQLite: snapshot the volume nightly; copy `brodonam.db` + WAL files.
Postgres: standard `pg_dump` + WAL archiving.
Retain at least 30 days. Test restores quarterly.
