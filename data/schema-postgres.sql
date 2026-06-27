-- ───────────────────────────────────────────────────────────────
-- BRODONAM — Postgres DDL
--
-- Apply when migrating off SQLite at scale.
-- Migration steps documented in DEPLOY.md.
--
-- After running this, refactor db.js to use pg.Pool with parameterized
-- queries (the prepared-statement names stay the same; the engine differs).
-- ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  created_at    BIGINT NOT NULL,
  last_seen_at  BIGINT,
  country       TEXT,
  deleted_at    BIGINT
);

CREATE TABLE IF NOT EXISTS magic_links (
  token       TEXT PRIMARY KEY,
  email       TEXT NOT NULL,
  created_at  BIGINT NOT NULL,
  expires_at  BIGINT NOT NULL,
  used_at     BIGINT
);
CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links(email);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires ON magic_links(expires_at);

CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  BIGINT NOT NULL,
  expires_at  BIGINT NOT NULL,
  user_agent  TEXT,
  ip          TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS conversations (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id) ON DELETE CASCADE,
  film_id     TEXT,
  context     TEXT,
  started_at  BIGINT NOT NULL,
  last_at     BIGINT NOT NULL,
  ended_at    BIGINT
);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_at ON conversations(last_at DESC);

CREATE TABLE IF NOT EXISTS messages (
  id              BIGSERIAL PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content         TEXT NOT NULL,
  created_at      BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, id);

CREATE TABLE IF NOT EXISTS crisis_events (
  id              BIGSERIAL PRIMARY KEY,
  user_id         TEXT REFERENCES users(id) ON DELETE SET NULL,
  conversation_id TEXT REFERENCES conversations(id) ON DELETE SET NULL,
  detected_by     TEXT NOT NULL,
  excerpt         TEXT,
  country         TEXT,
  created_at      BIGINT NOT NULL,
  reviewed_at     BIGINT,
  reviewer_notes  TEXT
);
CREATE INDEX IF NOT EXISTS idx_crisis_user ON crisis_events(user_id);
CREATE INDEX IF NOT EXISTS idx_crisis_unreviewed ON crisis_events(created_at) WHERE reviewed_at IS NULL;

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id          TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  muted_flags      TEXT,
  display_name     TEXT,
  pronouns         TEXT,
  notifications_ok INTEGER DEFAULT 0
);

-- Phase A tables — clinician layer + follow-ups (see DEPLOY.md "Future schema")

CREATE TABLE IF NOT EXISTS clinicians (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  credential    TEXT,
  organisation  TEXT,
  verified_at   BIGINT,
  created_at    BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id            TEXT PRIMARY KEY,
  clinician_id  TEXT NOT NULL REFERENCES clinicians(id) ON DELETE CASCADE,
  client_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  film_id       TEXT NOT NULL,
  note          TEXT,
  share_themes  INTEGER DEFAULT 0,  -- client must opt-in
  created_at    BIGINT NOT NULL,
  watched_at    BIGINT
);

CREATE TABLE IF NOT EXISTS follow_ups (
  id              BIGSERIAL PRIMARY KEY,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id TEXT REFERENCES conversations(id) ON DELETE SET NULL,
  film_id         TEXT,
  scheduled_for   BIGINT NOT NULL,
  sent_at         BIGINT,
  responded_at    BIGINT,
  kind            TEXT NOT NULL  -- 'week-1' | 'month-1' | 'month-3'
);
CREATE INDEX IF NOT EXISTS idx_followups_due ON follow_ups(scheduled_for) WHERE sent_at IS NULL;
