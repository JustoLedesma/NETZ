<?php
header('Content-Type: text/plain; charset=utf-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

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

$mail = new PHPMailer(true);

try {
    // Configuración SMTP de cPanel
    $mail->isSMTP();
    $mail->Host       = 'mail.netz.com.py';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@netz.com.py';
    $mail->Password   = 'TU_CONTRASEÑA_DE_CPANEL';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';

    // Remitente y destinatario
    $mail->setFrom('info@netz.com.py', 'Formulario Web NETZ');
    $mail->addAddress('justo.ledesma91@gmail.com');
    $mail->addReplyTo($email, $name);

    // Contenido del correo
    $mail->isHTML(false);
    $mail->Subject = "Nuevo mensaje de contacto desde netz.com.py de: $name";
    $mail->Body    = "Nombre: $name\n"
                   . "Teléfono: $phone\n"
                   . "Correo electrónico: $email\n\n"
                   . "Mensaje:\n$message\n";

    $mail->send();

    http_response_code(200);
    echo "¡Gracias! Su mensaje ha sido enviado exitosamente. Nos pondremos en contacto con usted a la brevedad.";

} catch (Exception $e) {
    error_log("Error PHPMailer: {$mail->ErrorInfo}");

    http_response_code(500);
    echo "No se pudo enviar el mensaje en este momento. Por favor, intente nuevamente o escríbanos a info@netz.com.py.";
}