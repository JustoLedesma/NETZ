<?php
/**
 * PLANTILLA DE CONFIGURACIÓN DE LA API DE WHMCS
 *
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. En tu servidor cPanel, crea una carpeta segura FUERA de public_html:
 *    mkdir -p /home/TU_USUARIO/netz-private
 *
 * 2. Copia este archivo a esa ubicación con el nombre whmcs_config.php:
 *    cp cron/whmcs_config.example.php /home/TU_USUARIO/netz-private/whmcs_config.php
 *
 * 3. En tu WHMCS (https://client.netz.com.py/admin):
 *    - Ve a: Ajustes del Sistema (o Configuración) > Credenciales de API (API Credentials).
 *    - Haz clic en "Generar nueva credencial de API".
 *    - Asígnale un Rol de API con permisos mínimos de lectura:
 *      * GetCurrencies
 *      * GetProducts
 *      * GetTLDPricing
 *    - En Configuración General > Seguridad > "IPs con acceso a la API", agrega la IP de tu servidor web.
 *
 * 4. Completa los valores reales únicamente en /home/TU_USUARIO/netz-private/whmcs_config.php.
 *    NUNCA guardes las credenciales reales dentro de public_html ni las compartas por chat o git.
 */

return [
    // URL base de tu instalación de WHMCS (sin barra final)
    'whmcs_url' => 'https://client.netz.com.py',

    // Autenticación moderna mediante Rol de API (Recomendada para WHMCS 7.2+)
    'api_identifier' => 'PEGA_AQUI_TU_API_IDENTIFIER',
    'api_secret'     => 'PEGA_AQUI_TU_API_SECRET',

    // Autenticación alternativa (solo si tu versión usa usuario administrativo y clave/token):
    // 'api_username' => 'usuario_admin',
    // 'api_password' => 'clave_o_md5',

    // Ruta del archivo de log fuera de public_html
    'log_file' => dirname(__DIR__, 2) . '/netz-private/logs/sync_prices.log',
];

