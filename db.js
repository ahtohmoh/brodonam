/**
 * BRODONAM — database layer (dual-driver)
 *
 * Default driver: better-sqlite3 (zero infra, perfect for dev + low/medium prod).
 * Optional driver: Postgres (pg.Pool) when DATABASE_URL is set.
 *
 * Both drivers expose the SAME async API. Sync better-sqlite3 calls are
 * wrapped to return Promises, so server.js can `await` either backend
 * uniformly.
 *
 * To switch to Postgres:
 *   1. Apply data/schema-postgres.sql to your Postgres database.
 *   2. Set DATABASE_URL=postgres://user:pass@host:5432/brodonam in .env
 *   3. Restart. The log line at boot will report which driver is active.
 *
 * NOTE: SQL strings below use `$1, $2, ...` placeholders (Postgres style).
 * better-sqlite3 expects `?` placeholders, so the SQLite branch rewrites
 * `$N` → `?` before preparing.
 */

const path   = require('node:path');
const crypto = require('node:crypto');
const log    = require('./logger');

const USE_PG   = !!process.env.DATABASE_URL;
const DB_PATH  = process.env.BRODONAM_DB_PATH || path.join(__dirname, 'data', 'brodonam.db');

const now      = () => Date.now();
const newId    = () => crypto.randomBytes(16).toString('hex');
const newToken = () => crypto.randomBytes(32).toString('base64url');

const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;
const SESSION_TTL_MS    = 30 * 24 * 3600 * 1000;

/* ═══════════════════════════════════════════════════════
   DRIVER ABSTRACTION
   Each driver exposes:
     query(sql, params)          → { rows }
     exec(sql)                   → applies a multi-statement script
     close()                     → close the underlying pool/db
   server.js never sees these directly — it uses the named helpers below.
═══════════════════════════════════════════════════════ */
let driver;
let underlying;  // raw handle for /api/health stats etc.

if (USE_PG) {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: parseInt(process.env.PGPOOL_MAX || '12', 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 8_000,
  });
  underlying = pool;
  driver = {
    async query(sql, params = []) { return pool.query(sql, params); },
    async exec(script) { await pool.query(script); },
    async close() { await pool.end(); },
    placeholder: '$',
  };
  log.info('DB driver: Postgres');
} else {
  const Database = require('better-sqlite3');
  const sqlite = new Database(DB_PATH);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('synchronous = NORMAL');
  underlying = sqlite;
  // Cache prepared statements for performance.
  const prepared = new Map();
  function prep(sql) {
    // Rewrite `$1, $2, ...` → `?, ?` for SQLite
    const sqliteSql = sql.replace(/\$\d+/g, '?');
    let stmt = prepared.get(sqliteSql);
    if (!stmt) { stmt = sqlite.prepare(sqliteSql); prepared.set(sqliteSql, stmt); }
    return stmt;
  }
  driver = {
    async query(sql, params = []) {
      const stmt = prep(sql);
      const trimmed = sql.trim().toUpperCase();
      if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH')) {
        return { rows: stmt.all(...params) };
      }
      const r = stmt.run(...params);
      // For SQLite, mirror the "rows" shape so callers can detect changes.
      return { rows: [], rowCount: r.changes, lastInsertRowid: r.lastInsertRowid };
    },
    async exec(script) { sqlite.exec(script); },
    async close() { sqlite.close(); },
    placeholder: '?',
  };
  log.info({ path: DB_PATH }, 'DB driver: SQLite');
}

