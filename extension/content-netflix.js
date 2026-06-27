/**
 * BRODONAM — Netflix content script
 *
 * Watches the player page, extracts title + current playhead, and asks the
 * backend whether this title matches a Brodonam film. If yes, overlays a
 * small companion chip at the bottom-right of the player.
 *
 * Netflix's DOM evolves; the selectors below work as of 2025-Q4 but are
 * intentionally defensive — failures should be silent, never break playback.
 */

(function () {
  if (window.__brodonamInjected) return;
  window.__brodonamInjected = true;

  const POLL_MS = 2_000;
  let lastTitleSig = '';
  let activeFilmId = null;
  let firedInsightIds = new Set();

  function getTitle() {
    // Netflix renders the title in the player chrome — try a few selectors.
    const sel = [
      'h4[data-uia="video-title"]',
      '.video-title h4',
      '.ellipsize-text',
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
    let chip = document.getElementById('brodonam-chip');
    if (chip) return chip;
    chip = document.createElement('div');
    chip.id = 'brodonam-chip';
    chip.style.cssText = `
      position: fixed; right: 18px; bottom: 90px; z-index: 9999;
      padding: 10px 14px;
      background: rgba(12,10,16,0.92);
      border: 1px solid rgba(138,120,168,0.42);
      color: rgba(255,255,255,0.84);
      font-family: Inter, system-ui, sans-serif; font-size: 12px; font-weight: 300;
      letter-spacing: 0.04em;
      cursor: pointer;
      display: none;
      max-width: 280px;
      backdrop-filter: blur(8px);
    `;
    chip.onclick = () => {
      if (chip.dataset.url) window.open(chip.dataset.url, '_blank');
    };
    document.body.appendChild(chip);
    return chip;
  }

  function showChip(text, url) {
    const chip = ensureChip();
    chip.textContent = text;
    chip.dataset.url = url || '';
    chip.style.display = 'block';
    clearTimeout(chip._hide);
    chip._hide = setTimeout(() => { chip.style.display = 'none'; }, 8_000);
  }

  async function identify(title) {
    const sig = `netflix::${title}`;
    if (sig === lastTitleSig) return;
    lastTitleSig = sig;
    firedInsightIds.clear();
    chrome.runtime.sendMessage({
      type: 'IDENTIFY_FILM',
      payload: { source: 'netflix', title, url: location.href },
    }, (res) => {
      if (res?.filmId) {
        activeFilmId = res.filmId;
        showChip(`◆ Brodonam recognises this film — open companion`, res.companionUrl);
      } else {
        activeFilmId = null;
      }
    });
  }

  function checkInsightTriggers() {
    if (!activeFilmId) return;
    chrome.runtime.sendMessage({ type: 'GET_INSIGHTS', filmId: activeFilmId }, (res) => {
      const insights = res?.insights || [];
      const pct = getProgressPct();
      for (const ins of insights) {
        if (firedInsightIds.has(ins.id || ins.pct)) continue;
        if (pct >= ins.pct && pct < ins.pct + 1.5) {
          firedInsightIds.add(ins.id || ins.pct);
          showChip(`◆ Brodonam insight at this scene — tap to open`, res.companionUrl);
        }
      }
    });
  }

  setInterval(() => {
    const t = getTitle();
    if (t) identify(t);
    checkInsightTriggers();
  }, POLL_MS);
})();
