<?php
/**
 * NETZ - Script de Sincronización Automática de Precios desde WHMCS
 *
 * USO POR CLI:
 *   php cron/sync_prices.php             # Ejecución normal en cron
 *   php cron/sync_prices.php --dry-run   # Prueba sin escribir archivos en disco
 *   php cron/sync_prices.php --mock      # Prueba con respuestas simuladas (sin conectar a WHMCS)
 *   php cron/sync_prices.php --verbose   # Salida detallada en consola
 *
 * REQUISITOS:
 *   - Solo ejecutable por línea de comandos (CLI).
 *   - Credenciales ubicadas fuera de public_html (ej. /home/USUARIO/netz-private/whmcs_config.php).
 */

// 1. Bloqueo estricto de acceso web
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    echo "Acceso denegado: este script solo puede ejecutarse por CLI (línea de comandos).\n";
    exit(1);
}

// 2. Procesamiento de argumentos CLI
$options = getopt('', ['mock', 'dry-run', 'verbose', 'config:']);
$isMock    = isset($options['mock']);
$isDryRun  = isset($options['dry-run']);
$isVerbose = isset($options['verbose']);
$configArg = $options['config'] ?? null;

$rootDir = dirname(__DIR__);
$outputDir = $rootDir . '/assets/data/prices';
$countryConfigFile = $rootDir . '/config/country_currency.json';

// 3. Localización del archivo de configuración fuera de public_html
$configPaths = [
    $configArg,
    getenv('WHMCS_CONFIG_PATH') ?: null,
    dirname($rootDir) . '/netz-private/whmcs_config.php',       // /home/usuario/netz-private/...
    dirname($rootDir, 2) . '/netz-private/whmcs_config.php',
    $rootDir . '/cron/whmcs_config.php',                        // Solo desarrollo local si existe
];

$whmcsConfig = null;
if (!$isMock) {
    foreach ($configPaths as $path) {
        if ($path && file_exists($path)) {
            $whmcsConfig = require $path;
            break;
        }
    }

    if (!$whmcsConfig || empty($whmcsConfig['whmcs_url'])) {
        fwrite(STDERR, "[ERROR CRÍTICO] No se encontró el archivo de credenciales de WHMCS fuera de public_html.\n");
        fwrite(STDERR, "Por favor crea el archivo /home/TU_USUARIO/netz-private/whmcs_config.php usando cron/whmcs_config.example.php como plantilla.\n");
        fwrite(STDERR, "Para realizar una prueba sin credenciales, ejecuta: php cron/sync_prices.php --mock\n");
        exit(1);
    }
} else {
    $whmcsConfig = [
        'whmcs_url' => 'https://client.netz.com.py',
        'api_identifier' => 'MOCK_ID',
        'api_secret' => 'MOCK_SECRET',
        'log_file' => $rootDir . '/netz_sync_mock.log',
    ];
}

// 4. Configuración del Log
$logFile = $whmcsConfig['log_file'] ?? (dirname($rootDir) . '/netz-private/logs/sync_prices.log');
$logDir = dirname($logFile);
if (!is_dir($logDir) && !$isDryRun) {
    @mkdir($logDir, 0750, true);
}

function logMsg(string $msg, string $level = 'INFO') {
    global $logFile, $isDryRun;
    $time = date('Y-m-d H:i:s');
    $line = "[{$time}] [{$level}] {$msg}\n";
    echo $line;
    if (!$isDryRun && is_dir(dirname($logFile))) {
        @file_put_contents($logFile, $line, FILE_APPEND);
    }
}

logMsg("Iniciando sincronización de precios " . ($isMock ? "[MODO MOCK]" : "") . ($isDryRun ? "[MODO DRY-RUN]" : ""));

// 5. Cargar mapeo de países y monedas
if (!file_exists($countryConfigFile)) {
    logMsg("Archivo de configuración de países no encontrado en {$countryConfigFile}", 'ERROR');
    exit(1);
}
$countryConfig = json_decode(file_get_contents($countryConfigFile), true);
if (!$countryConfig) {
    logMsg("Error al leer el archivo {$countryConfigFile}: JSON inválido", 'ERROR');
    exit(1);
}

