/**
 * BRODONAM — Psychological AI Engine (hardened, streaming, safety-aware)
 *
 * Endpoints
 *   POST /api/chat           — SSE-streamed companion response
 *   GET  /api/film/:id       — public film metadata
 *   GET  /api/health         — status + spend snapshot
 *   GET  /api/crisis-resource — geo-aware crisis line lookup
 *
 * Hardening
 *   • Helmet headers + JSON body cap
 *   • Per-IP rate limiting (burst + hourly)
 *   • Daily Anthropic-spend ceiling (refuses past the cap)
 *   • Regex pre-filter for self-harm language → hardcoded response
 *   • Haiku classifier (async, observational) flags non-obvious risk
 *   • Country-aware crisis lines
 *
 * Performance
 *   • Anthropic prompt caching on the stable system block
 *   • Streaming responses via Server-Sent Events
 */

require('dotenv').config({ override: true });
const express      = require('express');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path         = require('path');
const Anthropic    = require('@anthropic-ai/sdk');
const DB           = require('./db');
const log          = require('./logger');
const { sendMagicLink } = require('./mail');
const followUps    = require('./followups');

/* ═══════════════════════════════════════════════════════
   BOOT-TIME ENVIRONMENT VALIDATION
   Fail loudly in production rather than silently misbehaving.
═══════════════════════════════════════════════════════ */
const isProd = process.env.NODE_ENV === 'production';
const required = ['ANTHROPIC_API_KEY'];
const recommendedInProd = ['COOKIE_SECRET', 'APP_URL', 'SMTP_HOST'];

for (const k of required) {
  if (!process.env[k]) {
    log.fatal({ var: k }, 'Missing required env var; exiting');
    process.exit(1);
  }
}
if (isProd) {
  for (const k of recommendedInProd) {
    if (!process.env[k]) log.warn({ var: k }, 'Recommended env var not set in production');
  }
  if (!process.env.COOKIE_SECRET || process.env.COOKIE_SECRET === 'change-me-to-a-long-random-string') {
    log.fatal('COOKIE_SECRET must be set to a long random string in production; exiting');
    process.exit(1);
  }
}

const app    = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const COOKIE_SECRET = process.env.COOKIE_SECRET || 'brodonam-dev-secret-change-me';
const COOKIE_NAME   = 'bdn_session';
const COOKIE_OPTS   = {
  httpOnly: true,
  sameSite: 'lax',
  signed:   true,
  secure:   process.env.NODE_ENV === 'production',
  maxAge:   DB.SESSION_TTL_MS,
  path:     '/',
};
if (COOKIE_SECRET === 'brodonam-dev-secret-change-me') {
  log.warn('COOKIE_SECRET is using the default — set a real one before production');
}

/* ═══════════════════════════════════════════════════════
   MODELS  (env-overridable so we can swap families later)
═══════════════════════════════════════════════════════ */
const MODEL_MAIN       = process.env.CLAUDE_MODEL_MAIN       || 'claude-opus-4-5';
const MODEL_CLASSIFIER = process.env.CLAUDE_MODEL_CLASSIFIER || 'claude-haiku-4-5';

/* ═══════════════════════════════════════════════════════
   SPEND TRACKING  (per-day USD ceiling)
═══════════════════════════════════════════════════════ */
const DAILY_SPEND_CAP_USD = parseFloat(process.env.DAILY_SPEND_CAP_USD || '10');
const PRICING = {
  // approximate $/M tokens — adjust to your actual contract
  'claude-opus-4-5':   { in: 15.0, out: 75.0, cwrite: 18.75, cread: 1.50 },
  'claude-sonnet-4-5': { in:  3.0, out: 15.0, cwrite:  3.75, cread: 0.30 },
  'claude-haiku-4-5':  { in:  0.8, out:  4.0, cwrite:  1.00, cread: 0.08 },
};
let dailySpend = { date: today(), usd: 0, requests: 0 };
function today() { return new Date().toISOString().slice(0, 10); }
function rollSpend() {
  const t = today();
  if (dailySpend.date !== t) dailySpend = { date: t, usd: 0, requests: 0 };
}
function trackSpend(usage, model) {
  if (!usage) return;
  rollSpend();
  const p = PRICING[model] || PRICING['claude-sonnet-4-5'];
  const cost =
    ((usage.input_tokens                || 0) * p.in     +
     (usage.output_tokens               || 0) * p.out    +
     (usage.cache_creation_input_tokens || 0) * p.cwrite +
     (usage.cache_read_input_tokens     || 0) * p.cread) / 1_000_000;
  dailySpend.usd += cost;
  dailySpend.requests += 1;
}
function spendCapReached() { rollSpend(); return dailySpend.usd >= DAILY_SPEND_CAP_USD; }

/* ═══════════════════════════════════════════════════════
   FRAMEWORKS + MOVIES
═══════════════════════════════════════════════════════ */
const FRAMEWORKS = {
  PSY: { name: 'Psychodynamic',  desc: 'Exploring unconscious patterns shaped by the past' },
  ATT: { name: 'Attachment',     desc: 'Understanding your patterns in close relationships' },
  CBT: { name: 'CBT',            desc: 'Examining the thoughts that are driving your feelings' },
  IFS: { name: 'Parts Work',     desc: 'Meeting the different parts of yourself with curiosity' },
  NDT: { name: 'Narrative',      desc: 'Re-authoring the story you tell about yourself' },
  ACT: { name: 'Acceptance',     desc: 'Choosing based on your values, not your fear' },
  SOM: { name: 'Somatic',        desc: 'Listening to what your body already knows' },
};

