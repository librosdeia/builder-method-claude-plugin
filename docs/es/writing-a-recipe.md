# Escribir una receta de hosting

La fase de Publicación nunca fija un proveedor en el código. Lee las recetas de `skills/ship/recipes/`, recomienda una según su sección «Fits when» y sigue paso a paso la receta elegida.

## Añadir un proveedor

1. Copia `skills/ship/recipes/_template.md` a `skills/ship/recipes/<proveedor>.md` (en minúsculas, con guiones).
2. Rellena las seis secciones y deja los encabezados en inglés, tal cual: **Fits when**, **Prerequisites**, **Prepare**, **Deploy**, **Domain**, **Rollback**.
3. Reglas:
   - Sin precios. Enlaza la página de precios del proveedor.
   - Divide los pasos de Deploy en **You (the user) do** y **Claude does**, y explica cómo comprobar que funciona.
   - Las variables de entorno se mencionan solo por su nombre.
   - Di claramente cuándo el proveedor *no* encaja (por ejemplo, si no tiene disco persistente para SQLite).
4. Actualiza la lista de `test/recipes.test.mjs` y ejecuta `npm test`.
5. Abre un pull request.
