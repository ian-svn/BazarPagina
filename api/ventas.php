<?php
require_once '../config.php';

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Obtener todas las ventas o una venta específica
        $id = $_GET['id'] ?? null;
        
        if ($id) {
            $stmt = $db->prepare("SELECT v.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre 
                                  FROM VENTAS v
                                  INNER JOIN CLIENTES c ON v.id_cliente = c.id_cliente
                                  INNER JOIN USUARIOS u ON v.id_usuario = u.id_usuario
                                  WHERE v.id_venta = ?");
            $stmt->execute([$id]);
            $venta = $stmt->fetch();
            
            if (!$venta) {
                sendResponse(['error' => 'Venta no encontrada'], 404);
            }
            
            // Obtener detalles de la venta
            $stmt = $db->prepare("SELECT dv.*, p.nombre as producto_nombre, p.imagen_url 
                                  FROM DETALLE_VENTA dv
                                  INNER JOIN PRODUCTOS p ON dv.id_producto = p.id_producto
                                  WHERE dv.id_venta = ?");
            $stmt->execute([$id]);
            $venta['detalles'] = $stmt->fetchAll();
            
            sendResponse(['venta' => $venta]);
        } else {
            $stmt = $db->prepare("SELECT v.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre 
                                  FROM VENTAS v
                                  INNER JOIN CLIENTES c ON v.id_cliente = c.id_cliente
                                  INNER JOIN USUARIOS u ON v.id_usuario = u.id_usuario
                                  ORDER BY v.fecha DESC, v.id_venta DESC");
            $stmt->execute();
            sendResponse(['ventas' => $stmt->fetchAll()]);
        }
        break;
        
    case 'POST':
        // Crear nueva venta
        $data = getJsonInput();
        
        if (!isset($data['id_cliente']) || !isset($data['id_usuario']) || !isset($data['forma_pago']) || !isset($data['productos'])) {
            sendResponse(['error' => 'Faltan campos requeridos'], 400);
        }
        
        try {
            $db->beginTransaction();
            
            // Calcular total
            $total = 0;
            foreach ($data['productos'] as $producto) {
                $stmt = $db->prepare("SELECT precio FROM PRODUCTOS WHERE id_producto = ?");
                $stmt->execute([$producto['id_producto']]);
                $precio = $stmt->fetchColumn();
                $subtotal = $precio * $producto['cantidad'];
                $total += $subtotal;
            }
            
            // Crear venta
            $stmt = $db->prepare("INSERT INTO VENTAS (fecha, id_cliente, id_usuario, forma_pago, total) 
                                  VALUES (CURDATE(), ?, ?, ?, ?)");
            $stmt->execute([
                $data['id_cliente'],
                $data['id_usuario'],
                $data['forma_pago'],
                $total
            ]);
            
            $id_venta = $db->lastInsertId();
            
            // Crear detalles de venta y actualizar stock
            foreach ($data['productos'] as $producto) {
                $stmt = $db->prepare("SELECT precio FROM PRODUCTOS WHERE id_producto = ?");
                $stmt->execute([$producto['id_producto']]);
                $precio = $stmt->fetchColumn();
                $subtotal = $precio * $producto['cantidad'];
                
                $stmt = $db->prepare("INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, subtotal) 
                                      VALUES (?, ?, ?, ?)");
                $stmt->execute([$id_venta, $producto['id_producto'], $producto['cantidad'], $subtotal]);
                
                // Actualizar stock
                $stmt = $db->prepare("UPDATE PRODUCTOS SET stock = stock - ? WHERE id_producto = ?");
                $stmt->execute([$producto['cantidad'], $producto['id_producto']]);
            }
            
            $db->commit();
            sendResponse(['id_venta' => $id_venta, 'total' => $total, 'mensaje' => 'Venta registrada exitosamente'], 201);
            
        } catch (Exception $e) {
            $db->rollBack();
            sendResponse(['error' => 'Error al procesar la venta: ' . $e->getMessage()], 500);
        }
        break;
        
    default:
        sendResponse(['error' => 'Método no permitido'], 405);
}
?>

