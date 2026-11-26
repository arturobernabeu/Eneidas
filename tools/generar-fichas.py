"""Genera las fichas del equipo en equipo/<slug>.html.

Uso (desde la raíz del proyecto):   python tools/generar-fichas.py

Para cambiar el contenido de una ficha, edita su entrada en la lista P y
vuelve a ejecutar el script: sobrescribe los cinco archivos de equipo/.
La cabecera, el pie y el sprite de iconos se copian de index.html, así que
cualquier cambio en el menú o el pie de la portada llega a las fichas al
regenerarlas. No edites a mano los HTML de equipo/: se perderían los cambios.

Todo el texto procede de las biografías originales («Sobre mí» de la web
antigua) o de la propia landing (descripciones de los enfoques). Lo que no
consta en ninguna fuente se marca como PENDIENTE en la página.
"""
import io, os, re, urllib.parse, html as H

# Raíz del proyecto: la carpeta que contiene tools/
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
idx = io.open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read().replace('\r\n', '\n')
BASE = 'https://www.eneidaspsicologia.com/'
TEL = '34614188845'

# --------------------------------------------------------------- piezas comunes
def cut(start, end):
    a = idx.index(start)
    b = idx.index(end, a) + len(end)
    return idx[a:b]

def to_home(h):
    h = h.replace('href="#inicio"', 'href="index.html"')
    # Solo enlaces <a>; los iconos <use href="#i-…"> apuntan al sprite de la página
    return re.sub(r'(<a\b[^>]*?)href="#([\w-]+)"', r'\1href="index.html#\2"', h)

HEADER = to_home(cut('<header class="header" id="header">', '<div class="nav-overlay" id="navOverlay" hidden></div>'))
FOOTER = cut('<footer class="footer">', '</footer>').replace('class="footer__top" href="#inicio"', 'class="footer__top" href="#main"')
FOOTER = to_home(FOOTER).replace('href="index.html#main"', 'href="#main"')
SPRITE = cut('<svg class="sprite"', '</svg>')

def strip(t):
    return H.unescape(re.sub(r'<[^>]+>', '', t)).strip()

def method_text(title):
    """Primera frase descriptiva de cada enfoque, tal como figura en la landing."""
    m = re.search(r'<span class="acc__title">%s</span>.*?<div class="acc__body">\s*<p>(.*?)</p>' % re.escape(title), idx, re.S)
    return strip(m.group(1))

MINDFUL = strip(re.search(r'id="p-mindfulness".*?<p class="treat__text">(.*?)</p>', idx, re.S).group(1))

METHODS = {
    'cc':   ('Terapia cognitivo-conductual', method_text('Terapia cognitivo-conductual'), 'index.html#metodologia'),
    'psd':  ('Psicodrama', method_text('Psicodrama'), 'index.html#metodologia'),
    'sis':  ('Terapia sistémica', method_text('Terapia sistémica'), 'index.html#metodologia'),
    'emdr': ('Terapia EMDR', method_text('Terapia EMDR'), 'index.html#metodologia'),
    'mind': ('Mindfulness', MINDFUL, 'index.html#tratamientos'),
}

