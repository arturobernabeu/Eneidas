# Redirecciones al desplegar

La web nueva es **una sola página** con anclas. La actual es un WordPress con
~34 URLs indexadas. Sin redirecciones 301, todas devolverán 404 y se pierde el
posicionamiento acumulado.

Este mapa es independiente del hosting: abajo están los formatos concretos para
los proveedores habituales.

## Ya resuelto sin redirección

Las páginas legales se sirven como índice de directorio, así que su URL coincide
con la actual y **no necesitan redirección**:

| URL | Estado |
|---|---|
| `/politica-de-cookies/` | Se mantiene igual |
| `/` | Se mantiene igual |

`/aviso-legal/` y `/politica-de-privacidad/` son nuevas: antes eran PDF en el
dominio del proveedor de protección de datos (`protecciondedatosencadiz.com`),
no en este sitio.

## Mapa de redirecciones 301

### Tratamientos → su pestaña en la portada

Cada tratamiento antiguo redirige a su área: `main.js` (bloque 7) abre la
pestaña correspondiente al llegar con `/#<área>` y desplaza a Tratamientos.

| Origen | Destino |
|---|---|
| `/ansiedad/` | `/#ansiedad` |
| `/depresion/` | `/#depresion` |
| `/dependencia-emocional/` | `/#dependencia` |
| `/autoestima-e-inseguridad/` | `/#autoestima` |
| `/duelo/` | `/#duelo` |
| `/ira-y-falta-de-control-de-impulsos/` | `/#ira` |
| `/hipocondria-y-trastornos-psicosomaticos/` | `/#psicosomatico` |
| `/pensamientos-obsesivos/` | `/#obsesivos` |
| `/falta-de-habilidades-sociales/` | `/#sociales` |
| `/adicciones/` | `/#adicciones` |
| `/trastornos-de-personalidad/` | `/#personalidad` |
| `/mindfulness/` | `/#mindfulness` |
| `/psico-oncologia/` | `/#oncologia` |

### Secciones

| Origen | Destino |
|---|---|
| `/metodologia-de-trabajo/` | `/#metodologia` |
| `/equipo/` | `/#equipo` |
| `/preguntas-frecuetes/` | `/#faq` |
| `/contacto/` | `/#contacto` |
| `/colaboradores/` | `/#equipo` |

### Fichas del equipo → página propia

Cada ficha es ahora un archivo en `equipo/` (`equipo/nombre-apellidos.html`), para que
funcione igual abriendo la web desde disco y en el servidor.

| Origen | Destino |
|---|---|
| `/alicia-rodriguez-aguilar/` | `/equipo/alicia-rodriguez-aguilar.html` |
| `/ana-fernandez-chaves/` | `/equipo/ana-fernandez-chaves.html` |
| `/berta-bejarano-garcia/` | `/equipo/berta-bejarano-garcia.html` |
| `/pilar-naranjo-gonzalez-quevedo/` | `/equipo/pilar-naranjo-gonzalez-quevedo.html` |
| `/carmen-nunez-benitez/` | `/equipo/carmen-nunez-benitez.html` |

### Sin equivalente en la web nueva

| Origen | Destino | Nota |
|---|---|---|
| `/blog/` | `/` | **El blog desaparece** |
| `/category/articulo/` | `/` | |
| `/category/taller/` | `/` | |
| `/como-afecta-el-covid-19-a-las-parejas/` | `/` | Entrada de blog |
| `/deteccion-y-prevencion-de-una-conducta-suicida/` | `/` | Entrada de blog |
| `/taller-de-mindfulness-online/` | `/` | Entrada de blog |
| `/informacion-detallada/` | `/politica-de-privacidad/` | Información RGPD del formulario |

## Decisiones que conviene tomar antes

**El blog.** Son tres entradas publicadas y una categoría. Redirigir todo a la
home es la salida rápida, pero Google trata una redirección masiva a la portada
como *soft 404* y no traslada autoridad. Si esas entradas tienen visitas, merece
la pena recuperarlas como páginas propias en lugar de redirigirlas.

**Las fichas del equipo.** Resuelto: las cinco fichas vuelven a existir con el
texto original de «Sobre mí», en `/equipo/nombre-apellidos.html` y con 301 desde la URL antigua.

**`/informacion-detallada/`** contenía la información RGPD ampliada que enlaza el
formulario de contacto. Ya redirige a `/politica-de-privacidad/`, que es su
equivalente correcto.

## Implementación según hosting

### Apache (`.htaccess` en la raíz)

```apache
RewriteEngine On
# NE (no escape) es imprescindible: sin él Apache convierte «#» en «%23» y la
# redirección acaba en una URL rota. Por eso no sirve la directiva Redirect.
RewriteRule ^ansiedad/?$ /#ansiedad [R=301,NE,L]
RewriteRule ^metodologia-de-trabajo/?$ /#metodologia [R=301,NE,L]
RewriteRule ^ana-fernandez-chaves/?$ /equipo/ana-fernandez-chaves.html [R=301,L]
# ... una línea por fila del mapa
```

### Netlify (`_redirects` en la raíz)

```
/ansiedad/                 /#ansiedad          301
/metodologia-de-trabajo/   /#metodologia       301
```

### Vercel (`vercel.json`)

```json
{
  "redirects": [
    { "source": "/ansiedad/", "destination": "/#ansiedad", "permanent": true }
  ]
}
```

### nginx

```nginx
location = /ansiedad/ { return 301 /#ansiedad; }
```

### GitHub Pages

No admite redirecciones del lado del servidor. Haría falta una página por URL
antigua con `<meta http-equiv="refresh">` y `<link rel="canonical">`, que
funciona pero transmite peor la autoridad. Si el SEO importa, mejor otro hosting.

## Después de desplegar

1. Dar de alta la propiedad en Google Search Console.
2. Enviar `sitemap.xml`.
3. Revisar el informe de cobertura a las dos semanas para cazar 404 que se hayan
   escapado de este mapa.
