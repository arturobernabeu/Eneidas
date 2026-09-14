# Eneidas — Landing Page

Landing page del **Centro de Psicología Eneidas** (Sevilla). HTML5, CSS3 y
JavaScript vanilla, sin build ni dependencias.

## Arrancar

**Hace falta un servidor**, no vale abrir `index.html` con `file://`: las páginas
legales son índices de directorio y los enlaces entre páginas son absolutos.

```bash
npx --yes serve . -l 5173
```

Luego visita <http://localhost:5173>.

## Qué falta

Lista completa con indicaciones en
[`docs/pendientes.md`](docs/pendientes.md). Lo que bloquea la publicación:
el formulario no envía, el buzón de destino y el hosting con sus
redirecciones.

## Antes de desplegar

Las URLs legales (`/politica-de-cookies/`) coinciden con las del sitio actual y
no necesitan redirección. El resto del WordPress sí: ver
[`docs/redirecciones.md`](docs/redirecciones.md).

## Estructura

```
eneidas/
├─ index.html                  Landing completa
├─ assets/
│  ├─ css/style.css            Estilos (tokens, componentes, secciones)
│  ├─ js/main.js               Menú, scroll, acordeón, formulario
│  ├─ img/
│  │  ├─ equipo/               Retratos del equipo
│  │  ├─ hero/                 Imágenes de cabecera
│  │  ├─ logo-mark.png         Isotipo, transparente — usado en cabecera y pie
│  │  └─ logo-full.png         Lockup completo, transparente — para uso externo
│  ├─ icons/                   Favicons generados desde el isotipo
│  └─ fonts/                   Montserrat variable autoalojada (2 ficheros)
├─ 404.html
├─ favicon.ico
├─ aviso-legal/index.html            Se sirve en /aviso-legal/
├─ politica-de-privacidad/index.html Se sirve en /politica-de-privacidad/
├─ politica-de-cookies/index.html    Se sirve en /politica-de-cookies/
├─ robots.txt
├─ sitemap.xml
├─ docs/
│  ├─ pendientes.md            Qué falta y cómo abordarlo
│  ├─ analisis-marca.md        Paleta, tipografía y contenido extraídos
│  └─ redirecciones.md         Mapa 301 de las ~34 URLs del WordPress actual
├─ .claude/
│  ├─ settings.json            Permisos del proyecto
│  ├─ agents/                  Subagentes (revisor-frontend)
│  ├─ skills/                  Skills (seccion-landing)
│  └─ commands/                Slash commands (/servir)
├─ .vscode/settings.json
├─ CLAUDE.md                   Convenciones para Claude Code
└─ README.md
```

## Diseño

- **Paleta**: azul sereno `#77BAE7` de la marca original, petróleo `#16333F`
  para el texto y los fondos oscuros, arena `#FDD79A` como acento cálido y papel
  `#FBF8F4` de fondo.
- **Tipografía**: Montserrat en toda la página (300/400/500/600/700 e itálica
  400), desde Google Fonts. Una sola familia, sin serif de titulares.
- **Responsive**: mobile-first en la práctica, con puntos de ruptura en 1100px,
  980px, 720px y 420px. Menú lateral deslizante por debajo de 980px.
- **Accesibilidad**: enlace de salto al contenido, foco visible, `aria` en los
  controles del menú y soporte de `prefers-reduced-motion`.

Detalle completo del análisis en [`docs/analisis-marca.md`](docs/analisis-marca.md).

## Funcionalidad

| Función                        | Dónde                  |
|--------------------------------|------------------------|
| Cabecera sticky que se compacta | `main.js` bloque 1     |
| Menú hamburguesa + overlay      | `main.js` bloque 2     |
| Smooth scroll con offset        | `main.js` bloque 3     |
| Scrollspy en la navegación      | `main.js` bloque 4     |
| Reveal on scroll escalonado     | `main.js` bloque 5     |
| Acordeón con transición de alto | `main.js` bloque 6     |
| Pestañas de tratamientos        | `main.js` bloque 7     |
| Validación del formulario       | `main.js` bloque 8     |

## Pendiente

El formulario **valida pero no envía**. Conecta el endpoint en el handler de
`submit` de `assets/js/main.js` (bloque 8, comentario "Punto de integración").

Otros puntos abiertos en la sección final de `docs/analisis-marca.md`.

## Claude Code

- `/servir` — levanta el servidor estático local.
- Skill `seccion-landing` — añade secciones respetando el sistema de diseño.
- Agente `revisor-frontend` — revisa semántica, accesibilidad y responsive.
