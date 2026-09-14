# Análisis de marca — eneidaspsicologia.com

Extraído del sitio original el 14/09/2026. Base para las decisiones de diseño
de la landing.

## 1. Sitio de origen

WordPress con el tema *Suffice* de ThemeGrill. Estructura clásica de menú amplio
(13 tratamientos en submenú), páginas separadas para metodología, equipo, FAQ y
contacto, y una home con slider, servicios, equipo y opiniones.

## 2. Paleta extraída

Colores recuperados del CSS del tema, ordenados por frecuencia de uso:

| Rol en el original      | HEX       | Uso                                    |
|-------------------------|-----------|----------------------------------------|
| Primario                | `#77BAE7` | Azul sereno. Botones, enlaces, acentos |
| Secundario              | `#5F95B9` | Azul medio. Hover y cabeceras          |
| Acento cálido           | `#FDD79A` | Arena suave. Destacados puntuales      |
| Fondo alternativo       | `#EDF0FA` | Bruma lavanda. Bandas de sección       |
| Texto                   | `#313131` | Gris neutro                            |
| Base                    | `#FFFFFF` | Fondo dominante                        |

### Paleta de la nueva landing

Se conserva el azul de marca y se amplía a una escala completa, se sustituye el
gris neutro por un petróleo profundo (más cálido y con mejor contraste) y el
blanco puro por un papel cálido.

```css
--brand-400: #77BAE7;  /* primario original, intacto */
--brand-500: #5F95B9;  /* secundario original, intacto */
--brand-600: #4A7D9E;  /* hover, enlaces sobre claro */
--brand-100: #EAF4FB;  /* fondos de icono y foco */
--ink-900:  #122C38;   /* sección de contacto */
--ink-800:  #16333F;   /* texto principal, header oscuro, footer */
--ink-500:  #4A6572;   /* texto de apoyo */
--sand-200: #FDD79A;   /* subrayado del hero, filetes */
--mist:     #EDF0FA;   /* bandas de sección */
--paper:    #FBF8F4;   /* fondo general */
```

Motivo del ajuste: `#77BAE7` sobre blanco no alcanza contraste AA para texto, así
que pasa a ser color de superficie y acento, y la carga tipográfica recae en
`--ink-800` y `--brand-600`.

## 3. Tipografía

**Original:** Poppins (titulares) + Open Sans (cuerpo). Correcta pero genérica y
sin personalidad de marca.

**Nueva:**

- **Montserrat** (300–700 e itálica 400) en toda la página, titulares incluidos.
  Sans geométrica de formas abiertas y altura de x generosa. Familia única por
  decisión de marca: no hay serif de display.

Ajustes derivados de usar una sola sans geométrica:

| Dónde | Valor | Motivo |
|---|---|---|
| `body` | interlínea 1.68 | Altura de x grande: a 1.72 el texto quedaba suelto |
| `h1–h4` | interlínea 1.16 | Ascendentes altas; 1.08 las pisaba |
| `h1–h4` | tracking −.025em | Una geométrica pide más tracking negativo en display |
| `--fs-hero` / `--fs-h2` | −25% | Montserrat lee mucho mayor y más pesada que un serif |
| Rótulo de marca | 1.15rem / 700 / −.01em | Como wordmark necesita peso, no tamaño |

Las dos itálicas de la página (el «cuidar» del hero y las citas de Opiniones)
cargan la variante real 1,400 de Google Fonts: sin ella el navegador
sintetizaría una falsa itálica inclinando la redonda.

El contraste serif/sans da jerarquía sin necesidad de recargar con color.

## 4. Secciones del original y su equivalente

| Original                          | Landing nueva                        |
|-----------------------------------|--------------------------------------|
| Topbar con dirección y teléfono   | `.topbar` (se conserva)              |
| Slider de bienvenida              | Hero asimétrico con datos clave      |
| Servicios (4 bloques)             | `#servicios` — 4 tarjetas            |
| 13 páginas de tratamiento         | `#tratamientos` — índice + panel      |
| Página "Metodología de trabajo"   | `#metodologia` — acordeón + imagen   |
| Página "Equipo" (5 personas)      | `#equipo` — sobre fondo petróleo     |
| Opiniones (4 testimonios)         | `#opiniones` — tarjetas de cita      |
| Página "Preguntas frecuentes"     | `#faq` — acordeón                    |
| Página "Contacto" + formulario    | `#contacto` — formulario validado    |
| Footer con enlaces y legal        | `.footer` en cuatro columnas         |

## 4 bis. Logotipo

El cliente entregó `assets/img/logo_real.jpg`: 1938×1098 px, 774 KB, **con el 81%
del lienzo en margen blanco vacío** y sin canal alfa. Inservible tal cual sobre
la cabecera translúcida o el pie oscuro, donde habría mostrado un recuadro blanco.

Recursos derivados, todos recortados a la caja real del arte y con transparencia:

| Archivo | Origen en el master | Uso |
|---|---|---|
| `logo-mark.png` 132×120 | Isotipo, caja `x559 y305 533×485` | Cabecera y pie |
| `logo-full.png` 600×346 | Lockup, caja `x545 y305 847×488` | Firma de email, impresión |
| `favicon-192.png`, `apple-touch-icon.png`, `favicon-32.png` | Isotipo centrado en lienzo cuadrado | Pestaña e inicio |

El alfa se calcula por cobertura (`a = (255 − R) / (255 − 0x77)` en los píxeles
cian), no por recorte duro, así que el borde antialiased se conserva limpio sobre
cualquier fondo. En el isotipo se descartan texto y sombra exigiendo `B − R > 12`.

**Cian del logotipo: `#77DDFF`.** Prácticamente el mismo tono que el primario
`#77BAE7` heredado del sitio antiguo, algo más saturado. Se conserva sin
retocar: es el activo de marca, no una decisión de la landing.

## 5. Datos de contacto verificados

- Av. Blas Infante, 6, 5ºB — 41011 Sevilla
- 614 18 88 45
- eneidaspsicologia@gmail.com
- Responsable del tratamiento de datos: Ana María Fernández Chaves

## 6. Equipo (nombres y colegiación tal cual aparecen)

| Nombre                            | Nº Colegiada |
|-----------------------------------|--------------|
| Alicia Rodríguez Aguilar          | AN09190      |
| Ana Fernández Chaves              | AN07176      |
| Berta Bejarano García             | AN06100      |
| Pilar Naranjo González-Quevedo    | AN07736      |
| Carmen Núñez Benítez              | AN10799      |

## 7. Pendiente de confirmar con el cliente

- URLs reales de Facebook e Instagram (en la landing apuntan al dominio raíz).
- Textos de aviso legal, privacidad y cookies.
- Endpoint de envío del formulario.
- Si ofrecen terapia online (se menciona en el hero como reclamo; confirmar).
