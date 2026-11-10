import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { summarize, renderProgress, renderError, escapeHtml } from '../src/progress/render.mjs';
import { STRINGS } from '../src/progress/i18n.mjs';

const root = new URL('../', import.meta.url);
const fixture = (n) => JSON.parse(readFileSync(new URL(`test/fixtures/state/${n}.json`, root), 'utf8'));
const midBuild = fixture('mid-build');

test('rendering is deterministic for identical state', () => {
  assert.equal(renderProgress(midBuild, 'en'), renderProgress(structuredClone(midBuild), 'en'));
});

test('Spanish rendering uses Spanish phase names', () => {
  const html = renderProgress(midBuild, 'es');
  assert.match(html, /Construcción/);
  assert.doesNotMatch(html, /\bBuild\b/);
});

test('unknown languages fall back to English', () => {
  assert.equal(renderProgress(midBuild, 'de'), renderProgress(midBuild, 'en'));
  assert.ok(STRINGS.en && STRINGS.es);
});

test('summarize counts covered and validated flows', () => {
  const s = summarize(midBuild);
  assert.deepEqual(s.flows, { total: 3, covered: 3, validated: 0 });
  assert.equal(s.currentPhase, 'build');
  assert.equal(s.pendingDecisions, 2);
  assert.equal(s.cycle, 1);
  const build = s.phases.find((p) => p.id === 'build');
  assert.deepEqual([build.n, build.status, build.stepsDone, build.stepsTotal], [4, 'in_progress', 2, 3]);
});

test('not-applicable design card is greyed out', () => {
  assert.match(renderProgress(fixture('no-frontend'), 'en'), /data-phase="design"[^>]*class="[^"]*\bna\b/);
});

test('a phase generated without review shows a debt badge', () => {
  const html = renderProgress(fixture('skipped-prd'), 'en');
  const prdCard = html.match(/<article[^>]*data-phase="prd"[\s\S]*?<\/article>/)[0];
  assert.match(prdCard, /debt-badge/);
  assert.equal(summarize(fixture('skipped-prd')).phases.find((p) => p.id === 'prd').debt, true);
});

test('the current phase is marked "you are here"', () => {
  const html = renderProgress(midBuild, 'en');
  const buildCard = html.match(/<article[^>]*data-phase="build"[\s\S]*?<\/article>/)[0];
  assert.match(buildCard, /You are here/);
});

test('user-supplied strings are escaped, never rendered as HTML', () => {
  const evil = structuredClone(midBuild);
  evil.flows[0].name = '<img src=x onerror=alert(1)>';
  evil.project.name = '"><script>alert(1)</script>';
  const html = renderProgress(evil, 'en');
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(html, /<img/);
  assert.doesNotMatch(html, /<script/);
  assert.equal(escapeHtml(`<&>"'`), '&lt;&amp;&gt;&quot;&#39;');
});

test('non-ASCII project names render verbatim', () => {
  const s = structuredClone(midBuild);
  s.project.name = 'Peluquería Ñ';
  assert.match(renderProgress(s, 'en'), /Peluquería Ñ/);
});

test('the flow table lists every flow with its tasks', () => {
  const html = renderProgress(midBuild, 'en');
  for (const f of midBuild.flows) assert.match(html, new RegExp(`<td>${f.id}</td>`));
  assert.match(html, /T7, T8, T9/);
});

test('renderError explains in the requested language', () => {
  assert.match(renderError('es'), /No se pudo leer/);
  assert.match(renderError('en'), /could not be read/i);
});

test('summarize throws on a state without phases', () => {
  assert.throws(() => summarize({}));
});

test('assets/progress.html is built from the current sources', () => {
  execFileSync(process.execPath, [new URL('scripts/build-progress.mjs', root).pathname, '--check']);
});

test('assets/progress.html has exactly one builder-state block', () => {
  const page = readFileSync(new URL('assets/progress.html', root), 'utf8');
  assert.equal(page.match(/<script id="builder-state" type="application\/json">/g).length, 1);
  assert.match(page, /rough\.js 4\.6\.6|roughjs/i);
});

test('not-applicable card states it once and explains why', () => {
  const html = renderProgress(fixture('no-frontend'), 'en');
  const design = html.match(/<article[^>]*data-phase="design"[\s\S]*?<\/article>/)[0];
  assert.equal(design.match(/Not needed/g).length, 1);
  assert.match(design, /no screens/);
});

test('an unknown phase status is rejected (page shows the error card)', () => {
  const evil = structuredClone(midBuild);
  evil.phases.idea.status = '"><svg onload=alert(1)>';
  assert.throws(() => renderProgress(evil, 'en'), /unknown status/);
});

test('hand-edited cycle and counts are coerced to numbers, never injected', () => {
  const evil = structuredClone(midBuild);
  evil.cycle = '<b>9</b>';
  evil.decisions.pending = '<i>2</i>';
  const html = renderProgress(evil, 'en');
  assert.doesNotMatch(html, /<b>|<i>/);
  assert.equal(summarize(evil).cycle, 1);
  assert.equal(summarize(evil).pendingDecisions, 0);
});
