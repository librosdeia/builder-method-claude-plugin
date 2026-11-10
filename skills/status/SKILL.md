---
name: status
description: Show where a Builder Method project stands — which phases are done, which step is current, what is missing, pending decisions and unreviewed outputs — and refresh the visual progress page. Use when the user asks "where am I", "how far along is it" or "what's missing".
---

# Project status

Don't change any phase or project file. The one thing you always write is the progress page (step 3), so it matches the state.

Read `${CLAUDE_PLUGIN_ROOT}/skills/_shared/state-rules.md` and `${CLAUDE_PLUGIN_ROOT}/skills/_shared/tone.md`.

## Steps

1. Read `builder/state.json`. If it's missing or damaged, say so, and offer to rebuild it from the `builder/*.md` files (only if the user agrees).
2. Print the summary below.
3. Always refresh the progress page (`builder/progress-data.js`, plus `builder/progress.html` if it's missing), as `state-rules.md` explains. Then tell the user they can open `builder/progress.html` in a browser.

## Summary format

Print this inside a code block, always in this exact shape. Translate the words, but keep the symbols and the phase numbers. The phase names are: Idea, PRD, Design, Build, Iterate, Ship (in Spanish: Idea, PRD, Diseño, Construcción, Iteración, Publicación).

```
 BUILDER · <project name>                               cycle <n>
 ✔ 1 Idea  ✔ 2 PRD  – 3 Design  ◐ 4 Build  ○ 5 Iterate  ○ 6 Ship
                                  ▲ you are here
 <Phase> › <current step> · <progress detail>
 Missing: <what's left in this phase, concrete>
 Debt: <unreviewed outputs and how to review them, or "none">
 Next: /builder:next
```

Symbols per phase status:
- `✔` done
- `◐` in progress
- `○` not started
- `!` skipped_generated (generated, not reviewed)
- `–` not_applicable

Place `▲ you are here` under the current phase.

Progress detail:
- In Build: "<done> of <total> tasks · flows covered <covered>/<total>".
- In Iterate: "flows validated <pass>/<total>".
- Otherwise: "step <k> of <n>".

In the Missing line, include pending decisions ("2 decisions to review") when there are any.

After the block, add one or two plain sentences: the most important thing to do next.