let MOVIES = [];
try {
  const { BRODONAM_MOVIES } = require('./data/movies.js');
  MOVIES = BRODONAM_MOVIES;
  log.info({ count: MOVIES.length }, 'Loaded films');
} catch (e) {
  log.warn({ err: e.message }, 'Could not load movies.js');
}
function getFilm(id) { return MOVIES.find(m => m.id === id) || null; }

/* ═══════════════════════════════════════════════════════
   CRISIS DETECTION
═══════════════════════════════════════════════════════ */

// Pre-filter: catches the most direct language without an API call.
// Tuned for explicit phrasing; the classifier handles indirect cases.
const CRISIS_PATTERNS = [
  /\b(kill|hurt|harm|end)\s+(myself|me|my\s*life|it\s*all)\b/i,
  /\b(suicid\w+)\b/i,
  /\b(self[-\s]?harm\w*)\b/i,
  /\b(don'?t\s+want\s+to\s+(live|be\s+alive|exist|be\s+here|wake\s+up))\b/i,
  /\bwant(?:ing)?\s+to\s+die\b/i,
  /\b(no\s+reason\s+to\s+(live|go\s+on|keep\s+going))\b/i,
  /\b(thinking\s+(about|of)\s+(ending|killing))\b/i,
  /\b(i\s+can'?t\s+(do|take)\s+(this|it)\s+anymore)\b/i,
  /\b(better\s+off\s+(dead|without\s+me))\b/i,
];
function preFilterCrisis(text) { return CRISIS_PATTERNS.some(p => p.test(text)); }

// LLM classifier — fast Haiku call, runs in parallel with the main response.
// It does NOT block the user reply; it only logs for review and informs the next turn.
async function classifyRisk(text) {
  try {
    const r = await client.messages.create({
      model: MODEL_CLASSIFIER,
      max_tokens: 80,
      system: [
        {
          type: 'text',
          text:
            'You classify the risk level of a user message in a mental-health-adjacent companion app. ' +
            'Reply with ONLY a single-line JSON object: {"risk":"none|low|moderate|high","reason":"<5 words>"}. ' +
            'high = active crisis: stated intent, plan, or means for self-harm/suicide; severe dissociation; acute danger to self or others. ' +
            'moderate = hopelessness, passive ideation, severe grief, panic, recent trauma re-experiencing. ' +
            'low = some distress, sadness, anxiety. ' +
            'none = ordinary conversation. ' +
            'Output JSON only. No prose.',
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: text.slice(0, 600) }],
    });
    trackSpend(r.usage, MODEL_CLASSIFIER);
    const raw = (r.content[0]?.text || '').trim().replace(/^```json\s*|\s*```$/g, '');
    return JSON.parse(raw);
  } catch (e) {
    return { risk: 'unknown', reason: e.message?.slice(0, 40) || 'classifier-error' };
  }
}

// Country-aware crisis resources
const CRISIS_RESOURCES = {
  US: { line: '988',           label: 'Suicide & Crisis Lifeline (call or text 988)' },
  CA: { line: '1-833-456-4566', label: 'Talk Suicide Canada (call) — text 45645 4pm–midnight ET' },
  GB: { line: '116 123',       label: 'Samaritans (free, 24/7)' },
  IE: { line: '116 123',       label: 'Samaritans Ireland (free, 24/7)' },
  AU: { line: '13 11 14',      label: 'Lifeline Australia' },
  NZ: { line: '1737',          label: 'Need to Talk? (call or text 1737)' },
  IN: { line: '+91 9152987821', label: 'iCall' },
  DE: { line: '0800 111 0 111', label: 'Telefonseelsorge (free)' },
  FR: { line: '3114',          label: 'Numéro national de prévention du suicide' },
  ES: { line: '024',           label: 'Línea de Atención a la Conducta Suicida' },
  IT: { line: '02 2327 2327',  label: 'Telefono Amico' },
  NL: { line: '0800-0113',     label: '113 Zelfmoordpreventie' },
  BR: { line: '188',           label: 'Centro de Valorização da Vida (CVV)' },
  MX: { line: '800 290 0024',  label: 'SAPTEL' },
  ZA: { line: '0800 567 567',  label: 'SADAG Suicide Crisis Line' },
  JP: { line: '0570-064-556',  label: 'Yorisoi Hotline' },
};
function crisisResourceFor(country) {
  const r = CRISIS_RESOURCES[country];
  if (r) return r;
  return {
    line: null,
    label: 'a crisis line in your country (find one at findahelpline.com) or your local emergency number',
  };
}
function detectCountry(req) {
  // CDN / proxy headers, then Accept-Language fallback
  const h = req.headers;
  const c = h['cf-ipcountry'] || h['x-vercel-ip-country'] || h['x-country'] ||
            (h['accept-language'] || '').match(/-(\w{2})/)?.[1] || 'US';
  return String(c).toUpperCase().slice(0, 2);
}
function crisisResponseText(country) {
  const r = crisisResourceFor(country);
  return (
    `What you just shared matters, and I'm taking it seriously.\n\n` +
    `I'm an AI companion — I can sit with you, but I'm not equipped to hold what you're describing on my own. Please reach out to a human who is:\n\n` +
    `${r.label}\n\n` +
    `If you're in immediate danger, please call your local emergency number. I'll be here when you're ready to come back.`
  );
}

/* ═══════════════════════════════════════════════════════
   SYSTEM PROMPT  (split into cacheable + variable blocks)
═══════════════════════════════════════════════════════ */
const STABLE_VOICE = `You are Brodonam — a therapeutic cinema companion.

You are NOT a therapist. You are a psychologically-informed companion who sits alongside people as they engage with meaningful films — helping them connect what they see on screen to what they carry inside.

Your voice: warm, precise, unhurried. Like a thoughtful friend who has studied psychology deeply — not a clinician. You speak plainly, without jargon. You do not use bullet points or headers in conversation. You never lecture.

━━ HOW YOU RESPOND ━━
• Reflect what the person shares before you interpret or question
• Ask one question at a time — never stack questions
• Connect their experience to the film's themes when it feels natural, not forced
• Occasionally offer a brief somatic prompt ("where do you feel this in your body?") — but sparingly
• When a reframe is relevant, offer it as possibility, not correction: "What if…" or "Is it possible that…"
• Keep responses under 80 words unless the person is sharing something deep that calls for more presence
• Plain prose only — no lists, no headers, no markdown in your response

━━ WHAT YOU NEVER DO ━━
• Diagnose, prescribe, or position yourself as their therapist
• Suggest medication or specific clinical interventions
• Minimise or rush what the person is feeling
• Give generic affirmations ("That's so valid", "I hear you")
• Break character — you are always Brodonam

━━ SAFETY ━━
If someone expresses crisis, self-harm, suicidal thoughts, or acute distress — respond with genuine warmth, acknowledge what they said directly, and clearly direct them to a professional or crisis line. Do not move past it.

You are Brodonam. Hold that voice always.`;

function buildFilmBlock(film) {
  if (!film) return '';
  const insightLines = (film.insights || [])
    .map((ins, i) => {
      const fw = FRAMEWORKS[ins.framework];
      return `  Insight ${i + 1} [${fw?.name || ins.framework}]: ${(ins.narration || '').slice(0, 180)}…
  Reframe: "${ins.reframe}"
  Core question: "${ins.question}"`;
    })
    .join('\n\n');
  return `\n━━ TONIGHT'S FILM ━━
Trigger: "${film.trigger}"
What it explores: ${film.synopsis}
Healing stage: ${film.healingStage}
Therapeutic categories: ${film.categories.join(', ')}
${film.insights?.length ? `\nKey psychological moments pre-loaded in this film:\n${insightLines}` : ''}`;
}

function buildProfileBlock(profile) {
  if (!profile || !Object.keys(profile).length) return '';
  const durationMap = {
    recent: 'just recently — this is fresh',
    weeks:  'a few weeks',
    months: 'several months',
    years:  'for years',
  };
  return `\n━━ PERSON'S PROFILE ━━
Emotional state / need: ${profile.emotion || 'unspecified'}
Duration: ${durationMap[profile.duration] || profile.duration || 'unspecified'}
Watch mode: ${profile.mode || 'solo'}
Support present: ${profile.support || 'none specified'}`;
}

const CONTEXT_NOTES = {
  landing: `You are in the pre-watch check-in. The person has just shared what they're carrying. A film recommendation has been made. Help them feel seen and ready — don't rush them toward pressing play. Reflect, ask, hold space.`,
  player: `You are speaking alongside the film as it plays. The person may be mid-scene, emotionally activated, or processing in real time. Be brief, present, and attuned. One thought at a time.`,
  reflection: `The film has ended. You are helping the person integrate what they experienced. This is a slower, more reflective conversation. Be gentle, unhurried, and curious. Help them name what shifted.`,
  general: `You are the Brodonam companion. Respond to wherever the person is, emotionally and practically.`,
};

/**
 * Returns an array of system blocks ready for Anthropic.
 * The stable block gets cache_control so the rich voice + film context is cached
 * across all turns in a session (cuts cost dramatically on long conversations).
 */
function buildSystemBlocks({ filmId, userProfile, context, insightInProgress }) {
  const film = filmId ? getFilm(filmId) : null;
  const stable =
    STABLE_VOICE +
    '\n' +
    buildFilmBlock(film) +
    '\n' +
    buildProfileBlock(userProfile) +
    '\n\n' +
    (CONTEXT_NOTES[context] || CONTEXT_NOTES.general);

  const blocks = [
    { type: 'text', text: stable, cache_control: { type: 'ephemeral' } },
  ];

  if (insightInProgress) {
    blocks.push({
      type: 'text',
      text: `\n━━ ACTIVE SCENE INSIGHT ━━\nA scene insight was just delivered: "${insightInProgress}". Your response can build on this moment.`,
    });
  }
  return blocks;
}

/* ═══════════════════════════════════════════════════════
   MIDDLEWARE
═══════════════════════════════════════════════════════ */
/* Per-request nonce — when STRICT_CSP=1, the static HTML must reference
   it via <script nonce="..."> blocks. Until inline event handlers are
   refactored out, STRICT_CSP=0 (default) keeps 'unsafe-inline'.
   See DEPLOY.md "Strict CSP" for the migration steps. */
const STRICT_CSP = process.env.STRICT_CSP === '1';
const crypto = require('node:crypto');
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: isProd
      ? {
          useDefaults: true,
          directives: {
            'default-src':  ["'self'"],
            'script-src': STRICT_CSP
              ? ["'self'", (_, res) => `'nonce-${res.locals.nonce}'`]
              : ["'self'", "'unsafe-inline'"],
            'style-src':    ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            'font-src':     ["'self'", 'https://fonts.gstatic.com'],
            'img-src':      ["'self'", 'data:', 'https://upload.wikimedia.org'],
            'connect-src':  ["'self'"],
            'object-src':   ["'none'"],
            'frame-ancestors': ["'none'"],
            'base-uri':     ["'self'"],
            'form-action':  ["'self'"],
          },
        }
      : false,
    crossOriginEmbedderPolicy: false,
  })
);