/* ═══════════════════════════════════════════════════════
   SCHEMA  — applied idempotently on boot
   The same DDL works on both engines because we use:
     - TEXT instead of VARCHAR
     - INTEGER for timestamps (unix ms)
     - INTEGER PRIMARY KEY AUTOINCREMENT for SQLite;
       Postgres uses BIGSERIAL in schema-postgres.sql instead.
   The "auto-increment" tables are only `messages`, `crisis_events`,
   `follow_ups`. They take their PG schema from schema-postgres.sql.
═══════════════════════════════════════════════════════ */
async function applySchema() {
  if (USE_PG) {
    // Apply the Postgres DDL on boot. Every statement is CREATE TABLE/INDEX
    // IF NOT EXISTS, so running it on each start is idempotent and safe — no
    // manual `psql` step needed for a fresh Render database.
    try {
      const fs  = require('node:fs');
      const ddl = fs.readFileSync(path.join(__dirname, 'data', 'schema-postgres.sql'), 'utf8');
      await driver.exec(ddl);
      log.info('Postgres schema applied (idempotent)');
    } catch (e) {
      log.fatal({ err: e.message }, 'Failed to apply Postgres schema from data/schema-postgres.sql');
      process.exit(1);
    }
    return;
  }
  await driver.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  created_at    INTEGER NOT NULL,
  last_seen_at  INTEGER,
  country       TEXT,
  deleted_at    INTEGER
);
CREATE TABLE IF NOT EXISTS magic_links (
  token       TEXT PRIMARY KEY,
  email       TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL,
  used_at     INTEGER
);
CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links(email);
CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL,
  user_agent  TEXT,
  ip          TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS conversations (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id) ON DELETE CASCADE,
  film_id     TEXT,
  context     TEXT,
  started_at  INTEGER NOT NULL,
  last_at     INTEGER NOT NULL,
  ended_at    INTEGER
);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE TABLE IF NOT EXISTS messages (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content         TEXT NOT NULL,
  created_at      INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);
