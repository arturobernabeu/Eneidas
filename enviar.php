<?php
/* =====================================================================
   Endpoint del formulario de contacto — Centro de Psicología Eneidas

   Recibe el formulario por POST, lo valida en servidor y envía el correo.
   Devuelve JSON: {"ok":true} o {"ok":false,"error":"..."}.

   ─────────────────────────────────────────────────────────────────────
   ANTES DE SUBIRLO, revisa el bloque CONFIGURACIÓN.
   ─────────────────────────────────────────────────────────────────────

   Capas antispam, de más a menos silenciosa:
     1. Trampa (honeypot) revalidada en servidor, no solo en JavaScript
     2. Tiempo mínimo de cumplimentación
     3. Límite de envíos por IP
     4. Comprobación de origen de la petición

   Nada de esto añade fricción a la persona ni depende de terceros.
   ===================================================================== */

/* ------------------------------------------------------------------
   CONFIGURACIÓN
   ------------------------------------------------------------------ */

// A dónde llegan las solicitudes de cita.
$DESTINO = 'eneidaspsicologia@gmail.com';

// Remitente. DEBE ser una dirección del propio dominio: si se pone aquí el
// correo del visitante, el SPF del dominio falla y el mensaje acaba en spam.
// El correo del visitante va en Reply-To, que es donde corresponde.
$REMITENTE = 'web@eneidaspsicologia.com';
$REMITENTE_NOMBRE = 'Web Eneidas';

// Dominios desde los que se acepta el formulario.
$ORIGENES = ['eneidaspsicologia.com', 'www.eneidaspsicologia.com', 'localhost:5173'];

// Segundos mínimos entre cargar el formulario y enviarlo.
$TIEMPO_MINIMO = 3;

// Límite por IP: nº de envíos permitidos en la ventana indicada.
$LIMITE_ENVIOS = 5;
$LIMITE_VENTANA = 3600;   // segundos

// Carpeta para el control de frecuencia. En el directorio temporal del
// sistema, fuera de la raíz web: así no es accesible por HTTP.
$DIR_CONTROL = sys_get_temp_dir() . '/eneidas-rate';


/* ------------------------------------------------------------------
   RESPUESTA
   ------------------------------------------------------------------ */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function responder($ok, $codigo = 200, $error = null) {
    http_response_code($codigo);
    echo json_encode($error ? ['ok' => $ok, 'error' => $error] : ['ok' => $ok]);
    exit;
}

// A los bots les devolvemos éxito: si les dijéramos por qué han fallado,
// ajustarían el siguiente intento.
function fingir_exito() {
    responder(true);
}


/* ------------------------------------------------------------------
   1. Método y origen
   ------------------------------------------------------------------ */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(false, 405, 'Método no permitido.');
}

$origen = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
if ($origen !== '') {
    $host = parse_url($origen, PHP_URL_HOST);
    $puerto = parse_url($origen, PHP_URL_PORT);
    if ($puerto) { $host .= ':' . $puerto; }
    if (!in_array($host, $ORIGENES, true)) {
        fingir_exito();
    }
}


/* ------------------------------------------------------------------
   2. Trampa antispam

   Se revalida aquí aunque el JavaScript ya lo compruebe: un bot que haga
   POST directo a este fichero nunca ejecuta el JavaScript de la página.
   ------------------------------------------------------------------ */

if (trim($_POST['web'] ?? '') !== '') {
    fingir_exito();
}


/* ------------------------------------------------------------------
   3. Tiempo de cumplimentación

   Nadie rellena nombre, teléfono, email y motivo en menos de 3 segundos.
   ------------------------------------------------------------------ */

$transcurrido = (int) ($_POST['tiempo'] ?? 0);   // milisegundos
if ($transcurrido > 0 && $transcurrido < $TIEMPO_MINIMO * 1000) {
    fingir_exito();
}


/* ------------------------------------------------------------------
   4. Límite de envíos por IP
   ------------------------------------------------------------------ */

