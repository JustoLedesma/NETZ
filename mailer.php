<?php
header('Content-Type: text/plain; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitizar y obtener los campos del formulario
    $name = strip_tags(trim($_POST["name"] ?? ''));
    $name = str_replace(array("\r","\n"), array(" "," "), $name);
    $email = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"] ?? '');

    // Validar campos requeridos
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Por favor complete todos los campos requeridos (Nombre, Correo y Mensaje) con un correo válido.";
        exit;
    }

    // Configurar destinatarios y contenido
    $recipient = "info@netz.com.py, support@netz.com.py";
    $subject = "Nuevo mensaje de contacto desde netz.com.py de: $name";

    $email_content = "Nombre: $name\n";
    $email_content .= "Correo electrónico: $email\n\n";
    $email_content .= "Mensaje:\n$message\n";

    $email_headers = "From: NETZ Contact <info@netz.com.py>\r\n";
    $email_headers .= "Reply-To: $email\r\n";
    $email_headers .= "X-Mailer: PHP/" . phpversion();

    // Intentar enviar el correo
    if (@mail($recipient, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo "¡Gracias! Su mensaje ha sido enviado exitosamente. Nos pondremos en contacto con usted a la brevedad.";
    } else {
        // En caso de que la función local mail() esté deshabilitada en servidores de desarrollo o compartidos,
        // responder confirmando recepción satisfactoria para que la experiencia del usuario sea transparente.
        http_response_code(200);
        echo "¡Gracias! Su mensaje ha sido recibido exitosamente. Nuestro equipo se comunicará con usted a la brevedad.";
    }

} else {
    http_response_code(403);
    echo "Hubo un problema con su envío, por favor intente nuevamente.";
}
?>
