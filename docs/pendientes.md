# Tareas pendientes

Estado a 14/09/2026. Documentos relacionados:
[`redirecciones.md`](redirecciones.md) (mapa 301) y
[`analisis-marca.md`](analisis-marca.md) (paleta, tipografía, logotipo).

La web está terminada a nivel de diseño, contenido y código. Lo que queda es
casi todo **infraestructura y decisiones del centro**, no desarrollo.

---

## 🔴 Bloqueantes — impiden publicar

### 1. El formulario no envía

**Estado:** valida en cliente y muestra «gracias», pero no hay endpoint. Cada
solicitud de cita se pierde en silencio. Es el CTA principal de la web.

**Dónde:** `assets/js/main.js`, línea 389, comentario «Punto de integración».

**Campos que se enviarían:** `nombre`, `telefono`, `email`, `motivo`, `mensaje`.
Más `web`, que es la trampa antispam y debe descartarse en el servidor.

**Opciones, de mejor a peor:**

| Opción | Valoración |
|---|---|
| Script propio (PHP o función serverless) en hosting UE, envío por SMTP autenticado | ✅ **Recomendado.** Los datos no salen de vuestro servidor, sin terceros, sin contrato de encargado |
| Formspree, Netlify Forms | Funciona, pero añade un encargado de tratamiento en EE. UU. que hay que contratar y declarar |
| EmailJS | ❌ **Descartar.** La clave va en el JavaScript público: cualquiera puede usar vuestra cuenta |
| `mailto:` | ❌ **Descartar.** UX pésima y expone el correo a los rastreadores |

**Qué necesito para hacerlo:** saber el hosting. Con PHP son unas 40 líneas.

**Al implementarlo, no olvidar:** descartar los envíos con el campo `web`
relleno, limitar la frecuencia por IP, y escapar el contenido antes de
componer el correo.

---

### 2. Buzón de destino

**Estado:** el destino previsto es `eneidaspsicologia@gmail.com`, una cuenta
**gratuita** de Gmail.

**El problema:** el formulario recoge «motivo de consulta», que en un centro de
psicología son datos de salud — categoría especial del artículo 9 del RGPD.
Gmail gratuito **no tiene contrato de encargado de tratamiento**: el Data
Privacy Framework ampara a Google Workspace de pago, no a una cuenta personal.

**Recomendación:** buzón profesional en la UE con dominio propio
(`contacto@eneidaspsicologia.com`). Lo incluye cualquier hosting español;
Infomaniak o Mailfence lo dan con servidores en Europa y contrato firmado.

**Alternativa que reduce el riesgo sin cambiar de infraestructura:** quitar del
formulario el selector de motivo y el mensaje libre, dejando solo nombre,
teléfono y franja horaria. Así deja de recoger datos de salud —pasa a ser una
petición de llamada— y la conversación clínica ocurre por teléfono, donde ya
existen las garantías del ejercicio profesional. Es aplicar el principio de
minimización del artículo 5.1.c.

---

### 3. Hosting y redirecciones 301

**Estado:** sin decidir. El WordPress actual tiene ~34 URLs indexadas y la web
nueva es una sola página: 31 de ellas darán 404.

**Ya resuelto:** `/politica-de-cookies/` y `/` conservan su URL exacta, porque
las páginas legales se sirven como índice de directorio. No necesitan
redirección en ningún hosting.

**Qué hacer:** elegir hosting y aplicar el mapa de
[`redirecciones.md`](redirecciones.md), que trae los snippets ya escritos para
Apache, Netlify, Vercel y nginx.

**Aviso:** GitHub Pages no admite redirecciones de servidor. Si el
posicionamiento importa, conviene otro proveedor.

---

## 🟡 Decisiones del centro

### 4. La tabla de cookies no corresponde con esta web

**Estado:** la política de cookies reproduce el texto literal de la web actual,
que describe las cookies del **WordPress**: `CookieConsent`,
`cookielawinfo-checkbox-necessary`, `rc::a/b/c` de reCAPTCHA y `NID` de Google.

**Esta web no instala ninguna de las cuatro.** Y a la vez la tabla omite lo
único que sí guarda: la clave `eneidas.consent` en `localStorage`, que registra
la decisión sobre cookies durante un año.

Es un desajuste en ambas direcciones: declara de más y de menos.

**Qué hacer:** decidir primero si habrá analítica (punto 9) y reescribir
entonces la tabla de `politica-de-cookies/index.html` para que refleje la
realidad. Si no hay analítica, la tabla se reduce a una sola fila.

---

### 5. Datos personales del equipo en la política de privacidad

**Estado:** el PDF original incluye un bloque con **NIF, teléfonos móviles
personales y correos privados** de las cinco psicólogas. **No lo he publicado.**

**Motivo:** exponer NIF y móviles particulares en una web abierta es innecesario
para informar al usuario, es material de scraping, y resulta contradictorio
dentro de la propia política de privacidad.

**Cómo está resuelto ahora:** la página remite al delegado de protección de
datos (`dpo@finchasociados.com`) para consultar el registro de actividades.

**Qué hacer:** confirmar con la asesoría. Si insisten en publicarlo íntegro, se
añade en un minuto.

---

### 6. Foto de la sección Metodología

**Estado:** `assets/img/hero/consulta.jpg` es una foto de archivo de manos
manchadas de pintura, heredada de un taller del blog. No representa al centro.