function ip_cliente() {
    // No se usan cabeceras tipo X-Forwarded-For: son falsificables y aquí
    // servirían para saltarse el límite.
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function limite_superado($dir, $limite, $ventana) {
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) {
        return false;   // sin control disponible, preferimos no bloquear
    }

    $fichero = $dir . '/' . hash('sha256', ip_cliente()) . '.json';
    $ahora = time();

    $marcas = [];
    if (is_readable($fichero)) {
        $marcas = json_decode((string) @file_get_contents($fichero), true) ?: [];
    }

    // Descarta lo que quede fuera de la ventana
    $marcas = array_values(array_filter($marcas, function ($t) use ($ahora, $ventana) {
        return is_int($t) && ($ahora - $t) < $ventana;
    }));

    if (count($marcas) >= $limite) {
        return true;
    }

    $marcas[] = $ahora;
    @file_put_contents($fichero, json_encode($marcas), LOCK_EX);
    return false;
}

if (limite_superado($DIR_CONTROL, $LIMITE_ENVIOS, $LIMITE_VENTANA)) {
    responder(false, 429, 'Has enviado varias solicitudes seguidas. Inténtalo de nuevo dentro de un rato o llámanos al 614 18 88 45.');
}


/* ------------------------------------------------------------------
   5. Validación de los campos
   ------------------------------------------------------------------ */

function limpiar($valor, $max) {
    $v = is_string($valor) ? $valor : '';
    $v = str_replace(["\0"], '', $v);
    $v = trim($v);
    return mb_substr($v, 0, $max);
}

// Quita saltos de línea: usados en una cabecera permitirían inyectar otras
// (Bcc, Reply-To...) y convertir el formulario en un relé de spam.
function sin_saltos($valor) {
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $valor));
}

$nombre   = limpiar($_POST['nombre']   ?? '', 100);
$telefono = limpiar($_POST['telefono'] ?? '', 30);
$email    = limpiar($_POST['email']    ?? '', 150);
$motivo   = limpiar($_POST['motivo']   ?? '', 60);
$mensaje  = limpiar($_POST['mensaje']  ?? '', 3000);
$acepta   = isset($_POST['privacidad']) && $_POST['privacidad'] !== '';

$errores = [];

if (mb_strlen($nombre) < 2) {
    $errores[] = 'Indícanos tu nombre.';
}
if (!preg_match('/^[+\d][\d\s().-]{7,}$/', $telefono)) {
    $errores[] = 'Introduce un teléfono válido.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores[] = 'Introduce un email válido.';
}

$MOTIVOS = ['Terapia individual', 'Terapia de pareja', 'Terapia de familia', 'Terapia de grupo', 'Otra consulta'];
if (!in_array($motivo, $MOTIVOS, true)) {
    $errores[] = 'Selecciona un motivo de consulta.';
}
if (!$acepta) {
    $errores[] = 'Debes aceptar la Política de Privacidad.';
}

if ($errores) {
    responder(false, 422, implode(' ', $errores));
}


/* ------------------------------------------------------------------
   6. Envío
   ------------------------------------------------------------------ */

$asunto = sin_saltos('Solicitud de cita: ' . $motivo);

$cuerpo = "Nueva solicitud desde el formulario de la web.\n\n"
        . "Nombre:   {$nombre}\n"
        . "Teléfono: {$telefono}\n"
        . "Email:    {$email}\n"
        . "Motivo:   {$motivo}\n\n"
        . "Mensaje:\n"
        . ($mensaje !== '' ? $mensaje : '(sin mensaje)') . "\n\n"
        . "---\n"
        . 'Recibido: ' . date('d/m/Y H:i') . "\n";

$cabeceras = [
    'From: ' . sin_saltos($REMITENTE_NOMBRE) . ' <' . sin_saltos($REMITENTE) . '>',
    'Reply-To: ' . sin_saltos($nombre) . ' <' . sin_saltos($email) . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'MIME-Version: 1.0',
    'X-Mailer: PHP/' . phpversion(),
];

$enviado = @mail(
    $DESTINO,
    '=?UTF-8?B?' . base64_encode($asunto) . '?=',
    $cuerpo,
    implode("\r\n", $cabeceras),
    '-f' . $REMITENTE
);

if (!$enviado) {
    error_log('[eneidas] mail() falló para ' . $email);
    responder(false, 500, 'No hemos podido enviar tu solicitud. Escríbenos a eneidaspsicologia@gmail.com o llámanos al 614 18 88 45.');
}

responder(true);
