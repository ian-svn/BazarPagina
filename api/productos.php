<?php
// Manejo de errores mejorado
error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    require_once '../config.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al cargar configuración: ' . $e->getMessage()]);
    exit();
}

try {
    $db = getDB();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos: ' . $e->getMessage()]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Obtener todos los productos o filtrar por categoría
        $categoria = $_GET['categoria'] ?? null;
        
        if ($categoria && $categoria !== 'all') {
            $stmt = $db->prepare("SELECT p.*, pr.nombre as proveedor_nombre 
                                  FROM PRODUCTOS p 
                                  INNER JOIN PROVEEDORES pr ON p.id_proveedor = pr.id_proveedor 
                                  WHERE p.categoria = ? AND p.stock > 0
                                  ORDER BY p.nombre");
            $stmt->execute([$categoria]);
        } else {
            // Cambiar para mostrar productos incluso con stock 0, o al menos verificar que la query funcione
            $stmt = $db->prepare("SELECT p.*, pr.nombre as proveedor_nombre 
                                  FROM PRODUCTOS p 
                                  INNER JOIN PROVEEDORES pr ON p.id_proveedor = pr.id_proveedor 
                                  WHERE p.stock >= 0
                                  ORDER BY p.nombre");
            $stmt->execute();
        }
        
        $productos = $stmt->fetchAll();
        
        // Si no hay productos, retornar array vacío en lugar de error
        if (empty($productos)) {
            sendResponse(['productos' => []]);
        }
        
        // Formatear productos para el frontend
        $formatted = array_map(function($p) {
            return [
                'id' => 'producto-' . $p['id_producto'],
                'id_producto' => (int)$p['id_producto'],
                'name' => $p['nombre'],
                'category' => $p['categoria'],
                'price' => (float)$p['precio'],
                'stock' => (int)$p['stock'],
                'imagen_url' => $p['imagen_url'],
                'proveedor' => $p['proveedor_nombre']
            ];
        }, $productos);
        
        sendResponse(['productos' => $formatted]);
        break;
        
    case 'POST':
        // Crear nuevo producto
        $data = getJsonInput();
        
        if (!isset($data['nombre']) || !isset($data['precio']) || !isset($data['imagen_url']) || !isset($data['id_proveedor'])) {
            sendResponse(['error' => 'Faltan campos requeridos'], 400);
        }
        
        $stmt = $db->prepare("INSERT INTO PRODUCTOS (nombre, precio, stock, imagen_url, id_proveedor, categoria) 
                              VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['nombre'],
            $data['precio'],
            $data['stock'] ?? 0,
            $data['imagen_url'],
            $data['id_proveedor'],
            $data['categoria'] ?? 'otros'
        ]);
        
        sendResponse(['id' => $db->lastInsertId(), 'mensaje' => 'Producto creado exitosamente'], 201);
        break;
        
    case 'PUT':
        // Actualizar producto
        $data = getJsonInput();
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            sendResponse(['error' => 'ID de producto requerido'], 400);
        }
        
        $fields = [];
        $values = [];
        
        if (isset($data['nombre'])) { $fields[] = 'nombre = ?'; $values[] = $data['nombre']; }
        if (isset($data['precio'])) { $fields[] = 'precio = ?'; $values[] = $data['precio']; }
        if (isset($data['stock'])) { $fields[] = 'stock = ?'; $values[] = $data['stock']; }
        if (isset($data['imagen_url'])) { $fields[] = 'imagen_url = ?'; $values[] = $data['imagen_url']; }
        if (isset($data['categoria'])) { $fields[] = 'categoria = ?'; $values[] = $data['categoria']; }
        
        if (empty($fields)) {
            sendResponse(['error' => 'No hay campos para actualizar'], 400);
        }
        
        $values[] = $id;
        $stmt = $db->prepare("UPDATE PRODUCTOS SET " . implode(', ', $fields) . " WHERE id_producto = ?");
        $stmt->execute($values);
        
        sendResponse(['mensaje' => 'Producto actualizado exitosamente']);
        break;
        
    case 'DELETE':
        // Eliminar producto
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            sendResponse(['error' => 'ID de producto requerido'], 400);
        }
        
        $stmt = $db->prepare("DELETE FROM PRODUCTOS WHERE id_producto = ?");
        $stmt->execute([$id]);
        
        sendResponse(['mensaje' => 'Producto eliminado exitosamente']);
        break;
        
    default:
        sendResponse(['error' => 'Método no permitido'], 405);
}
?>