// Per-request structured logging
app.use((req, res, next) => {
  const t0 = Date.now();
  res.on('finish', () => {
    log.info({
      method: req.method,
      url:    req.originalUrl,
      status: res.statusCode,
      ms:     Date.now() - t0,
      ip:     req.ip,
      user:   req.user?.id,
    }, 'req');
  });
  next();
});

/* ═══════════════════════════════════════════════════════
   STAGING ACCESS GATE
   When STAGING_GATE_PASSWORD is set, the whole site requires HTTP Basic
   auth (any username, password = the secret) and is marked noindex. The
   health check is left open so Render's platform probe still passes.
   Unset the var to lift the gate for a public launch.
═══════════════════════════════════════════════════════ */
const STAGING_GATE = process.env.STAGING_GATE_PASSWORD || '';
if (STAGING_GATE) {
  log.info('Staging gate ENABLED — site is private + noindex');
  app.use((req, res, next) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    if (req.path === '/api/health') return next(); // let the platform probe through
    const hdr = req.headers.authorization || '';
    const [scheme, encoded] = hdr.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString();
      const pass = decoded.slice(decoded.indexOf(':') + 1);
      if (pass === STAGING_GATE) return next();
    }
    res.setHeader('WWW-Authenticate', 'Basic realm="Brodonam (staging)"');
    return res.status(401).send('Restricted — staging access required.');
  });
}

