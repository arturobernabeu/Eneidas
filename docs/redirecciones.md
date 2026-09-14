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

### Tratamientos → ancla de Tratamientos

Los 13 tratamientos tienen ahora su contenido en el panel de `#tratamientos`.

| Origen | Destino |
|---|---|
| `/ansiedad/` | `/#tratamientos` |
| `/depresion/` | `/#tratamientos` |
| `/dependencia-emocional/` | `/#tratamientos` |
| `/autoestima-e-inseguridad/` | `/#tratamientos` |
| `/duelo/` | `/#tratamientos` |
| `/ira-y-falta-de-control-de-impulsos/` | `/#tratamientos` |
| `/hipocondria-y-trastornos-psicosomaticos/` | `/#tratamientos` |
| `/pensamientos-obsesivos/` | `/#tratamientos` |
| `/falta-de-habilidades-sociales/` | `/#tratamientos` |
| `/adicciones/` | `/#tratamientos` |
| `/trastornos-de-personalidad/` | `/#tratamientos` |
| `/mindfulness/` | `/#tratamientos` |
| `/psico-oncologia/` | `/#tratamientos` |

### Secciones

| Origen | Destino |
|---|---|
| `/metodologia-de-trabajo/` | `/#metodologia` |
| `/equipo/` | `/#equipo` |
| `/preguntas-frecuetes/` | `/#faq` |
| `/contacto/` | `/#contacto` |
| `/colaboradores/` | `/#equipo` |

### Sin equivalente en la web nueva

| Origen | Destino | Nota |
|---|---|---|
| `/alicia-rodriguez-aguilar/` | `/#equipo` | Las fichas individuales no se han replicado |
| `/ana-fernandez-chaves/` | `/#equipo` | |
| `/berta-bejarano-garcia/` | `/#equipo` | |
| `/pilar-naranjo-gonzalez-quevedo/` | `/#equipo` | |
| `/carmen-nunez-benitez/` | `/#equipo` | |
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

**Las fichas del equipo.** Cinco URLs con contenido propio que ahora colapsan en
una tarjeta sin biografía. Mismo razonamiento.

**`/informacion-detallada/`** contenía la información RGPD ampliada que enlaza el
formulario de contacto. Ya redirige a `/politica-de-privacidad/`, que es su
equivalente correcto.

## Implementación según hosting

### Apache (`.htaccess` en la raíz)

```apache
RewriteEngine On
Redirect 301 /ansiedad/ /#tratamientos
Redirect 301 /metodologia-de-trabajo/ /#metodologia
# ... una línea por fila del mapa
```

### Netlify (`_redirects` en la raíz)

```
/ansiedad/                 /#tratamientos      301
/metodologia-de-trabajo/   /#metodologia       301
```

### Vercel (`vercel.json`)

```json
{
  "redirects": [
    { "source": "/ansiedad/", "destination": "/#tratamientos", "permanent": true }
  ]
}
```

### nginx

```nginx
location = /ansiedad/ { return 301 /#tratamientos; }
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
