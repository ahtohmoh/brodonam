/**
 * BRODONAM — Prime Video content script
 *
 * Same shape as Netflix detector, different DOM. Prime updates its
 * player markup periodically; selectors below are defensive.
 */
(function () {
  if (window.__brodonamInjected) return;
  window.__brodonamInjected = true;

  const POLL_MS = 2_000;
  let lastTitleSig = '';
  let activeFilmId = null;
  const fired = new Set();

  function getTitle() {
    const sel = [
      'h1[data-testid="title"]',
      '.atvwebplayersdk-title-text',
      'h1.av-detail-section_title',
    ];
    for (const s of sel) {
      const el = document.querySelector(s);
      if (el?.textContent?.trim()) return el.textContent.trim();
    }
    return '';
  }
  function getProgressPct() {
    const v = document.querySelector('video');
    if (!v || !v.duration) return 0;
    return (v.currentTime / v.duration) * 100;
  }
  function ensureChip() {
    let c = document.getElementById('brodonam-chip');
    if (c) return c;
    c = document.createElement('div');
    c.id = 'brodonam-chip';
    c.style.cssText = `
      position: fixed; right: 18px; bottom: 90px; z-index: 9999;
      padding: 10px 14px; background: rgba(12,10,16,0.92);
      border: 1px solid rgba(138,120,168,0.42); color: rgba(255,255,255,0.84);
      font-family: Inter, system-ui, sans-serif; font-size: 12px; font-weight: 300;
      letter-spacing: 0.04em; cursor: pointer; display: none;
      max-width: 280px; backdrop-filter: blur(8px);`;
    c.onclick = () => { if (c.dataset.url) window.open(c.dataset.url, '_blank'); };
    document.body.appendChild(c);
    return c;
  }
  function show(text, url) {
    const c = ensureChip();
    c.textContent = text; c.dataset.url = url || ''; c.style.display = 'block';
    clearTimeout(c._h);
    c._h = setTimeout(() => { c.style.display = 'none'; }, 8_000);
  }
  async function identify(title) {
    const sig = `prime::${title}`;
    if (sig === lastTitleSig) return;
    lastTitleSig = sig; fired.clear();
    chrome.runtime.sendMessage({
      type: 'IDENTIFY_FILM',
      payload: { source: 'prime', title, url: location.href },
    }, (res) => {
      if (res?.filmId) {
        activeFilmId = res.filmId;
        show('◆ Brodonam recognises this film — open companion', res.companionUrl);
      } else activeFilmId = null;
    });
  }
  function checkInsights() {
    if (!activeFilmId) return;
    chrome.runtime.sendMessage({ type: 'GET_INSIGHTS', filmId: activeFilmId }, (res) => {
      const ins = res?.insights || []; const pct = getProgressPct();
      for (const i of ins) {
        const k = i.id || i.pct;
        if (fired.has(k)) continue;
        if (pct >= i.pct && pct < i.pct + 1.5) {
          fired.add(k);
          show('◆ Brodonam insight at this scene — tap to open', res.companionUrl);
        }
      }
    });
  }
  setInterval(() => { const t = getTitle(); if (t) identify(t); checkInsights(); }, POLL_MS);
})();
