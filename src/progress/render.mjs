// Pure renderer for builder/progress.html. No DOM, no clock, no randomness:
// identical state + language always produce identical markup.
import { strings } from './i18n.mjs';

export const PHASES = [
  { id: 'idea', n: 1, file: '01-idea.md', steps: ['explore', 'scope', 'summarize'] },
  { id: 'prd', n: 2, file: '02-prd.md', steps: ['clarify', 'write', 'review', 'polish'] },
  { id: 'design', n: 3, file: '03-design.md', steps: ['prototype', 'validate', 'link'] },
  { id: 'build', n: 4, file: '04-plan.md', steps: ['plan', 'setup', 'build'] },
  { id: 'iterate', n: 5, file: '05-validation.md', steps: ['validate', 'decisions', 'triage', 'loop'] },
  { id: 'ship', n: 6, file: '06-ship.md', steps: ['audit', 'remote', 'prepare', 'deploy', 'domain', 'record'] },
];

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function summarize(state) {
  if (!state || typeof state !== 'object' || !state.phases) throw new Error('state has no phases');
  const debtPhases = new Set((state.debt || []).map((d) => d.phase));
  const phases = PHASES.map((p) => {
    const ph = state.phases[p.id];
    if (!ph || typeof ph.status !== 'string') throw new Error(`phase ${p.id} is missing`);
    const steps = ph.steps || {};
    const stepsDone = ph.status === 'done' || ph.status === 'not_applicable'
      ? p.steps.length
      : p.steps.filter((s) => steps[s] === 'done' || steps[s] === 'skipped').length;
    return {
      id: p.id,
      n: p.n,
      status: ph.status,
      stepsDone,
      stepsTotal: p.steps.length,
      debt: debtPhases.has(p.id) || ph.review === 'unreviewed',
    };
  });
  const flows = state.flows || [];
  return {
    currentPhase: state.currentPhase,
    phases,
    flows: {
      total: flows.length,
      covered: flows.filter((f) => (f.tasks || []).length > 0).length,
      validated: flows.filter((f) => f.validation === 'pass').length,
    },
    pendingDecisions: state.decisions?.pending ?? 0,
    cycle: state.cycle ?? 1,
  };
}

function missingText(state, phase, sum, t) {
  if (sum.status === 'not_applicable') return t.notNeeded;
  if (sum.status === 'done') return '';
  if (sum.status === 'skipped_generated') return t.reviewWith(`/builder:${phase.id}`);
  if (phase.id === 'build' && sum.status === 'in_progress') {
    const left = (state.tasks || []).filter((k) => k.status !== 'done' && k.cycle === (state.cycle ?? 1)).map((k) => k.id);
    if (left.length) return `${t.tasksLeft}: ${left.join(', ')}`;
  }
  if (phase.id === 'iterate' && sum.status === 'in_progress') {
    const left = (state.flows || []).filter((f) => f.validation !== 'pass').map((f) => f.id);
    if (left.length) return `${t.flowsToValidate}: ${left.join(', ')}`;
  }
  const steps = state.phases[phase.id].steps || {};
  const pending = phase.steps.filter((s) => steps[s] !== 'done' && steps[s] !== 'skipped');
  return `${t.pendingSteps}: ${pending.map((s) => t.steps[s] || s).join(', ')}`;
}

function card(state, phase, sum, current, t) {
  const classes = ['card', `st-${sum.status}`];
  if (sum.status === 'not_applicable') classes.push('na');
  if (current) classes.push('current');
  const pct = Math.round((sum.stepsDone / sum.stepsTotal) * 100);
  const showFile = sum.status !== 'not_started' && sum.status !== 'not_applicable';
  const missing = missingText(state, phase, sum, t);
  return [
    `<article data-phase="${phase.id}" data-status="${sum.status}" class="${classes.join(' ')}">`,
    `<header><span class="num">${phase.n}</span><div><p class="eyebrow">${escapeHtml(t.phaseOf(phase.n))}</p><h2>${escapeHtml(t.phases[phase.id])}</h2></div></header>`,
    current ? `<p class="here">▲ ${escapeHtml(t.youAreHere)}</p>` : '',
    `<p class="status">${escapeHtml(t.status[sum.status] || sum.status)}</p>`,
    `<div class="bar" role="img" aria-label="${sum.stepsDone}/${sum.stepsTotal}"><span style="width:${pct}%"></span></div>`,
    showFile ? `<p class="file">${escapeHtml(t.deliverable)}: <a href="${phase.file}">${phase.file}</a></p>` : '',
    missing ? `<p class="missing">${escapeHtml(missing)}</p>` : '',
    sum.debt ? `<p class="debt-badge">${escapeHtml(t.unreviewed)}</p>` : '',
    '</article>',
  ].join('');
}

function flowTable(state, t) {
  const flows = state.flows || [];
  if (!flows.length) return `<section class="flows"><h3>${escapeHtml(t.flows)}</h3><p>${escapeHtml(t.noFlows)}</p></section>`;
  const rows = flows.map((f) => [
    `<tr class="v-${escapeHtml(f.validation)}">`,
    `<td>${escapeHtml(f.id)}</td>`,
    `<td>${escapeHtml(f.name)}</td>`,
    `<td>${escapeHtml((f.tasks || []).join(', '))}</td>`,
    `<td>${escapeHtml(t.validationStatus[f.validation] || f.validation)}</td>`,
    '</tr>',
  ].join(''));
  return [
    `<section class="flows"><h3>${escapeHtml(t.flows)}</h3>`,
    `<table><thead><tr><th>${escapeHtml(t.flow)}</th><th>${escapeHtml(t.name)}</th><th>${escapeHtml(t.tasks)}</th><th>${escapeHtml(t.validation)}</th></tr></thead>`,
    `<tbody>${rows.join('')}</tbody></table></section>`,
  ].join('');
}

export function renderProgress(state, lang) {
  const t = strings(lang);
  const s = summarize(state);
  const cards = PHASES.map((p, i) => card(state, p, s.phases[i], p.id === s.currentPhase, t));
  return [
    `<header class="top"><p class="brand">${escapeHtml(t.title)}</p>`,
    `<h1>${escapeHtml(state.project?.name)}</h1>`,
    `<p class="meta">${escapeHtml(t.cycle)} ${s.cycle}</p></header>`,
    `<section class="board">${cards.join('')}<p class="loop" aria-hidden="true">${escapeHtml(t.loop)}</p></section>`,
    `<section class="totals"><p>${escapeHtml(t.covered(s.flows.covered, s.flows.total))}</p>`,
    `<p>${escapeHtml(t.validated(s.flows.validated, s.flows.total))}</p>`,
    `<p>${escapeHtml(t.decisionsPending(s.pendingDecisions))}</p></section>`,
    flowTable(state, t),
    `<footer class="next"><p>${escapeHtml(t.next)}: <code>/builder:next</code></p></footer>`,
  ].join('');
}

export function renderError(lang) {
  const t = strings(lang);
  return `<section class="error"><h1>${escapeHtml(t.errorTitle)}</h1><p>${escapeHtml(t.errorBody)}</p></section>`;
}
