import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

const TEMPLATES = {
  'skills/idea/templates/01-idea.md': 'idea',
  'skills/prd/templates/02-prd.md': 'prd',
  'skills/design/templates/03-design.md': 'design',
  'skills/build/templates/04-plan.md': 'build',
  'skills/build/templates/decisions.md': 'build',
  'skills/iterate/templates/05-validation.md': 'iterate',
  'skills/ship/templates/06-ship.md': 'ship',
};

const frontmatter = (text) => {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(m, 'missing frontmatter');
  return Object.fromEntries(m[1].split('\n').map((l) => l.split(/:\s*/).map((x) => x.trim())).map(([k, ...v]) => [k, v.join(':')]));
};

for (const [path, phase] of Object.entries(TEMPLATES)) {
  test(`${path} has the four frontmatter keys`, () => {
    const fm = frontmatter(read(path));
    assert.deepEqual(Object.keys(fm).sort(), ['generated_by', 'phase', 'review', 'updated']);
    assert.equal(fm.phase, phase);
    assert.match(fm.review, /^(reviewed|unreviewed)$/);
  });
}

test('01-idea template has the §7.1 sections', () => {
  const t = read('skills/idea/templates/01-idea.md');
  for (const h of ['What it is', 'What it is for', 'Who it is for', 'How it is used', 'Not in v1', 'Sources']) {
    assert.match(t, new RegExp(`^## ${h}$`, 'm'));
  }
});

test('02-prd template has §7.2 sections and the flow format', () => {
  const t = read('skills/prd/templates/02-prd.md');
  for (const h of ['Summary', 'Users', 'User flows', 'Non-goals', 'Data & privacy', 'Design notes', 'Technical constraints', 'Validation criteria']) {
    assert.match(t, new RegExp(`^## ${h}$`, 'm'));
  }
  assert.match(t, /^### F1 — /m);
  assert.match(t, /^Acceptance:$/m);
  assert.match(t, /When .+, then /);
});

test('04-plan template lists tasks with Covers/Check/Model', () => {
  const t = read('skills/build/templates/04-plan.md');
  assert.match(t, /^### T1 — /m);
  for (const k of ['Covers:', 'Check:', 'Model:', 'Cycle:']) assert.ok(t.includes(k), k);
});

test('decisions template uses D<n> entries with a status', () => {
  const t = read('skills/build/templates/decisions.md');
  assert.match(t, /^## D1 — /m);
  for (const k of ['What:', 'Why:', 'Check:', 'Status: pending']) assert.ok(t.includes(k), k);
});

test('05-validation template has a section per flow and a Result line', () => {
  const t = read('skills/iterate/templates/05-validation.md');
  assert.match(t, /^## F1 — /m);
  assert.match(t, /^Result: /m);
  assert.match(t, /- \[ \] /);
});

test('06-ship template has the §7.6 record sections', () => {
  const t = read('skills/ship/templates/06-ship.md');
  for (const h of ['Audit', 'Deploy', 'Domain', 'Environment variables', 'Redeploy', 'Rollback']) {
    assert.match(t, new RegExp(`^## ${h}`, 'm'));
  }
});

test('gates.md covers every gated phase and the two choices', () => {
  const g = read('skills/_shared/gates.md');
  for (const p of ['PRD', 'Design', 'Build', 'Iterate', 'Ship']) assert.match(g, new RegExp(`\\| ${p} \\|`));
  assert.match(g, /Go back/);
  assert.match(g, /Continue anyway/);
  assert.match(g, /generated_by: gate:/);
  assert.match(g, /not_applicable/);
});

test('state-rules.md documents the progress.html contract and escaping', () => {
  const r = read('skills/_shared/state-rules.md');
  assert.match(r, /id="builder-state"/);
  assert.match(r, /\$\{CLAUDE_PLUGIN_ROOT\}\/assets\/progress\.html/);
  assert.match(r, /\\u003c/);
  for (const s of ['explore', 'clarify', 'prototype', 'setup', 'triage', 'record']) assert.ok(r.includes(s), s);
});

test('tone.md sets language, pacing and the /builder:next ending', () => {
  const t = read('skills/_shared/tone.md');
  assert.match(t, /profile\.language/);
  assert.match(t, /codingExperience/);
  assert.match(t, /\/builder:next/);
  assert.match(t, /defaults/);
});