CREATE TABLE IF NOT EXISTS crisis_events (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id         TEXT REFERENCES users(id) ON DELETE SET NULL,
  conversation_id TEXT REFERENCES conversations(id) ON DELETE SET NULL,
  detected_by     TEXT NOT NULL,
  excerpt         TEXT,
  country         TEXT,
  created_at      INTEGER NOT NULL,
  reviewed_at     INTEGER,
  reviewer_notes  TEXT
);
CREATE INDEX IF NOT EXISTS idx_crisis_user ON crisis_events(user_id);
CREATE INDEX IF NOT EXISTS idx_crisis_unreviewed ON crisis_events(reviewed_at) WHERE reviewed_at IS NULL;
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id          TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  muted_flags      TEXT,
  display_name     TEXT,
  pronouns         TEXT,
  notifications_ok INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS clinicians (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  credential    TEXT,
  organisation  TEXT,
  verified_at   INTEGER,
  created_at    INTEGER NOT NULL,
  UNIQUE (user_id)
);
CREATE TABLE IF NOT EXISTS prescriptions (
  id            TEXT PRIMARY KEY,
  clinician_id  TEXT NOT NULL REFERENCES clinicians(id) ON DELETE CASCADE,
  client_id     TEXT NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
  film_id       TEXT NOT NULL,
  note          TEXT,
  share_themes  INTEGER DEFAULT 0,
  created_at    INTEGER NOT NULL,
  watched_at    INTEGER
);
CREATE INDEX IF NOT EXISTS idx_prescriptions_client    ON prescriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_clinician ON prescriptions(clinician_id);
CREATE TABLE IF NOT EXISTS follow_ups (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id TEXT REFERENCES conversations(id) ON DELETE SET NULL,
  film_id         TEXT,
  scheduled_for   INTEGER NOT NULL,
  sent_at         INTEGER,
  responded_at    INTEGER,
  kind            TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_followups_due ON follow_ups(scheduled_for) WHERE sent_at IS NULL;
`);
}

/* ═══════════════════════════════════════════════════════
   HELPERS  (all async — both drivers behave identically to callers)
═══════════════════════════════════════════════════════ */
const one = (r) => r.rows[0] || null;

/* ── users ── */
async function findUserByEmail(email) {
  const r = await driver.query(`SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`, [email.toLowerCase().trim()]);
  return one(r);
}
async function findUserById(id) {
  const r = await driver.query(`SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL`, [id]);
  return one(r);
}
async function getOrCreateUser(email) {
  const e = email.toLowerCase().trim();
  const existing = await findUserByEmail(e);
  if (existing) return existing;
  const id = newId();
  await driver.query(`INSERT INTO users (id, email, created_at) VALUES ($1, $2, $3)`, [id, e, now()]);
  return findUserById(id);
}
async function touchUser(id, country) {
  await driver.query(`UPDATE users SET last_seen_at = $1, country = COALESCE($2, country) WHERE id = $3`, [now(), country || null, id]);
}

/* ── magic links ── */
async function createMagicLink(email) {
  await driver.query(`DELETE FROM magic_links WHERE expires_at < $1`, [now() - 24 * 3600 * 1000]);
  const token = newToken();
  const t = now();
  await driver.query(`INSERT INTO magic_links (token, email, created_at, expires_at) VALUES ($1, $2, $3, $4)`, [token, email.toLowerCase().trim(), t, t + MAGIC_LINK_TTL_MS]);
  return { token, expiresAt: t + MAGIC_LINK_TTL_MS };
}
async function consumeMagicLink(token) {
  const link = one(await driver.query(`SELECT * FROM magic_links WHERE token = $1`, [token]));
  if (!link) return { ok: false, reason: 'unknown' };
  if (link.used_at) return { ok: false, reason: 'used' };
  if (link.expires_at < now()) return { ok: false, reason: 'expired' };
  const r = await driver.query(`UPDATE magic_links SET used_at = $1 WHERE token = $2 AND used_at IS NULL`, [now(), token]);
  if (r.rowCount !== 1) return { ok: false, reason: 'race' };
  return { ok: true, email: link.email };
}

/* ── sessions ── */
async function createSession(userId, userAgent, ip) {
  await driver.query(`DELETE FROM sessions WHERE expires_at < $1`, [now()]);
  const id = newToken();
  const t = now();
  await driver.query(`INSERT INTO sessions (id, user_id, created_at, expires_at, user_agent, ip) VALUES ($1, $2, $3, $4, $5, $6)`, [id, userId, t, t + SESSION_TTL_MS, userAgent || null, ip || null]);
  return { id, expiresAt: t + SESSION_TTL_MS };
}
async function findSession(id) {
  const s = one(await driver.query(`SELECT * FROM sessions WHERE id = $1`, [id]));
  if (!s) return null;
  if (s.expires_at < now()) { await driver.query(`DELETE FROM sessions WHERE id = $1`, [id]); return null; }
  return s;
}
async function deleteSession(id) { await driver.query(`DELETE FROM sessions WHERE id = $1`, [id]); }

/* ── conversations + messages ── */
async function ensureConversation({ conversationId, userId, filmId, context }) {
  if (conversationId) {
    const c = one(await driver.query(`SELECT * FROM conversations WHERE id = $1`, [conversationId]));
    if (c && c.user_id === userId) {
      await driver.query(`UPDATE conversations SET last_at = $1 WHERE id = $2`, [now(), conversationId]);
      return c;
    }
  }
  const id = newId();
  await driver.query(
    `INSERT INTO conversations (id, user_id, film_id, context, started_at, last_at) VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, userId || null, filmId || null, context || null, now(), now()],
  );
  return one(await driver.query(`SELECT * FROM conversations WHERE id = $1`, [id]));
}
async function appendMessage(conversationId, role, content) {
  await driver.query(`INSERT INTO messages (conversation_id, role, content, created_at) VALUES ($1, $2, $3, $4)`, [conversationId, role, content, now()]);
  await driver.query(`UPDATE conversations SET last_at = $1 WHERE id = $2`, [now(), conversationId]);
}
async function listConversations(userId, limit = 50) {
  return (await driver.query(`SELECT * FROM conversations WHERE user_id = $1 ORDER BY last_at DESC LIMIT $2`, [userId, limit])).rows;
}
async function listMessages(conversationId) {
  return (await driver.query(`SELECT role, content, created_at FROM messages WHERE conversation_id = $1 ORDER BY id ASC`, [conversationId])).rows;
}

