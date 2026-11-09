<?php
/**
 * Devuelve en JSON los dominios de activación automática (extensión + costo).
 * Soporta parametrización por país (?country=br, ?country=py, ?country=ar, etc.)
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../conexion/conexion.php';

$country = isset($_GET['country']) ? strtolower(trim($_GET['country'])) : (isset($_POST['country']) ? strtolower(trim($_POST['country'])) : 'py');

$countryCurrencyMap = [
    'py' => ['currency' => 'PYG', 'symbol' => 'GS.', 'decimals' => 0, 'default_rate' => 7800],
    'br' => ['currency' => 'BRL', 'symbol' => 'R$', 'decimals' => 2, 'default_rate' => 5.60],
    'ar' => ['currency' => 'ARS', 'symbol' => '$', 'decimals' => 2, 'default_rate' => 1200.0],
    'es' => ['currency' => 'EUR', 'symbol' => '€', 'decimals' => 2, 'default_rate' => 0.92],
    'us' => ['currency' => 'USD', 'symbol' => 'USD', 'decimals' => 2, 'default_rate' => 1.0],
    'cl' => ['currency' => 'CLP', 'symbol' => '$', 'decimals' => 0, 'default_rate' => 950.0],
    'co' => ['currency' => 'COP', 'symbol' => '$', 'decimals' => 0, 'default_rate' => 4200.0],
    'mx' => ['currency' => 'MXN', 'symbol' => '$', 'decimals' => 2, 'default_rate' => 20.0],
];

$cfg = $countryCurrencyMap[$country] ?? $countryCurrencyMap['py'];
$targetCurrency = $cfg['currency'];
$symbol = $cfg['symbol'];
$decimals = $cfg['decimals'];
$rate = $cfg['default_rate'];

if ($conexion && !$conexion->connect_error) {
    $currRes = $conexion->query("SELECT code, prefix, suffix, rate FROM tblcurrencies WHERE code = '" . $conexion->real_escape_string($targetCurrency) . "' LIMIT 1");
    if ($currRes && $cRow = $currRes->fetch_assoc()) {
        if (!empty($cRow['rate']) && (float)$cRow['rate'] > 0) {
            $rate = (float)$cRow['rate'];
        }
        if (!empty($cRow['prefix'])) {
            $symbol = trim($cRow['prefix']);
        }
    }
}

$dominios = array();
$relid_procesados = array();

$sql = $conexion->query("
    SELECT * FROM tbldomainpricing
    INNER JOIN tblpricing ON tbldomainpricing.id = tblpricing.relid
    ORDER BY tbldomainpricing.id ASC
");

if ($sql) {
    while ($resultado = $sql->fetch_assoc()) {
        $relid_actual = $resultado['relid'];

        // Se queda solo con la primera fila de cada dominio
        if (in_array($relid_actual, $relid_procesados)) {
            continue;
        }
        $relid_procesados[] = $relid_actual;

        $usd = (float) $resultado['msetupfee'];
        $gs  = number_format($usd * 7800, 0, ',', '.');

        if ($country === 'py') {
            $localFormatted = $gs;
        } elseif ($country === 'us') {
            $localFormatted = number_format($usd, 2, '.', '.');
        } else {
            $val = round($usd * $rate, $decimals);
            $localFormatted = number_format($val, $decimals, ($country === 'br' ? ',' : '.'), ($country === 'br' ? '.' : ','));
        }

        $dominios[] = array(
            'extension'       => $resultado['extension'],
            'usd'             => number_format($usd, 2, '.', '.'),
            'gs'              => $gs,
            'currency'        => $targetCurrency,
            'currency_symbol' => $symbol,
            'local_price'     => $localFormatted,
        );
    }
}

echo json_encode($dominios, JSON_UNESCAPED_UNICODE);
