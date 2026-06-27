#!/usr/bin/env node
/**
 * BRODONAM extension packager.
 *
 *   node extension/build.js            → builds icons + emits dist/brodonam-companion-x.y.z.zip
 *   node extension/build.js --icons    → just (re)generate the PNG icons from icon.svg
 *
 * Requires:
 *   - `sharp` (npm i sharp) for SVG → PNG. Optional; skipped with a warning when missing.
 *   - native `zip` (macOS/Linux) or PowerShell `Compress-Archive` (Windows).
 */
const fs   = require('node:fs');
const path = require('node:path');
const cp   = require('node:child_process');

const ROOT = __dirname;
const DIST = path.join(ROOT, '..', 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));

async function makeIcons() {
  let sharp;
  try { sharp = require('sharp'); }
  catch {
    console.warn('⚠ sharp not installed; skipping icon generation. `npm i sharp` to enable.');
    return;
  }
  const svg = fs.readFileSync(path.join(ROOT, 'icon.svg'));
  for (const size of [16, 32, 48, 128]) {
    const out = path.join(ROOT, size === 128 ? 'icon-128.png' : `icon-${size}.png`);
    await sharp(svg).resize(size, size).png().toFile(out);
    console.log(`✓ ${path.basename(out)}`);
  }
}

function makeZip() {
  fs.mkdirSync(DIST, { recursive: true });
  const name = `brodonam-companion-${manifest.version}.zip`;
  const out  = path.join(DIST, name);
  if (fs.existsSync(out)) fs.rmSync(out);

  const files = fs.readdirSync(ROOT).filter(f =>
    !f.startsWith('.') && f !== 'build.js' && !f.endsWith('.svg')
  );

  // Cross-platform: prefer `zip` if present, else PowerShell.
  const hasZip = (() => { try { cp.execSync('zip -v', { stdio: 'ignore' }); return true; } catch { return false; }})();

  if (hasZip) {
    cp.execSync(`zip -j "${out}" ${files.map(f => `"${path.join(ROOT, f)}"`).join(' ')}`, { stdio: 'inherit' });
  } else {
    // PowerShell expects a list separated by commas; works on Win 10+.
    const list = files.map(f => `'${path.join(ROOT, f)}'`).join(',');
    cp.execSync(`powershell -NoProfile -Command "Compress-Archive -Path ${list} -DestinationPath '${out}' -Force"`, { stdio: 'inherit' });
  }
  console.log(`\n✓ Packaged ${name}\n  ${out}`);
}

(async () => {
  await makeIcons();
  if (!process.argv.includes('--icons')) makeZip();
})().catch(e => { console.error(e); process.exit(1); });
