# Método Builder: plugin para Claude

**Te lleva de la idea al producto publicado con el Método Builder: idea, PRD, diseño, construcción, iteración y publicación.** Funciona en Claude Code y en Cowork, y no necesitas saber programar.

El plugin te acompaña paso a paso por seis fases. Cada fase tiene una entrada y una salida: un archivo que puedes abrir y leer. Claude recuerda por dónde vas entre sesiones. Si te saltas un paso, te avisa y genera igualmente lo que falta. Además, mantiene un mapa visual de tu progreso en `builder/progress.html`.

> Complemento de la serie de libros **Método Builder** de Javier Rayón ([librosdeia.com](https://librosdeia.com)). El plugin funciona por sí solo; los libros profundizan.

🇬🇧 [Read in English](README.md)

## Instalación

**Claude Code**

```
/plugin marketplace add librosdeia/builder-method-claude-plugin
/plugin install builder@builder-method
```

**Cowork y claude.ai**: abre **Customize → Plugins → Add → Add marketplace**, escribe `librosdeia/builder-method-claude-plugin` e instala **Builder Method**. Un plugin instalado en tu cuenta de claude.ai aparece también en Claude Code.

## Uso

En una carpeta vacía, ejecuta:

```
/builder:start
```

A partir de ahí, el único comando que necesitas es **`/builder:next`**: te dice por dónde vas y sigue con el siguiente paso. En Claude Code, `/builder` es un atajo de ese comando.

Los comandos están en inglés, pero Claude te habla en español, y todos los documentos del proyecto se escriben en español.

## Las seis fases

| # | Fase | Lo que obtienes | Comando |
|---|---|---|---|
| 1 | **Idea** | una idea concreta y lo que la v1 no hará | `/builder:idea` |
| 2 | **PRD** | un documento de requisitos con flujos de usuario numerados (F1, F2…) y criterios de aceptación | `/builder:prd` |
| 3 | **Diseño** | una vista previa de las pantallas (se omite sola si no hay pantallas) | `/builder:design` |
| 4 | **Construcción** | una primera versión que funciona: un plan de tareas que cubre todos los flujos, tests y un punto de guardado tras cada tarea | `/builder:build` |
| 5 | **Iteración** | un producto validado: cada flujo comprobado, las decisiones revisadas y los arreglos de vuelta a Construcción | `/builder:iterate` |
| 6 | **Publicación** | una auditoría de seguridad, la app en internet con tu dominio y cómo volver atrás | `/builder:ship` |

Las fases 1 a 3 funcionan igual en Cowork y en Claude Code. Las fases 4 a 6 ejecutan comandos, así que necesitan Claude Code. Todo se guarda en `builder/`, de modo que puedes cambiar de herramienta en cualquier momento.

## Todos los comandos

| Comando | Qué hace |
|---|---|
| `/builder:start` | Prepara un proyecto nuevo y empieza la fase de Idea |
| `/builder:next` | Te dice por dónde vas y qué sigue, y continúa |
| `/builder:status` | Muestra un resumen del progreso y actualiza `builder/progress.html` |
| `/builder:idea` … `/builder:ship` | Ejecuta una fase concreta |
| `/builder:explain <concepto>` | Explica un término (commit, deploy, DNS…) con palabras sencillas, aplicado a tu proyecto |
| `/builder:undo` | Vuelve a un punto guardado anterior sin perder nada |

## Qué se crea en tu proyecto

```
builder/
  state.json         por dónde vas (Claude lo lee al empezar cada sesión)
  01-idea.md … 06-ship.md   un entregable por fase
  decisions.md       decisiones que tomó Claude y que conviene que revises
  progress.html      ábrelo en el navegador para ver tu progreso
  progress-data.js   los datos que muestra esa página
```

## Documentación

- [Primeros pasos](docs/es/getting-started.md)
- [El método](docs/es/the-method.md)
- [Comandos](docs/es/commands.md)
- [Escribir una receta de hosting](docs/es/writing-a-recipe.md)

## Licencia y nombre

MIT, ver [LICENSE](LICENSE). «Método Builder» se refiere al método de Javier Rayón. Los forks deben usar otro nombre.