app.use(cookieParser(COOKIE_SECRET));
app.use(express.json({ limit: '64kb' }));

/* ═══════════════════════════════════════════════════════
   AUTH MIDDLEWARE  (attaches req.user when a valid session
   cookie is present; never blocks unauthed requests)
═══════════════════════════════════════════════════════ */
async function attachUser(req, _res, next) {
  const sid = req.signedCookies[COOKIE_NAME];
  if (!sid) return next();
  try {
    const session = await DB.findSession(sid);
    if (!session) return next();
    const user = await DB.findUserById(session.user_id);
    if (!user) return next();
    req.user    = user;
    req.session = session;
    await DB.touchUser(user.id, detectCountry(req));
  } catch (e) {
    log.warn({ err: e.message }, 'attachUser failed');
  }
  next();
}
function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Sign in required' });
  next();
}

app.use(attachUser);
app.use(express.static(path.join(__dirname)));

// Rate limiters scoped to chat — burst and hourly
const chatBurstLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Slow down — give yourself a moment between messages.' },
});
const chatHourlyLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "You've been sending a lot of messages. Take a breath — come back in a bit." },
  // Authed users are tracked per-user-id so they aren't penalised by shared NAT.
  // Authed users keyed by id; anonymous keyed by IPv6-safe IP.
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
});

// Conservative limiter on the auth-request endpoint to slow email-bombing
const authRequestLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many sign-in requests. Try again in a few minutes.' },
});

