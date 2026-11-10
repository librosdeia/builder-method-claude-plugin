import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../skills/explain/concepts/', import.meta.url);
const CONCEPTS = ['commit', 'repository', 'branch', 'environment-variable', 'port', 'database', 'api',
  'frontend-backend', 'deploy', 'dns', 'domain', 'build', 'test', 'lint', 'dependency'];

test('exactly the 15 v0.1 concepts exist', () => {
  assert.deepEqual(readdirSync(dir).filter((f) => f.endsWith('.md')).sort(), CONCEPTS.map((c) => `${c}.md`).sort());
});

for (const c of CONCEPTS) {
  test(`concept ${c} has the three sections`, () => {
    const t = readFileSync(new URL(`${c}.md`, dir), 'utf8');
    for (const h of ['What it is', 'Why it matters', 'Example']) assert.match(t, new RegExp(`^## ${h}$`, 'm'), h);
  });
}
