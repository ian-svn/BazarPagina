<?php
require_once '../config.php';

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        
        if ($id) {
            $stmt = $db->prepare("SELECT * FROM CLIENTES WHERE id_cliente = ?");
            $stmt->execute([$id]);
            $cliente = $stmt->fetch();
            
            if (!$cliente) {
                sendResponse(['error' => 'Cliente no encontrado'], 404);
            }
            
            sendResponse(['cliente' => $cliente]);
        } else {
            $stmt = $db->prepare("SELECT * FROM CLIENTES ORDER BY nombre");
            $stmt->execute();
            sendResponse(['clientes' => $stmt->fetchAll()]);
        }
        break;
        
    case 'POST':
        $data = getJsonInput();
        
        if (!isset($data['nombre'])) {
            sendResponse(['error' => 'El nombre es requerido'], 400);
        }
        
        $stmt = $db->prepare("INSERT INTO CLIENTES (nombre, telefono, direccion, email) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['nombre'],
            $data['telefono'] ?? null,
            $data['direccion'] ?? null,
            $data['email'] ?? null
        ]);
        
        sendResponse(['id' => $db->lastInsertId(), 'mensaje' => 'Cliente creado exitosamente'], 201);
        break;
        
    default:
        sendResponse(['error' => 'Método no permitido'], 405);
}
?>

