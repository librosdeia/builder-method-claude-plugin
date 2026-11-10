import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';

const root = new URL('../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const schema = read('skills/_shared/state.schema.json');
const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);

const dir = (p) => readdirSync(new URL(p, root)).filter((f) => f.endsWith('.json'));

for (const f of dir('test/fixtures/state/')) {
  test(`valid fixture ${f} passes the schema`, () => {
    const ok = validate(read(`test/fixtures/state/${f}`));
    assert.ok(ok, JSON.stringify(validate.errors, null, 2));
  });
}

for (const f of dir('test/fixtures/state/invalid/')) {
  test(`invalid fixture ${f} is rejected`, () => {
    assert.equal(validate(read(`test/fixtures/state/invalid/${f}`)), false);
  });
}

test('there are five valid and three invalid fixtures', () => {
  assert.equal(dir('test/fixtures/state/').length, 5);
  assert.equal(dir('test/fixtures/state/invalid/').length, 3);
});
