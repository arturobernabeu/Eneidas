# SEO — estado y tareas fuera del código

Estado a 26/11/2026.

## Ya hecho en la web

- `<title>` de la portada con palabras clave: «Psicólogos en Sevilla | Centro de
  Psicología Eneidas» (el titular visible «Un espacio para cuidar de ti» se mantiene).
- Meta description, canonical y Open Graph en todas las páginas; títulos de las
  fichas ≤ 62 caracteres y descripciones ≤ 156.
- Imagen LCP del hero precargada (`hero/sala-5.webp`); fotos servidas en **WebP**
  con JPG de respaldo y las del hero reducidas a 1120 px
  (`python tools/optimizar-imagenes.py` al añadir o cambiar fotos).
- Datos estructurados: `MedicalBusiness` + `Psychologist` con `hasMap` y las cinco
  psicólogas enlazadas a su ficha; `FAQPage`; en cada ficha, `Person` vinculada al
  centro y `BreadcrumbList`.
- Cada área de Tratamientos tiene enlace directo (`/#ansiedad`, `/#trauma`…), y
  las URLs antiguas redirigen a su área (ver [`redirecciones.md`](redirecciones.md)).
- `sitemap.xml` con `<lastmod>` y `robots.txt` que lo declara.

**Decidido no hacer:**
- Páginas propias por tratamiento: sería la mayor mejora de posicionamiento
  («psicólogo ansiedad Sevilla»…), pero se mantienen en la portada.
- Marcar los testimonios con `Review`/`AggregateRating`: Google prohíbe las
  reseñas publicadas por el propio negocio y puede penalizarlo.
- `geo` (coordenadas) y horario en los datos estructurados, mientras no se confirmen.

## Pendiente fuera del código (por orden de impacto)

### 1. Google Business Profile
Es lo que más pesa en búsquedas locales («psicólogo Sevilla», mapas).
- Dar de alta o reclamar la ficha del centro y verificarla.
- Nombre, dirección y teléfono **exactamente iguales** que en la web:
  «Centro de Psicología Eneidas · Av. Blas Infante, 6, 5ºB, 41011 Sevilla · 614 18 88 45».
- Categoría principal «Psicólogo»; secundarias según servicios.
- Horario, fotos del centro, enlace a la web y a la solicitud de cita.
- Pedir **reseñas reales** a pacientes y responderlas.

### 2. Search Console y Bing Webmaster Tools
- Verificar el dominio `eneidaspsicologia.com` (registro DNS).
- Enviar `https://www.eneidaspsicologia.com/sitemap.xml`.
- Las dos primeras semanas: revisar errores de rastreo y que las 301 se
  resuelven bien (Inspección de URL sobre `/ansiedad/`, `/ana-fernandez-chaves/`…).

### 3. Hosting
- Forzar **HTTPS** y la versión **con www** (301 desde `http://` y desde el dominio sin www).
- Aplicar el mapa de [`redirecciones.md`](redirecciones.md).
- Compresión gzip o brotli y caché larga para `assets/` (CSS, JS, fuentes e imágenes).

### 4. Directorios y perfiles
Mismos nombre, dirección y teléfono, y enlace a la web, en: Doctoralia, Top
Doctors, Colegio Oficial de la Psicología de Andalucía Occidental, Facebook e
Instagram. Las incoherencias entre directorios restan en SEO local.

### 5. Copia de pruebas en GitHub Pages
`arturobernabeu.github.io/Eneidas/` declara como canonical el dominio definitivo,
así que Google no la trata como competidora. Aun así, **desactivar GitHub Pages**
cuando la web esté publicada.

## Comprobaciones tras publicar

- [Rich Results Test](https://search.google.com/test/rich-results) sobre la portada
  y una ficha: `MedicalBusiness`, `BreadcrumbList` y `Person` sin errores.
  (El `FAQPage` es válido, pero Google ya no muestra resultados enriquecidos de
  FAQ para centros sanitarios privados.)
- [PageSpeed Insights](https://pagespeed.web.dev/) en móvil: LCP < 2,5 s, CLS < 0,1.
- Buscar `site:eneidaspsicologia.com` a las 2-4 semanas para ver qué se ha indexado.
