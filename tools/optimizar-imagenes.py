"""Optimiza las fotos de la web: reduce las demasiado grandes y crea su versión WebP.

Uso (desde la raíz del proyecto):   python tools/optimizar-imagenes.py
Requiere Pillow:                    python -m pip install pillow

- Fotos del hero (assets/img/hero/): ancho máximo 1120 px. El carrusel nunca
  se muestra a más de ~560 px, así que 1120 cubre pantallas de doble densidad.
- Fotos del equipo (assets/img/equipo/): ancho máximo 900 px.
- De cada JPG se genera un .webp al lado; el HTML lo sirve con <picture> y
  deja el JPG como respaldo para navegadores antiguos.

Es idempotente: se puede ejecutar de nuevo al añadir o cambiar fotos.
"""
import os
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CARPETAS = {
    os.path.join('assets', 'img', 'hero'): 1120,
    os.path.join('assets', 'img', 'equipo'): 900,
}
CALIDAD_JPG = 82
CALIDAD_WEBP = 80


def kb(ruta):
    return os.path.getsize(ruta) // 1024


for carpeta, ancho_max in CARPETAS.items():
    base = os.path.join(ROOT, carpeta)
    for nombre in sorted(os.listdir(base)):
        if not nombre.lower().endswith(('.jpg', '.jpeg')):
            continue
        ruta = os.path.join(base, nombre)
        antes = kb(ruta)
        with Image.open(ruta) as im:
            im = ImageOps.exif_transpose(im).convert('RGB')
            reducida = im.width > ancho_max
            if reducida:
                alto = round(im.height * ancho_max / im.width)
                im = im.resize((ancho_max, alto), Image.LANCZOS)
                im.save(ruta, 'JPEG', quality=CALIDAD_JPG, optimize=True, progressive=True)
            webp = os.path.splitext(ruta)[0] + '.webp'
            im.save(webp, 'WEBP', quality=CALIDAD_WEBP, method=6)
            print(f'{carpeta}/{nombre}: {im.width}×{im.height} · '
                  f'JPG {antes}→{kb(ruta)} KB{" (reducida)" if reducida else ""} · WebP {kb(webp)} KB')
