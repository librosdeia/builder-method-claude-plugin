// Guards on skill instructions that a whole-branch review found ambiguous.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

test('undo reverts everything after the target, including the first later task', () => {
  const s = read('skills/undo/SKILL.md');
  assert.match(s, /git revert --no-edit <target-sha>\.\.HEAD/);
  assert.doesNotMatch(s, /sha-after-target/);
});

test('iterate loop resets its own steps and the failed flows for the next cycle', () => {
  const s = read('skills/iterate/SKILL.md');
  assert.match(s, /phases\.iterate\.steps[^\n]*pending/);
  assert.match(s, /`fail`[^\n]*`pending`/);
});

test('one rule for damaged state: repair first, back up before any rebuild', () => {
  const r = read('skills/_shared/state-rules.md');
  assert.match(r, /## Damaged or missing state/);
  assert.match(r, /state\.json\.bak/);
  assert.match(r, /minimal repair/i);
  for (const skill of ['status', 'next']) {
    assert.match(read(`skills/${skill}/SKILL.md`), /Damaged or missing state/, skill);
  }
  assert.doesNotMatch(read('skills/status/SKILL.md'), /only if the user agrees/);
});

test('existing outputs are revised, never regenerated over the user\'s edits', () => {
  assert.match(read('skills/_shared/state-rules.md'), /## Existing outputs/);
  for (const skill of ['idea', 'prd', 'design', 'build']) {
    assert.match(read(`skills/${skill}/SKILL.md`), /Existing outputs/, skill);
  }
  assert.match(read('skills/start/SKILL.md'), /builder\/\*\.md/);
});

test('a leaked secret must be replaced before any push', () => {
  const s = read('skills/ship/SKILL.md');
  assert.match(s, /new key|rotate/i);
  assert.match(s, /before (the remote step|pushing)/i);
  assert.match(read('agents/security-auditor.md'), /git history[\s\S]*(rotate|replace)/i);
});