/* ── crisis ── */
async function logCrisis({ userId, conversationId, detectedBy, excerpt, country }) {
  await driver.query(
    `INSERT INTO crisis_events (user_id, conversation_id, detected_by, excerpt, country, created_at) VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId || null, conversationId || null, detectedBy, (excerpt || '').slice(0, 500), country || null, now()],
  );
}
async function unreviewedCrisisCount() {
  return one(await driver.query(`SELECT COUNT(*) as n FROM crisis_events WHERE reviewed_at IS NULL`)).n;
}

/* ── preferences ── */
async function getPreferences(userId) {
  const p = one(await driver.query(`SELECT * FROM user_preferences WHERE user_id = $1`, [userId]));
  if (!p) return { muted_flags: [], display_name: null, pronouns: null, notifications_ok: false };
  return {
    muted_flags:      p.muted_flags ? JSON.parse(p.muted_flags) : [],
    display_name:     p.display_name,
    pronouns:         p.pronouns,
    notifications_ok: !!p.notifications_ok,
  };
}
async function setPreferences(userId, prefs) {
  // Both engines support ON CONFLICT(col) DO UPDATE SET col = excluded.col
  await driver.query(
    `INSERT INTO user_preferences (user_id, muted_flags, display_name, pronouns, notifications_ok)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT(user_id) DO UPDATE SET
         muted_flags      = excluded.muted_flags,
         display_name     = excluded.display_name,
         pronouns         = excluded.pronouns,
         notifications_ok = excluded.notifications_ok`,
    [userId, JSON.stringify(prefs.muted_flags || []), prefs.display_name || null, prefs.pronouns || null, prefs.notifications_ok ? 1 : 0],
  );
}

/* ── clinicians ── */
async function findClinicianByUser(userId) {
  return one(await driver.query(`SELECT * FROM clinicians WHERE user_id = $1`, [userId]));
}
async function findClinicianById(id) {
  return one(await driver.query(`SELECT * FROM clinicians WHERE id = $1`, [id]));
}
async function requestClinicianStatus({ userId, credential, organisation }) {
  const existing = await findClinicianByUser(userId);
  if (existing) return existing;
  const id = newId();
  await driver.query(`INSERT INTO clinicians (id, user_id, credential, organisation, created_at) VALUES ($1, $2, $3, $4, $5)`, [id, userId, credential || null, organisation || null, now()]);
  return findClinicianById(id);
}
async function verifyClinician(id) {
  await driver.query(`UPDATE clinicians SET verified_at = $1 WHERE id = $2`, [now(), id]);
  return findClinicianById(id);
}
async function listPendingClinicians() {
  return (await driver.query(
    `SELECT c.*, u.email FROM clinicians c JOIN users u ON u.id = c.user_id
     WHERE c.verified_at IS NULL ORDER BY c.created_at ASC`,
  )).rows;
}

/* ── prescriptions ── */
async function createPrescription({ clinicianId, clientId, filmId, note, shareThemes }) {
  const id = newId();
  await driver.query(
    `INSERT INTO prescriptions (id, clinician_id, client_id, film_id, note, share_themes, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, clinicianId, clientId, filmId, note || null, shareThemes ? 1 : 0, now()],
  );
  return one(await driver.query(`SELECT * FROM prescriptions WHERE id = $1`, [id]));
}
async function listPrescriptionsByClinician(clinicianId) {
  return (await driver.query(`SELECT * FROM prescriptions WHERE clinician_id = $1 ORDER BY created_at DESC`, [clinicianId])).rows;
}
async function listPrescriptionsForClient(clientId) {
  return (await driver.query(`SELECT * FROM prescriptions WHERE client_id = $1 ORDER BY created_at DESC`, [clientId])).rows;
}
async function markPrescriptionWatched(id, clientId) {
  await driver.query(`UPDATE prescriptions SET watched_at = $1 WHERE id = $2 AND client_id = $3`, [now(), id, clientId]);
}

