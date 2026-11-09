<?php
/**
 * Devuelve en JSON los dominios de activación automática (extensión + costo).
 * Este es el ÚNICO archivo que necesita PHP. La página .html le pide los
 * datos a este endpoint vía fetch() y arma la tabla en el navegador.
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../conexion/conexion.php';

$dominios = array();
$relid_procesados = array();

$sql = $conexion->query("
    SELECT * FROM tbldomainpricing
    INNER JOIN tblpricing ON tbldomainpricing.id = tblpricing.relid
");

if ($sql) {
    while ($resultado = $sql->fetch_assoc()) {
        $relid_actual = $resultado['relid'];

        // Se queda solo con la primera fila de cada dominio (evita duplicados
        // por moneda/tipo de facturación que trae el INNER JOIN)
        if (in_array($relid_actual, $relid_procesados)) {
            continue;
        }
        $relid_procesados[] = $relid_actual;

        $usd = (float) $resultado['msetupfee'];

        $dominios[] = array(
            'extension' => $resultado['extension'],
            'usd'       => number_format($usd, 2, '.', '.'),
            'gs'        => number_format($usd * 7800, 0, ',', '.'),
        );
    }
}

echo json_encode($dominios, JSON_UNESCAPED_UNICODE);