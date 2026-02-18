<?php
// Script de prueba para verificar la conexión y datos
header('Content-Type: application/json; charset=utf-8');

try {
    require_once '../config.php';
    
    $db = getDB();
    
    // Verificar conexión
    $result = [
        'status' => 'ok',
        'database' => DB_NAME,
        'host' => DB_HOST,
        'connection' => 'success'
    ];
    
    // Verificar tablas
    $stmt = $db->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $result['tables'] = $tables;
    $result['tables_count'] = count($tables);
    
    // Verificar productos
    if (in_array('PRODUCTOS', $tables)) {
        $stmt = $db->query("SELECT COUNT(*) as total FROM PRODUCTOS");
        $count = $stmt->fetch();
        $result['productos_count'] = (int)$count['total'];
        
        // Obtener algunos productos
        $stmt = $db->query("SELECT id_producto, nombre, categoria, stock FROM PRODUCTOS LIMIT 5");
        $result['productos_sample'] = $stmt->fetchAll();
    } else {
        $result['productos_count'] = 0;
        $result['error'] = 'La tabla PRODUCTOS no existe';
    }
    
    // Verificar proveedores
    if (in_array('PROVEEDORES', $tables)) {
        $stmt = $db->query("SELECT COUNT(*) as total FROM PROVEEDORES");
        $count = $stmt->fetch();
        $result['proveedores_count'] = (int)$count['total'];
    }
    
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?>

