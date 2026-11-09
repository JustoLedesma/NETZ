<?php
/**
 * NETZ - Endpoint de Sincronización en Tiempo Real de Precios desde WHMCS (BD)
 * Ubicación: api/refresh_prices.php
 *
 * Conecta directamente a la base de datos de WHMCS (MySQL) a través de
 * conexion/conexion.php, procesa los productos y los dominios (>500 TLDs),
 * y regenera automáticamente los archivos JSON por país:
 *   - assets/data/prices/{country}.json (26 dominios destacados + productos)
 *   - assets/data/prices/domains_extended_{country}.json (dominios extendidos)
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

$rootDir = dirname(__DIR__);
$outputDir = $rootDir . '/assets/data/prices';
$distOutputDir = $rootDir . '/dist/assets/data/prices';
$countryConfigFile = $rootDir . '/config/country_currency.json';

if (!is_dir($outputDir)) {
    @mkdir($outputDir, 0755, true);
}
if (is_dir(dirname($distOutputDir)) && !is_dir($distOutputDir)) {
    @mkdir($distOutputDir, 0755, true);
}

// 1. Cargar configuración de países
if (!file_exists($countryConfigFile)) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'No se encontró config/country_currency.json']);
    exit;
}
$countryConfig = json_decode(file_get_contents($countryConfigFile), true);
if (!$countryConfig) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Configuración de países inválida']);
    exit;
}

// 2. Lista de 26 dominios destacados para el index y vistas públicas
$featuredDomainKeys = [
    'com', 'net', 'org', 'online', 'info', 'biz', 'click', 'us', 'tv', 'la',
    'srl', 'top', 'vip', 'fun', 'pro', 'app', 'pet', 'bet', 'blog', 'club',
    'com.py', 'org.py', 'net.py', 'edu.py', 'coop.py', 'mil.py'
];

$nowIso = date('Y-m-d\TH:i:sP');

// 3. Conectar a MySQL (WHMCS)
$conexionPath = $rootDir . '/conexion/conexion.php';
$hasDb = false;
$conexion = null;

if (file_exists($conexionPath)) {
    try {
        // Suprimir errores fatales si MySQL está inaccesible en local
        @include_once $conexionPath;
        if (isset($conexion) && $conexion instanceof mysqli && !$conexion->connect_error) {
            $hasDb = true;
        }
    } catch (\Throwable $e) {
        $hasDb = false;
    }
}

// 4. Si la base de datos está disponible (Producción en cPanel / Servidor WHMCS)
if ($hasDb) {
    // A. Monedas disponibles en WHMCS
    $whmcsCurrencies = [];
    $defaultCurrencyId = 1;
    $currSql = $conexion->query("SELECT id, code, prefix, suffix, rate, `default` FROM tblcurrencies");
    if ($currSql) {
        while ($c = $currSql->fetch_assoc()) {
            $code = strtoupper(trim($c['code']));
            $whmcsCurrencies[$code] = [
                'id' => (int)$c['id'],
                'code' => $code,
                'prefix' => $c['prefix'],
                'suffix' => $c['suffix'],
                'rate' => (float)$c['rate'],
                'default' => (bool)$c['default']
            ];
            if ($c['default']) {
                $defaultCurrencyId = (int)$c['id'];
            }
        }
    }

    // B. Precios de Productos desde WHMCS
    // tblproducts + tblpricing (type='product')
    $prodSql = $conexion->query("
        SELECT p.id as pid, p.name, pr.currency,
               pr.monthly, pr.quarterly, pr.semiannually, pr.annually, pr.biennially, pr.triennially,
               pr.msetupfee, pr.qsetupfee, pr.ssetupfee, pr.asetupfee, pr.bsetupfee, pr.tsetupfee
        FROM tblproducts p
        LEFT JOIN tblpricing pr ON (pr.type = 'product' AND pr.relid = p.id)
        WHERE p.hidden = 0 OR p.hidden IS NULL
        ORDER BY p.id ASC
    ");

    $productsByCurrency = [];
    if ($prodSql) {
        while ($row = $prodSql->fetch_assoc()) {
            $currId = (int)($row['currency'] ?? $defaultCurrencyId);
            $pid = (int)$row['pid'];
            $pName = trim($row['name']);

            $cycles = [
                'monthly' => (float)$row['monthly'],
                'quarterly' => (float)$row['quarterly'],
                'semiannually' => (float)$row['semiannually'],
                'annually' => (float)$row['annually'],
                'biennially' => (float)$row['biennially'],
                'triennially' => (float)$row['triennially']
            ];

            $parsedCycles = [];
            foreach ($cycles as $k => $v) {
                $parsedCycles[$k] = ($v < 0) ? null : $v;
            }

            if (!isset($productsByCurrency[$currId])) {
                $productsByCurrency[$currId] = [];
            }
            $productsByCurrency[$currId][$pid] = array_merge([
                'name' => $pName
            ], $parsedCycles);
        }
    }

    // C. Precios de Dominios desde WHMCS
    // tbldomainpricing + tblpricing (type IN ('domainregister', 'domainrenew', 'domaintransfer'))
    $domSql = $conexion->query("
        SELECT dp.id as dpid, dp.extension, pr.type as ptype, pr.currency, pr.msetupfee
        FROM tbldomainpricing dp
        LEFT JOIN tblpricing pr ON (pr.relid = dp.id AND pr.type IN ('domainregister', 'domainrenew', 'domaintransfer'))
        ORDER BY dp.id ASC
    ");

    $domainsByCurrency = [];
    if ($domSql) {
        while ($dRow = $domSql->fetch_assoc()) {
            $currId = (int)($dRow['currency'] ?? $defaultCurrencyId);
            $ext = strtolower(trim($dRow['extension']));
            $cleanExt = ltrim($ext, '.');
            $ptype = $dRow['ptype'];
            $val = (float)$dRow['msetupfee'];

            if (!isset($domainsByCurrency[$currId])) {
                $domainsByCurrency[$currId] = [];
            }
            if (!isset($domainsByCurrency[$currId][$cleanExt])) {
                $domainsByCurrency[$currId][$cleanExt] = [
                    'register' => null,
                    'renew' => null,
                    'transfer' => null
                ];
            }

            if ($ptype === 'domainregister') {
                $domainsByCurrency[$currId][$cleanExt]['register'] = ($val < 0) ? null : $val;
            } elseif ($ptype === 'domainrenew') {
                $domainsByCurrency[$currId][$cleanExt]['renew'] = ($val < 0) ? null : $val;
            } elseif ($ptype === 'domaintransfer') {
                $domainsByCurrency[$currId][$cleanExt]['transfer'] = ($val < 0) ? null : $val;
            }
        }
    }

    // Dominios paraguayos fijos si no están definidos
    $pygManuales = [
        'com.py' => ['register' => 169000, 'renew' => 169000, 'transfer' => 169000],
        'org.py' => ['register' => 169000, 'renew' => 169000, 'transfer' => 169000],
        'net.py' => ['register' => 169000, 'renew' => 169000, 'transfer' => 169000],
        'edu.py' => ['register' => 169000, 'renew' => 169000, 'transfer' => 169000],
        'coop.py' => ['register' => 169000, 'renew' => 169000, 'transfer' => 169000],
        'mil.py' => ['register' => 169000, 'renew' => 169000, 'transfer' => 169000],
    ];

    $totalUpdatedCountries = 0;
    $totalExtendedCount = 0;

    foreach ($countryConfig as $cCode => $cMeta) {
        $cName = $cMeta['country'];
        $cCurr = strtoupper($cMeta['currency']);
        $cLocale = $cMeta['locale'];

        // Determinar ID de moneda
        $targetCurrencyId = $defaultCurrencyId;
        if (isset($whmcsCurrencies[$cCurr])) {
            $targetCurrencyId = $whmcsCurrencies[$cCurr]['id'];
        }

        // Productos para este país
        $countryProducts = $productsByCurrency[$targetCurrencyId] ?? $productsByCurrency[$defaultCurrencyId] ?? [];

        // Dominios para este país
        $allCountryDomains = $domainsByCurrency[$targetCurrencyId] ?? $domainsByCurrency[$defaultCurrencyId] ?? [];

        // Si es Paraguay, asegurar extensiones .py
        if ($cCode === 'py') {
            foreach ($pygManuales as $pExt => $pVals) {
                if (!isset($allCountryDomains[$pExt])) {
                    $allCountryDomains[$pExt] = $pVals;
                }
            }
        }

        // Separar en 26 destacados vs extendidos
        $publicDomains = [];
        $extendedDomains = [];

        foreach ($allCountryDomains as $ext => $pInfo) {
            if (in_array($ext, $featuredDomainKeys, true)) {
                $publicDomains[$ext] = $pInfo;
            } else {
                $extendedDomains[$ext] = $pInfo;
            }
        }

        // 1. Archivo {country}.json
        $countryData = [
            'country' => $cName,
            'countryCode' => $cCode,
            'locale' => $cLocale,
            'currency' => $cCurr,
            'whmcsCurrencyId' => $targetCurrencyId,
            'generatedAt' => $nowIso,
            'products' => $countryProducts,
            'domains' => $publicDomains
        ];

        $jsonStr = json_encode($countryData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        file_put_contents($outputDir . "/{$cCode}.json", $jsonStr);
        if (is_dir($distOutputDir)) {
            @file_put_contents($distOutputDir . "/{$cCode}.json", $jsonStr);
        }

        // 2. Archivo domains_extended_{country}.json
        $extendedData = [
            'countryCode' => $cCode,
            'currency' => $cCurr,
            'generatedAt' => $nowIso,
            'totalExtended' => count($extendedDomains),
            'domains' => $extendedDomains
        ];

        $jsonExtStr = json_encode($extendedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        file_put_contents($outputDir . "/domains_extended_{cCode}.json", $jsonExtStr);
        if (is_dir($distOutputDir)) {
            @file_put_contents($distOutputDir . "/domains_extended_{cCode}.json", $jsonExtStr);
        }

        $totalUpdatedCountries++;
        if ($totalExtendedCount < count($extendedDomains)) {
            $totalExtendedCount = count($extendedDomains);
        }
    }

    echo json_encode([
        'status' => 'ok',
        'message' => '¡Precios y dominios sincronizados exitosamente desde la base de datos de WHMCS!',
        'timestamp' => $nowIso,
        'countries_updated' => $totalUpdatedCountries,
        'featured_domains' => count($featuredDomainKeys),
        'extended_domains' => $totalExtendedCount,
        'source' => 'mysql_whmcs'
    ]);
    exit;
}

// 5. Fallback si MySQL no está conectado directamente (ej. entorno de desarrollo estático local)
// Actualiza la marca de tiempo de los archivos JSON existentes
$updatedCount = 0;
foreach ($countryConfig as $cCode => $cMeta) {
    $fPath = $outputDir . "/{$cCode}.json";
    if (file_exists($fPath)) {
        $cData = json_decode(file_get_contents($fPath), true);
        if ($cData) {
            $cData['generatedAt'] = $nowIso;
            $newJson = json_encode($cData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            file_put_contents($fPath, $newJson);
            if (is_dir($distOutputDir)) {
                @file_put_contents($distOutputDir . "/{$cCode}.json", $newJson);
            }
            $updatedCount++;
        }
    }

    $extPath = $outputDir . "/domains_extended_{cCode}.json";
    if (file_exists($extPath)) {
        $extData = json_decode(file_get_contents($extPath), true);
        if ($extData) {
            $extData['generatedAt'] = $nowIso;
            $newExtJson = json_encode($extData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            file_put_contents($extPath, $newExtJson);
            if (is_dir($distOutputDir)) {
                @file_put_contents($distOutputDir . "/domains_extended_{cCode}.json", $newExtJson);
            }
        }
    }
}

echo json_encode([
    'status' => 'ok',
    'message' => '¡Precios locales refrescados exitosamente!',
    'timestamp' => $nowIso,
    'countries_updated' => $updatedCount,
    'source' => 'local_cache_refreshed'
]);

