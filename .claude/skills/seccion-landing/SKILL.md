---
name: seccion-landing
description: Añade una sección nueva a la landing de Eneidas siguiendo el sistema de diseño existente (tokens, BEM, reveal on scroll, responsive). Úsala cuando se pida crear, duplicar o reordenar una sección de index.html.
---

# Añadir una sección a la landing

Sigue estos pasos en orden. No inventes un sistema de diseño nuevo: reutiliza el
que ya existe.

## 1. Antes de escribir

Lee `assets/css/style.css` hasta el final del bloque `1. TOKENS` y localiza en
`index.html` una sección parecida a la que vas a crear. Copia su estructura.

## 2. Marcado

Plantilla base:

```html
<!-- ===================== NOMBRE ===================== -->
<section class="section" id="slug">
  <div class="wrap">
    <header class="section__head reveal">
      <p class="eyebrow"><span class="eyebrow__line"></span> Antetítulo</p>
      <h2 class="section__title">Título de la sección</h2>
      <p class="section__lead">Frase de apoyo, máximo dos líneas.</p>
    </header>

    <!-- contenido -->
  </div>
</section>
```

Variantes de fondo disponibles, para alternar el ritmo visual de la página:

| Clase              | Fondo                        | Color de texto |
|--------------------|------------------------------|----------------|
| `.section`         | papel cálido (`--paper`)     | oscuro         |
| `.section--mist`   | bruma lavanda (`--mist`)     | oscuro         |
| `.section--ink`    | petróleo (`--ink-800`)       | claro          |
| `.section--contact`| petróleo profundo + halo     | claro          |

En fondos oscuros usa `.eyebrow--light`.

## 3. Estilos

Añade las reglas en el bloque `5. SECCIONES` de `style.css` (o en `4. COMPONENTES`
si es un componente reutilizable). Reglas:

- Nomenclatura BEM: `.bloque`, `.bloque__elemento`, `.bloque--modificador`.
- Solo variables CSS para color, tipografía, radios, sombras y transiciones.
- Espaciado fluido con `clamp()`, siguiendo el patrón de las secciones existentes.
- Rejillas con `repeat(auto-fit, minmax(Xpx, 1fr))` para que colapsen solas.
- Los ajustes responsive van al bloque `8. RESPONSIVE`, nunca inline.

## 4. Animación

Pon `reveal` en los elementos que deban aparecer al hacer scroll. El observer de
`main.js` aplica el escalonado automáticamente según la posición entre hermanos:
no hace falta declarar retardos.

## 5. Navegación

Si la sección es de primer nivel, añade su enlace en tres sitios:

1. `.nav__list` del header
2. `.footer__col` de navegación
3. El scrollspy la detecta solo, siempre que el `href` coincida con el `id`.

## 6. Iconos

Si necesitas un icono nuevo, añádelo como `<symbol id="i-nombre" viewBox="0 0 24 24">`
al sprite del final de `index.html` y úsalo con
`<svg class="ico"><use href="#i-nombre"></use></svg>`.
Mantén el estilo: trazo `1.6`, `fill="none"`, `stroke="currentColor"`.

## 7. Comprobación final

- Sin desbordamiento horizontal a 375px.
- Contraste correcto si la sección es oscura.
- Encabezados sin saltos de nivel.
- Todas las imágenes con `alt` descriptivo y `loading="lazy"` (salvo el hero).
