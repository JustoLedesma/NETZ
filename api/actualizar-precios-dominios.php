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

/**
 * Asegurar que las tablas de persistencia para costos de Brixly existan en MySQL
 */
function ensureBrixlyTablesExist($conexion) {
    static $checked = false;
    if ($checked) return;

    $sql1 = "
        CREATE TABLE IF NOT EXISTS `tblbrixly_domain_costs` (
            `extension` VARCHAR(64) NOT NULL PRIMARY KEY,
            `register_cost` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            `transfer_cost` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            `renew_cost` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            `register_retail` DECIMAL(10,2) DEFAULT NULL,
            `transfer_retail` DECIMAL(10,2) DEFAULT NULL,
            `renew_retail` DECIMAL(10,2) DEFAULT NULL,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    $conexion->query($sql1);

    $sql2 = "
        CREATE TABLE IF NOT EXISTS `tblbrixly_product_costs` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `product_name` VARCHAR(255) NOT NULL,
            `billing_cycle` VARCHAR(64) DEFAULT NULL,
            `setup_fee` DECIMAL(10,2) DEFAULT 0.00,
            `recurring_cost` DECIMAL(10,2) DEFAULT 0.00,
            `retail_rec` DECIMAL(10,2) DEFAULT 0.00,
            `saving_percent` VARCHAR(32) DEFAULT NULL,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY `uniq_prod_cycle` (`product_name`, `billing_cycle`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    $conexion->query($sql2);

    $checked = true;
}

/**
 * Parser de respaldo en PHP para archivos CSV/TXT de Brixly si se envían directamente
 */
function parseBrixlyUploadedFile($filePath, $fileName) {
    $tlds = [];
    $products = [];
    $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    if ($ext === 'csv' || $ext === 'txt') {
        $handle = fopen($filePath, 'r');
        if ($handle) {
            $isTldSection = false;
            $isProductSection = false;
            while (($row = fgetcsv($handle, 4000, ',')) !== false) {
                if (empty($row) || (count($row) === 1 && trim($row[0]) === '')) continue;
                $col0 = strtolower(trim($row[0] ?? ''));
                if ($col0 === 'product') {
                    $isProductSection = true;
                    $isTldSection = false;
                    continue;
                }
                if ($col0 === 'tld') {
                    $isTldSection = true;
                    $isProductSection = false;
                    continue;
                }
                if ($isProductSection && !empty($row[0])) {
                    $products[] = [
                        'product_name' => trim($row[0]),
                        'billing_cycle' => trim($row[1] ?? ''),
                        'setup_fee' => (float)($row[2] ?? 0),
                        'recurring_cost' => (float)($row[3] ?? 0),
                        'retail_rec' => (float)($row[4] ?? 0),
                        'saving_percent' => trim($row[6] ?? '')
                    ];
                }
                if ($isTldSection && !empty($row[0])) {
                    $tlds[] = [
                        'extension' => trim($row[0]),
                        'register_cost' => (float)($row[1] ?? 0),
                        'register_retail' => (float)($row[2] ?? 0),
                        'transfer_cost' => (float)($row[4] ?? 0),
                        'transfer_retail' => (float)($row[5] ?? 0),
                        'renew_cost' => (float)($row[7] ?? 0),
                        'renew_retail' => (float)($row[8] ?? 0)
                    ];
                }
            }
            fclose($handle);
        }
    }
    return ['tlds' => $tlds, 'products' => $products];
}


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

        // Consultar catálogo completo de dominios con precios ya creados en WHMCS y costo Brixly / Base USD
        $baseCurrencyId = $baseCurrency ? (int)$baseCurrency['id'] : 1;
        $domainsCatalog = [];
        $domQuery = $conexion->query("
            SELECT dp.id as dpid, dp.extension, dp.autoreg,
                   pr.currency, pr.type, pr.msetupfee
            FROM tbldomainpricing dp
            LEFT JOIN tblpricing pr ON (pr.relid = dp.id AND pr.type IN ('domainregister', 'domainrenew', 'domaintransfer'))
            ORDER BY dp.id ASC
        ");

        if ($domQuery) {
            while ($row = $domQuery->fetch_assoc()) {
                $dpid = (int)$row['dpid'];
                $ext = strtolower(trim($row['extension']));
                if ($ext !== '' && substr($ext, 0, 1) !== '.') {
                    $ext = '.' . $ext;
                }
                $autoreg = trim($row['autoreg'] ?? '');
                $currId = (int)($row['currency'] ?? 0);
                $type = $row['type'] ?? '';
                $mfee = isset($row['msetupfee']) ? (float)$row['msetupfee'] : null;

                if (!isset($domainsCatalog[$dpid])) {
                    $domainsCatalog[$dpid] = [
                        'id' => $dpid,
                        'extension' => $ext,
                        'autoreg' => $autoreg ?: 'brixly',
                        'cost_brixly' => null,
                        'prices' => []
                    ];
                }

                if ($currId > 0 && $type !== '') {
                    if (!isset($domainsCatalog[$dpid]['prices'][$currId])) {
                        $domainsCatalog[$dpid]['prices'][$currId] = [
                            'register' => null,
                            'renew' => null,
                            'transfer' => null
                        ];
                    }
                    if ($type === 'domainregister') $domainsCatalog[$dpid]['prices'][$currId]['register'] = $mfee;
                    if ($type === 'domainrenew')    $domainsCatalog[$dpid]['prices'][$currId]['renew'] = $mfee;
                    if ($type === 'domaintransfer') $domainsCatalog[$dpid]['prices'][$currId]['transfer'] = $mfee;

                    // Si es la moneda base (USD), asignar como costo de proveedor (Brixly)
                    if ($currId === $baseCurrencyId && $type === 'domainregister' && $mfee !== null && $mfee > 0) {
                        $domainsCatalog[$dpid]['cost_brixly'] = $mfee;
                    }
                }
            }
        }

        // Consultar costos de referencia Brixly guardados en MySQL
        ensureBrixlyTablesExist($conexion);
        $brixlyCosts = [];
        $brixlyRes = $conexion->query("SELECT extension, register_cost, transfer_cost, renew_cost, register_retail, transfer_retail, renew_retail FROM tblbrixly_domain_costs");
        if ($brixlyRes) {
            while ($b = $brixlyRes->fetch_assoc()) {
                $extClean = strtolower(trim($b['extension']));
                if ($extClean !== '' && substr($extClean, 0, 1) !== '.') {
                    $extClean = '.' . $extClean;
                }
                $brixlyCosts[$extClean] = [
                    'register' => (float)$b['register_cost'],
                    'transfer' => (float)$b['transfer_cost'],
                    'renew'    => (float)$b['renew_cost'],
                    'register_retail' => $b['register_retail'] !== null ? (float)$b['register_retail'] : null,
                    'transfer_retail' => $b['transfer_retail'] !== null ? (float)$b['transfer_retail'] : null,
                    'renew_retail'    => $b['renew_retail'] !== null ? (float)$b['renew_retail'] : null
                ];
            }
        }

        // Conteo de productos Cloud en MySQL
        $cloudCount = 0;
        $cloudCountRes = $conexion->query("SELECT COUNT(*) as total FROM tblbrixly_product_costs");
        if ($cloudCountRes && $cRow = $cloudCountRes->fetch_assoc()) {
            $cloudCount = (int)$cRow['total'];
        }

        // Asignar costos Brixly específicos a cada TLD
        foreach ($domainsCatalog as &$dItem) {
            $extKey = $dItem['extension'];
            if (isset($brixlyCosts[$extKey])) {
                $dItem['brixly_costs'] = $brixlyCosts[$extKey];
                $dItem['cost_brixly'] = $brixlyCosts[$extKey]['register'];
                $dItem['has_brixly'] = true;
            } else {
                $fallbackReg = $dItem['prices'][$baseCurrencyId]['register'] ?? 13.99;
                $fallbackRen = $dItem['prices'][$baseCurrencyId]['renew'] ?? $fallbackReg;
                $fallbackTra = $dItem['prices'][$baseCurrencyId]['transfer'] ?? $fallbackReg;
                $dItem['brixly_costs'] = [
                    'register' => (float)$fallbackReg,
                    'renew'    => (float)$fallbackRen,
                    'transfer' => (float)$fallbackTra,
                    'register_retail' => null,
                    'transfer_retail' => null,
                    'renew_retail'    => null
                ];
                $dItem['cost_brixly'] = (float)$fallbackReg;
                $dItem['has_brixly'] = false;
            }
        }
        unset($dItem);

        echo json_encode([
            'status' => 'success',
            'total_tlds' => $totalTlds,
            'base_currency' => $baseCurrency,
            'currencies' => $currencies,
            'domains' => array_values($domainsCatalog),
            'brixly_stats' => [
                'total_tlds_in_db' => count($brixlyCosts),
                'total_products_in_db' => $cloudCount
            ],
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
// ACCIÓN: IMPORTAR TARIFARIO EXCEL DE BRIXLY (TLDs Y CLOUD)
// ========================================================
if ($action === 'import_brixly_data') {
    try {
        ensureBrixlyTablesExist($conexion);

        $tldsToSave = [];
        $productsToSave = [];

        // 1. Si se envió JSON vía body
        if (!empty($inputData['tlds']) && is_array($inputData['tlds'])) {
            $tldsToSave = $inputData['tlds'];
        }
        if (!empty($inputData['products']) && is_array($inputData['products'])) {
            $productsToSave = $inputData['products'];
        }

        // 2. Si se envió un archivo vía $_FILES['excel_file']
        if (isset($_FILES['excel_file']) && $_FILES['excel_file']['error'] === UPLOAD_ERR_OK) {
            $tmpPath = $_FILES['excel_file']['tmp_name'];
            $fileName = $_FILES['excel_file']['name'];
            $parsed = parseBrixlyUploadedFile($tmpPath, $fileName);
            if (!empty($parsed['tlds'])) {
                $tldsToSave = array_merge($tldsToSave, $parsed['tlds']);
            }
            if (!empty($parsed['products'])) {
                $productsToSave = array_merge($productsToSave, $parsed['products']);
            }
        }

        if (empty($tldsToSave) && empty($productsToSave)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'No se encontraron registros válidos de TLDs ni de Productos Cloud para guardar.'
            ]);
            exit;
        }

        $conexion->begin_transaction();

        $tldCount = 0;
        if (!empty($tldsToSave)) {
            $stmtTld = $conexion->prepare("
                INSERT INTO tblbrixly_domain_costs 
                (extension, register_cost, transfer_cost, renew_cost, register_retail, transfer_retail, renew_retail)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                register_cost = VALUES(register_cost),
                transfer_cost = VALUES(transfer_cost),
                renew_cost = VALUES(renew_cost),
                register_retail = VALUES(register_retail),
                transfer_retail = VALUES(transfer_retail),
                renew_retail = VALUES(renew_retail),
                updated_at = CURRENT_TIMESTAMP
            ");

            foreach ($tldsToSave as $t) {
                $rawExt = strtolower(trim($t['extension'] ?? ($t['tld'] ?? '')));
                if ($rawExt === '') continue;
                if (substr($rawExt, 0, 1) !== '.') {
                    $rawExt = '.' . $rawExt;
                }

                $regCost = isset($t['register_cost']) ? (float)$t['register_cost'] : 0.0;
                $traCost = isset($t['transfer_cost']) ? (float)$t['transfer_cost'] : 0.0;
                $renCost = isset($t['renew_cost']) ? (float)$t['renew_cost'] : 0.0;
                $regRet  = isset($t['register_retail']) && $t['register_retail'] !== '' ? (float)$t['register_retail'] : null;
                $traRet  = isset($t['transfer_retail']) && $t['transfer_retail'] !== '' ? (float)$t['transfer_retail'] : null;
                $renRet  = isset($t['renew_retail']) && $t['renew_retail'] !== '' ? (float)$t['renew_retail'] : null;

                $stmtTld->bind_param("sdddddd", $rawExt, $regCost, $traCost, $renCost, $regRet, $traRet, $renRet);
                $stmtTld->execute();
                $tldCount++;
            }
        }

        $prodCount = 0;
        if (!empty($productsToSave)) {
            $stmtProd = $conexion->prepare("
                INSERT INTO tblbrixly_product_costs 
                (product_name, billing_cycle, setup_fee, recurring_cost, retail_rec, saving_percent)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                setup_fee = VALUES(setup_fee),
                recurring_cost = VALUES(recurring_cost),
                retail_rec = VALUES(retail_rec),
                saving_percent = VALUES(saving_percent),
                updated_at = CURRENT_TIMESTAMP
            ");

            foreach ($productsToSave as $p) {
                $pName = trim($p['product_name'] ?? ($p['product'] ?? ''));
                if ($pName === '') continue;
                $pCycle = trim($p['billing_cycle'] ?? '');
                $pSetup = isset($p['setup_fee']) ? (float)$p['setup_fee'] : 0.0;
                $pRecur = isset($p['recurring_cost']) ? (float)$p['recurring_cost'] : (isset($p['recurring']) ? (float)$p['recurring'] : 0.0);
                $pRetail = isset($p['retail_rec']) ? (float)$p['retail_rec'] : 0.0;
                $pSaving = trim($p['saving_percent'] ?? '');

                $stmtProd->bind_param("ssddds", $pName, $pCycle, $pSetup, $pRecur, $pRetail, $pSaving);
                $stmtProd->execute();
                $prodCount++;
            }
        }

        $conexion->commit();

        echo json_encode([
            'status' => 'success',
            'message' => "Tarifario de Brixly guardado exitosamente en base de datos: {$tldCount} TLDs y {$prodCount} Productos Cloud.",
            'tlds_saved' => $tldCount,
            'products_saved' => $prodCount
        ]);
        exit;
    } catch (Throwable $t) {
        if (isset($conexion)) {
            $conexion->rollback();
        }
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Error al guardar datos de Brixly: ' . $t->getMessage()
        ]);
        exit;
    }
}

// ========================================================
// ACCIÓN B: GUARDAR PRECIO INDIVIDUAL (CLICK-TO-EDIT & ENTER)
// ========================================================
if ($action === 'save_single_price') {
    try {
        $dpid = (int)($inputData['dpid'] ?? 0);
        $currencyId = (int)($inputData['currency_id'] ?? 0);
        $type = trim($inputData['type'] ?? '');
        $price = isset($inputData['price']) ? (float)$inputData['price'] : null;

        if ($dpid <= 0 || $currencyId <= 0 || !in_array($type, ['domainregister', 'domainrenew', 'domaintransfer']) || $price === null) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Parámetros inválidos para actualizar precio'
            ]);
            exit;
        }

        // 1. Verificar si existe en tblpricing
        $stmtCheck = $conexion->prepare("SELECT id FROM tblpricing WHERE type = ? AND currency = ? AND relid = ? LIMIT 1");
        $stmtCheck->bind_param("sii", $type, $currencyId, $dpid);
        $stmtCheck->execute();
        $stmtCheck->store_result();

        if ($stmtCheck->num_rows > 0) {
            $stmtUpdate = $conexion->prepare("UPDATE tblpricing SET msetupfee = ? WHERE type = ? AND currency = ? AND relid = ?");
            $stmtUpdate->bind_param("dsii", $price, $type, $currencyId, $dpid);
            $stmtUpdate->execute();
        } else {
            $stmtInsert = $conexion->prepare("
                INSERT INTO tblpricing 
                (type, currency, relid, msetupfee, qsetupfee, ssetupfee, asetupfee, bsetupfee, monthly, quarterly, semiannually, annually, biennially)
                VALUES (?, ?, ?, ?, -1, -1, -1, -1, -1, -1, -1, -1, -1)
            ");
            $stmtInsert->bind_param("siid", $type, $currencyId, $dpid, $price);
            $stmtInsert->execute();
        }

        // 2. Sincronizar en segundo plano el caché de precios JSON
        $refreshScript = __DIR__ . '/refresh_prices.php';
        if (file_exists($refreshScript)) {
            try {
                ob_start();
                include $refreshScript;
                ob_end_clean();
            } catch (\Throwable $t) {
                ob_end_clean();
            }
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Precio guardado exitosamente en WHMCS',
            'dpid' => $dpid,
            'currency_id' => $currencyId,
            'type' => $type,
            'price' => $price
        ]);
        exit;
    } catch (\Throwable $t) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Error al guardar precio: ' . $t->getMessage()
        ]);
        exit;
    }
}