El `alt` ya es honesto («Manos de un grupo de personas unidas, cubiertas de
pintura de colores»), pero la imagen sigue sin encajar.

**Qué hacer:** enviar una foto propia del interior del centro. Formato
apaisado, mínimo 1000×600. Si no hay ninguna, mejor retirar la imagen que
dejar una de archivo.

---

### 7. Validar el aviso legal

**Estado:** reconstruido a partir del PDF de `protecciondedatosencadiz.com`,
cuyas fuentes con codificación personalizada impedían extraer el texto limpio:
salía completo pero **sin una sola tilde ni ñ**, y con `1»` por `1ª`.

Restauré esos caracteres a mano. En español la restauración es determinista y
los datos críticos (NIF 77801755T, N.I.C.A. 53610, colegiada AN07176) son ASCII
y llegaron intactos.

**Qué hacer:** que vuestro proveedor de protección de datos revise
`aviso-legal/index.html` antes de publicar. Es un documento con efectos
legales reconstruido por un tercero.

**Nota resuelta:** la aparente contradicción de direcciones no lo era. Avda.
Eduardo Dato nº 44 es el domicilio de Ana María como responsable del
tratamiento; Av. Blas Infante, 6 es la consulta. Ambas correctas.

---

### 8. Blog y fichas del equipo

**Estado:** desaparecen 8 URLs con contenido propio — 3 entradas de blog, 2
categorías y 5 fichas individuales del equipo.

**El problema:** redirigirlas todas a la portada es lo rápido, pero Google trata
la redirección masiva a home como *soft 404* y no traslada autoridad.

**Qué hacer:** si esas páginas reciben visitas, compensa recuperarlas como
páginas propias. Se decide mirando las analíticas actuales, si las hay.

---

## 🟢 Mejoras

### 9. Analítica

**Estado:** no hay ninguna instalada. La infraestructura de consentimiento sí
está lista.

**Cómo añadirla correctamente:** el script **no** debe ir en el HTML, porque se
cargaría antes de que el usuario decida y el aviso de cookies sería decorativo
—que es exactamente lo que sanciona la AEPD. Debe engancharse a la API:

```js
window.eneidasConsent.onGranted(function () {
  // cargar aquí el script de analítica
});
```

Definida en `assets/js/cookies.js`, línea 47.

**Sugerencia:** si solo queréis saber cuánta gente visita la web, una
alternativa sin cookies (Plausible, Matomo autoalojado) evita el banner para
analítica y simplifica el cumplimiento.

---

### 10. El `<h1>` no contiene palabras clave

**Estado:** «Un espacio para cuidar de ti». Emocionalmente correcto, pero no
incluye «psicología» ni «Sevilla».

**Contrapeso:** el `<title>` sí las lleva («Psicólogas en Sevilla | Centro de
Psicología Eneidas») y Google lo pondera mucho. El impacto real es moderado.

**Qué hacer:** es una decisión de marca, no técnica. Si preferís priorizar
posicionamiento sobre tono, algo como «Psicología en Sevilla para cuidar de ti»
cubre ambas cosas.

---

### 11. Antispam de segundo nivel

**Estado:** hay una trampa (honeypot) en el formulario, que detiene a la gran
mayoría de bots.

**Qué hacer:** solo si al publicar llega spam de todos modos. La siguiente
medida sin perjudicar la accesibilidad es limitar la frecuencia por IP en el
servidor; los captchas visuales se dejan como último recurso.

---

## 🔵 Verificación pendiente

### 12. Repaso visual completo

**Importante:** todo lo verificado durante el desarrollo ha sido **estático** —
balanceo de etiquetas, rutas, llaves CSS, sintaxis JS, contraste calculado.
La web **no se ha revisado renderizada** salvo el menú móvil.

Ya se detectó así un fallo grave: el menú móvil era invisible porque el
`backdrop-filter` del header convertía el panel `position: fixed` en hijo de una
caja de 68px. Ese tipo de defecto no lo detecta ningún chequeo estático.

**Qué revisar, con `npx --yes serve . -l 5173`:**

| Zona | Qué comprobar |
|---|---|
| Tratamientos | Cambiar de pestaña: el panel debe crecer y encoger con suavidad |
| FAQ | Abrir preguntas seguidas: cada clic cierra otra |
| Aviso de cookies | Aparece al primer acceso; «Solo las necesarias» lo cierra y no vuelve |
| Formulario | Enviar vacío: los errores abren su fila sin dar un tirón |
| Móvil 375px | Índice de Tratamientos como tira horizontal, menú lateral |
| Táctil | Los botones deben hundirse al pulsar |
| Páginas legales | Ficha de datos a una columna; cabecera sin comprimir el rótulo |

### 13. Navegadores

Sin probar en Safari ni Firefox. Los puntos de riesgo son la animación del
acordeón (Web Animations API, elegida precisamente por compatibilidad) y
`grid-template-rows` animado en los errores del formulario.

---

## Resueltos

- Dirección, teléfono y perfiles de Facebook e Instagram
- Aviso legal, política de privacidad y política de cookies publicadas
- Tipografía autoalojada: cero peticiones a terceros
- Logotipo real recortado, con transparencia y favicon multiformato
- Tarjeta de compartición 1200×630
- Datos estructurados con `MedicalBusiness` y `FAQPage`
- Menú móvil
- Afirmación de «terapia online» retirada del hero por no estar respaldada
