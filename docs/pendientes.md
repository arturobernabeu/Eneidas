# Tareas pendientes

Estado a 26/11/2026. Cada punto tiene su issue en GitHub, con la misma
categoría como etiqueta. Documentos relacionados:
[`redirecciones.md`](redirecciones.md) (mapa 301) y
[`analisis-marca.md`](analisis-marca.md) (paleta, tipografía, logotipo).

Lo que queda es sobre todo **infraestructura, validación legal y contenido que
debe aportar el centro**; el desarrollo está prácticamente cerrado.

---

## 🔴 Bloqueantes — impiden publicar

### B1. Probar el envío del formulario en el hosting

**Estado:** el formulario envía a `enviar.php` (validación en servidor, trampa
antispam, tiempo mínimo de cumplimentación y límite de 5 envíos/hora por IP).
**No se ha podido probar**: necesita un servidor con PHP y correo.

**Campos que se envían:** `nombre`, `telefono`, `email`, `psicologa` (opcional) y
`mensaje` («¿En qué podemos ayudarte?», opcional). Más `web` (trampa) y `tiempo`.

**Antes de la prueba, en `enviar.php` → CONFIGURACIÓN:**

- `$DESTINO`: el buzón que recibe las solicitudes (ver B2).
- `$REMITENTE`: una dirección **que exista en el propio dominio**
  (`web@eneidaspsicologia.com`). Si no existe, muchos servidores rechazan el envío.
- `$ORIGENES`: si se prueba con el dominio provisional del hosting, añadirlo y
  quitarlo al publicar. Un origen no incluido recibe un error visible (no se
  pierde en silencio).

**Para que los mensajes no acaben en spam (DNS del dominio):** SPF que autorice
al servidor del hosting, DKIM activado y DMARC al menos con `p=none`. Si el
hosting lo permite, mejor **SMTP autenticado** que `mail()`.

**Prueba de aceptación (con la web en su dominio y con HTTPS):**

1. Envío completo con psicóloga elegida → llega, asunto «Solicitud de cita: [psicóloga]», sin caer en spam.
2. Envío sin psicóloga ni mensaje → llega con «Sin preferencia» y «(no lo ha indicado)».
3. Responder al correo → la respuesta va al email del paciente (Reply-To).
4. Tildes y eñes correctas en asunto y cuerpo.
5. Desde una ficha, «Solicitar cita» → el formulario llega con la psicóloga elegida.
6. Seis envíos seguidos desde la misma conexión → el sexto muestra el aviso de límite.
7. Cabeceras del correo recibido con `spf=pass` y `dkim=pass`.

### B2. Buzón de destino profesional

**Estado:** el destino es `eneidaspsicologia@gmail.com`, cuenta **gratuita**.

**El problema:** el campo «¿En qué podemos ayudarte?» invita a contar el motivo
de consulta, que son datos de salud (categoría especial, art. 9 RGPD). Gmail
gratuito **no tiene contrato de encargado de tratamiento**.

**Recomendación:** buzón profesional en la UE con dominio propio
(`contacto@eneidaspsicologia.com`), con contrato de encargado firmado.

**Alternativa sin cambiar de infraestructura:** quitar el campo libre y dejar
solo nombre y teléfono, de modo que el formulario sea una petición de llamada
(minimización, art. 5.1.c).

### B3. Hosting y redirecciones 301

**Estado:** sin decidir. El WordPress actual tiene ~34 URLs indexadas.

**Ya resuelto sin redirección:** `/` y `/politica-de-cookies/` conservan su URL.

**Qué hacer:** elegir hosting y aplicar el mapa de
[`redirecciones.md`](redirecciones.md), que incluye las 5 fichas antiguas
(`/ana-fernandez-chaves/` → `/equipo/ana-fernandez-chaves.html`…) y trae los
snippets para Apache, Netlify, Vercel y nginx. GitHub Pages no admite 301.

### B4. Política de privacidad y textos del formulario (validar con el DPO)

**Hecho:** información básica plegada bajo el formulario; casilla de
consentimiento explícito que menciona los datos de salud, sin premarcar; el log
del servidor no guarda el email del visitante.

**Pendiente de validar con el DPO** (`dpo@finchasociados.com`):

- Los textos nuevos de la casilla y de la información básica.
- La **Política de Privacidad** no menciona: datos de salud (art. 9), un **plazo
  de conservación** concreto de las solicitudes, el derecho a **retirar el
  consentimiento**, ni qué **encargados de tratamiento** intervienen (hosting y correo).

### B5. Acuerdo de corresponsabilidad

**Estado:** la web presenta a las cinco psicólogas como **corresponsables** del
tratamiento (art. 26 RGPD), con el DPO como punto de contacto común. La política
las lista con su nº de colegiada y el domicilio del centro, sin NIF ni contactos
personales.

**Qué hacer:** firmar entre las cinco un **acuerdo de corresponsabilidad** que
reparta las obligaciones, reflejarlo en el registro de actividades y confirmar
con el DPO si deben figurar los NIF (hoy solo consta el de Ana María, en el aviso legal).