/* ═══════════════════════════════════════════════════════
   AUTH ROUTES
═══════════════════════════════════════════════════════ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /auth/request  { email }
// Always responds 200 with the same shape — never reveals whether the email exists.
app.post('/auth/request', authRequestLimit, async (req, res) => {
  const email = (req.body?.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  try {
    const { token } = await DB.createMagicLink(email);
    await sendMagicLink(email, token);
    return res.json({ ok: true, message: 'If that email is recognised, a sign-in link is on its way.' });
  } catch (e) {
    log.error({ err: e.message }, 'Magic-link send failed');
    return res.status(500).json({ error: "We couldn't send the link right now. Please try again." });
  }
});

// GET /auth/verify?token=...
// Consumes the magic link, creates a session, sets the cookie, redirects to /.
app.get('/auth/verify', async (req, res) => {
  const token = (req.query.token || '').toString();
  if (!token) return res.status(400).send('Missing token.');

  const result = await DB.consumeMagicLink(token);
  if (!result.ok) {
    const reasons = {
      unknown: 'This link is not recognised.',
      used:    'This link has already been used.',
      expired: 'This link expired. Request a new one.',
      race:    'Something went wrong. Try again.',
    };
    return res
      .status(400)
      .send(`<!doctype html><meta charset=utf-8><title>Brodonam</title>
        <body style="font-family:Inter,system-ui;background:#030305;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;text-align:center">
        <div><div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C09060;margin-bottom:24px">◆ Brodonam</div>
        <div style="font-size:16px;color:rgba(255,255,255,0.78);margin-bottom:24px">${reasons[result.reason] || 'Sign-in failed.'}</div>
        <a href="/" style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.42);text-decoration:underline">Return home</a></div></body>`);
  }

  const user = await DB.getOrCreateUser(result.email);
  await DB.touchUser(user.id, detectCountry(req));
  const session = await DB.createSession(user.id, req.get('user-agent'), req.ip);
  res.cookie(COOKIE_NAME, session.id, COOKIE_OPTS);
  res.redirect('/');
});

// GET /me
app.get('/me', async (req, res) => {
  if (!req.user) return res.json({ user: null });
  const prefs = await DB.getPreferences(req.user.id);
  return res.json({
    user: { id: req.user.id, email: req.user.email, created_at: req.user.created_at },
    preferences: prefs,
  });
});

// POST /logout
app.post('/logout', async (req, res) => {
  if (req.session) await DB.deleteSession(req.session.id);
  res.clearCookie(COOKIE_NAME, { ...COOKIE_OPTS, maxAge: 0 });
  res.json({ ok: true });
});

// GET /me/conversations
app.get('/me/conversations', requireUser, async (req, res) => {
  const conversations = await DB.listConversations(req.user.id, 100);
  res.json({ conversations });
});

// GET /me/conversations/:id
app.get('/me/conversations/:id', requireUser, async (req, res) => {
  const msgs = await DB.listMessages(req.params.id);
  res.json({ messages: msgs });
});

// PUT /me/preferences
app.put('/me/preferences', requireUser, async (req, res) => {
  await DB.setPreferences(req.user.id, req.body || {});
  res.json({ ok: true, preferences: await DB.getPreferences(req.user.id) });
});

// GET /me/export  — GDPR data export
app.get('/me/export', requireUser, async (req, res) => {
  const data = await DB.exportUserData(req.user.id);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="brodonam-${req.user.id}.json"`);
  res.send(JSON.stringify(data, null, 2));
});

// DELETE /me  — GDPR right to erasure. Requires explicit confirmation in body.
app.delete('/me', requireUser, async (req, res) => {
  if (req.body?.confirm !== 'DELETE_MY_ACCOUNT') {
    return res.status(400).json({ error: 'Confirmation required. Send { "confirm": "DELETE_MY_ACCOUNT" }.' });
  }
  await DB.deleteUserCompletely(req.user.id);
  res.clearCookie(COOKIE_NAME, { ...COOKIE_OPTS, maxAge: 0 });
  res.json({ ok: true });
});

/* ═══════════════════════════════════════════════════════
   POST /api/chat   (SSE-streamed)
═══════════════════════════════════════════════════════ */
function sse(res, event, dataObj) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(dataObj)}\n\n`);
}

app.post('/api/chat', chatBurstLimit, chatHourlyLimit, async (req, res) => {
  const { filmId, messages, userProfile, context, insightInProgress, conversationId } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // Validate + clean message stream
  const validMessages = messages
    .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim());
  if (validMessages.length === 0) return res.status(400).json({ error: 'No valid messages' });

  const cleaned = [];
  for (const m of validMessages) {
    const last = cleaned[cleaned.length - 1];
    if (last && last.role === m.role) last.content += '\n' + m.content;
    else cleaned.push({ role: m.role, content: m.content });
  }
  if (cleaned[0]?.role !== 'user') {
    return res.status(400).json({ error: 'Conversation must start with a user message' });
  }

  // Spend cap
  if (spendCapReached()) {
    return res.status(503).json({
      error: "We've reached today's safety ceiling on AI usage. Please come back tomorrow — your conversation is preserved on your device.",
    });
  }

  const country = detectCountry(req);
  const lastUserMsg = cleaned[cleaned.length - 1].content;

  // Conversation persistence — only for authed users (anonymous is fully ephemeral)
  let conversation = null;
  if (req.user) {
    conversation = await DB.ensureConversation({
      conversationId,
      userId:  req.user.id,
      filmId,
      context,
    });
    const existing = await DB.listMessages(conversation.id);
    if (existing.length === 0) {
      for (const m of cleaned) await DB.appendMessage(conversation.id, m.role, m.content);
    } else {
      await DB.appendMessage(conversation.id, 'user', lastUserMsg);
    }
  }

  // Open SSE channel
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering
  res.flushHeaders?.();

  // 1) Hard pre-filter — bypass the model entirely
  if (preFilterCrisis(lastUserMsg)) {
    log.warn({ detector: 'pre-filter', excerpt: lastUserMsg.slice(0, 120), user: req.user?.id, country }, 'CRISIS detected');
    await DB.logCrisis({
      userId:         req.user?.id,
      conversationId: conversation?.id,
      detectedBy:     'pre-filter',
      excerpt:        lastUserMsg,
      country,
    });
    const text = crisisResponseText(country);
    for (let i = 0; i < text.length; i += 8) sse(res, 'token', text.slice(i, i + 8));
    if (conversation) await DB.appendMessage(conversation.id, 'assistant', text);
    sse(res, 'crisis', { resource: crisisResourceFor(country) });
    sse(res, 'done', { reason: 'crisis-prefilter', conversationId: conversation?.id });
    return res.end();
  }

  // 2) Fire-and-forget classifier — informs logs and the next turn's logic.
  classifyRisk(lastUserMsg)
    .then(async c => {
      if (c.risk === 'high' || c.risk === 'moderate') {
        log.warn({ detector: `classifier-${c.risk}`, reason: c.reason, excerpt: lastUserMsg.slice(0, 80), user: req.user?.id, country }, 'CRISIS classifier flagged');
        await DB.logCrisis({
          userId:         req.user?.id,
          conversationId: conversation?.id,
          detectedBy:     `classifier-${c.risk}`,
          excerpt:        lastUserMsg,
          country,
        });
      }
    })
    .catch(() => { /* swallow — classifier is best-effort */ });

  // 3) Build cached system + stream response
  const systemBlocks = buildSystemBlocks({ filmId, userProfile, context, insightInProgress });

  try {
    const stream = client.messages.stream({
      model:      MODEL_MAIN,
      max_tokens: 400,
      system:     systemBlocks,
      messages:   cleaned,
    });

    let fullText = '';
    stream.on('text', (chunk) => {
      fullText += chunk;
      sse(res, 'token', chunk);
    });
    const final = await stream.finalMessage();
    trackSpend(final.usage, MODEL_MAIN);
    if (conversation && fullText.trim()) {
      await DB.appendMessage(conversation.id, 'assistant', fullText);
      try {
        const existing = (await DB.followUpsForUser(req.user.id)).filter(f => f.conversation_id === conversation.id);
        const persisted = await DB.listMessages(conversation.id);
        if (req.user && !existing.length && persisted.length >= 5 && filmId) {
          await DB.scheduleFollowUps({ userId: req.user.id, conversationId: conversation.id, filmId });
          log.info({ user: req.user.id, conv: conversation.id, film: filmId }, 'follow-ups scheduled');
        }
      } catch (e) { log.warn({ err: e.message }, 'follow-up scheduling failed'); }
    }
    sse(res, 'done', {
      usage: final.usage,
      spend: { today: dailySpend.usd.toFixed(4), cap: DAILY_SPEND_CAP_USD },
      conversationId: conversation?.id,
    });
    res.end();
  } catch (err) {
    log.error({ status: err.status, err: err.message }, 'Claude stream error');
    let message = 'Something interrupted us. Take your time — I\'m still here.';
    if (err.status === 401) message = 'API key issue — check the server .env file.';
    if (err.status === 429) message = "We're moving a little fast. Give it a few seconds and try again.";
    sse(res, 'error', { error: message });
    res.end();
  }
});

/* ═══════════════════════════════════════════════════════
   GET /api/film/:id
═══════════════════════════════════════════════════════ */
app.get('/api/film/:id', (req, res) => {
  const film = getFilm(req.params.id);
  if (!film) return res.status(404).json({ error: 'Film not found' });
  res.json({
    id:           film.id,
    trigger:      film.trigger,
    categories:   film.categories,
    healingStage: film.healingStage,
    synopsis:     film.synopsis,
    watchModes:   film.watchModes,
    duration:     film.duration,
    year:         film.year,
    contentFlags: film.contentFlags || [],
  });
});

/* ═══════════════════════════════════════════════════════
   GET /api/crisis-resource  (geo-aware lookup)
═══════════════════════════════════════════════════════ */
app.get('/api/crisis-resource', (req, res) => {
  const country = (req.query.country || detectCountry(req)).toString().toUpperCase().slice(0, 2);
  res.json({ country, resource: crisisResourceFor(country) });
});

/* ═══════════════════════════════════════════════════════
   EXTENSION  (item 8a)
═══════════════════════════════════════════════════════ */

// Normalise a streaming-service title for fuzzy match against our catalog.
function normaliseTitle(t) {
  return String(t || '')
    .toLowerCase()
    .replace(/[‐-―]/g, '-')
    .replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
    .replace(/\b(the|a|an|and)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
// Pre-compute normalised titles so identify() stays O(N) with no per-call work.
const NORMALISED_FILM_TITLES = MOVIES.map(m => ({
  id:   m.id,
  norm: normaliseTitle(m.title || m.trigger),
}));

const extLimit = rateLimit({ windowMs: 60_000, max: 30, standardHeaders: true, legacyHeaders: false });

app.post('/api/extension/identify', extLimit, (req, res) => {
  const { title, source } = req.body || {};
  if (!title || typeof title !== 'string') return res.status(400).json({ error: 'title required' });
  const target = normaliseTitle(title);
  if (!target) return res.json({});
  // Substring match in both directions — handles "Eternal Sunshine" vs "Eternal Sunshine of the Spotless Mind"
  const hit = NORMALISED_FILM_TITLES.find(f => f.norm.includes(target) || target.includes(f.norm));
  if (!hit) return res.json({});
  const f = getFilm(hit.id);
  log.info({ source, title, matched: f.id }, 'extension identify');
  res.json({
    filmId:       f.id,
    companionUrl: `${process.env.APP_URL || `http://localhost:${PORT}`}/player.html?id=${f.id}`,
    contentFlags: f.contentFlags || [],
  });
});

/* ═══════════════════════════════════════════════════════
   VOICE COMPANION  (item 8b)
   STT (speech-to-text) via OpenAI Whisper API.
   TTS (text-to-speech) via ElevenLabs.
   Both are optional — require their respective env keys.
═══════════════════════════════════════════════════════ */

const OPENAI_API_KEY     = process.env.OPENAI_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE   = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // calm female default

const voiceLimit = rateLimit({ windowMs: 60_000, max: 20, standardHeaders: true, legacyHeaders: false });

// POST /api/voice/transcribe — raw audio body, returns { text }
app.post('/api/voice/transcribe', voiceLimit, express.raw({ type: '*/*', limit: '5mb' }), async (req, res) => {
  if (!OPENAI_API_KEY) return res.status(503).json({ error: 'Voice transcription not configured.' });
  try {
    const fd = new FormData();
    fd.append('file', new Blob([req.body], { type: req.headers['content-type'] || 'audio/webm' }), 'speech.webm');
    fd.append('model', 'whisper-1');
    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: fd,
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data.error?.message || 'transcription failed' });
    res.json({ text: data.text || '' });
  } catch (e) {
    log.error({ err: e.message }, 'transcribe error');
    res.status(500).json({ error: 'transcription failed' });
  }
});

// POST /api/voice/speak — { text } → audio/mpeg stream
app.post('/api/voice/speak', voiceLimit, async (req, res) => {
  if (!ELEVENLABS_API_KEY) return res.status(503).json({ error: 'Voice synthesis not configured.' });
  const text = (req.body?.text || '').slice(0, 1500);
  if (!text) return res.status(400).json({ error: 'text required' });
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key':   ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        Accept:         'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: { stability: 0.5, similarity_boost: 0.7 },
      }),
    });
    if (!r.ok) {
      const err = await r.text();
      log.error({ status: r.status, err }, 'elevenlabs error');
      return res.status(502).json({ error: 'tts failed' });
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    r.body.pipe(res);
  } catch (e) {
    log.error({ err: e.message }, 'speak error');
    res.status(500).json({ error: 'tts failed' });
  }
});

/* ═══════════════════════════════════════════════════════
   CLINICIAN LAYER  (item 8c)
   Verification is manual: a clinician requests status with their
   credential text + organisation, an admin verifies, then they
   can issue prescriptions to clients (existing users by email).
═══════════════════════════════════════════════════════ */

const ADMIN_EMAILS = (process.env.BRODONAM_ADMIN_EMAILS || '')
  .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

function isAdmin(req) {
  return req.user && ADMIN_EMAILS.includes(req.user.email.toLowerCase());
}
function requireAdmin(req, res, next) {
  if (!req.user)       return res.status(401).json({ error: 'Sign in required' });
  if (!isAdmin(req))   return res.status(403).json({ error: 'Admin only' });
  next();
}
async function requireVerifiedClinician(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Sign in required' });
  const c = await DB.findClinicianByUser(req.user.id);
  if (!c || !c.verified_at) return res.status(403).json({ error: 'Clinician verification required' });
  req.clinician = c;
  next();
}

// GET /api/clinician/me — clinician status for the current user
app.get('/api/clinician/me', requireUser, async (req, res) => {
  const c = await DB.findClinicianByUser(req.user.id);
  res.json({
    clinician: c || null,
    verified:  !!(c && c.verified_at),
    admin:     isAdmin(req),
  });
});

// POST /api/clinician/request — { credential, organisation }
app.post('/api/clinician/request', requireUser, async (req, res) => {
  const { credential, organisation } = req.body || {};
  if (!credential || !organisation) {
    return res.status(400).json({ error: 'credential and organisation are required' });
  }
  if (credential.length > 400 || organisation.length > 200) {
    return res.status(400).json({ error: 'Field too long' });
  }
  const c = await DB.requestClinicianStatus({ userId: req.user.id, credential, organisation });
  log.info({ user: req.user.id, clinician_id: c.id }, 'clinician status requested');
  res.json({ clinician: c, message: 'Request received. An admin will review shortly.' });
});

// GET /api/admin/clinicians — pending approval queue
app.get('/api/admin/clinicians', requireAdmin, async (_req, res) => {
  res.json({ pending: await DB.listPendingClinicians() });
});

// POST /api/admin/clinicians/:id/verify — approve
app.post('/api/admin/clinicians/:id/verify', requireAdmin, async (req, res) => {
  const c = await DB.verifyClinician(req.params.id);
  if (!c) return res.status(404).json({ error: 'not found' });
  log.info({ admin: req.user.id, clinician_id: c.id }, 'clinician verified');
  res.json({ clinician: c });
});

// POST /api/clinician/prescribe — { clientEmail, filmId, note, shareThemes }
app.post('/api/clinician/prescribe', requireVerifiedClinician, async (req, res) => {
  const { clientEmail, filmId, note, shareThemes } = req.body || {};
  if (!clientEmail || !filmId) return res.status(400).json({ error: 'clientEmail and filmId required' });

  const client = await DB.findUserByEmail(clientEmail);
  if (!client) {
    return res.status(404).json({
      error: 'Client must already have a Brodonam account. Ask them to sign in once first.',
    });
  }
  const film = getFilm(filmId);
  if (!film) return res.status(404).json({ error: 'filmId not found in catalog' });

  const p = await DB.createPrescription({
    clinicianId: req.clinician.id,
    clientId:    client.id,
    filmId,
    note,
    shareThemes,
  });
  log.info({ clinician: req.clinician.id, client: client.id, film: filmId }, 'prescription created');
  res.json({ prescription: p });
});

// GET /api/clinician/prescriptions — list ones issued by this clinician
app.get('/api/clinician/prescriptions', requireVerifiedClinician, async (req, res) => {
  res.json({ prescriptions: await DB.listPrescriptionsByClinician(req.clinician.id) });
});

// GET /me/prescriptions — what this user has been prescribed
app.get('/me/prescriptions', requireUser, async (req, res) => {
  res.json({ prescriptions: await DB.listPrescriptionsForClient(req.user.id) });
});

/* ═══════════════════════════════════════════════════════
   JUSTWATCH HELPER
   We don't proxy JustWatch's paid API. Instead we link out
   to their search page, which always exists and surfaces
   whichever services have the title in the user's country.
   This is the lowest-friction path for "where can I watch?"
═══════════════════════════════════════════════════════ */
app.get('/api/film/:id/watch-link', (req, res) => {
  const film = getFilm(req.params.id);
  if (!film) return res.status(404).json({ error: 'Film not found' });
  const country = detectCountry(req).toLowerCase();
  const locale = ({ us: 'us', gb: 'uk', ca: 'ca', au: 'au' })[country] || 'us';
  const q = encodeURIComponent(film.title || film.trigger);
  res.json({
    title: film.title || film.trigger,
    url:   `https://www.justwatch.com/${locale}/search?q=${q}`,
    note:  'JustWatch shows current streaming availability in your region.',
  });
});

