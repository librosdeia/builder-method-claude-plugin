# Getting started

## 1. Install

**Claude Code**

```
/plugin marketplace add librosdeia/builder-method-claude-plugin
/plugin install builder@builder-method
```

**Cowork / claude.ai**: Customize → Plugins → Add → Add marketplace → `librosdeia/builder-method-claude-plugin` → install **Builder Method**.

## 2. Start a project

Create an empty folder for your product, open it in Claude Code (or select it in Cowork), and run:

```
/builder:start
```

Claude asks three things:
- a short name for the project;
- whether you've programmed before (`none`, `some` or `developer`), which sets how much it explains;
- the language to use.

Then it creates a `builder/` folder and starts Phase 1.

## 3. Keep going

Whenever you come back, type **`/builder:next`**. Claude shows a summary like this one and continues:

```
 BUILDER · booking-app                                  cycle 1
 ✔ 1 Idea  ✔ 2 PRD  ✔ 3 Design  ◐ 4 Build  ○ 5 Iterate  ○ 6 Ship
                                  ▲ you are here
 Build › build · 5 of 9 tasks · flows covered 3/3
 Missing: T6–T9 · 2 decisions to review
 Debt: none
 Next: /builder:next
```

Open `builder/progress.html` in your browser for the visual version.

## 4. When you're unsure

- `/builder:explain <word>`: any technical term, explained in plain words with an example from your project.
- `/builder:undo`: go back to an earlier saved point (it never deletes anything).
- `/builder:status`: where you are, without changing anything.

## Verify your install

- [ ] `/builder:start` appears when you type `/builder` in Claude Code.
- [ ] In Cowork, `/builder:next` appears in the slash menu after installing from Customize → Plugins.
- [ ] After `/builder:start`, `builder/progress.html` opens in a browser and shows six cards.
- [ ] Closing and reopening the session, Claude still knows which phase you're in.
