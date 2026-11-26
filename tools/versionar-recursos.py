"""Añade a cada enlace a CSS y JS una huella de su contenido (?v=…).

Uso (desde la raíz del proyecto):   python tools/versionar-recursos.py
(tools/generar-fichas.py lo ejecuta al terminar, así que normalmente no
hace falta lanzarlo a mano.)

Los navegadores guardan style.css y main.js en caché. Si cambian pero la
URL no, quien ya visitó la web puede seguir viendo la versión antigua.
La huella cambia solo cuando cambia el archivo: tras editar CSS o JS,
basta con volver a ejecutar este script antes de publicar.

Es idempotente: si nada ha cambiado, los HTML quedan igual.
"""
import glob, hashlib, io, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Rutas a assets/css/*.css y assets/js/*.js, relativas (../), absolutas (/) o
# desde la raíz, con o sin una huella anterior.
PATRON = re.compile(r'((?:\.\./|/)?(assets/(?:css|js)/[\w.-]+\.(?:css|js)))(?:\?v=[0-9a-f]+)?"')

_huellas = {}

def huella(rel):
    if rel not in _huellas:
        with open(os.path.join(ROOT, rel), 'rb') as f:
            _huellas[rel] = hashlib.sha256(f.read()).hexdigest()[:8]
    return _huellas[rel]


def versionar():
    paginas = glob.glob(os.path.join(ROOT, '*.html')) + glob.glob(os.path.join(ROOT, 'equipo', '*.html'))
    for ruta in sorted(paginas):
        texto = io.open(ruta, encoding='utf-8', newline='').read()
        nuevo = PATRON.sub(lambda m: f'{m.group(1)}?v={huella(m.group(2))}"', texto)
        if nuevo != texto:
            io.open(ruta, 'w', encoding='utf-8', newline='').write(nuevo)
            print('versionado', os.path.relpath(ruta, ROOT))


if __name__ == '__main__':
    versionar()