# --------------------------------------------------------------- datos
# Cada bloque de texto es literal de la biografía original; solo se ha
# repartido entre los apartados de la ficha.
P = [
 dict(slug='alicia-rodriguez-aguilar', first='Alicia', name='Alicia Rodríguez Aguilar', img='alicia', col='AN09190',
  chips=['Cognitivo-conductual', 'EMDR', 'Mindfulness', 'Psicodrama'],
  desc='terapia individual y de pareja con adultos. Enfoque cognitivo-conductual con EMDR, mindfulness y psicodrama.',
  intro=['Trabajo integrando distintas corrientes psicológicas, partiendo de un enfoque <strong>cognitivo-conductual</strong>, empleando <strong>EMDR</strong>, <strong>Mindfulness</strong> y <strong>Psicodrama</strong>. El objetivo es poder ofrecer una intervención completa y adaptada a las necesidades personales.'],
  formacion=[('Psicóloga Sanitaria', 'Nº de colegiada AN09190')],
  formacion_pend='titulación universitaria, másteres y formación complementaria (EMDR, mindfulness, psicodrama).',
  experiencia=['Realizo terapia individual y de pareja, con adultos.'],
  experiencia_pend='trayectoria profesional y años de experiencia.',
  especialidades=[], especialidades_pend='áreas o problemáticas en las que está especializada.',
  metodos=['cc', 'emdr', 'mind', 'psd'],
  metodo_txt=['Las sesiones son de cincuenta minutos de duración. Existe la opción de tener una primera cita gratuita de media hora de duración, para que el paciente pueda plantear una visión general de los temas que le preocupan.',
              'La asistencia puede ser presencial y online, aunque siempre recomiendo la primera opción por su riqueza.'],
  facts=[('Atiende a', 'Adultos'), ('Tipo de terapia', 'Individual y de pareja'), ('Modalidad', 'Presencial y online'),
         ('Duración de la sesión', '50 minutos'), ('Primera cita', 'Gratuita, de media hora')]),

 dict(slug='ana-fernandez-chaves', first='Ana', name='Ana Fernández Chaves', img='ana', col='AN07176',
  chips=['Terapia sistémica', 'Psicodrama', 'EMDR', 'Terapia familiar'],
  desc='terapia individual, de pareja y familiar. Psicoterapeuta familiar (FEATF), orientación sistémica y psicodrama.',
  intro=['Cuando me siento delante de un paciente soy consciente de que tengo delante una persona que pide algo tan básico como ayuda, que tiene alguna pieza por dentro con necesidad de reparar. A veces es difícil encontrar esa pieza, otras salta a la vista, pero trato de actuar siempre desde el profundo respeto que siento hacia el valiente que se pone a trabajar desnudando su alma.',
         'Soy afortunada de decir que para mí se cumple el dicho de Confucio:'],
  quote=('Elige un trabajo que te guste y no tendrás que trabajar ni un día de tu vida.', 'Confucio'),
  formacion=[('Psicóloga Sanitaria', 'Nº de colegiada AN07176'),
             ('Psicoterapeuta Familiar', 'Acreditada por la FEATF'),
             ('Experta en Intervención Sistémica', ''),
             ('Experta en Psicoterapia Dinámica', ''),
             ('Experta en Trastornos Psicosomáticos', ''),
             ('Psicoterapeuta EMDR', '')],
  formacion_pend='titulación universitaria y centros donde se cursó cada formación.',
  experiencia=['Tengo experiencia profesional en Terapia Individual, de Parejas y Terapia Familiar.'],
  experiencia_pend='trayectoria profesional y años de experiencia.',
  especialidades=['Terapia familiar', 'Terapia de pareja', 'Intervención sistémica', 'Psicoterapia dinámica', 'Trastornos psicosomáticos', 'EMDR'],
  metodos=['sis', 'psd', 'emdr'],
  metodo_txt=['Mi manera de trabajar se basa en dos corrientes principales. Una es la <strong>Orientación Sistémica</strong>, es decir, la dimensión relacional del comportamiento del individuo, que engloba tanto la relación con sí mismo, como con su entorno, su ambiente, familia, etc. La otra “pata” de mi trabajo es el <strong>Psicodrama</strong>, en las sesiones trabajo a través del poder del lenguaje no verbal y como vehículo de comunicación, donde los ejercicios vivenciales permiten que seas tú el que descubras lo que te ocurre y las posibles soluciones.'],
  facts=[('Tipo de terapia', 'Individual, de pareja y familiar'), ('Orientación', 'Sistémica y psicodrama'), ('Acreditación', 'Psicoterapeuta Familiar (FEATF)')]),

 dict(slug='berta-bejarano-garcia', first='Berta', name='Berta Bejarano García', img='berta', col='AN06100',
  chips=['Cognitivo-conductual', 'Adolescentes', 'Adultos'],
  desc='enfoque cognitivo-conductual y amplia experiencia en terapia con adolescentes y adultos.',
  intro=['Tengo como objetivo ayudarte a resolver aquello que te hace sentir mal, en el menor tiempo posible, en un espacio de confianza y seguridad, donde puedas sentirte cómodo/a y escuchado/a.',
         'Trabajaremos juntos, las dificultades que te han llevado a pedir ayuda y te ofreceré un punto de vista profesional y diferente.'],
  formacion=[('Psicóloga Sanitaria', 'Nº de colegiada AN06100'),
             ('Formación cognitivo-conductual', '')],
  formacion_pend='titulación universitaria, másteres y formación complementaria.',
  experiencia=['Tengo una formación <strong>cognitiva-conductual</strong> y una amplia experiencia en terapia con adolescentes y adultos.',
               'Mi desarrollo profesional se ha realizado principalmente con personas con trastornos de personalidad, psicosis, problemática asociada a las adicciones, ansiedad, depresión, dependencia emocional, baja autoestima, etc.'],
  experiencia_pend='años de experiencia y centros o servicios en los que ha trabajado.',
  especialidades=['Trastornos de personalidad', 'Psicosis', 'Adicciones', 'Ansiedad', 'Depresión', 'Dependencia emocional', 'Baja autoestima'],
  metodos=['cc'],
  metodo_txt=['Las sesiones duran 50 minutos. Ofrecemos la posibilidad de concertar una cita de media hora, gratuita, para una primera toma de contacto y puedas contarme el motivo de tu consulta.'],
  facts=[('Atiende a', 'Adolescentes y adultos'), ('Duración de la sesión', '50 minutos'), ('Primera cita', 'Gratuita, de media hora')]),

 dict(slug='pilar-naranjo-gonzalez-quevedo', first='Pilar', name='Pilar Naranjo González-Quevedo', img='pilar', col='AN07736',
  chips=['Cognitivo-conductual', 'Psicodrama', 'EMDR', 'Psicooncología'],
  desc='especializada en psicooncología. Enfoque cognitivo-conductual con psicodrama y EMDR.',
  intro=['Atiendo a adultos, adolescentes, familias y parejas, siendo las sesiones de forma presencial u online.'],
  intro_pend='una presentación personal breve (por qué se dedica a la psicología, cómo acompaña a sus pacientes).',
  formacion=[('Psicóloga Sanitaria', 'Nº de colegiada AN07736'),
             ('Formación cognitivo-conductual', ''),
             ('Especialización en Psicooncología', '')],
  formacion_pend='titulación universitaria, másteres y formación en psicodrama y EMDR.',
  experiencia=['Además, estoy especializada en <strong>Psicooncología</strong>, ofreciendo atención en esta área tanto a la persona enferma como al entorno social cercano.'],
  experiencia_pend='trayectoria profesional y años de experiencia.',
  especialidades=['Psicooncología', 'Atención a la persona enferma y a su entorno cercano'],
  metodos=['cc', 'psd', 'emdr'],
  metodo_txt=['Me formé desde la corriente <strong>Cognitivo Conductual</strong>, aunque integro herramientas y metodología de otras corrientes como por ejemplo el <strong>Psicodrama</strong> o el <strong>EMDR</strong>, ya que considero que ayuda a expresar de alguna manera aquello que nos cuesta decir o aquello de lo que no somos del todo conscientes así como a superar traumas pasados que nos influyen en la actualidad.'],
  facts=[('Atiende a', 'Adultos, adolescentes, familias y parejas'), ('Especialidad', 'Psicooncología'), ('Modalidad', 'Presencial u online')]),

 dict(slug='carmen-nunez-benitez', first='Carmen', name='Carmen Núñez Benítez', img='carmen', col='AN10799',
  chips=['Cognitivo-conductual', 'Psicodrama', 'Habilidades sociales', 'Bienestar emocional'],
  desc='experta en habilidades sociales y bienestar emocional. Enfoque cognitivo-conductual y psicodrama.',
  intro=['Durante estos años me hice consciente de mi capacidad de empatía y escucha y de mis ganas de querer mejorar la vida de las personas, por lo que seguí formándome en el ámbito de la Intervención. Es muy satisfactorio poder ayudar a aquellas personas que en algún momento de su vida necesitan la mano de un psicólogo para encontrar su camino hacia el bienestar.'],
  formacion=[('Psicóloga Sanitaria', 'Nº de colegiada AN10799'),
             ('Técnico de Prevención de Riesgos Laborales', 'Especialidad en la rama psicosocial'),
             ('Experta en Habilidades Sociales e Intervención para la mejora del Bienestar Emocional', '')],
  formacion_pend='titulación universitaria y másteres.',
  experiencia=['Siempre supe que lo mío era ayudar a las personas. Gran parte de mi carrera profesional la he desarrollado desde el propio corazón de las empresas como Psicóloga y Técnico de Prevención de Riesgos Laborales, especializándome en la rama psicosocial y en la impartición de formación para la adquisición de habilidades tanto para el ámbito laboral como para el ámbito personal.',
               'Realizo terapia individual con adultos y adolescentes.'],
  especialidades=['Habilidades sociales', 'Intervención para la mejora del bienestar emocional', 'Rama psicosocial de la prevención de riesgos laborales'],
  metodos=['cc', 'psd'],
  metodo_txt=['Trabajo integrando distintas corrientes psicológicas partiendo de un enfoque <strong>cognitivo conductual</strong> y empleando herramientas de <strong>psicodrama</strong>.',
              'Las sesiones son de 50 minutos de duración, presenciales u online. Ofrecemos la posibilidad de concertar una cita de media hora gratuita, para tener una primera toma de contacto y que puedas contarme tu caso.'],
  facts=[('Atiende a', 'Adultos y adolescentes'), ('Tipo de terapia', 'Individual'), ('Modalidad', 'Presencial u online'),
         ('Duración de la sesión', '50 minutos'), ('Primera cita', 'Gratuita, de media hora')]),
]

