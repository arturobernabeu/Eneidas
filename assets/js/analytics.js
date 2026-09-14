/* =====================================================================
   Google Analytics 4 — Centro de Psicología Eneidas

   ─────────────────────────────────────────────────────────────────────
   PARA ACTIVARLO: pega abajo el ID de medición (G-XXXXXXXXXX).
   Mientras esté vacío, este fichero no hace absolutamente nada.
   ─────────────────────────────────────────────────────────────────────

   El script de Google NO se carga al abrir la página: se engancha a
   window.eneidasConsent.onGranted() y solo se descarga si la persona ha
   aceptado las cookies. Ponerlo directamente en el HTML lo cargaría antes
   de que decidiera, que es la infracción que sanciona la AEPD.

   Requiere que cookies.js se cargue ANTES que este fichero.
   ===================================================================== */
(function () {
  'use strict';

  var GA_ID = '';   // <-- aquí el G-XXXXXXXXXX

  if (!GA_ID) return;

  if (!window.eneidasConsent) {
    // cookies.js no se ha cargado: sin gestión de consentimiento no medimos
    return;
  }

  window.eneidasConsent.onGranted(function () {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, {
      // Desactiva remarketing y datos demográficos: reduce mucho lo que
      // Google puede cruzar con perfiles publicitarios. En una web de
      // psicología esos datos no aportan nada y sí añaden riesgo.
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  });
})();
