# Primeros pasos

## 1. Instalar

**Claude Code**

```
/plugin marketplace add librosdeia/builder-method-claude-plugin
/plugin install builder@builder-method
```

**Cowork / claude.ai**: Customize → Plugins → Add → Add marketplace → `librosdeia/builder-method-claude-plugin` → instala **Builder Method**.

## 2. Empezar un proyecto

Crea una carpeta vacía para tu producto, ábrela en Claude Code (o selecciónala en Cowork) y ejecuta:

```
/builder:start
```

Claude te pregunta tres cosas:
- un nombre corto para el proyecto;
- si has programado antes (`none`, `some` o `developer`), para ajustar cuánto te explica;
- el idioma.

Después crea la carpeta `builder/` y empieza la fase 1.

## 3. Seguir

Cada vez que vuelvas, escribe **`/builder:next`**. Claude muestra un resumen como este y continúa:

```
 BUILDER · reservas-peluqueria                          ciclo 1
 ✔ 1 Idea  ✔ 2 PRD  ✔ 3 Diseño  ◐ 4 Construcción  ○ 5 Iteración  ○ 6 Publicación
                                  ▲ estás aquí
 Construcción › construir · 5 de 9 tareas · flujos cubiertos 3/3
 Falta: T6–T9 · 2 decisiones por revisar
 Deuda: ninguna
 Siguiente: /builder:next
```

Abre `builder/progress.html` en el navegador para ver la versión visual.

## 4. Si tienes dudas

- `/builder:explain <palabra>`: cualquier término técnico, explicado con palabras sencillas y un ejemplo de tu proyecto.
- `/builder:undo`: vuelve a un punto guardado anterior (nunca borra nada).
- `/builder:status`: muestra por dónde vas, sin cambiar nada.

## Comprueba la instalación

- [ ] `/builder:start` aparece al escribir `/builder` en Claude Code.
- [ ] En Cowork, `/builder:next` aparece en el menú de comandos tras instalar desde Customize → Plugins.
- [ ] Tras `/builder:start`, `builder/progress.html` se abre en el navegador y muestra seis tarjetas.
- [ ] Al cerrar y reabrir la sesión, Claude sigue sabiendo en qué fase estás.
