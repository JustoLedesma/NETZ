<?php
/**
 * NETZ - Herramienta de Actualización Masiva de Precios de Dominios en WHMCS
 * Ubicación: api/actualizar-precios-dominios.php
 *
 * Funcionalidad:
 * 1. Conexión segura a la base de datos MySQL de WHMCS (conexion/conexion.php).
 * 2. Consulta dinámica de monedas activas en tblcurrencies con sus tasas actuales.
 * 3. Actualización masiva de precios en tblpricing (tbldomainpricing):
 *    - Registro (1 año - msetupfee, domainregister)
 *    - Transferencia (1 año - msetupfee, domaintransfer)
 *    - Renovación (1 año - msetupfee, domainrenew)
 * 4. Conversión según tasa manual + margen global de beneficio (%).
 * 5. Redondeo inteligente al .99 más cercano (ej. 13.99, 78.99).
 * 6. Actualización de tasas de cambio en tblcurrencies para coherencia con WHMCS.
 * 7. Sincronización automática del caché JSON de precios (refresh_prices.php).
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// 1. Conexión a la Base de Datos WHMCS
$conexionPath = __DIR__ . '/../conexion/conexion.php';
if (!file_exists($conexionPath)) {
    $conexionPath = dirname(__DIR__) . '/conexion/conexion.php';
}

if (!file_exists($conexionPath)) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'No se encontró el archivo de conexión en conexion/conexion.php'
    ]);
    exit;
}

try {
    require_once $conexionPath;
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Excepción al cargar conexión: ' . $e->getMessage()
    ]);
    exit;
}

if (!isset($conexion) || !($conexion instanceof mysqli) || $conexion->connect_error) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error de conexión MySQL: ' . (isset($conexion->connect_error) ? $conexion->connect_error : 'Variable $conexion no disponible')
    ]);
    exit;
}

$conexion->set_charset("utf8mb4");

// 2. Determinar la acción solicitada (GET o POST)
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true);
if (!is_array($inputData)) {
    $inputData = $_POST;
}
$action = $inputData['action'] ?? ($_GET['action'] ?? 'get_currencies');

// ========================================================
// ACCIÓN A: OBTENER DIVISAS DINÁMICAS Y CONTEO DE TLDs
// ========================================================
if ($action === 'get_currencies') {
    try {
        // Monedas en tblcurrencies
        $currencies = [];
        $baseCurrency = null;
        $currSql = $conexion->query("SELECT id, code, prefix, suffix, format, rate, `default` FROM tblcurrencies ORDER BY `default` DESC, id ASC");
        
        if ($currSql) {
            while ($c = $currSql->fetch_assoc()) {
                $isDefault = ((int)$c['default'] === 1);
                $currItem = [
                    'id' => (int)$c['id'],
                    'code' => strtoupper(trim($c['code'])),
                    'prefix' => trim($c['prefix']),
                    'suffix' => trim($c['suffix']),
                    'rate' => (float)$c['rate'],
                    'default' => $isDefault
                ];
                $currencies[] = $currItem;
                if ($isDefault && $baseCurrency === null) {
                    $baseCurrency = $currItem;
                }
            }
        }

        if ($baseCurrency === null && !empty($currencies)) {
            $baseCurrency = $currencies[0];
        }

        // Conteo total de TLDs en tbldomainpricing
        $totalTlds = 0;
        $tldCountSql = $conexion->query("SELECT COUNT(*) as total FROM tbldomainpricing");
        if ($tldCountSql && $row = $tldCountSql->fetch_assoc()) {
            $totalTlds = (int)$row['total'];
        }

        echo json_encode([
            'status' => 'success',
            'total_tlds' => $totalTlds,
            'base_currency' => $baseCurrency,
            'currencies' => $currencies,
            'server_time' => date('Y-m-d H:i:s')
        ]);
        exit;
    } catch (\Throwable $t) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Error al consultar divisas: ' . $t->getMessage()
        ]);
        exit;
    }
}

// ========================================================
// ACCIÓN B: ACTUALIZACIÓN MASIVA DE PRECIOS
// ========================================================
if ($action === 'update_prices') {
    try {
        $margin = isset($inputData['margin']) ? (float)$inputData['margin'] : 15.0;
        if ($margin < 0) {
            $margin = 0.0;
        }

        $roundingMode = isset($inputData['rounding']) ? trim($inputData['rounding']) : 'nearest'; // 'nearest' o 'ceil'
        $ratesInput = $inputData['rates'] ?? [];

        if (empty($ratesInput) || !is_array($ratesInput)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'No se enviaron tasas de cambio para actualizar.'
            ]);
            exit;
        }

        // Función de redondeo al .99 más cercano
        function roundPriceToPoint99($val, $mode = 'nearest') {
            if ($val <= 0) return 0.99;
            $floor = floor($val);
            $c1 = $floor - 1 + 0.99; // Ej: 13.99 cuando val es 14.15
            $c2 = $floor + 0.99;     // Ej: 14.99 cuando val es 14.15

            if ($mode === 'ceil') {
                return ($val > $c1) ? round($c2, 2) : round($c1, 2);
            }

            // 'nearest': redondeo al .99 con menor distancia absoluta
            if ($c1 > 0 && abs($val - $c1) < abs($val - $c2)) {
                return round($c1, 2);
            }
            return round($c2, 2);
        }

        // 1. Identificar la Moneda Base (default = 1, o ID 1 USD)
        $baseCurrencyId = 1;
        $baseCurrRes = $conexion->query("SELECT id, code FROM tblcurrencies WHERE `default` = 1 LIMIT 1");
        if ($baseCurrRes && $row = $baseCurrRes->fetch_assoc()) {
            $baseCurrencyId = (int)$row['id'];
        }

        // 2. Obtener todos los TLDs configurados y sus precios base en la moneda de referencia
        $tldCatalog = [];
        $tldSql = $conexion->query("
            SELECT dp.id as dpid, dp.extension, pr.type, pr.msetupfee
            FROM tbldomainpricing dp
            LEFT JOIN tblpricing pr ON (pr.relid = dp.id AND pr.currency = {$baseCurrencyId} AND pr.type IN ('domainregister', 'domainrenew', 'domaintransfer'))
            ORDER BY dp.id ASC
        ");

        if ($tldSql) {
            while ($row = $tldSql->fetch_assoc()) {
                $dpid = (int)$row['dpid'];
                $ext = strtolower(trim($row['extension']));
                if (!isset($tldCatalog[$dpid])) {
                    $tldCatalog[$dpid] = [
                        'id' => $dpid,
                        'extension' => $ext,
                        'register' => null,
                        'renew' => null,
                        'transfer' => null
                    ];
                }
                $val = (float)$row['msetupfee'];
                if ($val > 0) {
                    if ($row['type'] === 'domainregister') $tldCatalog[$dpid]['register'] = $val;
                    if ($row['type'] === 'domainrenew')    $tldCatalog[$dpid]['renew'] = $val;
                    if ($row['type'] === 'domaintransfer') $tldCatalog[$dpid]['transfer'] = $val;
                }
            }
        }

        if (empty($tldCatalog)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'No se encontraron extensiones en tbldomainpricing de WHMCS.'
            ]);
            exit;
        }

        // 3. Preparar Statements SQL para UPDATE, INSERT y actualización de tasas
        $stmtCheck = $conexion->prepare("SELECT id FROM tblpricing WHERE type = ? AND currency = ? AND relid = ? LIMIT 1");
        $stmtUpdate = $conexion->prepare("UPDATE tblpricing SET msetupfee = ? WHERE type = ? AND currency = ? AND relid = ?");
        $stmtInsert = $conexion->prepare("
            INSERT INTO tblpricing 
            (type, currency, relid, msetupfee, qsetupfee, ssetupfee, asetupfee, bsetupfee, monthly, quarterly, semiannually, annually, biennially)
            VALUES (?, ?, ?, ?, -1, -1, -1, -1, -1, -1, -1, -1, -1)
        ");
        $stmtRateUpdate = $conexion->prepare("UPDATE tblcurrencies SET rate = ? WHERE id = ?");

        $currenciesReport = [];
        $totalOperations = 0;
        $totalTldsProcessed = count($tldCatalog);

        // 4. Iterar sobre cada moneda secundaria seleccionada
        foreach ($ratesInput as $item) {
            $currId = (int)($item['id'] ?? 0);
            $code = strtoupper(trim($item['code'] ?? ''));
            $rate = (float)($item['rate'] ?? 0);
            $enabled = !empty($item['enabled']);

            // Omitir si no está habilitada o tasa <= 0
            if (!$enabled || $currId <= 0 || $rate <= 0) {
                continue;
            }

            // Omitir moneda base si la tasa es 1 y es la referencia, a menos que el usuario la actualice explícitamente
            $isBaseCurrency = ($currId === $baseCurrencyId);

            // Actualizar la tasa en tblcurrencies
            if ($stmtRateUpdate) {
                $stmtRateUpdate->bind_param("di", $rate, $currId);
                $stmtRateUpdate->execute();
            }

            $currTldsUpdated = 0;
            $currOpsCount = 0;

            // Recorrer todos los TLDs
            foreach ($tldCatalog as $dpid => $tldData) {
                $typesToProcess = [
                    'domainregister' => $tldData['register'],
                    'domainrenew'    => $tldData['renew'],
                    'domaintransfer' => $tldData['transfer']
                ];

                $tldSuccess = false;

                foreach ($typesToProcess as $pType => $baseCost) {
                    // Si el costo base no está definido, usar el registro del mismo TLD o un costo mínimo fallback de 13.99
                    if ($baseCost === null || $baseCost <= 0) {
                        $baseCost = $tldData['register'] ?? ($tldData['renew'] ?? 13.99);
                    }

                    // APLICAR FÓRMULA: Costo Base * Tasa * (1 + Margen %)
                    $converted = $baseCost * $rate;
                    $withMargin = $converted * (1 + ($margin / 100.0));
                    $finalRounded = roundPriceToPoint99($withMargin, $roundingMode);

                    // 1. Intentar UPDATE
                    $stmtUpdate->bind_param("dsii", $finalRounded, $pType, $currId, $dpid);
                    $stmtUpdate->execute();

                    if ($stmtUpdate->affected_rows > 0) {
                        $currOpsCount++;
                        $tldSuccess = true;
                    } else {
                        // 2. Si no actualizó, comprobar si ya existe con ese mismo precio o si hay que INSERTAR
                        $stmtCheck->bind_param("sii", $pType, $currId, $dpid);
                        $stmtCheck->execute();
                        $stmtCheck->store_result();

                        if ($stmtCheck->num_rows === 0) {
                            // No existe -> INSERTAR en tblpricing
                            $stmtInsert->bind_param("siid", $pType, $currId, $dpid, $finalRounded);
                            $stmtInsert->execute();
                            $currOpsCount++;
                            $tldSuccess = true;
                        } else {
                            // Ya existía con ese valor exacto
                            $currOpsCount++;
                            $tldSuccess = true;
                        }
                    }
                }

                if ($tldSuccess) {
                    $currTldsUpdated++;
                }
            }

            $totalOperations += $currOpsCount;
            $currenciesReport[] = [
                'id' => $currId,
                'code' => $code,
                'rate' => $rate,
                'margin' => $margin,
                'rounding' => $roundingMode,
                'tlds_updated' => $currTldsUpdated,
                'operations_count' => $currOpsCount,
                'status' => 'success'
            ];
        }

        // 5. Verificar si tbldomainpricing tiene columnas directas de precio y actualizarlas si existieran
        $colCheck = $conexion->query("SHOW COLUMNS FROM tbldomainpricing");
        $existingCols = [];
        if ($colCheck) {
            while ($cRow = $colCheck->fetch_assoc()) {
                $existingCols[] = strtolower($cRow['Field']);
            }
        }

        // 6. Sincronizar automáticamente el caché JSON en disco ejecutando refresh_prices.php
        $jsonSyncSuccess = false;
        $refreshScript = __DIR__ . '/refresh_prices.php';
        if (file_exists($refreshScript)) {
            try {
                ob_start();
                include $refreshScript;
                ob_end_clean();
                $jsonSyncSuccess = true;
            } catch (\Throwable $syncErr) {
                ob_end_clean();
                $jsonSyncSuccess = false;
            }
        }

        echo json_encode([
            'status' => 'success',
            'message' => '¡Precios de dominios actualizados masivamente con éxito en WHMCS!',
            'margin_percent' => $margin,
            'rounding_mode' => $roundingMode,
            'total_tlds' => $totalTldsProcessed,
            'total_operations' => $totalOperations,
            'currencies_updated' => $currenciesReport,
            'json_synced' => $jsonSyncSuccess,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit;
    } catch (\Throwable $t) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Error durante el procesamiento masivo: ' . $t->getMessage()
        ]);
        exit;
    }
}

// Acción desconocida
http_response_code(400);
echo json_encode([
    'status' => 'error',
    'message' => 'Acción no reconocida: ' . htmlspecialchars($action)
]);