// 6. Función para invocar la API de WHMCS
function callWhmcsApi(array $config, string $action, array $params = [], bool $mock = false): ?array {
    if ($mock) {
        return getMockApiResponse($action, $params);
    }

    $url = rtrim($config['whmcs_url'], '/') . '/includes/api.php';
    $postData = array_merge([
        'action' => $action,
        'responsetype' => 'json',
    ], $params);

    if (!empty($config['api_identifier']) && !empty($config['api_secret'])) {
        $postData['identifier'] = $config['api_identifier'];
        $postData['secret'] = $config['api_secret'];
    } elseif (!empty($config['api_username']) && !empty($config['api_password'])) {
        $postData['username'] = $config['api_username'];
        $postData['password'] = md5($config['api_password']);
    }

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($postData),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_USERAGENT => 'NETZ-PriceSync/1.0',
    ]);

    $raw = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($curlErr) {
        logMsg("Error cURL en acción {$action}: {$curlErr}", 'ERROR');
        return null;
    }

    if ($httpCode !== 200) {
        logMsg("HTTP {$httpCode} recibido al invocar {$action}", 'ERROR');
        return null;
    }

    $json = json_decode($raw, true);
    if (!$json || !isset($json['result'])) {
        logMsg("Respuesta JSON inválida de WHMCS en {$action}", 'ERROR');
        return null;
    }

    if ($json['result'] !== 'success') {
        $errText = $json['message'] ?? 'Error desconocido de la API';
        logMsg("WHMCS rechazó la acción {$action}: {$errText}", 'WARNING');
        return null;
    }

    return $json;
}

