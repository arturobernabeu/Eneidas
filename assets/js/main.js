/* =====================================================================
   Centro de Psicología Eneidas — main.js
   1. Header sticky  2. Menú móvil  3. Smooth scroll  4. Scrollspy
   5. Reveal on scroll  6. Acordeones  7. Pestañas  8. Formulario  9. Año
   ===================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Espejo en JS de --t-med y --ease: las animaciones de alto no se pueden
     hacer con CSS puro sobre <details>, pero comparten el mismo vocabulario. */
  var MOTION_MS = 380;
  var MOTION_EASE = 'cubic-bezier(.22, .8, .3, 1)';

  /* ---------------------------------------------------------------
     1. Header sticky — compacta la cabecera al hacer scroll
     --------------------------------------------------------------- */
  var header = document.getElementById('header');

  function onScroll() {
    header.classList.toggle('is-stuck', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------
     2. Menú hamburguesa
     --------------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var overlay = document.getElementById('navOverlay');

  function openMenu() {
    nav.classList.add('is-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Cerrar menú');
    overlay.hidden = false;
    document.body.classList.add('is-locked');
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    overlay.hidden = true;
    document.body.classList.remove('is-locked');
  }

  burger.addEventListener('click', function () {
    nav.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      burger.focus();
    }
  });

  // Al volver a escritorio, reseteamos el estado del menú
  var desktop = window.matchMedia('(min-width: 981px)');
  var onBreakpoint = function (e) { if (e.matches) closeMenu(); };

  if (desktop.addEventListener) {
    desktop.addEventListener('change', onBreakpoint);
  } else if (desktop.addListener) {
    desktop.addListener(onBreakpoint); // Safari < 14
  }

  /* ---------------------------------------------------------------
     3. Smooth scroll — respeta la altura de la cabecera sticky
     --------------------------------------------------------------- */
  var links = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  Array.prototype.forEach.call(links, function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      if (nav.classList.contains('is-open')) closeMenu();

      var offset = header.offsetHeight + 16;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', '#' + id);
    });
  });

  /* ---------------------------------------------------------------
     4. Scrollspy — resalta el enlace de la sección visible
     --------------------------------------------------------------- */
  var navLinks = document.querySelectorAll('.nav__link');
  var sections = [];

  Array.prototype.forEach.call(navLinks, function (link) {
    var section = document.getElementById(link.getAttribute('href').slice(1));
    if (section) sections.push({ link: link, el: section });
  });

  function spy() {
    var pos = window.scrollY + header.offsetHeight + 120;
    var current = sections[0];

    sections.forEach(function (item) {
      if (item.el.offsetTop <= pos) current = item;
    });

    navLinks.forEach(function (l) { l.classList.remove('is-active'); });
    if (current) current.link.classList.add('is-active');
  }
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  /* ---------------------------------------------------------------
     5. Reveal on scroll — con escalonado por grupo
     --------------------------------------------------------------- */
  var revealables = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || reduced) {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        var siblings = Array.prototype.filter.call(
          el.parentElement.children,
          function (n) { return n.classList.contains('reveal'); }
        );
        el.style.setProperty('--d', (siblings.indexOf(el) * 90) + 'ms');
        el.classList.add('is-visible');
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(revealables, function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------
     6. Acordeones — uno abierto por grupo, con transición de alto

     <details> no admite transición de alto en CSS: el contenido no se renderiza
     mientras está cerrado. Interceptamos el clic del <summary> y animamos alto,
     padding y opacidad con Web Animations API, que sí funciona en todas partes
     (::details-content todavía no está en Safari ni Firefox).
     --------------------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('.accordion'), function (group) {
    var items = Array.prototype.slice.call(group.querySelectorAll('.acc'));

    items.forEach(function (item) {
      var head = item.querySelector('.acc__head');
      var body = item.querySelector('.acc__body');
      var anim = null;

      if (!head || !body) return;

      function height() { return body.getBoundingClientRect().height; }

      function slide(frames, closeAfter) {
        if (anim) anim.cancel();

        body.style.overflow = 'hidden';

        var run = body.animate(frames, {
          duration: MOTION_MS,
          easing: MOTION_EASE,
          fill: 'forwards'
        });

        anim = run;
        run.onfinish = function () {
          if (anim !== run) return;          // otro clic tomó el relevo
          if (closeAfter) item.open = false; // se cierra antes de soltar el fill
          run.cancel();
          body.style.overflow = '';
          anim = null;
        };
      }

      function expand() {
        item.open = true;                                  // renderiza para medir
        var pad = getComputedStyle(body).paddingBottom;
        slide([
          { height: '0px', paddingBottom: '0px', opacity: 0 },
          { height: height() + 'px', paddingBottom: pad, opacity: 1 }
        ], false);
      }

      function collapse() {
        if (!item.open) return;
        var pad = getComputedStyle(body).paddingBottom;
        slide([
          { height: height() + 'px', paddingBottom: pad, opacity: 1 },
          { height: '0px', paddingBottom: '0px', opacity: 0 }
        ], true);
      }

      item.collapse = collapse;

      head.addEventListener('click', function (e) {
        e.preventDefault();   // también cubre Enter/Space sobre el <summary>

        if (reduced) {
          var willOpen = !item.open;
          items.forEach(function (other) { if (other !== item) other.open = false; });
          item.open = willOpen;
          return;
        }

        if (item.open) {
          collapse();
        } else {
          items.forEach(function (other) {
            if (other !== item && other.collapse) other.collapse();
          });
          expand();
        }
      });
    });
  });

  /* ---------------------------------------------------------------
     7. Tratamientos — pestañas accesibles (patrón tablist/tab/tabpanel)
     --------------------------------------------------------------- */
  var tablist = document.querySelector('.treat__index');

  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('.treat__tab'));
    var stage = document.querySelector('.treat__stage');
    var stageAnim = null;

    var selectTab = function (tab, focus) {
      // Los paneles tienen alturas muy distintas (unos llevan lista de señales
      // y otros no): sin esto la caja daba un salto seco al cambiar.
      var fromH = stage ? stage.getBoundingClientRect().height : 0;

      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;

        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });

      if (stage && !reduced) {
        var toH = stage.getBoundingClientRect().height;

        if (Math.abs(toH - fromH) > 1) {
          if (stageAnim) stageAnim.cancel();
          stage.style.overflow = 'hidden';

          stageAnim = stage.animate(
            [{ height: fromH + 'px' }, { height: toH + 'px' }],
            { duration: 420, easing: MOTION_EASE }   // igual que panelIn
          );
          stageAnim.onfinish = function () {
            stage.style.overflow = '';
            stageAnim = null;
          };
        }
      }

      if (focus) tab.focus();

      // En móvil el índice es una tira horizontal: centramos la pestaña activa
      if (tablist.scrollWidth > tablist.clientWidth) {
        tab.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
      }
    };

    tablist.addEventListener('click', function (e) {
      var tab = e.target.closest ? e.target.closest('.treat__tab') : null;
      if (tab) selectTab(tab, false);
    });

    tablist.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;

      var next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];

      if (next) {
        e.preventDefault();
        selectTab(next, true);
      }
    });
  }

  /* ---------------------------------------------------------------
     8. Formulario — validación en cliente
     --------------------------------------------------------------- */
  var form = document.getElementById('form');
  var formOk = document.getElementById('formOk');

  var RULES = {
    nombre: {
      test: function (v) { return v.trim().length >= 2; },
      msg: 'Indícanos tu nombre.'
    },
    telefono: {
      test: function (v) { return /^[+\d][\d\s().-]{7,}$/.test(v.trim()); },
      msg: 'Introduce un teléfono válido.'
    },
    email: {
      test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      msg: 'Introduce un email válido.'
    },
    motivo: {
      test: function (v) { return v !== ''; },
      msg: 'Selecciona un motivo de consulta.'
    },
    privacidad: {
      test: function (v, el) { return el.checked; },
      msg: 'Debes aceptar la Política de Privacidad.'
    }
  };

  function showError(name, msg) {
    var slot = form.querySelector('[data-error-for="' + name + '"]');
    var field = document.getElementById(name).closest('.field');

    // Al ocultar conservamos el texto: se va con la transición en vez de
    // desaparecer de golpe mientras la fila todavía se está cerrando.
    if (slot && msg) (slot.firstElementChild || slot).textContent = msg;
    if (field) field.classList.toggle('has-error', Boolean(msg));
  }

  function validateField(name) {
    var el = document.getElementById(name);
    var rule = RULES[name];
    var ok = rule.test(el.value, el);
    showError(name, ok ? '' : rule.msg);
    return ok;
  }

  Object.keys(RULES).forEach(function (name) {
    var el = document.getElementById(name);
    el.addEventListener('blur', function () { validateField(name); });
    el.addEventListener('input', function () {
      if (el.closest('.field').classList.contains('has-error')) validateField(name);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Trampa antispam: si viene rellena es un bot. Fingimos éxito para no
    // darle pistas de por qué ha fallado, pero no se procesa nada.
    var trap = document.getElementById('web');
    if (trap && trap.value) {
      formOk.hidden = false;
      form.reset();
      return;
    }

    var valid = true;
    var firstBad = null;

    Object.keys(RULES).forEach(function (name) {
      if (!validateField(name)) {
        valid = false;
        if (!firstBad) firstBad = document.getElementById(name);
      }
    });

    if (!valid) {
      formOk.hidden = true;
      firstBad.focus();
      return;
    }

    // Punto de integración: aquí se conectaría el envío real
    // (fetch a un endpoint, Formspree, EmailJS, etc.)
    formOk.hidden = false;
    form.reset();
    formOk.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  });

  /* ---------------------------------------------------------------
     9. Año dinámico en el footer
     --------------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

})();