/* ── follow-ups ── */
async function scheduleFollowUps({ userId, conversationId, filmId }) {
  const t = now();
  await driver.query(`INSERT INTO follow_ups (user_id, conversation_id, film_id, scheduled_for, kind) VALUES ($1, $2, $3, $4, $5)`, [userId, conversationId || null, filmId || null, t +  7 * 86400 * 1000, 'week-1']);
  await driver.query(`INSERT INTO follow_ups (user_id, conversation_id, film_id, scheduled_for, kind) VALUES ($1, $2, $3, $4, $5)`, [userId, conversationId || null, filmId || null, t + 30 * 86400 * 1000, 'month-1']);
  await driver.query(`INSERT INTO follow_ups (user_id, conversation_id, film_id, scheduled_for, kind) VALUES ($1, $2, $3, $4, $5)`, [userId, conversationId || null, filmId || null, t + 90 * 86400 * 1000, 'month-3']);
}
async function listDueFollowUps() {
  return (await driver.query(
    `SELECT f.*, u.email FROM follow_ups f JOIN users u ON u.id = f.user_id
     WHERE f.sent_at IS NULL AND f.scheduled_for <= $1
     ORDER BY f.scheduled_for ASC LIMIT 50`, [now()],
  )).rows;
}
async function markFollowUpSent(id)      { await driver.query(`UPDATE follow_ups SET sent_at = $1 WHERE id = $2`, [now(), id]); }
async function markFollowUpResponded(id) { await driver.query(`UPDATE follow_ups SET responded_at = $1 WHERE id = $2`, [now(), id]); }
async function followUpsForUser(userId)  { return (await driver.query(`SELECT * FROM follow_ups WHERE user_id = $1 ORDER BY scheduled_for DESC`, [userId])).rows; }

/* ── GDPR ── */
async function exportUserData(userId) {
  const user = await findUserById(userId);
  if (!user) return null;
  const prefs = await getPreferences(userId);
  const convs = await listConversations(userId, 10000);
  const conversations = [];
  for (const c of convs) conversations.push({ ...c, messages: await listMessages(c.id) });
  const crisisEvents = (await driver.query(`SELECT detected_by, excerpt, country, created_at FROM crisis_events WHERE user_id = $1`, [userId])).rows;
  const clinician = await findClinicianByUser(userId);
  const prescriptions = await listPrescriptionsForClient(userId);
  const follow_ups = await followUpsForUser(userId);
  return {
    exported_at:   new Date().toISOString(),
    user:          { id: user.id, email: user.email, created_at: user.created_at, country: user.country },
    preferences:   prefs,
    conversations,
    crisis_events: crisisEvents,
    clinician,
    prescriptions,
    follow_ups,
  };
}
async function deleteUserCompletely(userId) {
  await driver.query(`UPDATE crisis_events SET user_id = NULL, conversation_id = NULL WHERE user_id = $1`, [userId]);
  await driver.query(`DELETE FROM users WHERE id = $1`, [userId]);
}

/* ── stats for /api/health ── */
async function stats() {
  const u = one(await driver.query(`SELECT COUNT(*) as n FROM users WHERE deleted_at IS NULL`));
  const c = one(await driver.query(`SELECT COUNT(*) as n FROM conversations`));
  return { users: Number(u.n), conversations: Number(c.n) };
}

/* ═══════════════════════════════════════════════════════
   Apply schema synchronously on first require.
   (Top-level await keeps the export ergonomics intact.)
═══════════════════════════════════════════════════════ */
const ready = applySchema();

module.exports = {
  driver:    () => driver,
  underlying: () => underlying,
  ready,
  // users
  findUserByEmail, findUserById, getOrCreateUser, touchUser,
  // magic links
  createMagicLink, consumeMagicLink, MAGIC_LINK_TTL_MS,
  // sessions
  createSession, findSession, deleteSession, SESSION_TTL_MS,
  // conversations
  ensureConversation, appendMessage, listConversations, listMessages,
  // crisis
  logCrisis, unreviewedCrisisCount,
  // prefs
  getPreferences, setPreferences,
  // clinicians
  findClinicianByUser, findClinicianById, requestClinicianStatus, verifyClinician, listPendingClinicians,
  // prescriptions
  createPrescription, listPrescriptionsByClinician, listPrescriptionsForClient, markPrescriptionWatched,
  // follow-ups
  scheduleFollowUps, listDueFollowUps, markFollowUpSent, markFollowUpResponded, followUpsForUser,
  // gdpr
  exportUserData, deleteUserCompletely,
  // stats
  stats,
};