/* ═══════════════════════════════════════════════════════
   FEEDBACK  (item B observability)
   Anonymous-friendly thumbs/notes endpoint — feeds the
   dataset you'll fine-tune on later.
═══════════════════════════════════════════════════════ */

const feedbackLimit = rateLimit({ windowMs: 60_000, max: 10, standardHeaders: true, legacyHeaders: false });

app.post('/api/feedback', feedbackLimit, (req, res) => {
  const { conversationId, score, note, filmId } = req.body || {};
  if (score !== 1 && score !== -1 && score !== 0) return res.status(400).json({ error: 'score must be -1, 0, or 1' });
  log.info({
    user:           req.user?.id || null,
    conversationId: conversationId || null,
    score,
    filmId:         filmId || null,
    note:           (note || '').slice(0, 500),
  }, 'feedback');
  res.json({ ok: true });
});

/* ═══════════════════════════════════════════════════════
   GET /api/health
═══════════════════════════════════════════════════════ */
app.get('/api/health', async (req, res) => {
  rollSpend();
  const { users, conversations } = await DB.stats();
  res.json({
    status:     'ok',
    films:      MOVIES.length,
    key:        process.env.ANTHROPIC_API_KEY ? '✓ set' : '✗ missing',
    model:      MODEL_MAIN,
    classifier: MODEL_CLASSIFIER,
    spend:      { ...dailySpend, cap: DAILY_SPEND_CAP_USD },
    users,
    conversations,
    crisis_unreviewed: await DB.unreviewedCrisisCount(),
    db:         process.env.DATABASE_URL ? 'postgres' : 'sqlite',
    you: req.user ? { id: req.user.id, email: req.user.email } : null,
  });
});