### B6. Revisar el aviso legal

**Estado:** `aviso-legal/index.html` se reconstruyó a partir de un PDF cuyo
texto salía sin tildes ni eñes; se restauraron a mano. Los datos críticos (NIF,
N.I.C.A. 53610, colegiada AN07176) llegaron intactos.

**Qué hacer:** que el proveedor de protección de datos lo revise antes de publicar.

---

## 🟡 Aportación del centro — contenido o decisiones

### A1. Completar las fichas del equipo

Las fichas (`equipo/*.html`) muestran recuadros **«Pendiente de completar»**
que no deben publicarse. Se rellenan editando `tools/generar-fichas.py` y
ejecutando `python tools/generar-fichas.py`.

| Persona | Falta |
|---|---|
| Alicia | Titulación y formación complementaria · trayectoria y años de experiencia · especialidades |
| Ana | Titulación y centros de formación · trayectoria y años de experiencia |
| Berta | Titulación y formación complementaria · años de experiencia y centros |
| Pilar | Presentación personal · titulación y formación en psicodrama y EMDR · trayectoria |
| Carmen | Titulación y másteres |

**Confirmar además:** que siguen vigentes las sesiones de 50 minutos y la
primera cita gratuita de media hora (Alicia, Berta, Carmen), y si se quieren
publicar el móvil, email y Doctoralia personales de las fichas antiguas.

**Fotos:** ver issue #4. Formato vertical 4:5, mínimo 900×1125 px.

### A2. Texto de Psico-Oncología

Es la única de las 14 áreas de Tratamientos que conserva el texto antiguo.

### A3. Foto de la sección Metodología

`assets/img/hero/consulta.jpg` es una foto de archivo (manos con pintura) que no
representa al centro. Sustituir por una foto propia apaisada (mín. 1000×600) o retirarla.

### A4. Política de cookies

Describe las cookies del WordPress (`CookieConsent`, reCAPTCHA, `NID`), que esta
web **no instala**, y omite lo que sí guarda: la clave `eneidas.consent` en
`localStorage`. Reescribir la tabla cuando se decida la analítica (M1).

### A5. Blog antiguo

Desaparecen 3 entradas y 2 categorías. Decidir si se recuperan como páginas o
se redirigen; la redirección masiva a portada cuenta como *soft 404*.

### A6. Sección Colaboradores

Ver issue #3.

---

## 🟢 Mejoras

### M1. Analítica respetando el consentimiento

No hay ninguna. Si se añade, debe cargarse desde
`window.eneidasConsent.onGranted(…)` (`assets/js/cookies.js`), nunca en el HTML.
Una opción sin cookies (Plausible, Matomo autoalojado) simplifica el cumplimiento.

### M2. Palabras clave en el `<h1>`

«Un espacio para cuidar de ti» no incluye «psicología» ni «Sevilla». Decisión de
marca; una alternativa: «Psicología en Sevilla para cuidar de ti».

### M3. Versionado de CSS y JS

Quien ya visitó la web puede quedarse con un `main.js` o `style.css` antiguo en
caché. Añadir un número de versión a las rutas (`main.js?v=2`) al publicar cambios.

### M4. Páginas legales como archivos sueltos

Pasar `aviso-legal/`, `politica-de-privacidad/` y `politica-de-cookies/` a
archivos `.html` con el menú completo, como las fichas. Permitiría eliminar
`assets/js/enlaces-locales.js`. `/politica-de-cookies/` necesitaría una 301.

### M5. Antispam de segundo nivel

Ya hay trampa, tiempo mínimo y límite por IP. Solo si aun así llega spam:
siguiente paso, un captcha accesible como último recurso.

---

## 🔵 Verificación

### V1. Repaso visual pendiente

Revisado en navegador durante el desarrollo: fichas, Equipo, Tratamientos,
Metodología, FAQ y formulario, en escritorio y a 375 px. **Falta:** aviso de
cookies (aparece y no vuelve tras decidir), páginas legales en móvil y una
prueba en un móvil real (táctil).

### V2. Safari y Firefox

Sin probar. Puntos de riesgo: animación del acordeón (Web Animations API),
`grid-template-rows` animado en los errores del formulario y `backdrop-filter`.

---

## Resueltos

- Formulario con envío propio (`enviar.php`), campo de psicóloga y consentimiento explícito
- Fichas individuales del equipo y sección Equipo renovada
- Textos nuevos de Tratamientos (14 áreas), Metodología (4 enfoques) y FAQ (10 preguntas)
- Dirección, teléfono y perfiles de Facebook e Instagram
- Aviso legal, política de privacidad y política de cookies publicadas
- Tipografía autoalojada: cero peticiones a terceros
- Logotipo real, favicon multiformato y tarjeta de compartición 1200×630
- Datos estructurados `MedicalBusiness`, `FAQPage` y `Person`
- Menú móvil