# --------------------------------------------------------------- plantilla
I = '        '

def wa(p):
    return f'https://wa.me/{TEL}?text=' + urllib.parse.quote('Hola, me gustaría pedir cita con %s.' % p['name'], safe='')

def pending(text):
    return (I + '<p class="profile__pending"><strong>Pendiente de completar:</strong> ' + text + '</p>')

def paras(items):
    return '\n'.join(I + f'<p>{t}</p>' for t in items)

def section(num, sid, title, inner):
    return f'''      <section class="profile__section" id="{sid}" aria-labelledby="{sid}-t">
        <p class="profile__num">{num:02d}</p>
        <h2 class="profile__h" id="{sid}-t">{title}</h2>
{inner}
      </section>'''

def cita(p):
    """Enlace a la solicitud de cita con la psicóloga ya elegida en el formulario."""
    return f"index.html?psicologa={p['slug']}#contacto"

def card(o, home=False):
    """Tarjeta de psicóloga (foto + nombre), igual en la portada y en «resto del equipo».
    Foto y nombre enlazan a la ficha; la foto queda fuera del tabulador para no
    repetir el mismo enlace dos veces."""
    ficha = f"equipo/{o['slug']}.html" if home else f"{o['slug']}.html"
    nombre = o['name'].replace('-', '&#8209;')   # guion que no parte «González-Quevedo»
    return f"""      <article class="member reveal">
        <a class="member__link" href="{ficha}" tabindex="-1" aria-hidden="true"><div class="member__photo"><picture><source srcset="assets/img/equipo/{o['img']}.webp" type="image/webp"><img src="assets/img/equipo/{o['img']}.jpg" alt="{o['name']}, psicóloga" width="400" height="480" loading="lazy" decoding="async"></picture></div></a>
        <h3 class="member__name"><a href="{ficha}">{nombre}</a></h3>
      </article>"""

