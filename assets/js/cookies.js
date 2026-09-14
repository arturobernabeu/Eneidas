/* =====================================================================
   Aviso de cookies — Centro de Psicología Eneidas

   Diseñado para consentimiento previo (RGPD / LSSI-CE): nada que no sea
   estrictamente necesario debe cargarse antes de que el usuario decida.

   Este sitio NO instala hoy ninguna cookie de analítica ni de publicidad.
   Cuando se añadan, deben engancharse a window.eneidasConsent.onGranted()
   en lugar de cargarse directamente en el HTML.
   ===================================================================== */
(function () {
  'use strict';

  var KEY = 'eneidas.consent';
  var VERSION = 1;                       // súbela si cambian las categorías
  var MAX_AGE_DAYS = 365;                // el consentimiento caduca al año

  /* --- Estado almacenado --------------------------------------------- */
  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data.version !== VERSION) return null;
      var age = (Date.now() - data.ts) / 86400000;
      if (age > MAX_AGE_DAYS) return null;
      return data;
    } catch (_) {
      return null;                       // modo privado o almacenamiento bloqueado
    }
  }

  function write(analytics) {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        version: VERSION,
        analytics: analytics,
        ts: Date.now()
      }));
    } catch (_) { /* sin almacenamiento: la decisión dura la sesión */ }
  }

  /* --- API pública para futuros scripts ------------------------------ */
  var queue = [];
  var consent = read();

  window.eneidasConsent = {
    get analytics() { return !!(consent && consent.analytics); },
    // Registra una función que solo se ejecutará si hay consentimiento
    onGranted: function (fn) {
      if (this.analytics) fn();
      else queue.push(fn);
    },
    revoke: function () {
      try { localStorage.removeItem(KEY); } catch (_) {}
      consent = null;
      location.reload();
    }
  };

  function grant() {
    while (queue.length) {
      try { queue.shift()(); } catch (_) {}
    }
  }

  /* --- Aviso ---------------------------------------------------------- */
  function decide(analytics) {
    write(analytics);
    consent = { version: VERSION, analytics: analytics, ts: Date.now() };
    if (analytics) grant(); else queue.length = 0;
    hide();
  }

  var banner = null;
  var lastFocus = null;

  function hide() {
    if (!banner) return;
    banner.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  var POLICY_URL = '/politica-de-cookies/';

  function build() {
    banner = document.createElement('aside');
    banner.className = 'cookie';
    banner.id = 'cookieBanner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'cookieTitle');
    banner.setAttribute('aria-describedby', 'cookieText');

    banner.innerHTML =
      '<p class="cookie__title" id="cookieTitle">Cookies</p>' +
      '<p class="cookie__text" id="cookieText">Utilizamos cookies propias y de terceros para analizar la navegación y mejorar nuestros servicios. ' +
      'Puedes aceptarlas, rechazar las no necesarias o consultar la ' +
      '<a href="' + POLICY_URL + '">política de cookies</a>.</p>' +
      '<div class="cookie__actions">' +
        '<button class="btn btn--primary" type="button" data-cookie="all">Aceptar</button>' +
        '<button class="btn btn--ghost" type="button" data-cookie="necessary">Rechazar</button>' +
      '</div>';

    document.body.appendChild(banner);

    banner.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-cookie]') : null;
      if (!btn) return;
      decide(btn.getAttribute('data-cookie') === 'all');
    });

    lastFocus = document.activeElement;
    var first = banner.querySelector('button');
    if (first) first.focus({ preventScroll: true });
  }

  /* --- Arranque ------------------------------------------------------- */
  function start() {
    if (!consent) build();
    else if (consent.analytics) grant();

    // Botón "cambiar preferencias" de la página de política
    var reset = document.getElementById('cookieReset');
    if (reset) reset.addEventListener('click', function () { window.eneidasConsent.revoke(); });

    // Texto de estado en la página de política
    var state = document.getElementById('cookieState');
    if (state) {
      state.textContent = !consent
        ? 'Todavía no has elegido en este navegador.'
        : (consent.analytics
            ? 'Aceptaste todas las cookies el ' + new Date(consent.ts).toLocaleDateString('es-ES') + '.'
            : 'Aceptaste solo las necesarias el ' + new Date(consent.ts).toLocaleDateString('es-ES') + '.');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
