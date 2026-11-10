import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, statSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const hook = new URL('hooks/session-start.sh', root).pathname;
const fixture = new URL('test/fixtures/state/mid-build.json', root).pathname;

function project(sub = 'p') {
  const dir = join(mkdtempSync(join(tmpdir(), 'builder-hook-')), sub);
  mkdirSync(join(dir, 'builder'), { recursive: true });
  return dir;
}
const run = (dir, env = {}) => spawnSync('sh', [hook], {
  encoding: 'utf8',
  env: { PATH: process.env.PATH, CLAUDE_PROJECT_DIR: dir, ...env },
});

test('prints nothing when the project has no builder state', () => {
  const r = run(project());
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '');
});

test('injects a header and the state when builder/state.json exists', () => {
  const dir = project();
  copyFileSync(fixture, join(dir, 'builder/state.json'));
  const r = run(dir);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^This project follows the Builder Method plugin/);
  assert.match(r.stdout, /"currentPhase": "build"/);
});

test('works with spaces and non-ASCII in the project path', () => {
  const dir = project('Mis proyectos/Peluquería Ñ');
  copyFileSync(fixture, join(dir, 'builder/state.json'));
  const r = run(dir);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /"currentPhase": "build"/);
});

test('falls back to the working directory without CLAUDE_PROJECT_DIR', () => {
  const dir = project();
  copyFileSync(fixture, join(dir, 'builder/state.json'));
  const r = spawnSync('sh', [hook], { encoding: 'utf8', cwd: dir, env: { PATH: process.env.PATH } });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /"currentPhase": "build"/);
});

test('a damaged state never breaks the session', () => {
  const dir = project();
  writeFileSync(join(dir, 'builder/state.json'), '{not json');
  const r = run(dir);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^This project follows the Builder Method plugin/);
});

test('caps very large state files at 400 lines', () => {
  const dir = project();
  writeFileSync(join(dir, 'builder/state.json'), Array.from({ length: 1000 }, (_, i) => `line ${i}`).join('\n'));
  const r = run(dir);
  assert.match(r.stdout, /line 399\n/);
  assert.doesNotMatch(r.stdout, /line 400\b/);
});

test('the hook script is executable', () => {
  assert.ok(statSync(hook).mode & 0o111);
});

test('hooks.json registers the SessionStart hook', () => {
  const cfg = JSON.parse(readFileSync(new URL('hooks/hooks.json', root), 'utf8'));
  const entry = cfg.hooks.SessionStart[0];
  assert.equal(entry.matcher, 'startup|resume|clear|compact');
  assert.equal(entry.hooks[0].type, 'command');
  assert.equal(entry.hooks[0].command, '"${CLAUDE_PLUGIN_ROOT}"/hooks/session-start.sh');
  assert.equal(entry.hooks[0].timeout, 10);
});