// Función auxiliar de redondeo a .99 o millar limpio para Guaraníes
if (!function_exists('roundPriceToPoint99')) {
    function roundPriceToPoint99($val, $mode = 'nearest', $currCode = '') {
        if ($val <= 0) return 0.99;
        $currUpper = strtoupper(trim($currCode));
        if ($currUpper === 'PYG' || ($val >= 1000 && in_array($currUpper, ['CLP', 'COP']))) {
            return (float)(round($val / 1000) * 1000);
        }

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
}

// ========================================================
// ACCIÓN: APLICAR COSTOS BRIXLY EUR x TASA A UNA MONEDA (⚡ APLICAR A TODO)
// ========================================================
if ($action === 'apply_eur_costs_to_currency') {
    try {
        $currId = (int)($inputData['currency_id'] ?? 0);
        $eurRate = (float)($inputData['eur_rate'] ?? 0);
        $margin = isset($inputData['margin']) ? (float)$inputData['margin'] : 0.0;
        if ($margin < 0) $margin = 0.0;
        $roundingMode = trim($inputData['rounding'] ?? 'nearest');

        if ($currId <= 0 || $eurRate <= 0) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Moneda o tasa de cambio de EUR inválida para aplicar los costos.'
            ]);
            exit;
        }

        // Obtener código de la moneda
        $currCode = '';
        $currRes = $conexion->query("SELECT code FROM tblcurrencies WHERE id = {$currId} LIMIT 1");
        if ($currRes && $cRow = $currRes->fetch_assoc()) {
            $currCode = strtoupper(trim($cRow['code']));
        }

        // 1. Obtener catálogo completo de TLDs
        $tldCatalog = [];
        $tldSql = $conexion->query("SELECT id as dpid, extension FROM tbldomainpricing ORDER BY id ASC");
        if ($tldSql) {
            while ($row = $tldSql->fetch_assoc()) {
                $ext = strtolower(trim($row['extension']));
                if ($ext !== '' && substr($ext, 0, 1) !== '.') {
                    $ext = '.' . $ext;
                }
                $tldCatalog[(int)$row['dpid']] = $ext;
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

        // 2. Costos Brixly en EUR desde tblbrixly_domain_costs
        ensureBrixlyTablesExist($conexion);
        $brixlyCosts = [];
        $brixlyRes = $conexion->query("SELECT extension, register_cost, transfer_cost, renew_cost FROM tblbrixly_domain_costs");
        if ($brixlyRes) {
            while ($b = $brixlyRes->fetch_assoc()) {
                $extClean = strtolower(trim($b['extension']));
                if ($extClean !== '' && substr($extClean, 0, 1) !== '.') {
                    $extClean = '.' . $extClean;
                }
                $brixlyCosts[$extClean] = [
                    'register' => (float)$b['register_cost'],
                    'transfer' => (float)$b['transfer_cost'],
                    'renew'    => (float)$b['renew_cost']
                ];
            }
        }

        // 3. Preparar Statements SQL
        $stmtCheck = $conexion->prepare("SELECT id FROM tblpricing WHERE type = ? AND currency = ? AND relid = ? LIMIT 1");
        $stmtUpdate = $conexion->prepare("UPDATE tblpricing SET msetupfee = ? WHERE type = ? AND currency = ? AND relid = ?");
        $stmtInsert = $conexion->prepare("
            INSERT INTO tblpricing 
            (type, currency, relid, msetupfee, qsetupfee, ssetupfee, asetupfee, bsetupfee, monthly, quarterly, semiannually, annually, biennially)
            VALUES (?, ?, ?, ?, -1, -1, -1, -1, -1, -1, -1, -1, -1)
        ");

        $updatedTlds = 0;
        $totalOperations = 0;

        foreach ($tldCatalog as $dpid => $extKey) {
            $bData = $brixlyCosts[$extKey] ?? null;
            $regEur = ($bData && $bData['register'] > 0) ? $bData['register'] : 9.26;
            $renEur = ($bData && $bData['renew'] > 0) ? $bData['renew'] : $regEur;
            $traEur = ($bData && $bData['transfer'] > 0) ? $bData['transfer'] : $regEur;

            $types = [
                'domainregister' => $regEur,
                'domainrenew'    => $renEur,
                'domaintransfer' => $traEur
            ];

            $tldOk = false;
            foreach ($types as $pType => $eurCost) {
                // FÓRMULA: Costo EUR * Tasa EUR * (1 + Margen %)
                $converted = $eurCost * $eurRate;
                $withMargin = $converted * (1 + ($margin / 100.0));
                
                if ($roundingMode === 'raw' || $roundingMode === 'none') {
                    $finalPrice = round($withMargin, 2);
                } else {
                    $finalPrice = roundPriceToPoint99($withMargin, $roundingMode, $currCode);
                }

                // Intentar UPDATE
                $stmtUpdate->bind_param("dsii", $finalPrice, $pType, $currId, $dpid);
                $stmtUpdate->execute();

                if ($stmtUpdate->affected_rows > 0) {
                    $totalOperations++;
                    $tldOk = true;
                } else {
                    // Verificar si existe o INSERTAR
                    $stmtCheck->bind_param("sii", $pType, $currId, $dpid);
                    $stmtCheck->execute();
                    $stmtCheck->store_result();

                    if ($stmtCheck->num_rows === 0) {
                        $stmtInsert->bind_param("siid", $pType, $currId, $dpid, $finalPrice);
                        $stmtInsert->execute();
                        $totalOperations++;
                        $tldOk = true;
                    } else {
                        $totalOperations++;
                        $tldOk = true;
                    }
                }
            }

            if ($tldOk) {
                $updatedTlds++;
            }
        }

        // Sincronizar automáticamente el caché JSON en disco ejecutando refresh_prices.php
        $refreshScript = __DIR__ . '/refresh_prices.php';
        if (file_exists($refreshScript)) {
            try {
                ob_start();
                include $refreshScript;
                ob_end_clean();
            } catch (\Throwable $t) {
                ob_end_clean();
            }
        }

        echo json_encode([
            'status' => 'success',
            'message' => "¡Precios de venta para {$currCode} actualizados masivamente con éxito a partir de costos Brixly EUR!",
            'currency_id' => $currId,
            'currency_code' => $currCode,
            'eur_rate' => $eurRate,
            'margin' => $margin,
            'rounding' => $roundingMode,
            'updated_tlds' => $updatedTlds,
            'total_operations' => $totalOperations,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit;
    } catch (\Throwable $t) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Error al aplicar costos EUR masivamente: ' . $t->getMessage()
        ]);
        exit;
    }
}

