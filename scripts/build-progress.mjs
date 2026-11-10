// Dev-only: inline the renderer into assets/progress.html.
// Usage: node scripts/build-progress.mjs [--check]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const toScript = (src) => src
  .replace(/^import .*$/gm, '')
  .replace(/^export /gm, '');

export function buildProgress() {
  const renderer = [toScript(read('src/progress/i18n.mjs')), toScript(read('src/progress/render.mjs'))].join('\n');
  return read('src/progress/page.template.html')
    .replace('/*@RENDERER@*/', () => renderer);
}

const out = new URL('assets/progress.html', root);
const html = buildProgress();
if (process.argv.includes('--check')) {
  if (!existsSync(out) || readFileSync(out, 'utf8') !== html) {
    console.error('assets/progress.html is stale: run npm run build:progress');
    process.exit(1);
  }
} else {
  writeFileSync(out, html);
  console.log('wrote assets/progress.html');
}
