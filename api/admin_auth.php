<?php
/**
 * NETZ - API de Autenticación y Ajustes de Credenciales Administrativas
 * Ubicación: api/admin_auth.php
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$configFile = __DIR__ . '/../config/admin_credentials.php';

// Valores por defecto
$defaultUsername = 'admin';
$defaultHash = 'd5b1abba5fe88a187064c359c17b731ce7d402daab27bf014093b1a20fe5f691';

// Función para obtener credenciales actuales
function getCredentials($configFile, $defaultUsername, $defaultHash) {
    if (file_exists($configFile)) {
        define('NETZ_SECURE', true);
        $creds = include $configFile;
        if (is_array($creds) && !empty($creds['username']) && !empty($creds['password_hash'])) {
            return $creds;
        }
    }
    return [
        'username' => $defaultUsername,
        'password_hash' => $defaultHash,
        'is_default' => true
    ];
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$action = $input['action'] ?? $_GET['action'] ?? 'status';

$currentCreds = getCredentials($configFile, $defaultUsername, $defaultHash);

if ($action === 'status') {
    echo json_encode([
        'status' => 'ok',
        'server_storage' => true,
        'username' => $currentCreds['username'],
        'is_default' => !empty($currentCreds['is_default'])
    ]);
    exit;
}

if ($action === 'login') {
    $user = trim($input['username'] ?? '');
    $passHash = trim($input['password_hash'] ?? '');

    if (empty($user) || empty($passHash)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Usuario y contraseña requeridos']);
        exit;
    }

    if (hash_equals($currentCreds['username'], $user) && hash_equals($currentCreds['password_hash'], $passHash)) {
        echo json_encode([
            'status' => 'ok',
            'message' => 'Autenticación exitosa',
            'username' => $currentCreds['username']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Credenciales inválidas']);
    }
    exit;
}

if ($action === 'update') {
    $currentUser = trim($input['current_user'] ?? '');
    $currentPassHash = trim($input['current_password_hash'] ?? '');
    $newUser = trim($input['new_username'] ?? '');
    $newPassHash = trim($input['new_password_hash'] ?? '');

    if (empty($currentPassHash) || empty($newUser) || empty($newPassHash)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Todos los campos son obligatorios']);
        exit;
    }

    // Validar contraseña actual
    if (!hash_equals($currentCreds['password_hash'], $currentPassHash)) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'La contraseña actual no es correcta']);
        exit;
    }

    // Guardar nuevo archivo de credenciales
    $exportContent = "<?php\n";
    $exportContent .= "// Archivo protegido de credenciales de administración NETZ\n";
    $exportContent .= "defined('NETZ_SECURE') or die('Acceso denegado');\n";
    $exportContent .= "return [\n";
    $exportContent .= "    'username' => " . var_export($newUser, true) . ",\n";
    $exportContent .= "    'password_hash' => " . var_export($newPassHash, true) . ",\n";
    $exportContent .= "    'updated_at' => " . var_export(date('Y-m-d H:i:s'), true) . "\n";
    $exportContent .= "];\n";

    if (@file_put_contents($configFile, $exportContent, LOCK_EX) !== false) {
        echo json_encode([
            'status' => 'ok',
            'message' => 'Credenciales actualizadas exitosamente en el servidor',
            'username' => $newUser
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'No se pudo escribir en config/admin_credentials.php. Verifique permisos de escritura en la carpeta config.'
        ]);
    }
    exit;
}

http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'Acción no reconocida']);