// ========================================================
// ACCIÓN C: ACTUALIZACIÓN MASIVA DE PRECIOS
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

        // Cargar costos mayoristas oficiales de Brixly desde la base de datos
        $brixlyCosts = [];
        $brixlyRes = $conexion->query("SELECT extension, register_cost, transfer_cost, renew_cost FROM tblbrixly_domain_costs");
        if ($brixlyRes) {
            while ($b = $brixlyRes->fetch_assoc()) {
                $extClean = strtolower(trim($b['extension']));
                if ($extClean !== '' && substr($extClean, 0, 1) !== '.') {
                    $extClean = '.' . $extClean;
                }
                $brixlyCosts[$extClean] = [
                    'register' => (float)$b['register_cost'],
                    'transfer' => (float)$b['transfer_cost'],
                    'renew'    => (float)$b['renew_cost']
                ];
            }
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
                $extKey = strtolower(trim($tldData['extension']));
                if ($extKey !== '' && substr($extKey, 0, 1) !== '.') {
                    $extKey = '.' . $extKey;
                }
                $bData = $brixlyCosts[$extKey] ?? null;

                $typesToProcess = [
                    'domainregister' => ($bData && $bData['register'] > 0) ? $bData['register'] : $tldData['register'],
                    'domainrenew'    => ($bData && $bData['renew'] > 0) ? $bData['renew'] : $tldData['renew'],
                    'domaintransfer' => ($bData && $bData['transfer'] > 0) ? $bData['transfer'] : $tldData['transfer']
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
                    $finalRounded = roundPriceToPoint99($withMargin, $roundingMode, $code);

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

