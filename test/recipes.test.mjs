import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../skills/ship/recipes/', import.meta.url);
const HEADINGS = ['Fits when', 'Prerequisites', 'Prepare', 'Deploy', 'Domain', 'Rollback'];
const recipes = readdirSync(dir).filter((f) => f.endsWith('.md') && f !== '_template.md');

test('v0.1 ships the railway and vercel recipes', () => {
  assert.deepEqual(recipes.sort(), ['railway.md', 'vercel.md']);
});

for (const f of [...recipes, '_template.md']) {
  test(`${f} follows the recipe contract`, () => {
    const text = readFileSync(new URL(f, dir), 'utf8');
    for (const h of HEADINGS) assert.match(text, new RegExp(`^## ${h}$`, 'm'), h);
  });
}

for (const f of recipes) {
  test(`${f} contains no hard-coded prices`, () => {
    const text = readFileSync(new URL(f, dir), 'utf8');
    assert.doesNotMatch(text, /[$€]\s?\d/);
    assert.match(text, /pricing/i);
  });
}
