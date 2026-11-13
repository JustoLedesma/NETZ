<?php
/**
 * Devuelve en JSON los dominios de activación automática (extensión + costo de Registro, Renovación y Transferencia).
 * Soporta parametrización por país (?country=py, ?country=br, ?country=us, etc.)
 * Todos los precios se retornan estrictamente en la moneda oficial del país solicitado.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

$country = isset($_GET['country']) ? strtolower(trim($_GET['country'])) : (isset($_POST['country']) ? strtolower(trim($_POST['country'])) : 'py');

$currencyConfigs = [
    'py' => ['currency' => 'PYG', 'symbol' => 'Gs.', 'decimals' => 0, 'dec_sep' => ',', 'thousands_sep' => '.', 'rate' => 7800],
    'br' => ['currency' => 'BRL', 'symbol' => 'R$', 'decimals' => 2, 'dec_sep' => ',', 'thousands_sep' => '.', 'rate' => 5.60],
    'ar' => ['currency' => 'ARS', 'symbol' => '$', 'decimals' => 2, 'dec_sep' => ',', 'thousands_sep' => '.', 'rate' => 1200.0],
    'es' => ['currency' => 'EUR', 'symbol' => '€', 'decimals' => 2, 'dec_sep' => ',', 'thousands_sep' => '.', 'rate' => 0.92],
    'us' => ['currency' => 'USD', 'symbol' => '$', 'decimals' => 2, 'dec_sep' => '.', 'thousands_sep' => ',', 'rate' => 1.0],
    'cl' => ['currency' => 'CLP', 'symbol' => '$', 'decimals' => 0, 'dec_sep' => ',', 'thousands_sep' => '.', 'rate' => 950.0],
    'co' => ['currency' => 'COP', 'symbol' => '$', 'decimals' => 0, 'dec_sep' => ',', 'thousands_sep' => '.', 'rate' => 4200.0],
    'mx' => ['currency' => 'MXN', 'symbol' => '$', 'decimals' => 2, 'dec_sep' => '.', 'thousands_sep' => ',', 'rate' => 20.0],
];

$cfg = $currencyConfigs[$country] ?? $currencyConfigs['py'];

// 1. Cargar directamente los precios oficiales sincronizados desde assets/data/prices/
$possibleDirs = [
    __DIR__ . '/../assets/data/prices',
    dirname(__DIR__) . '/assets/data/prices',
    (isset($_SERVER['DOCUMENT_ROOT']) ? rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/assets/data/prices' : null)
];
$pricesDir = null;
foreach ($possibleDirs as $dir) {
    if ($dir && is_dir($dir)) {
        $pricesDir = $dir;
        break;
    }
}

$localDomains = [];
$usdDomains = [];
$pyDomains = [];

if ($pricesDir) {
    // País actual
    $targetFile = $pricesDir . '/' . $country . '.json';
    if (file_exists($targetFile)) {
        $json = json_decode(file_get_contents($targetFile), true);
        if (isset($json['domains']) && is_array($json['domains'])) {
            $localDomains = $json['domains'];
        }
    }
    $targetExtFile = $pricesDir . '/domains_extended_' . $country . '.json';
    if (file_exists($targetExtFile)) {
        $jsonExt = json_decode(file_get_contents($targetExtFile), true);
        if (isset($jsonExt['domains']) && is_array($jsonExt['domains'])) {
            $localDomains = array_merge($localDomains, $jsonExt['domains']);
        }
    }

    // Referencia USD
    $usFile = $pricesDir . '/us.json';
    if (file_exists($usFile)) {
        $jsonUs = json_decode(file_get_contents($usFile), true);
        if (isset($jsonUs['domains']) && is_array($jsonUs['domains'])) {
            $usdDomains = $jsonUs['domains'];
        }
    }
    $usExtFile = $pricesDir . '/domains_extended_us.json';
    if (file_exists($usExtFile)) {
        $jsonUsExt = json_decode(file_get_contents($usExtFile), true);
        if (isset($jsonUsExt['domains']) && is_array($jsonUsExt['domains'])) {
            $usdDomains = array_merge($usdDomains, $jsonUsExt['domains']);
        }
    }

    // Referencia PY
    $pyFile = $pricesDir . '/py.json';
    if (file_exists($pyFile)) {
        $jsonPy = json_decode(file_get_contents($pyFile), true);
        if (isset($jsonPy['domains']) && is_array($jsonPy['domains'])) {
            $pyDomains = $jsonPy['domains'];
        }
    }
    $pyExtFile = $pricesDir . '/domains_extended_py.json';
    if (file_exists($pyExtFile)) {
        $jsonPyExt = json_decode(file_get_contents($pyExtFile), true);
        if (isset($jsonPyExt['domains']) && is_array($jsonPyExt['domains'])) {
            $pyDomains = array_merge($pyDomains, $jsonPyExt['domains']);
        }
    }
}

// Conectar a BD MySQL de WHMCS si está disponible para unir el catálogo completo (>500 TLDs)
try {
    if (file_exists(__DIR__ . '/../conexion/precios-dominios.php')) {
        @include_once __DIR__ . '/../conexion/precios-dominios.php';
        if (function_exists('obtenerPreciosDominiosBD')) {
            $dbPrecios = obtenerPreciosDominiosBD($conexion ?? null, $country);
            if (!empty($dbPrecios)) {
                foreach ($dbPrecios as $ext => $p) {
                    $clean = ltrim($ext, '.');
                    if (!isset($localDomains[$clean])) {
                        $localDomains[$clean] = [
                            'register' => $p['local'] ?? ($country === 'py' ? $p['gs'] : $p['usd']),
                            'renew'    => $p['renew_local'] ?? $p['local'] ?? ($country === 'py' ? $p['gs'] : $p['renew_usd']),
                            'transfer' => $p['transfer_local'] ?? $p['local'] ?? ($country === 'py' ? $p['gs'] : $p['renew_usd']),
                        ];
                    }
                }
            }
        }
    }
} catch (\Throwable $e) {}

$destacados = [
    '.com', '.net', '.org', '.biz', '.info', '.xyz',
    '.online', '.site', '.tech', '.store', '.app', '.pro',
    '.blog', '.club', '.vip', '.fun', '.top', '.click',
    '.us', '.tv', '.la', '.srl', '.pet', '.bet'
];

$dominios = [];
$incluidos = [];

function armarDominioItem($dotExt, $dInfo, $cfg, $country, $usdDomains, $pyDomains) {
    $cleanExt = ltrim($dotExt, '.');

    $regNum = isset($dInfo['register']) ? (float)$dInfo['register'] : null;
    $renNum = isset($dInfo['renew']) ? (float)$dInfo['renew'] : $regNum;
    $traNum = isset($dInfo['transfer']) ? (float)$dInfo['transfer'] : $regNum;

    // USD
    $usdNum = null;
    $renewUsdNum = null;
    if (isset($usdDomains[$cleanExt]['register'])) {
        $usdNum = (float)$usdDomains[$cleanExt]['register'];
        $renewUsdNum = isset($usdDomains[$cleanExt]['renew']) ? (float)$usdDomains[$cleanExt]['renew'] : $usdNum;
    } elseif ($country === 'us' && $regNum !== null) {
        $usdNum = $regNum;
        $renewUsdNum = $renNum;
    } elseif ($regNum !== null && $cfg['rate'] > 0) {
        $usdNum = round($regNum / $cfg['rate'], 2);
        $renewUsdNum = round($renNum / $cfg['rate'], 2);
    }

    // GS
    $gsNum = null;
    if (isset($pyDomains[$cleanExt]['register'])) {
        $gsNum = round((float)$pyDomains[$cleanExt]['register']);
    } elseif ($country === 'py' && $regNum !== null) {
        $gsNum = round($regNum);
    } elseif ($usdNum !== null) {
        $gsNum = round($usdNum * 7800);
    }

    // Formateo local garantizado
    $sym = $cfg['symbol'];
    $regStr = ($regNum !== null) ? number_format($regNum, $cfg['decimals'], $cfg['dec_sep'], $cfg['thousands_sep']) : '';
    $renStr = ($renNum !== null) ? number_format($renNum, $cfg['decimals'], $cfg['dec_sep'], $cfg['thousands_sep']) : $regStr;
    $traStr = ($traNum !== null) ? number_format($traNum, $cfg['decimals'], $cfg['dec_sep'], $cfg['thousands_sep']) : $renStr;

    // Fallbacks si vienen vacíos
    if ($regStr === '' && $country === 'py' && $gsNum !== null) {
        $regStr = number_format($gsNum, 0, ',', '.');
    }
    if ($renStr === '' && $country === 'py' && $gsNum !== null) {
        $renStr = number_format($gsNum, 0, ',', '.');
    }
    if ($traStr === '' && $country === 'py' && $gsNum !== null) {
        $traStr = number_format($gsNum, 0, ',', '.');
    }

    $usdFormatted = ($usdNum !== null) ? number_format($usdNum, 2, '.', '') : '0.00';
    $renewUsdFormatted = ($renewUsdNum !== null) ? number_format($renewUsdNum, 2, '.', '') : $usdFormatted;
    $gsFormatted = ($gsNum !== null) ? number_format($gsNum, 0, ',', '.') : '0';

    return [
        'extension'          => $dotExt,
        'register'           => $regStr,
        'renew'              => $renStr,
        'transfer'           => $traStr,
        'register_formatted' => $regStr !== '' ? ($sym . ' ' . $regStr) : ($sym . ' 0'),
        'renew_formatted'    => $renStr !== '' ? ($sym . ' ' . $renStr) : ($sym . ' 0'),
        'transfer_formatted' => $traStr !== '' ? ($sym . ' ' . $traStr) : ($sym . ' 0'),
        'currency'           => $cfg['currency'],
        'currency_symbol'    => $sym,
        'local_price'        => $regStr,
        'usd'                => $usdFormatted,
        'renew_usd'          => $renewUsdFormatted,
        'gs'                 => $gsFormatted
    ];
}

// 1. Agregar destacados primero
foreach ($destacados as $ext) {
    $clean = ltrim($ext, '.');
    if (isset($localDomains[$clean])) {
        $dominios[] = armarDominioItem($ext, $localDomains[$clean], $cfg, $country, $usdDomains, $pyDomains);
        $incluidos[$clean] = true;
    }
}

// 2. Agregar resto del catálogo (excluyendo dominios paraguayos que van en sección manual)
foreach ($localDomains as $clean => $dInfo) {
    if (isset($incluidos[$clean])) continue;
    if (substr($clean, -3) === '.py' || $clean === 'py') continue;

    $dotExt = '.' . $clean;
    $dominios[] = armarDominioItem($dotExt, $dInfo, $cfg, $country, $usdDomains, $pyDomains);
}

echo json_encode($dominios, JSON_UNESCAPED_UNICODE);
