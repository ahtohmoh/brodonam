# Brodonam

Therapeutic cinema companion — an AI-guided, psychologically-informed film experience.
Node/Express backend serving the static UI, with a Claude-powered companion, crisis
detection, magic-link auth, conversation persistence, a clinician layer, and follow-ups.

> ⚠️ Crisis-aware mental-health app. Not a substitute for therapy. Have a digital-health
> attorney review before any public, ungated launch.

## Run locally

```sh
cp .env.example .env        # set ANTHROPIC_API_KEY at minimum
npm install
npm start                   # http://localhost:3001
```

SQLite is the default store (no setup). Magic-link sign-in prints links to the
console when SMTP isn't configured.

## Deploy to Render (Blueprint)

This repo ships a `render.yaml` that provisions a managed Postgres + a Node web service.

1. **Rotate your Anthropic key** at console.anthropic.com (the old one was exposed) and copy the new one.
2. In Render: **New → Blueprint**, connect this repo. Render reads `render.yaml` and
   creates `brodonam-db` (Postgres) + the `brodonam` web service, wiring `DATABASE_URL`
   and generating `COOKIE_SECRET` automatically.
3. In the service's **Environment** tab, set the `sync: false` vars:
   - `ANTHROPIC_API_KEY` — the **new** key
   - `APP_URL` — your Render URL (e.g. `https://brodonam.onrender.com`)
   - `STAGING_GATE_PASSWORD` — any string; gates the whole site behind a password + `noindex`
   - `BRODONAM_ADMIN_EMAILS` — comma-separated, optional (clinician approvals)
   - `SMTP_*` — optional, for real magic-link emails
4. Deploy. The Postgres schema is applied automatically on first boot. Visit the URL —
   you'll get a browser password prompt; the username is anything, the password is your
   `STAGING_GATE_PASSWORD`.

To go public later: remove `STAGING_GATE_PASSWORD`, relax `robots.txt`, and complete the legal review.

See [`DEPLOY.md`](DEPLOY.md) for the full operations runbook (Postgres migration, CSP,
clinician workflow, follow-ups, backups, security checklist).

## Stack

Express · Anthropic SDK · better-sqlite3 / pg (dual driver) · Helmet · express-rate-limit ·
pino · nodemailer. Browser extension scaffold in [`extension/`](extension/). Framer gallery
component in [`framer/`](framer/).