def page(p):
    # Google corta el título hacia los 60 caracteres y la descripción hacia los 155
    title = f"{p['name']}, psicóloga en Sevilla | Eneidas"
    desc = f"{p['name']}, psicóloga en Sevilla: {p['desc']}"
    url = BASE + 'equipo/' + p['slug'] + '.html'
    chips = '\n'.join(f'        <li>{c}</li>' for c in p['chips'])

    # 01 Presentación
    inner = paras(p['intro'])
    if p.get('quote'):
        inner += '\n' + I + f'<blockquote class="profile__quote">“{p["quote"][0]}”<cite>{p["quote"][1]}</cite></blockquote>'
    if p.get('intro_pend'):
        inner += '\n' + pending(p['intro_pend'])
    secs = [('presentacion', 'Presentación profesional', inner)]

    # 02 Formación
    items = '\n'.join(I + '  <li class="timeline__item"><span class="timeline__title">%s</span>%s</li>'
                      % (t, f'<span class="timeline__meta">{m}</span>' if m else '') for t, m in p['formacion'])
    inner = I + '<ol class="timeline">\n' + items + '\n' + I + '</ol>'
    if p.get('formacion_pend'):
        inner += '\n' + pending(p['formacion_pend'])
    secs.append(('formacion', 'Formación', inner))

    # 03 Experiencia
    inner = paras(p['experiencia'])
    if p.get('experiencia_pend'):
        inner += '\n' + pending(p['experiencia_pend'])
    secs.append(('experiencia', 'Experiencia', inner))

    # 04 Especialidades
    if p['especialidades']:
        inner = I + '<ul class="specs">\n' + '\n'.join(I + f'  <li>{e}</li>' for e in p['especialidades']) + '\n' + I + '</ul>'
    else:
        inner = ''
    if p.get('especialidades_pend'):
        inner += ('\n' if inner else '') + pending(p['especialidades_pend'])
    secs.append(('especialidades', 'Especialidades', inner))

    # 05 Metodología
    cards = '\n'.join(f'''{I}  <li class="approach">
{I}    <h3 class="approach__title">{METHODS[k][0]}</h3>
{I}    <p class="approach__text">{METHODS[k][1]}</p>
{I}    <a class="approach__link" href="{METHODS[k][2]}">Saber más <svg class="ico" aria-hidden="true"><use href="#i-arrow"></use></svg></a>
{I}  </li>''' for k in p['metodos'])
    inner = paras(p['metodo_txt']) + '\n' + I + '<ul class="approaches">\n' + cards + '\n' + I + '</ul>'
    secs.append(('metodologia', 'Metodología de trabajo', inner))

    body = '\n\n'.join(section(i + 1, sid, t, inner) for i, (sid, t, inner) in enumerate(secs))
    toc = '\n'.join(f'        <li><a href="#{sid}">{t}</a></li>' for sid, t, _ in secs)
    facts = '\n'.join(f'          <div><dt>{k}</dt><dd>{v}</dd></div>'
                      for k, v in [('Titulación', 'Psicóloga Sanitaria'), ('Nº de colegiada', p['col'])] + p['facts'])
    others = '\n'.join(card(o) for o in P if o is not p)
    knows = ', '.join('"%s"' % c for c in p['chips'])

    return f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#16333F">
