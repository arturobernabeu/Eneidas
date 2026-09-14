# Eneidas — Landing Page

Landing page estática para el **Centro de Psicología Eneidas** (Sevilla).
Réplica moderna de `https://www.eneidaspsicologia.com/` en HTML5 + CSS3 + JS vanilla.

## Stack

Sin build, sin dependencias, sin framework. Se abre `index.html` directamente
o se sirve con cualquier servidor estático. Las únicas peticiones externas son
las fuentes de Google Fonts.

## Estructura

```
index.html              Documento único de la landing
assets/css/style.css    Hoja de estilos completa (tokens + componentes)
assets/js/main.js       Interacciones (menú, scroll, acordeón, formulario)
assets/img/             Imágenes locales (equipo, hero)
assets/icons/           Favicons
pages/                  Páginas secundarias futuras (aviso legal, blog…)
docs/                   Documentación del proyecto y del análisis de marca
.claude/                Configuración de Claude Code (agentes, skills, comandos)
```

## Convenciones

- **CSS**: nomenclatura BEM (`.card`, `.card__title`, `.card--alt`). Todos los
  colores, fuentes, radios y sombras salen de las variables de `:root`; no
  introducir valores hex sueltos fuera del bloque de tokens.
- **Orden de `style.css`**: 1 Tokens · 2 Reset · 3 Utilidades · 4 Componentes ·
  5 Secciones · 6 Footer · 7 Animaciones · 8 Responsive. Mantener ese orden al
  añadir reglas.
- **HTML**: semántico y en español (`lang="es"`). Los iconos viven en el sprite
  SVG del final del documento y se referencian con `<use href="#i-nombre">`.
- **JS**: vanilla, un único IIFE en `main.js`, sin dependencias. Cada bloque va
  numerado y comentado.
- **Responsive**: breakpoints en 1100px, 980px (aparece el menú móvil), 720px y
  420px. Comprobar siempre a 375px de ancho.
- **Accesibilidad**: respetar `prefers-reduced-motion`, mantener el `skip-link`,
  los `aria-label` del menú y el foco visible.

## Contenido

Los textos, nombres del equipo, números de colegiada, testimonios, FAQ y datos
de contacto están transcritos de la web original. **No inventar datos nuevos**
(años de experiencia, precios, horarios) sin confirmarlos antes.

## Formulario

`main.js` valida en cliente pero **no envía nada**. El punto de integración está
marcado con un comentario en el handler de `submit` (bloque 8).