// 7. Respuestas Mock para desarrollo y pruebas
function getMockApiResponse(string $action, array $params): array {
    if ($action === 'GetCurrencies') {
        return [
            'result' => 'success',
            'totalresults' => 5,
            'currencies' => [
                'currency' => [
                    ['id' => 1, 'code' => 'USD', 'prefix' => '$', 'suffix' => ' USD', 'default' => true],
                    ['id' => 2, 'code' => 'PYG', 'prefix' => 'Gs. ', 'suffix' => '', 'default' => false],
                    ['id' => 3, 'code' => 'BRL', 'prefix' => 'R$ ', 'suffix' => '', 'default' => false],
                    ['id' => 4, 'code' => 'ARS', 'prefix' => '$ ', 'suffix' => ' ARS', 'default' => false],
                    ['id' => 5, 'code' => 'EUR', 'prefix' => '€', 'suffix' => '', 'default' => false],
                ]
            ]
        ];
    }

    if ($action === 'GetProducts') {
        $currId = $params['currencyid'] ?? 1;
        // Precios base USD
        $base = [
            1 => ['name' => 'Web Hosting Básico', 'm' => 2.50, 'a' => 25.00, 'setup' => 25.00],
            2 => ['name' => 'Web Hosting Pro', 'm' => 4.20, 'a' => 42.00, 'setup' => 42.00],
            3 => ['name' => 'Web Hosting Pro+', 'm' => 7.20, 'a' => 72.00, 'setup' => 72.00],
            4 => ['name' => 'Radio Stream Mini', 'm' => 3.10, 'a' => 37.20, 'setup' => 0.00],
            5 => ['name' => 'Radio Stream Junior', 'm' => 7.14, 'a' => 85.68, 'setup' => 0.00],
            6 => ['name' => 'Radio Stream Junior II', 'm' => 10.70, 'a' => 128.40, 'setup' => 0.00],
            7 => ['name' => 'Reseller cPanel 1', 'm' => 20.15, 'a' => 241.80, 'setup' => 0.00],
            8 => ['name' => 'Reseller cPanel 2', 'm' => -1, 'a' => 249.90, 'setup' => 0.00],
            9 => ['name' => 'Reseller cPanel 3', 'm' => -1, 'a' => 360.90, 'setup' => 0.00],
            10 => ['name' => 'Reseller cPanel 4', 'm' => -1, 'a' => 615.00, 'setup' => 0.00],
            11 => ['name' => 'Video Streaming 1', 'm' => 8.00, 'a' => -1, 'setup' => 0.00],
            12 => ['name' => 'Video Streaming 2', 'm' => 14.28, 'a' => -1, 'setup' => 0.00],
            13 => ['name' => 'Video Streaming 3', 'm' => 25.57, 'a' => -1, 'setup' => 0.00],
            14 => ['name' => 'Video Streaming 4', 'm' => 42.85, 'a' => -1, 'setup' => 0.00],
            15 => ['name' => 'Hosting Exclusivo 1', 'm' => -1, 'a' => 149.00, 'setup' => 0.00],
            16 => ['name' => 'Hosting Exclusivo 2', 'm' => -1, 'a' => 271.60, 'setup' => 0.00],
            17 => ['name' => 'Hosting Exclusivo 3', 'm' => -1, 'a' => 525.50, 'setup' => 0.00],
            18 => ['name' => 'Hosting Exclusivo 4', 'm' => -1, 'a' => 981.00, 'setup' => 0.00],
            19 => ['name' => 'Reseller DirectAdmin 1', 'm' => 19.97, 'a' => -1, 'setup' => 0.00],
            20 => ['name' => 'Reseller DirectAdmin 2', 'm' => 39.49, 'a' => -1, 'setup' => 0.00],
            21 => ['name' => 'Radio Streaming Plan Adicional', 'm' => -1, 'a' => 149.90, 'setup' => 0.00],
        ];

        // Multiplicador simple para simular monedas mock
        $mult = 1.0;
        if ($currId === 2) $mult = 7500.0; // PYG
        elseif ($currId === 3) $mult = 5.60; // BRL
        elseif ($currId === 4) $mult = 1200.0; // ARS
        elseif ($currId === 5) $mult = 0.92; // EUR

        $prods = [];
        foreach ($base as $pid => $info) {
            $mVal = $info['m'] > 0 ? (string)round($info['m'] * $mult, 2) : '-1.00';
            $aVal = $info['a'] > 0 ? (string)round($info['a'] * $mult, 2) : '-1.00';
            $sVal = $info['setup'] > 0 ? (string)round($info['setup'] * $mult, 2) : '0.00';

            $prods[] = [
                'pid' => $pid,
                'name' => $info['name'],
                'pricing' => [
                    'MOCK' => [
                        'monthly' => $mVal,
                        'quarterly' => '-1.00',
                        'semiannually' => '-1.00',
                        'annually' => $aVal,
                        'biennially' => '-1.00',
                        'triennially' => '-1.00',
                        'msetupfee' => '0.00',
                        'qsetupfee' => '0.00',
                        'ssetupfee' => '0.00',
                        'asetupfee' => $sVal,
                        'bsetupfee' => '0.00',
                        'tsetupfee' => '0.00',
                    ]
                ]
            ];
        }

        return [
            'result' => 'success',
            'totalresults' => count($prods),
            'products' => ['product' => $prods]
        ];
    }

    if ($action === 'GetTLDPricing') {
        $currId = $params['currencyid'] ?? 1;
        $mult = 1.0;
        if ($currId === 2) $mult = 7500.0;
        elseif ($currId === 3) $mult = 5.60;
        elseif ($currId === 4) $mult = 1200.0;
        elseif ($currId === 5) $mult = 0.92;

        $tlds = ['com' => [3.99, 14.99, 14.99], 'net' => [5.90, 16.99, 16.99], 'org' => [5.90, 15.99, 15.99],
                 'online' => [22.99, 35.99, 35.99], 'info' => [3.90, 18.99, 18.99], 'biz' => [7.90, 19.99, 19.99],
                 'click' => [1.99, 12.99, 12.99], 'us' => [5.90, 14.99, 14.99], 'tv' => [27.00, 35.00, 35.00],
                 'la' => [26.00, 38.00, 38.00], 'srl' => [25.00, 30.00, 30.00], 'top' => [3.00, 12.00, 12.00],
                 'vip' => [8.00, 18.00, 18.00], 'fun' => [13.00, 24.00, 24.00], 'pro' => [11.00, 19.00, 19.00],
                 'app' => [16.50, 22.00, 22.00], 'pet' => [9.00, 20.00, 20.00], 'bet' => [11.00, 25.00, 25.00],
                 'blog' => [18.00, 28.00, 28.00], 'club' => [14.00, 20.00, 20.00]];

        $pricing = [];
        foreach ($tlds as $tld => $vals) {
            $pricing[$tld] = [
                'register' => ['1' => (string)round($vals[0] * $mult, 2)],
                'renew' => ['1' => (string)round($vals[1] * $mult, 2)],
                'transfer' => ['1' => (string)round($vals[2] * $mult, 2)],
            ];
        }

        return [
            'result' => 'success',
            'pricing' => $pricing
        ];
    }

    return ['result' => 'error', 'message' => 'Acción no soportada en mock'];
}

// 8. Paso 1: Consultar monedas en WHMCS (GetCurrencies)
logMsg("Consultando monedas disponibles en WHMCS...");
$currenciesResponse = callWhmcsApi($whmcsConfig, 'GetCurrencies', [], $isMock);
if (!$currenciesResponse) {
    logMsg("No se pudo obtener el listado de monedas desde WHMCS. Cancelando sincronización.", 'ERROR');
    exit(1);
}

