/**
 * BRODONAM — shared store (optional Redis)
 *
 * Single-instance Brodonam works entirely in-memory. The moment you run
 * 2+ web instances behind Render's load balancer, two pieces of state must
 * be SHARED or they fragment:
 *
 *   1. the daily spend counter (each instance would otherwise track its own,
 *      so the real spend = N × the cap before the breaker trips), and
 *   2. the rate limiter (per-IP limits would be N× too loose).
 *
 * Set REDIS_URL to back both with Redis. Leave it unset and everything falls
 * back to per-process memory (correct for a single instance).
 */

const log = require('./logger');

const REDIS_URL = process.env.REDIS_URL || '';
let redis = null;

if (REDIS_URL) {
  try {
    const IORedis = require('ioredis');
    redis = new IORedis(REDIS_URL, {
      maxRetriesPerRequest: 2,
      enableOfflineQueue: false,
      lazyConnect: false,
    });
    redis.on('error', (e) => log.warn({ err: e.message }, 'redis error'));
    redis.on('connect', () => log.info('redis connected'));
  } catch (e) {
    log.error({ err: e.message }, 'redis init failed — falling back to in-memory');
    redis = null;
  }
} else {
  log.info('REDIS_URL not set — using in-memory store (single-instance only)');
}

/* ── daily spend counter ──────────────────────────────── */
const today = () => new Date().toISOString().slice(0, 10);
let mem = { date: today(), usd: 0, requests: 0 };
function rollMem() {
  const t = today();
  if (mem.date !== t) mem = { date: t, usd: 0, requests: 0 };
}

// Add cost (USD) for one request. Fire-and-forget safe.
async function addSpend(usd) {
  if (redis) {
    const key = `bdn:spend:${today()}`;
    try {
      const total = await redis.incrbyfloat(key, usd);
      // keep two days so the breaker reads cleanly across the date boundary
      await redis.expire(key, 2 * 86400);
      await redis.incr(`bdn:reqs:${today()}`);
      return total;
    } catch (e) {
      log.warn({ err: e.message }, 'redis addSpend failed; using memory');
    }
  }
  rollMem();
  mem.usd += usd;
  mem.requests += 1;
  return mem.usd;
}

async function getSpendToday() {
  if (redis) {
    try {
      const usd  = parseFloat((await redis.get(`bdn:spend:${today()}`)) || '0');
      const reqs = parseInt((await redis.get(`bdn:reqs:${today()}`)) || '0', 10);
      return { date: today(), usd, requests: reqs };
    } catch (e) {
      log.warn({ err: e.message }, 'redis getSpend failed; using memory');
    }
  }
  rollMem();
  return { ...mem };
}

async function spendCapReached(capUsd) {
  const { usd } = await getSpendToday();
  return usd >= capUsd;
}

/* ── rate-limit store factory ─────────────────────────── */
// Returns a store for express-rate-limit, or undefined (→ its default memory store).
function makeRateLimitStore(prefix) {
  if (!redis) return undefined;
  try {
    const { RedisStore } = require('rate-limit-redis');
    return new RedisStore({
      sendCommand: (...args) => redis.call(...args),
      prefix: `bdn:rl:${prefix}:`,
    });
  } catch (e) {
    log.warn({ err: e.message }, 'redis rate-limit store init failed; using memory');
    return undefined;
  }
}

async function close() {
  if (redis) { try { await redis.quit(); } catch {} }
}

module.exports = {
  redisEnabled: !!redis,
  addSpend, getSpendToday, spendCapReached, makeRateLimitStore, close,
};
