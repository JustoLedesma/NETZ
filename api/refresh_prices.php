<?php
/**
 * NETZ - Endpoint de Sincronización en Tiempo Real de Precios desde WHMCS (BD)
 * Ubicación: api/refresh_prices.php
 *
 * Conecta directamente a la base de datos de WHMCS (MySQL) a través de
 * conexion/conexion.php, procesa los productos y los dominios (>500 TLDs),
 * y regenera automáticamente los archivos JSON por país:
 *   - assets/data/prices/{country}.json (26 dominios destacados + productos)
 *   - assets/data/prices/domains_extended_{country}.json (dominios extendidos de la base)
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
    try {
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

        // B. Obtener el catálogo COMPLETO de TLDs configurados en tbldomainpricing (513 TLDs)
        $allConfiguredTlds = [];
        $tldSql = $conexion->query("SELECT id, extension FROM tbldomainpricing ORDER BY id ASC");
        if ($tldSql) {
            while ($t = $tldSql->fetch_assoc()) {
                $cleanExt = ltrim(strtolower(trim($t['extension'])), '.');
                if ($cleanExt !== '') {
                    $allConfiguredTlds[$cleanExt] = (int)$t['id'];
                }
            }
        }

        // C. Precios de Productos desde WHMCS (consulta estándar 100% compatible)
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
                    'pid' => $pid,
                    'name' => $pName
                ], $parsedCycles);
            }
        }

    // D. Precios de Dominios desde WHMCS por Moneda
    $domSql = $conexion->query("
        SELECT dp.id as dpid, dp.extension, pr.type as ptype, pr.currency, pr.msetupfee
        FROM tbldomainpricing dp
        INNER JOIN tblpricing pr ON (pr.relid = dp.id AND pr.type IN ('domainregister', 'domainrenew', 'domaintransfer'))
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

    // Dominios paraguayos fijos si no estuvieran en tbldomainpricing
    $pygManuales = [
        'com.py' => ['register' => 169000, 'renew' => 169000, 'transfer' => 169000],
        'org.py' => ['register' => 169000, 'renew' => 169000, 'transfer' => 169000],
        'net.py' => ['register' => 169000, 'renew' => 169000, 'transfer' => 169000],
        'edu.py' => ['register' => 169000, 'renew' => 169000, 'transfer' => 169000],
        'coop.py' => ['register' => 169000, 'renew' => 169000, 'transfer' => 169000],
        'mil.py' => ['register' => 169000, 'renew' => 169000, 'transfer' => 169000],
        'py' => ['register' => 169000, 'renew' => 169000, 'transfer' => 169000],
    ];

    $totalUpdatedCountries = 0;
    $maxExtendedCount = 0;
    $manifestCountries = [];

    $flagLookup = [
        'py' => '🇵🇾', 'br' => '🇧🇷', 'ar' => '🇦🇷', 'es' => '🇪🇸',
        'us' => '🇺🇸', 'cl' => '🇨🇱', 'co' => '🇨🇴', 'mx' => '🇲🇽',
        'pe' => '🇵🇪', 'uy' => '🇺🇾', 'bo' => '🇧🇴', 'ec' => '🇪🇨',
        've' => '🇻🇪', 'pa' => '🇵🇦', 'cr' => '🇨🇷', 'gt' => '🇬🇹',
        'hn' => '🇭🇳', 'ni' => '🇳🇮', 'sv' => '🇸🇻', 'do' => '🇩🇴',
        'gb' => '🇬🇧', 'de' => '🇩🇪', 'fr' => '🇫🇷', 'it' => '🇮🇹',
        'pt' => '🇵🇹', 'ca' => '🇨🇦'
    ];
    $currToCountryCode = [
        'PYG' => 'py', 'BRL' => 'br', 'ARS' => 'ar', 'EUR' => 'es',
        'USD' => 'us', 'CLP' => 'cl', 'COP' => 'co', 'MXN' => 'mx',
        'PEN' => 'pe', 'UYU' => 'uy', 'BOB' => 'bo', 'GBP' => 'gb',
        'CAD' => 'ca'
    ];
    $currToLocale = [
        'PYG' => 'es-PY', 'BRL' => 'pt-BR', 'ARS' => 'es-AR', 'EUR' => 'es-ES',
        'USD' => 'en-US', 'CLP' => 'es-CL', 'COP' => 'es-CO', 'MXN' => 'es-MX',
        'PEN' => 'es-PE', 'UYU' => 'es-UY', 'BOB' => 'es-BO', 'GBP' => 'en-GB',
        'CAD' => 'en-CA'
    ];

    // Autodescubrimiento: Si hay monedas creadas en WHMCS que aún no están en country_currency.json,
    // se agregan automáticamente para generar sus archivos y pestaña correspondiente
    $configuredCurrencies = [];
    foreach ($countryConfig as $cm) {
        $configuredCurrencies[strtoupper($cm['currency'])] = true;
    }
    foreach ($whmcsCurrencies as $wCode => $wData) {
        if (!isset($configuredCurrencies[$wCode])) {
            $mappedC = strtolower($currToCountryCode[$wCode] ?? $wCode);
            if (!isset($countryConfig[$mappedC])) {
                $countryConfig[$mappedC] = [
                    'country' => 'Moneda ' . $wCode,
                    'locale' => $currToLocale[$wCode] ?? 'en-US',
                    'currency' => $wCode,
                    'status' => 'active_whmcs'
                ];
            }
        }
    }

    foreach ($countryConfig as $cCode => $cMeta) {
        $cName = $cMeta['country'];
        $cCurr = strtoupper($cMeta['currency']);
        $cLocale = $cMeta['locale'];

        // Determinar ID y tasa de moneda
        $targetCurrencyId = $defaultCurrencyId;
        $currRate = 1.0;
        if (isset($whmcsCurrencies[$cCurr])) {
            $targetCurrencyId = $whmcsCurrencies[$cCurr]['id'];
            $currRate = $whmcsCurrencies[$cCurr]['rate'] ?: 1.0;
        }

        $manifestCountries[] = [
            'code' => $cCode,
            'name' => $cName,
            'flag' => $flagLookup[$cCode] ?? '💵',
            'currency' => $cCurr,
            'locale' => $cLocale,
            'whmcsCurrencyId' => $targetCurrencyId
        ];

        // Productos para este país
        $countryProducts = $productsByCurrency[$targetCurrencyId] ?? $productsByCurrency[$defaultCurrencyId] ?? [];

        // Construir catálogo COMPLETO de dominios para este país
        // Garantiza que TODOS los TLDs de tbldomainpricing estén incluidos
        $allCountryDomains = [];

        foreach ($allConfiguredTlds as $cleanExt => $dpid) {
            $reg = null;
            $ren = null;
            $tra = null;

            // 1. Buscar precio específico en la moneda del país
            if (isset($domainsByCurrency[$targetCurrencyId][$cleanExt])) {
                $p = $domainsByCurrency[$targetCurrencyId][$cleanExt];
                $reg = $p['register'];
                $ren = $p['renew'];
                $tra = $p['transfer'];
            }
            // 2. Si no tiene precio en moneda local, tomar el precio base USD y convertir por tasa
            elseif (isset($domainsByCurrency[$defaultCurrencyId][$cleanExt])) {
                $pBase = $domainsByCurrency[$defaultCurrencyId][$cleanExt];
                if ($pBase['register'] !== null) {
                    $reg = ($targetCurrencyId === $defaultCurrencyId)
                        ? $pBase['register']
                        : round($pBase['register'] * $currRate, ($cCurr === 'PYG' || $cCurr === 'CLP' || $cCurr === 'COP') ? 0 : 2);
                }
                if ($pBase['renew'] !== null) {
                    $ren = ($targetCurrencyId === $defaultCurrencyId)
                        ? $pBase['renew']
                        : round($pBase['renew'] * $currRate, ($cCurr === 'PYG' || $cCurr === 'CLP' || $cCurr === 'COP') ? 0 : 2);
                }
                if ($pBase['transfer'] !== null) {
                    $tra = ($targetCurrencyId === $defaultCurrencyId)
                        ? $pBase['transfer']
                        : round($pBase['transfer'] * $currRate, ($cCurr === 'PYG' || $cCurr === 'CLP' || $cCurr === 'COP') ? 0 : 2);
                }
            }

            $allCountryDomains[$cleanExt] = [
                'register' => $reg,
                'renew' => $ren,
                'transfer' => $tra
            ];
        }

        // Si es Paraguay, asegurar que las extensiones paraguayas existan
        if ($cCode === 'py') {
            foreach ($pygManuales as $pExt => $pVals) {
                $allCountryDomains[$pExt] = $pVals;
            }
        }

        // Separar en 26 destacados para el index vs extendidos
        $publicDomains = [];
        $extendedDomains = [];

        foreach ($allCountryDomains as $ext => $pInfo) {
            if (in_array($ext, $featuredDomainKeys, true)) {
                $publicDomains[$ext] = $pInfo;
            } else {
                $extendedDomains[$ext] = $pInfo;
            }
        }

        // 1. Archivo {country}.json (26 dominios + productos)
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

        // 2. Archivo domains_extended_{country}.json (catálogo completo de la base de datos)
        $extendedData = [
            'countryCode' => $cCode,
            'currency' => $cCurr,
            'generatedAt' => $nowIso,
            'totalExtended' => count($extendedDomains),
            'domains' => $extendedDomains
        ];

        $jsonExtStr = json_encode($extendedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        file_put_contents($outputDir . "/domains_extended_{$cCode}.json", $jsonExtStr);
        if (is_dir($distOutputDir)) {
            @file_put_contents($distOutputDir . "/domains_extended_{$cCode}.json", $jsonExtStr);
        }

        $totalUpdatedCountries++;
        if ($maxExtendedCount < count($extendedDomains)) {
            $maxExtendedCount = count($extendedDomains);
        }
    }

    // 3. Guardar manifiesto de países y monedas descubiertas para el panel de revisión
    $manifestData = [
        'updatedAt' => $nowIso,
        'totalCountries' => count($manifestCountries),
        'currencies' => array_values($whmcsCurrencies),
        'countries' => $manifestCountries
    ];
    $manifestJson = json_encode($manifestData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    file_put_contents($outputDir . "/manifest.json", $manifestJson);
    if (is_dir($distOutputDir)) {
        @file_put_contents($distOutputDir . "/manifest.json", $manifestJson);
    }

    echo json_encode([
        'status' => 'ok',
        'message' => '¡Precios y dominios sincronizados exitosamente desde la base de datos de WHMCS!',
        'timestamp' => $nowIso,
        'countries_updated' => $totalUpdatedCountries,
        'featured_domains' => count($featuredDomainKeys),
        'extended_domains' => $maxExtendedCount,
        'total_domains_catalog' => count($featuredDomainKeys) + $maxExtendedCount,
        'source' => 'mysql_whmcs'
    ]);
    exit;
    } catch (\Throwable $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Error al sincronizar desde WHMCS: ' . $e->getMessage() . ' en línea ' . $e->getLine()
        ]);
        exit;
    }
}

// 5. Fallback si MySQL no está conectado directamente (ej. entorno local estático sin PHP/MySQL)
$updatedCount = 0;
$manifestCountries = [];
$flagLookup = [
    'py' => '🇵🇾', 'br' => '🇧🇷', 'ar' => '🇦🇷', 'es' => '🇪🇸',
    'us' => '🇺🇸', 'cl' => '🇨🇱', 'co' => '🇨🇴', 'mx' => '🇲🇽',
    'pe' => '🇵🇪', 'uy' => '🇺🇾', 'bo' => '🇧🇴', 'ec' => '🇪🇨',
    've' => '🇻🇪', 'pa' => '🇵🇦', 'cr' => '🇨🇷', 'gt' => '🇬🇹',
    'hn' => '🇭🇳', 'ni' => '🇳🇮', 'sv' => '🇸🇻', 'do' => '🇩🇴',
    'gb' => '🇬🇧', 'de' => '🇩🇪', 'fr' => '🇫🇷', 'it' => '🇮🇹'
];

foreach ($countryConfig as $cCode => $cMeta) {
    $cName = $cMeta['country'] ?? strtoupper($cCode);
    $cCurr = strtoupper($cMeta['currency'] ?? 'USD');
    $cLocale = $cMeta['locale'] ?? 'en-US';

    $manifestCountries[] = [
        'code' => $cCode,
        'name' => $cName,
        'flag' => $flagLookup[$cCode] ?? '💵',
        'currency' => $cCurr,
        'locale' => $cLocale,
        'whmcsCurrencyId' => null
    ];

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

    $extPath = $outputDir . "/domains_extended_{$cCode}.json";
    if (file_exists($extPath)) {
        $extData = json_decode(file_get_contents($extPath), true);
        if ($extData) {
            $extData['generatedAt'] = $nowIso;
            $newExtJson = json_encode($extData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            file_put_contents($extPath, $newExtJson);
            if (is_dir($distOutputDir)) {
                @file_put_contents($distOutputDir . "/domains_extended_{$cCode}.json", $newExtJson);
            }
        }
    }
}

// Guardar manifest en fallback
$manifestData = [
    'updatedAt' => $nowIso,
    'totalCountries' => count($manifestCountries),
    'currencies' => [],
    'countries' => $manifestCountries
];
$manifestJson = json_encode($manifestData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
@file_put_contents($outputDir . "/manifest.json", $manifestJson);
if (is_dir($distOutputDir)) {
    @file_put_contents($distOutputDir . "/manifest.json", $manifestJson);
}
            if (is_dir($distOutputDir)) {
                @file_put_contents($distOutputDir . "/domains_extended_{$cCode}.json", $newExtJson);
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