$whmcsCurrencies = [];
$rawCurrs = $currenciesResponse['currencies']['currency'] ?? [];
// Normalizar si WHMCS devuelve un solo objeto en lugar de lista
if (isset($rawCurrs['code'])) {
    $rawCurrs = [$rawCurrs];
}
foreach ($rawCurrs as $c) {
    $code = strtoupper($c['code']);
    $whmcsCurrencies[$code] = [
        'id' => (int)$c['id'],
        'code' => $code,
        'prefix' => $c['prefix'] ?? '',
        'suffix' => $c['suffix'] ?? '',
        'default' => !empty($c['default']),
    ];
}

logMsg("Monedas detectadas en WHMCS: " . implode(', ', array_keys($whmcsCurrencies)));

// 9. Paso 2: Procesar cada país configurado
$generatedAt = date('Y-m-d\TH:i:sP');
$cycles = [
    'monthly' => 'msetupfee',
    'quarterly' => 'qsetupfee',
    'semiannually' => 'ssetupfee',
    'annually' => 'asetupfee',
    'biennially' => 'bsetupfee',
    'triennially' => 'tsetupfee'
];

foreach ($countryConfig as $countryCode => $cMeta) {
    $countryName = $cMeta['country'];
    $targetCurrency = strtoupper($cMeta['currency']);
    $locale = $cMeta['locale'];

    logMsg("--------------------------------------------------");
    logMsg("Procesando {$countryName} ({$countryCode}) -> Moneda: {$targetCurrency}");

    // Verificar si la moneda existe en WHMCS
    if (!isset($whmcsCurrencies[$targetCurrency])) {
        logMsg("⚠️ La moneda {$targetCurrency} para {$countryName} NO existe aún en WHMCS. Precios quedarán en null.", 'WARNING');

        // Generar archivo con estructura vacía/null para que el sitio use USD base
        $emptyPayload = [
            'country' => $countryName,
            'countryCode' => $countryCode,
            'locale' => $locale,
            'currency' => $targetCurrency,
            'whmcsCurrencyId' => null,
            'generatedAt' => null,
            'status' => 'pending_whmcs',
            'products' => (object)[],
            'domains' => (object)[]
        ];

        saveCountryPrices($countryCode, $emptyPayload, $outputDir, $isDryRun);
        continue;
    }

    $currInfo = $whmcsCurrencies[$targetCurrency];
    $whmcsCurrencyId = $currInfo['id'];

    // Consultar productos para esta moneda
    $prodsResponse = callWhmcsApi($whmcsConfig, 'GetProducts', ['currencyid' => $whmcsCurrencyId], $isMock);
    if (!$prodsResponse) {
        logMsg("Fallo al obtener productos para moneda {$targetCurrency} ({$countryName}). Se conserva el archivo previo.", 'ERROR');
        continue;
    }

    $rawProducts = $prodsResponse['products']['product'] ?? [];
    if (isset($rawProducts['pid'])) {
        $rawProducts = [$rawProducts];
    }

    $parsedProducts = [];
    $disabledCyclesReport = [];

    foreach ($rawProducts as $p) {
        $pid = (int)$p['pid'];
        $pName = $p['name'] ?? "Producto #{$pid}";
        
        // El objeto de pricing en WHMCS puede estar anidado por código de moneda
        $pricingArr = $p['pricing'] ?? [];
        $pPriceData = null;
        if (isset($pricingArr[$targetCurrency])) {
            $pPriceData = $pricingArr[$targetCurrency];
        } elseif (!empty($pricingArr)) {
            $pPriceData = reset($pricingArr);
        }

        $prodCycles = [];
        $hasAnyActiveCycle = false;

        foreach ($cycles as $cycleKey => $setupKey) {
            $val = isset($pPriceData[$cycleKey]) ? (float)$pPriceData[$cycleKey] : -1.0;
            $setup = isset($pPriceData[$setupKey]) ? (float)$pPriceData[$setupKey] : 0.0;

            if ($val < 0) {
                // Ciclo deshabilitado (-1)
                $prodCycles[$cycleKey] = null;
                $disabledCyclesReport[] = "PID {$pid} ({$pName}) [{$cycleKey}]";
            } else {
                $prodCycles[$cycleKey] = (float)$val;
                $hasAnyActiveCycle = true;

                // Regla 6: Alerta si la cuota de alta es igual al precio del ciclo
                if ($setup > 0 && abs($setup - $val) < 0.001) {
                    logMsg("⚠️ [ALERTA COBRO DOBLE] PID {$pid} ({$pName}) - {$cycleKey}: La cuota de alta ({$setup}) es idéntica al precio del ciclo ({$val}).", 'WARNING');
                }
            }
        }

        $parsedProducts[$pid] = array_merge([
            'name' => $pName
        ], $prodCycles);
    }

    // Consultar precios de dominios (GetTLDPricing)
    $domainsResponse = callWhmcsApi($whmcsConfig, 'GetTLDPricing', ['currencyid' => $whmcsCurrencyId], $isMock);
    $parsedDomains = [];

    if ($domainsResponse && !empty($domainsResponse['pricing'])) {
        foreach ($domainsResponse['pricing'] as $ext => $dInfo) {
            $cleanExt = ltrim($ext, '.');
            $regPrice = isset($dInfo['register']['1']) ? (float)$dInfo['register']['1'] : null;
            $renewPrice = isset($dInfo['renew']['1']) ? (float)$dInfo['renew']['1'] : null;
            $transferPrice = isset($dInfo['transfer']['1']) ? (float)$dInfo['transfer']['1'] : null;

            if ($regPrice !== null && $regPrice < 0) $regPrice = null;
            if ($renewPrice !== null && $renewPrice < 0) $renewPrice = null;
            if ($transferPrice !== null && $transferPrice < 0) $transferPrice = null;

            $parsedDomains[$cleanExt] = [
                'register' => $regPrice,
                'renew' => $renewPrice,
                'transfer' => $transferPrice,
            ];
        }
    } else {
        logMsg("Aviso: GetTLDPricing no devolvió resultados para {$countryName} (puede deberse a versión de WHMCS o permisos). Conservando dominios existentes si aplica.", 'NOTICE');
    }

    // Separar dominios: 26 destacados para el sitio web (index) vs resto de la base
    $featuredDomainKeys = [
        'com', 'net', 'org', 'online', 'info', 'biz', 'click', 'us', 'tv', 'la',
        'srl', 'top', 'vip', 'fun', 'pro', 'app', 'pet', 'bet', 'blog', 'club',
        'com.py', 'org.py', 'net.py', 'edu.py', 'coop.py', 'mil.py'
    ];

    $publicDomains = [];
    $extendedDomains = [];

    foreach ($parsedDomains as $ext => $pInfo) {
        $extLower = strtolower($ext);
        if (in_array($extLower, $featuredDomainKeys, true)) {
            $publicDomains[$extLower] = $pInfo;
        } else {
            $extendedDomains[$extLower] = $pInfo;
        }
    }

    // 1. Archivo ultraligero para el sitio público (solo 26 dominios + productos)
    $countryPayload = [
        'country' => $countryName,
        'countryCode' => $countryCode,
        'locale' => $locale,
        'currency' => $targetCurrency,
        'whmcsCurrencyId' => $whmcsCurrencyId,
        'generatedAt' => $generatedAt,
        'status' => 'active',
        'products' => $parsedProducts,
        'domains' => $publicDomains
    ];
    saveCountryPrices($countryCode, $countryPayload, $outputDir, $isDryRun);

    // 2. Archivo extendido con el resto de dominios de WHMCS para revisión y auditoría
    $extendedPayload = [
        'country' => $countryName,
        'countryCode' => $countryCode,
        'currency' => $targetCurrency,
        'generatedAt' => $generatedAt,
        'totalExtended' => count($extendedDomains),
        'domains' => $extendedDomains
    ];
    saveCountryPrices("domains_extended_{$countryCode}", $extendedPayload, $outputDir, $isDryRun);
}

logMsg("Sincronización completada exitosamente.");

// 10. Función de guardado atómico y seguro
function saveCountryPrices(string $countryCode, array $payload, string $outputDir, bool $isDryRun) {
    $targetFile = "{$outputDir}/{$countryCode}.json";
    $jsonEncoded = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    if ($isDryRun) {
        logMsg("[DRY-RUN] Datos generados para {$countryCode}.json (" . strlen($jsonEncoded) . " bytes). No se escribe en disco.");
        return;
    }

    if (!is_dir($outputDir)) {
        @mkdir($outputDir, 0755, true);
    }

    // Escritura atómica: escribir primero a .tmp y renombrar
    $tempFile = "{$targetFile}.tmp." . uniqid();
    $bytes = @file_put_contents($tempFile, $jsonEncoded);
    if ($bytes === false) {
        logMsg("Error al escribir archivo temporal {$tempFile}", 'ERROR');
        return;
    }

    if (!@rename($tempFile, $targetFile)) {
        logMsg("Error al renombrar {$tempFile} a {$targetFile}", 'ERROR');
        @unlink($tempFile);
        return;
    }

    logMsg("✓ Archivo {$countryCode}.json actualizado correctamente ({$bytes} bytes).");
}

