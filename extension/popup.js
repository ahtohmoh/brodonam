const apiEl    = document.getElementById('api');
const statusEl = document.getElementById('status');

chrome.storage.local.get('brodonamApiBase', ({ brodonamApiBase }) => {
  apiEl.value = brodonamApiBase || 'http://localhost:3001';
});

document.getElementById('save').onclick = async () => {
  await chrome.storage.local.set({ brodonamApiBase: apiEl.value.trim() });
  statusEl.textContent = 'Saved.';
};

document.getElementById('test').onclick = () => {
  statusEl.textContent = 'Testing…';
  chrome.runtime.sendMessage({ type: 'PING_HEALTH' }, (res) => {
    if (res?.ok) statusEl.textContent = '✓ Connected to Brodonam';
    else statusEl.textContent = `✗ ${res?.error || 'unreachable'}`;
  });
};
