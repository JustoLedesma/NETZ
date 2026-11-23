<?php
header('Content-Type: text/plain; charset=utf-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

const MAIL_TO        = 'justo.ledesma91@gmail.com';
const MAIL_FROM      = 'info@netz.com.py';
const MAIL_FROM_NAME = 'Formulario Web NETZ';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(403);
    echo "Hubo un problema con su envío, por favor intente nuevamente.";
    exit;
}

// Sanitizar y obtener los campos del formulario
$name    = strip_tags(trim($_POST["name"] ?? ''));
$name    = str_replace(["\r", "\n"], [" ", " "], $name);
$phone   = strip_tags(trim($_POST["phone"] ?? ''));
$phone   = str_replace(["\r", "\n"], [" ", " "], $phone);
$email   = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
$message = trim($_POST["message"] ?? '');

// Validar todos los campos obligatorios
if (empty($name) || empty($phone) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Por favor complete todos los campos requeridos (Nombre, Teléfono, Correo válido y Mensaje).";
    exit;
}

// Credenciales SMTP privadas (fuera de git): conexion/smtp-credentials.php
// Debe retornar: ['host' => 'mail.netz.com.py', 'port' => 465, 'username' => 'info@netz.com.py', 'password' => '...']
$smtp = [];
$credFile = __DIR__ . '/conexion/smtp-credentials.php';
if (is_file($credFile)) {
    $smtp = (array) require $credFile;
}

function buildMail(string $name, string $phone, string $email, string $message): PHPMailer
{
    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
    $mail->addAddress(MAIL_TO);
    $mail->addReplyTo($email, $name);
    $mail->isHTML(false);
    $mail->Subject = "Nuevo mensaje de contacto desde netz.com.py de: $name";
    $mail->Body    = "Nombre: $name\n"
                   . "Teléfono: $phone\n"
                   . "Correo electrónico: $email\n\n"
                   . "Mensaje:\n$message\n";
    return $mail;
}

$sent = false;

// 1) Intento por SMTP autenticado (recomendado, mejor entregabilidad)
if (!empty($smtp['password'])) {
    try {
        $mail = buildMail($name, $phone, $email, $message);
        $mail->isSMTP();
        $mail->Host       = $smtp['host'] ?? 'mail.netz.com.py';
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtp['username'] ?? MAIL_FROM;
        $mail->Password   = $smtp['password'];
        $mail->Port       = (int) ($smtp['port'] ?? 465);
        $mail->SMTPSecure = $mail->Port === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Timeout    = 15;
        $mail->send();
        $sent = true;
    } catch (Exception $e) {
        error_log("Error PHPMailer SMTP: " . (isset($mail) ? $mail->ErrorInfo : $e->getMessage()));
    }
}

// 2) Respaldo: mail() local del servidor (cPanel/Exim)
if (!$sent) {
    try {
        $mail = buildMail($name, $phone, $email, $message);
        $mail->isMail();
        $mail->Sender = MAIL_FROM; // envelope-from para SPF
        $mail->send();
        $sent = true;
    } catch (Exception $e) {
        error_log("Error PHPMailer mail(): " . (isset($mail) ? $mail->ErrorInfo : $e->getMessage()));
    }
}

if ($sent) {
    http_response_code(200);
    echo "¡Gracias! Su mensaje ha sido enviado exitosamente. Nos pondremos en contacto con usted a la brevedad.";
} else {
    http_response_code(500);
    echo "No se pudo enviar el mensaje en este momento. Por favor, intente nuevamente o escríbanos a info@netz.com.py.";
}
