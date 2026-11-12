<?php
/**
 * Devuelve en JSON los dominios de activación automática (extensión + costo).
 * Soporta parametrización por país (?country=br, ?country=py, ?country=ar, etc.)
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../conexion/precios-dominios.php';

$country = isset($_GET['country']) ? strtolower(trim($_GET['country'])) : (isset($_POST['country']) ? strtolower(trim($_POST['country'])) : 'py');
$precios = obtenerPreciosDominiosBD($conexion ?? null, $country);

$destacados = [
    '.com', '.net', '.org', '.online', '.info', '.biz',
    '.click', '.us', '.top', '.pro', '.app', '.store', '.tech', '.site'
];

$dominios = [];

foreach ($destacados as $ext) {
    if (isset($precios[$ext])) {
        $p = $precios[$ext];
        $valLocal = ($country === 'py') ? number_format($p['gs'], 0, ',', '.') : $p['local_formatted'];
        $usdFormatted = ($p['usd'] !== null) ? number_format($p['usd'], 2, '.', '') : '0.00';
        $renewUsdFormatted = ($p['renew_usd'] !== null) ? number_format($p['renew_usd'], 2, '.', '') : $usdFormatted;

        $dominios[] = [
            'extension'       => $ext,
            'usd'             => $usdFormatted,
            'renew_usd'       => $renewUsdFormatted,
            'gs'              => number_format($p['gs'], 0, ',', '.'),
            'currency'        => $p['currency'],
            'currency_symbol' => $p['currency_symbol'],
            'local_price'     => $valLocal,
        ];
    }
}

if (empty($dominios)) {
    foreach ($precios as $ext => $p) {
        if (substr($ext, -3) === '.py') continue;
        $valLocal = ($country === 'py') ? number_format($p['gs'], 0, ',', '.') : $p['local_formatted'];
        $usdFormatted = ($p['usd'] !== null) ? number_format($p['usd'], 2, '.', '') : '0.00';
        $renewUsdFormatted = ($p['renew_usd'] !== null) ? number_format($p['renew_usd'], 2, '.', '') : $usdFormatted;

        $dominios[] = [
            'extension'       => $ext,
            'usd'             => $usdFormatted,
            'renew_usd'       => $renewUsdFormatted,
            'gs'              => number_format($p['gs'], 0, ',', '.'),
            'currency'        => $p['currency'],
            'currency_symbol' => $p['currency_symbol'],
            'local_price'     => $valLocal,
        ];
    }
}

echo json_encode($dominios, JSON_UNESCAPED_UNICODE);
