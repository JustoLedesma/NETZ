<?php
/**
 * Devuelve en JSON los dominios de activación automática (extensión + costo de Registro, Renovación y Transferencia).
 * Soporta parametrización por país (?country=py, ?country=br, ?country=us, etc.)
 * Todos los precios se retornan estrictamente en la moneda oficial del país solicitado.
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../conexion/precios-dominios.php';

$country = isset($_GET['country']) ? strtolower(trim($_GET['country'])) : (isset($_POST['country']) ? strtolower(trim($_POST['country'])) : 'py');
$precios = obtenerPreciosDominiosBD($conexion ?? null, $country);

$destacados = [
    '.com', '.net', '.org', '.biz', '.info', '.xyz',
    '.online', '.site', '.tech', '.store', '.app', '.pro',
    '.blog', '.club', '.vip', '.fun', '.top', '.click',
    '.us', '.tv', '.la', '.srl', '.pet', '.bet'
];

$dominios = [];
$incluidos = [];

// 1. Agregar extensiones destacadas primero
foreach ($destacados as $ext) {
    if (isset($precios[$ext])) {
        $p = $precios[$ext];
        $sym = $p['currency_symbol'];
        $reg = $p['local_formatted'];
        $ren = $p['renew_formatted'] ?? $reg;
        $tra = $p['transfer_formatted'] ?? $reg;

        $usdFormatted = ($p['usd'] !== null) ? number_format($p['usd'], 2, '.', '') : '0.00';
        $renewUsdFormatted = ($p['renew_usd'] !== null) ? number_format($p['renew_usd'], 2, '.', '') : $usdFormatted;

        $dominios[] = [
            'extension'          => $ext,
            'register'           => $reg,
            'renew'              => $ren,
            'transfer'           => $tra,
            'register_formatted' => $sym . ' ' . $reg,
            'renew_formatted'    => $sym . ' ' . $ren,
            'transfer_formatted' => $sym . ' ' . $tra,
            'currency'           => $p['currency'],
            'currency_symbol'    => $sym,
            'local_price'        => $reg,
            'usd'                => $usdFormatted,
            'renew_usd'          => $renewUsdFormatted,
            'gs'                 => number_format($p['gs'] ?? 0, 0, ',', '.')
        ];
        $incluidos[$ext] = true;
    }
}

// 2. Agregar cualquier otra extensión automática disponible en el catálogo
foreach ($precios as $ext => $p) {
    if (isset($incluidos[$ext])) continue;
    if (substr($ext, -3) === '.py') continue; // Los dominios de Paraguay van en la sección manual

    $sym = $p['currency_symbol'];
    $reg = $p['local_formatted'];
    $ren = $p['renew_formatted'] ?? $reg;
    $tra = $p['transfer_formatted'] ?? $reg;

    $usdFormatted = ($p['usd'] !== null) ? number_format($p['usd'], 2, '.', '') : '0.00';
    $renewUsdFormatted = ($p['renew_usd'] !== null) ? number_format($p['renew_usd'], 2, '.', '') : $usdFormatted;

    $dominios[] = [
        'extension'          => $ext,
        'register'           => $reg,
        'renew'              => $ren,
        'transfer'           => $tra,
        'register_formatted' => $sym . ' ' . $reg,
        'renew_formatted'    => $sym . ' ' . $ren,
        'transfer_formatted' => $sym . ' ' . $tra,
        'currency'           => $p['currency'],
        'currency_symbol'    => $sym,
        'local_price'        => $reg,
        'usd'                => $usdFormatted,
        'renew_usd'          => $renewUsdFormatted,
        'gs'                 => number_format($p['gs'] ?? 0, 0, ',', '.')
    ];
}

echo json_encode($dominios, JSON_UNESCAPED_UNICODE);
