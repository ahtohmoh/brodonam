/**
 * BRODONAM — follow-up scheduler
 *
 * In-process loop that wakes every FOLLOWUP_TICK_MS, finds rows in
 * `follow_ups` whose `scheduled_for <= now` and `sent_at IS NULL`,
 * and sends a warm, low-pressure email referencing the film they
 * watched. Each follow-up has a `kind` (week-1 / month-1 / month-3)
 * that varies the tone.
 *
 * Production: replace this in-process scheduler with a real queue
 * (BullMQ, Cloudflare Queues, AWS SQS) when you scale to >1 instance.
 * For now, single-instance Brodonam is fine.
 */
const log = require('./logger');
const DB  = require('./db');
const nodemailer = require('nodemailer');

const TICK_MS     = parseInt(process.env.FOLLOWUP_TICK_MS || `${5 * 60 * 1000}`, 10); // 5 min
const ENABLED     = process.env.FOLLOWUPS_ENABLED !== '0';
const APP_URL     = process.env.APP_URL || `http://localhost:${process.env.PORT || 3001}`;
const SMTP_FROM   = process.env.SMTP_FROM || 'Brodonam <hello@brodonam.local>';

let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const TEMPLATES = {
  'week-1': (film) => ({
    subject: `Brodonam — one week on`,
    body:
`Hi,

It's been about a week since we watched ${film ? `"${film.title || film.trigger}"` : 'together'}.

One question, no pressure: has anything from the film stayed with you?

If you want to talk it through, I'm here: ${APP_URL}

— Brodonam`,
  }),
  'month-1': (film) => ({
    subject: `Brodonam — a month later`,
    body:
`Hi,

A month has passed since ${film ? `"${film.title || film.trigger}"` : 'our last film'}.

If something has shifted — even something small — I'd love to hear what.

${APP_URL}

— Brodonam`,
  }),
  'month-3': (film) => ({
    subject: `Brodonam — three months on`,
    body:
`Hi,

Three months ago you spent time with ${film ? `"${film.title || film.trigger}"` : 'a film'} on Brodonam.

If you'd like to revisit, or sit with something new, the door is open: ${APP_URL}

— Brodonam`,
  }),
};

function getFilm(id) {
  try {
    const { BRODONAM_MOVIES } = require('./data/movies.js');
    return BRODONAM_MOVIES.find(m => m.id === id) || null;
  } catch { return null; }
}

async function sendOne(row) {
  const film = row.film_id ? getFilm(row.film_id) : null;
  const tmpl = TEMPLATES[row.kind];
  if (!tmpl) {
    log.warn({ id: row.id, kind: row.kind }, 'unknown follow-up kind; marking sent');
    await DB.markFollowUpSent(row.id);
    return;
  }
  const { subject, body } = tmpl(film);

  if (!transporter) {
    log.info({ to: row.email, subject, kind: row.kind, dev: true }, 'follow-up (dev mode)');
    await DB.markFollowUpSent(row.id);
    return;
  }

  try {
    await transporter.sendMail({ from: SMTP_FROM, to: row.email, subject, text: body });
    await DB.markFollowUpSent(row.id);
    log.info({ to: row.email, kind: row.kind }, 'follow-up sent');
  } catch (e) {
    log.error({ id: row.id, err: e.message }, 'follow-up send failed');
  }
}

async function tick() {
  let due;
  try { due = await DB.listDueFollowUps(); }
  catch (e) { log.error({ err: e.message }, 'follow-up query failed'); return; }
  if (!due.length) return;
  log.info({ n: due.length }, 'processing follow-ups');
  for (const row of due) await sendOne(row);
}

function start() {
  if (!ENABLED) {
    log.info('follow-up scheduler disabled (FOLLOWUPS_ENABLED=0)');
    return;
  }
  log.info({ tick_ms: TICK_MS, smtp: !!transporter }, 'follow-up scheduler started');
  // Stagger the first tick so it doesn't fire during boot
  setTimeout(() => { tick().catch(()=>{}); setInterval(() => tick().catch(()=>{}), TICK_MS); }, 30_000);
}

module.exports = { start, tick, sendOne };
