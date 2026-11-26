# Eneidas — Landing Page

Landing page estática para el **Centro de Psicología Eneidas** (Sevilla).
Réplica moderna de `https://www.eneidaspsicologia.com/` en HTML5 + CSS3 + JS vanilla.

## Stack

Sin build, sin dependencias, sin framework. Se abre `index.html` directamente
o se sirve con cualquier servidor estático (el formulario necesita PHP). Las
fuentes están autoalojadas en `assets/fonts/`: la web no hace peticiones a
terceros.

## Estructura

```
index.html              Portada (landing)
404.html                Página de error
aviso-legal/, politica-de-privacidad/, politica-de-cookies/
                        Páginas legales (carpeta + index.html)
enviar.php              Recibe el formulario y envía el correo (requiere PHP)
sitemap.xml, robots.txt SEO
assets/css/style.css    Hoja de estilos completa (tokens + componentes)
assets/js/main.js       Interacciones (menú, scroll, pestañas, carrusel, formulario)
assets/js/enlaces-locales.js  Solo en file://: añade index.html a los enlaces a carpetas
assets/img/             Imágenes locales (equipo, hero)
assets/icons/           Favicons
equipo/                 Fichas individuales del equipo (GENERADAS, no editar a mano)
tools/generar-fichas.py Genera equipo/*.html y las tarjetas del equipo de index.html
                        (entre <!-- equipo:tarjetas -->): `python tools/generar-fichas.py`
tools/optimizar-imagenes.py  Reduce fotos y crea sus .webp (requiere Pillow); el HTML
                        las sirve con <picture> y el JPG como respaldo
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

`main.js` (bloque 8) valida en cliente y envía con `fetch` a `enviar.php`, que
revalida, aplica el antispam y manda el correo con `mail()`; responde JSON
`{"ok":true}` o `{"ok":false,"error":"…"}`. Antes de publicar, revisar el bloque
CONFIGURACIÓN de `enviar.php` (destino, remitente, orígenes permitidos). En
GitHub Pages y en servidores estáticos el envío siempre falla: no hay PHP.
