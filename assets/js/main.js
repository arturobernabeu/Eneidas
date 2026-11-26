/* =====================================================================
   Centro de Psicología Eneidas — main.js
   1. Header sticky  2. Menú móvil  3. Smooth scroll  4. Scrollspy
   5. Reveal on scroll  6. Acordeones  7. Pestañas  8. Formulario  9. Año  10. Pila de fotos
   11. Psicóloga preferida
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

    /* Enlace directo a un área: /#ansiedad, /#trauma… abre esa pestaña.
       Las URLs de la web antigua (/ansiedad/…) redirigen aquí con una 301. */
    var abrirDesdeHash = function () {
      var area = window.location.hash.slice(1);
      var tab = area && document.getElementById('t-' + area);
      if (!tab || tabs.indexOf(tab) < 0) return;
      selectTab(tab, false);
      var seccion = document.getElementById('tratamientos');
      if (seccion) seccion.scrollIntoView({ behavior: 'auto', block: 'start' });
    };
    abrirDesdeHash();
    window.addEventListener('hashchange', abrirDesdeHash);
  }

  /* ---------------------------------------------------------------
     8. Formulario — validación en cliente
     --------------------------------------------------------------- */
  var form = document.getElementById('form');
  var formOk = document.getElementById('formOk');

  /* Solo la portada tiene formulario; las fichas cargan este mismo script. */
  if (form) {
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
      privacidad: {
        test: function (v, el) { return el.checked; },
        msg: 'Necesitamos tu consentimiento para gestionar la solicitud.'
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

      enviar();
    });

    /* --- Envío real a enviar.php --------------------------------------- */

    var cargado = Date.now();
    var boton = form.querySelector('button[type="submit"]');
    var etiquetaBoton = boton ? boton.innerHTML : '';

    function avisar(texto, esError) {
      formOk.textContent = texto;
      formOk.classList.toggle('form__ok--error', Boolean(esError));
      formOk.hidden = false;
      formOk.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }

    function enviar() {
      var campoTiempo = document.getElementById('tiempo');
      if (campoTiempo) campoTiempo.value = String(Date.now() - cargado);

      if (boton) {
        boton.disabled = true;
        boton.textContent = 'Enviando…';
      }
      formOk.hidden = true;

      fetch(form.getAttribute('action') || 'enviar.php', {
        method: 'POST',
        body: new FormData(form)
      })
        .then(function (r) {
          return r.json().catch(function () { return { ok: false }; });
        })
        .then(function (data) {
          if (data && data.ok) {
            avisar('Gracias por escribirnos. Hemos recibido tu solicitud y te responderemos muy pronto.', false);
            form.reset();
            cargado = Date.now();          // reinicia el contador de tiempo
          } else {
            avisar((data && data.error) ||
              'No hemos podido enviar tu solicitud. Escríbenos a eneidaspsicologia@gmail.com o llámanos al 614 18 88 45.', true);
          }
        })
        .catch(function () {
          avisar('No hemos podido conectar. Comprueba tu conexión o llámanos al 614 18 88 45.', true);
        })
        .then(function () {
          if (boton) {
            boton.disabled = false;
            boton.innerHTML = etiquetaBoton;
          }
        });
    }
  }

  /* ---------------------------------------------------------------
     9. Año dinámico en el footer
     --------------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------
     10. Carrusel del hero (canto rodado) — avance automático cada 6,5 s
     El avance lo da el final de la animación de la barra (CSS), así
     que pausar la animación pausa también el carrusel.
     --------------------------------------------------------------- */
  var pebble = document.getElementById('pebble');

  if (pebble) {
    var slides = pebble.querySelectorAll('.pebble__slide');
    var fill = document.getElementById('pebbleFill');
    var numEl = document.getElementById('pebbleNum');
    var pauseBtn = document.getElementById('pebblePause');
    var total = slides.length;
    var current = 0;
    var prevTimer = null;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };

    document.getElementById('pebbleTotal').textContent = pad(total);
    if (reduced) pebble.classList.add('is-static');

    function restartFill() {
      if (reduced) return;
      fill.classList.remove('is-running');
      void fill.offsetWidth;
      fill.classList.add('is-running');
    }

    function go(i) {
      i = (i + total) % total;
      if (i === current) return;
      var old = slides[current];
      clearTimeout(prevTimer);
      Array.prototype.forEach.call(slides, function (s) { s.classList.remove('is-prev'); });
      old.classList.remove('is-active');
      if (!reduced) {
        old.classList.add('is-prev');           // se queda debajo mientras entra la nueva
        prevTimer = setTimeout(function () { old.classList.remove('is-prev'); }, 1400);
      }
      current = i;
      slides[i].classList.add('is-active');
      Array.prototype.forEach.call(slides, function (s, k) {
        s.setAttribute('aria-hidden', k === current ? 'false' : 'true');
      });
      numEl.textContent = pad(current + 1);
      restartFill();
    }

    restartFill();
    fill.addEventListener('animationend', function (e) {
      if (e.animationName === 'pebble-fill') go(current + 1);
    });
    document.getElementById('pebbleNext').addEventListener('click', function () { go(current + 1); });
    document.getElementById('pebblePrev').addEventListener('click', function () { go(current - 1); });
    pebble.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(current - 1);
      else if (e.key === 'ArrowRight') go(current + 1);
    });

    /* Deslizar con el dedo */
    var frame = document.getElementById('pebbleFrame');
    var startX = null;
    frame.addEventListener('pointerdown', function (e) { startX = e.clientX; });
    frame.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
    });
    frame.addEventListener('pointercancel', function () { startX = null; });

    /* Pausa a petición (WCAG 2.2.2) */
    pauseBtn.addEventListener('click', function () {
      var paused = pebble.classList.toggle('is-paused');
      pauseBtn.setAttribute('aria-label', paused ? 'Reanudar carrusel' : 'Pausar carrusel');
      pauseBtn.querySelector('use').setAttribute('href', paused ? '#i-play' : '#i-pause');
    });

    /* Pausa automática: puntero encima, foco por teclado dentro o fuera de pantalla */
    var holds = { over: false, focus: false, away: false };
    function hold(key, on) {
      holds[key] = on;
      pebble.classList.toggle('is-hold', holds.over || holds.focus || holds.away);
    }
    pebble.addEventListener('mouseenter', function () { hold('over', true); });
    pebble.addEventListener('mouseleave', function () { hold('over', false); });
    pebble.addEventListener('focusin', function (e) {
      hold('focus', e.target.matches(':focus-visible'));   // un clic de ratón no cuenta
    });
    pebble.addEventListener('focusout', function () { hold('focus', false); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        hold('away', !entries[0].isIntersecting);
      }, { threshold: 0.3 }).observe(pebble);
    }

    /* Paralaje suave de la silueta de línea y la forma de fondo (solo con ratón) */
    var hero = document.getElementById('inicio');
    if (hero && !reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var raf = null;
      hero.addEventListener('pointermove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = hero.getBoundingClientRect();
          pebble.style.setProperty('--px', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
          pebble.style.setProperty('--py', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
        });
      });
      hero.addEventListener('pointerleave', function () {
        pebble.style.setProperty('--px', 0);
        pebble.style.setProperty('--py', 0);
      });
    }
  }

  /* ---------------------------------------------------------------
     11. Psicóloga preferida en el formulario
     Los botones «Solicitar cita» de cada ficha llegan con
     ?psicologa=slug: se deja elegida en el desplegable.
     --------------------------------------------------------------- */
  var selPsicologa = document.getElementById('psicologa');
  var desdeFicha = new URLSearchParams(window.location.search).get('psicologa');

  if (selPsicologa && desdeFicha) {
    var opt = selPsicologa.querySelector('option[data-slug="' + desdeFicha + '"]');
    if (opt) selPsicologa.value = opt.value;
  }

})();
