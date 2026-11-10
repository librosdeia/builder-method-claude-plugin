# El Método Builder

Seis fases llevan un producto de una idea vaga a internet. Cada una tiene **una entrada y una salida**. Las fases 4 y 5 forman un ciclo: construir → validar → arreglar → validar…

| Fase | Entrada | Salida | Qué pasa |
|---|---|---|---|
| 1 · Idea | tu problema, notas, enlaces | `01-idea.md` | Explorar el problema y los enfoques, acordar qué **no** hará la v1 y resumirlo en términos sencillos. Sin código. |
| 2 · PRD | `01-idea.md` | `02-prd.md` | Concretar usuarios, datos y reglas. Escribir **flujos de usuario** numerados (F1, F2…) con criterios de aceptación («Cuando…, entonces…»). Un subagente revisor busca huecos y fricción de UX. |
| 3 · Diseño | `02-prd.md` | `03-design.md` | Previsualizar las pantallas (un artefacto de Claude Design o un prototipo local navegable) y recorrer cada flujo antes de construir. *No aplica* si no hay pantallas. |
| 4 · Construcción | PRD + diseño | producto funcionando | Un plan de tareas pequeñas que **cubre todos los flujos**; preparación del repositorio (git, `CLAUDE.md`, scripts, lint); después, tarea a tarea con tests y un commit de guardado. Las decisiones que el PRD no cubría van a `decisions.md`. |
| 5 · Iteración | producto | producto validado | Una lista de comprobación por flujo; lo pruebas tú; se revisan las decisiones; el feedback se clasifica en *arreglar ya / siguiente versión / descartar*. Los arreglos abren un nuevo ciclo de construcción. |
| 6 · Publicación | producto validado | producto en internet | Auditoría de seguridad y privacidad; copia del código; proveedor elegido entre las recetas (Railway, Vercel…); despliegue; tu dominio; cómo volver a publicar y cómo volver atrás. |

## Puertas: avisos, no muros

Cada fase comprueba que existen las salidas anteriores. Si falta algo, Claude explica por qué importa y te ofrece volver atrás. También puedes continuar igualmente: Claude **genera** lo que falta con lo que sabe y lo marca como *sin revisar*. Aparece como deuda en tu mapa de progreso hasta que lo revises.

## Trazabilidad

Cada flujo tiene un identificador. El plan dice qué tareas cubren cada flujo, la validación comprueba cada flujo y el mapa de progreso cuenta los flujos cubiertos y validados. Así, «lo que falta» siempre es concreto.

## Puntos de guardado

Desde el inicio de la Construcción, cada tarea terminada se guarda como un commit (`builder: T3 Formulario de reserva`). `/builder:undo` te devuelve atrás sin borrar el historial.
