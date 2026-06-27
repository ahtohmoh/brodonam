/**
 * BRODONAM — extension service worker.
 *
 * Holds the API base URL, ferries messages between content scripts and the
 * Brodonam backend, and keeps the auth cookie scoped per origin.
 *
 * Production: bake the real API host into a `config.json` shipped with the
 * extension or pull it from chrome.storage.managed for enterprise rollouts.
 */

const DEFAULT_API_BASE = 'http://localhost:3001';

async function getApiBase() {
  const { brodonamApiBase } = await chrome.storage.local.get('brodonamApiBase');
  return brodonamApiBase || DEFAULT_API_BASE;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    const apiBase = await getApiBase();
    try {
      if (msg.type === 'IDENTIFY_FILM') {
        // Content script tells us what's playing; we ask the backend for matching insights.
        const r = await fetch(`${apiBase}/api/extension/identify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(msg.payload),
        });
        sendResponse(await r.json());
      } else if (msg.type === 'GET_INSIGHTS') {
        const r = await fetch(`${apiBase}/api/film/${encodeURIComponent(msg.filmId)}`);
        sendResponse(await r.json());
      } else if (msg.type === 'PING_HEALTH') {
        const r = await fetch(`${apiBase}/api/health`);
        sendResponse({ ok: r.ok, status: r.status });
      } else {
        sendResponse({ error: 'unknown message type' });
      }
    } catch (e) {
      sendResponse({ error: e.message });
    }
  })();
  return true; // async response
});
