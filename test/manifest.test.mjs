import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const json = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const text = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

test('plugin.json declares the builder plugin', () => {
  const m = json('.claude-plugin/plugin.json');
  assert.equal(m.name, 'builder');
  assert.equal(m.displayName, 'Builder Method');
  assert.equal(m.license, 'MIT');
  assert.match(m.version, /^0\.1\.\d+$/);
  assert.equal(m.author.name, 'Javier Rayón');
  assert.equal('userConfig' in m, false);
});

test('marketplace.json lists builder from the repo root', () => {
  const mk = json('.claude-plugin/marketplace.json');
  assert.equal(mk.name, 'builder-method');
  assert.equal(mk.plugins[0].name, 'builder');
  assert.equal(mk.plugins[0].source, './');
});

test('no top-level bin/ (Cowork and chat refuse it)', () => {
  assert.equal(existsSync(new URL('../bin', import.meta.url)), false);
});

test('LICENSE is the MIT file already on origin/main', () => {
  const l = text('LICENSE');
  assert.match(l, /MIT License/);
  assert.match(l, /Copyright \(c\) 2026 Libros de ia\.com/);
});

test('NOTICE states the third-party position', () => {
  assert.match(text('NOTICE'), /bundles no third-party code/);
});