<link rel="canonical" href="{url}">

<meta property="og:type" content="profile">
<meta property="og:site_name" content="Centro de Psicología Eneidas">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{p['name']} | Centro de Psicología Eneidas">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{BASE}assets/img/equipo/{p['img']}.jpg">
<meta property="og:locale" content="es_ES">
<meta name="twitter:card" content="summary">

<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" href="assets/icons/favicon-32.png" sizes="32x32">
<link rel="icon" href="assets/icons/favicon-192.png" sizes="192x192">
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">

<link rel="preload" as="image" href="assets/img/equipo/{p['img']}.webp" type="image/webp" fetchpriority="high">
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/montserrat-variable.woff2" crossorigin>
<link rel="stylesheet" href="assets/css/style.css">

<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@graph": [
    {{
      "@type": "Person",
      "@id": "{url}#persona",
      "name": "{p['name']}",
      "jobTitle": "Psicóloga Sanitaria",
      "url": "{url}",
      "image": "{BASE}assets/img/equipo/{p['img']}.jpg",
      "knowsAbout": [{knows}],
      "hasCredential": {{ "@type": "EducationalOccupationalCredential", "credentialCategory": "Colegiación", "identifier": "{p['col']}" }},
      "worksFor": {{ "@id": "{BASE}#centro" }}
    }},
    {{
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{ "@type": "ListItem", "position": 1, "name": "Inicio", "item": "{BASE}" }},
        {{ "@type": "ListItem", "position": 2, "name": "Equipo", "item": "{BASE}#equipo" }},
        {{ "@type": "ListItem", "position": 3, "name": "{p['name']}", "item": "{url}" }}
      ]
    }}
  ]
}}
</script>
</head>
<body class="page-profile">

