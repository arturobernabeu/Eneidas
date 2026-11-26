/* ===============================================================
   Enlaces a carpetas al abrir la web desde disco (file://)
   ---------------------------------------------------------------
   Las páginas secundarias viven en carpetas (/aviso-legal/,
   /ana-fernandez-chaves/…) para tener URLs limpias. Un servidor
   resuelve la carpeta a su index.html, pero el navegador abriendo
   archivos locales muestra el listado del directorio.
   Solo en file:// se añade «index.html» a esos enlaces; en un
   servidor este script no hace nada.
   =============================================================== */
(function () {
  'use strict';
  if (location.protocol !== 'file:') return;

  var links = document.querySelectorAll('a[href]');
  for (var i = 0; i < links.length; i++) {
    var a = links[i];
    if (a.protocol !== 'file:') continue;
    if (a.pathname.slice(-1) === '/') {
      a.pathname = a.pathname + 'index.html';
    }
  }
})();
