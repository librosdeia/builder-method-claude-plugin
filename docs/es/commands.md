# Comandos

Todos los comandos empiezan por `/builder:`. En Claude Code, `/builder` a secas es un atajo de `/builder:next`.

| Comando | Dónde | Qué hace |
|---|---|---|
| `/builder:start` | Cowork, Claude Code | Crea `builder/`, te pregunta el nombre del proyecto, tu experiencia y el idioma, y empieza la fase de Idea. Si ya existe un proyecto, te ofrece retomarlo. |
| `/builder:next` | Cowork, Claude Code | Muestra el resumen del progreso, dice cuál es el siguiente paso y continúa cuando confirmas. |
| `/builder:status` | Cowork, Claude Code | Muestra el resumen y actualiza `builder/progress.html`, sin cambiar el proyecto. |
| `/builder:idea` | Cowork, Claude Code | Fase 1. |
| `/builder:prd` | Cowork, Claude Code | Fase 2. También revisa un PRD que se generó sin revisión. |
| `/builder:design` | Cowork, Claude Code | Fase 3. Se marca como *no aplica* cuando no hay pantallas. |
| `/builder:build` | Claude Code | Fase 4. En Cowork, te indica que abras la carpeta en Claude Code. |
| `/builder:iterate` | Claude Code | Fase 5. |
| `/builder:ship` | Claude Code | Fase 6. Pregunta antes de cualquier cosa que publique o cueste dinero. |
| `/builder:explain <concepto>` | Cowork, Claude Code | Explicación sencilla ligada a tu proyecto. Notas incluidas: commit, repositorio, rama, variable de entorno, puerto, base de datos, API, front end y back end, despliegue, DNS, dominio, build, test, lint, dependencia. |
| `/builder:undo` | Claude Code | Lista los puntos guardados y restaura uno con `git revert` o en una rama nueva. Nunca borra historial. |

## Símbolos del resumen

`✔` hecha · `◐` en curso · `○` sin empezar · `!` generada, sin revisar · `–` no aplica