<a class="skip-link" href="#main">Saltar al contenido</a>

<!-- ===================== HEADER ===================== -->
{HEADER}
<main id="main">

<!-- ===================== CABECERA DE LA FICHA ===================== -->
<section class="profile-hero">
  <div class="wrap profile-hero__inner">
    <figure class="profile__photo">
      <!-- PENDIENTE: fotografía actualizada (vertical 4:5, mínimo 900×1125 px) -->
      <picture><source srcset="assets/img/equipo/{p['img']}.webp" type="image/webp"><img src="assets/img/equipo/{p['img']}.jpg" alt="Retrato de {p['name']}" width="400" height="480" fetchpriority="high" decoding="async"></picture>
    </figure>
    <div class="profile__intro">
      <a class="profile__back" href="index.html#equipo"><svg class="ico" aria-hidden="true"><use href="#i-arrow"></use></svg> Volver al equipo</a>
      <p class="eyebrow"><span class="eyebrow__line"></span> Equipo Eneidas</p>
      <h1 class="profile__name">{p['name']}</h1>
      <p class="profile__role">Psicóloga Sanitaria <span class="profile__badge">Nº Colegiada {p['col']}</span></p>
      <ul class="profile__chips" aria-label="Enfoques y áreas de trabajo">
{chips}
      </ul>
      <div class="profile__actions">
        <a class="btn btn--primary btn--lg" href="{cita(p)}">Solicitar cita con {p['first']} <svg class="ico" aria-hidden="true"><use href="#i-arrow"></use></svg></a>
        <a class="btn btn--ghost btn--lg" href="{wa(p)}" target="_blank" rel="noopener"><svg class="ico" aria-hidden="true"><use href="#i-whatsapp"></use></svg> Escríbenos por WhatsApp</a>
      </div>
    </div>
  </div>
</section>

<!-- ===================== ÍNDICE DE LA FICHA ===================== -->
<nav class="profile-toc" aria-label="Apartados de la ficha">
  <div class="wrap">
    <ul class="profile-toc__list">
{toc}
    </ul>
  </div>
</nav>

<!-- ===================== CONTENIDO ===================== -->
<div class="section profile-body">
  <div class="wrap profile-body__inner">
    <div class="profile__content">

