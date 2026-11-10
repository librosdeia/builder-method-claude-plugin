# Builder Method — Claude plugin

**Guides you from idea to published product with the Builder Method: idea, PRD, design, build, iterate and ship.** It works in Claude Code and Cowork, and you don't need to know how to program.

The plugin takes you by the hand through six phases. Every phase has one input and one output: a file you can open and read. Claude remembers where you are between sessions, warns you when you skip a step (and still produces what's missing), and keeps a visual map of your progress in `builder/progress.html`.

> Companion to the **Builder Method** book series by Javier Rayón ([librosdeia.com](https://librosdeia.com)). The plugin works on its own; the books go deeper.

🇪🇸 [Leer en español](README.es.md)

## Install

**Claude Code**

```
/plugin marketplace add librosdeia/builder-method-claude-plugin
/plugin install builder@builder-method
```

**Cowork and claude.ai**: open **Customize → Plugins → Add → Add marketplace**, enter `librosdeia/builder-method-claude-plugin`, and install **Builder Method**. A plugin installed on your claude.ai account also appears in Claude Code.

## Use

In an empty folder, run:

```
/builder:start
```

After that, the only command you need is **`/builder:next`**: it tells you where you are and continues with the next step. (In Claude Code, `/builder` is a shortcut for it.)

## The six phases

| # | Phase | You end up with | Command |
|---|---|---|---|
| 1 | **Idea** | a concrete idea, and what v1 won't do | `/builder:idea` |
| 2 | **PRD** | a requirements document with numbered user flows (F1, F2…) and acceptance criteria | `/builder:prd` |
| 3 | **Design** | a preview of the screens (skipped automatically if there are none) | `/builder:design` |
| 4 | **Build** | a working first version: a plan of tasks that covers every flow, tests, and a saved checkpoint after each task | `/builder:build` |
| 5 | **Iterate** | a validated product: each flow checked, decisions reviewed, fixes looped back into Build | `/builder:iterate` |
| 6 | **Ship** | a security audit, the app online with your own domain, and how to roll back | `/builder:ship` |

Phases 1–3 work the same in Cowork and Claude Code. Phases 4–6 run commands, so they need Claude Code. Everything is saved in `builder/`, so you can switch tools at any moment.

## All commands

| Command | What it does |
|---|---|
| `/builder:start` | Set up a new project and begin the Idea phase |
| `/builder:next` | Where am I, and what's next? Then continues |
| `/builder:status` | Progress summary, and refreshes `builder/progress.html` |
| `/builder:idea` … `/builder:ship` | Run a specific phase |
| `/builder:explain <concept>` | Explain a term (commit, deploy, DNS…) in plain words, applied to your project |
| `/builder:undo` | Go back to an earlier saved point without losing anything |

## What gets created in your project

```
builder/
  state.json         where you are (Claude reads it at every session start)
  01-idea.md … 06-ship.md   one deliverable per phase
  decisions.md       choices Claude made that you should review
  progress.html      open it in a browser to see your progress
  progress-data.js   the data that page shows
```

## Documentation

- [Getting started](docs/en/getting-started.md) · [Primeros pasos](docs/es/getting-started.md)
- [The method](docs/en/the-method.md) · [El método](docs/es/the-method.md)
- [Commands](docs/en/commands.md) · [Comandos](docs/es/commands.md)
- [Writing a hosting recipe](docs/en/writing-a-recipe.md) · [Escribir una receta de hosting](docs/es/writing-a-recipe.md)

## Contributing

Issues and pull requests are welcome, especially hosting recipes (`skills/ship/recipes/`). Run `npm install && npm test` before opening a PR. See [Writing a hosting recipe](docs/en/writing-a-recipe.md).

## License and name

MIT, see [LICENSE](LICENSE). "Builder Method" refers to the method by Javier Rayón. Forks should use a different name.