/* ═══════════════════════════════════════════════════════
   START
═══════════════════════════════════════════════════════ */
const PORT = process.env.PORT || 3001;
let server;
DB.ready
  .then(() => {
    server = app.listen(PORT, () => {
      log.info({
        port:          PORT,
        static:        __dirname,
        films:         MOVIES.length,
        main_model:    MODEL_MAIN,
        classifier:    MODEL_CLASSIFIER,
        daily_cap_usd: DAILY_SPEND_CAP_USD,
        env:           process.env.NODE_ENV || 'development',
        db:            process.env.DATABASE_URL ? 'postgres' : 'sqlite',
      }, '◆ Brodonam API ready');
      followUps.start();
    });
  })
  .catch(err => {
    log.fatal({ err: err.message }, 'DB init failed');
    process.exit(1);
  });

/* ═══════════════════════════════════════════════════════
   GRACEFUL SHUTDOWN
   On SIGTERM (k8s/docker stop) / SIGINT (Ctrl-C): stop accepting
   new connections, drain in-flight requests, close the DB,
   exit. Force-exit after 10s if a stuck connection holds us up.
═══════════════════════════════════════════════════════ */
let shuttingDown = false;
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  log.info({ signal }, 'Shutting down');
  const force = setTimeout(() => {
    log.warn('Forcing exit after 10s');
    process.exit(1);
  }, 10_000).unref();
  const finish = async () => {
    try { await DB.driver().close(); } catch (e) { log.error({ err: e }, 'db.close errored'); }
    clearTimeout(force);
    log.info('Goodbye');
    process.exit(0);
  };
  if (server) server.close(err => { if (err) log.error({ err }, 'server.close errored'); finish(); });
  else finish();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('uncaughtException', (err) => { log.fatal({ err }, 'uncaughtException'); shutdown('uncaughtException'); });
process.on('unhandledRejection', (reason) => { log.error({ reason }, 'unhandledRejection'); });