{body}

    </div>
    <aside class="profile__card" aria-labelledby="ficha-titulo">
      <h2 id="ficha-titulo">En consulta</h2>
      <a class="btn btn--primary btn--block" href="{cita(p)}">Solicitar cita <svg class="ico" aria-hidden="true"><use href="#i-arrow"></use></svg></a>
      <a class="profile__card-wa" href="{wa(p)}" target="_blank" rel="noopener"><svg class="ico" aria-hidden="true"><use href="#i-whatsapp"></use></svg> o escríbenos por WhatsApp</a>
      <dl class="profile__facts">
{facts}
      </dl>
    </aside>
  </div>
</div>

<!-- ===================== LLAMADA FINAL ===================== -->
<section class="profile-cta">
  <div class="wrap">
    <h2 class="section__title">¿Quieres empezar con {p['first']}?</h2>
    <p class="section__lead">Cuéntanos qué te ocurre y te orientaremos sin compromiso.</p>
    <div class="profile__actions">
      <a class="btn btn--primary btn--lg" href="{cita(p)}">Solicitar cita <svg class="ico" aria-hidden="true"><use href="#i-arrow"></use></svg></a>
      <a class="btn btn--ghost btn--lg" href="tel:+{TEL}"><svg class="ico" aria-hidden="true"><use href="#i-phone"></use></svg> 614 18 88 45</a>
    </div>
  </div>
</section>

<!-- ===================== RESTO DEL EQUIPO ===================== -->
<section class="section section--ink">
  <div class="wrap">
    <header class="section__head">
      <p class="eyebrow eyebrow--light"><span class="eyebrow__line"></span> Equipo</p>
      <h2 class="section__title">Conoce al resto del equipo</h2>
    </header>
    <div class="team">
{others}
    </div>
  </div>
</section>

</main>

<!-- ===================== FOOTER ===================== -->
{FOOTER}

<!-- ===================== WHATSAPP FLOTANTE ===================== -->
<a class="whatsapp-float" href="{wa(p)}" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp" data-tip="WhatsApp"><svg class="ico" aria-hidden="true"><use href="#i-whatsapp"></use></svg></a>

<!-- ===================== BARRA DE CITA (MÓVIL) ===================== -->
<div class="profile-bar">
  <a class="btn btn--primary profile-bar__cta" href="{cita(p)}">Solicitar cita con {p['first']}</a>
</div>

<!-- ===================== SPRITE SVG ===================== -->
{SPRITE}
<script src="assets/js/main.js" defer></script>
<script src="assets/js/enlaces-locales.js" defer></script>
<script src="assets/js/cookies.js" defer></script>
<script src="assets/js/analytics.js" defer></script>
</body>
</html>
'''

def up(h):
    # Las fichas viven en /equipo/: lo que apunta a la raíz sube un nivel
    return re.sub(r'\b(href|src|srcset)="((?:assets/|favicon\.ico|index\.html|aviso-legal/|politica-de-[\w-]+/)[^"]*)"', r'\1="../\2"', h)

INI, FIN = '<!-- equipo:tarjetas -->', '<!-- /equipo:tarjetas -->'

def actualizar_portada():
    """Reescribe las tarjetas del equipo en index.html, entre las marcas INI y FIN."""
    ruta = os.path.join(ROOT, 'index.html')
    raw = io.open(ruta, encoding='utf-8', newline='').read()
    nl = '\r\n' if '\r\n' in raw else '\n'
    a, b = raw.index(INI) + len(INI), raw.index(FIN)
    bloque = '\n' + '\n'.join(card(p, home=True) for p in P) + '\n      '
    io.open(ruta, 'w', encoding='utf-8', newline='').write(raw[:a] + bloque.replace('\n', nl) + raw[b:])
    print('ok index.html (tarjetas del equipo)')

if __name__ == '__main__':
    actualizar_portada()
    os.makedirs(os.path.join(ROOT, 'equipo'), exist_ok=True)
    for p in P:
        io.open(os.path.join(ROOT, 'equipo', p['slug'] + '.html'), 'w', encoding='utf-8', newline='\n').write(up(page(p)))
        print('ok', 'equipo/' + p['slug'] + '.html')
