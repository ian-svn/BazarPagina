<?php
// Script para insertar productos si no existen
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insertar Productos - Bazar</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; }
        .success { color: #4CAF50; background: #e8f5e9; padding: 10px; border-radius: 5px; margin: 5px 0; }
        .error { color: #f44336; background: #ffebee; padding: 10px; border-radius: 5px; margin: 5px 0; }
        .info { color: #2196F3; background: #e3f2fd; padding: 10px; border-radius: 5px; margin: 5px 0; }
        button {
            background: #F493BD;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
        }
        button:hover { background: #e082a8; }
        a { color: #F493BD; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📦 Insertar Productos de Ejemplo</h1>
        <p><a href="verificar-sistema.php">← Volver a verificación</a> | <a href="index.html">Ir a la tienda</a></p>
        <hr>
        
<?php
require_once 'config.php';

try {
    $db = getDB();
    
    echo "<div class='info'>Verificando base de datos...</div>";
    
    // Verificar si existe el proveedor
    $stmt = $db->query("SELECT id_proveedor FROM PROVEEDORES LIMIT 1");
    $proveedor = $stmt->fetch();
    
    if (!$proveedor) {
        echo "<div class='info'>Creando proveedor por defecto...</div>";
        $stmt = $db->prepare("INSERT INTO PROVEEDORES (nombre, contacto, telefono, email) VALUES (?, ?, ?, ?)");
        $stmt->execute(['Proveedor General', 'Juan Pérez', '1234567890', 'contacto@proveedor.com']);
        $id_proveedor = $db->lastInsertId();
        echo "<div class='success'>✓ Proveedor creado con ID: $id_proveedor</div>";
    } else {
        $id_proveedor = $proveedor['id_proveedor'];
        echo "<div class='success'>✓ Proveedor existente con ID: $id_proveedor</div>";
    }
    
    // Verificar productos existentes
    $stmt = $db->query("SELECT COUNT(*) as total FROM PRODUCTOS");
    $count = $stmt->fetch();
    
    if ($count['total'] > 0) {
        echo "<div class='info'>Ya existen {$count['total']} productos en la base de datos.</div>";
        echo "<div class='info'>Se insertarán solo los productos que no existan.</div>";
    }
    
    // Productos a insertar
    $productos = [
        ['Vaso reutilizable', 2200.00, 50, 'assets/vaso.png', 'vasos'],
        ['Vaso térmico', 6900.00, 30, 'assets/vasoTermico.png', 'vasos'],
        ['Plato de bambú', 3500.00, 40, 'assets/plato.png', 'platos'],
        ['Plato postre', 2800.00, 35, 'assets/platos.png', 'platos'],
        ['Contenedor de vidrio', 7800.00, 25, 'assets/contenedor.png', 'contenedores'],
        ['Compostera para hogar', 19990.00, 15, 'assets/compostera.png', 'composteras'],
        ['Jarra térmica', 12500.00, 20, 'assets/jarra.png', 'jarras'],
        ['Set de cubiertos', 5200.00, 45, 'assets/vasos.png', 'cubiertos']
    ];
    
    $insertados = 0;
    $stmt = $db->prepare("INSERT INTO PRODUCTOS (nombre, precio, stock, imagen_url, id_proveedor, categoria) VALUES (?, ?, ?, ?, ?, ?)");
    
    foreach ($productos as $producto) {
        // Verificar si ya existe
        $check = $db->prepare("SELECT id_producto FROM PRODUCTOS WHERE nombre = ?");
        $check->execute([$producto[0]]);
        
        if (!$check->fetch()) {
            $stmt->execute([
                $producto[0], // nombre
                $producto[1], // precio
                $producto[2], // stock
                $producto[3], // imagen_url
                $id_proveedor,
                $producto[4]  // categoria
            ]);
            $insertados++;
            echo "<div class='success'>✓ Insertado: {$producto[0]}</div>";
        } else {
            echo "<div class='info'>- Ya existe: {$producto[0]}</div>";
        }
    }
    
    echo "<hr>";
    echo "<div class='success'><strong>✓ Proceso completado. Productos insertados: $insertados</strong></div>";
    
    // Mostrar resumen
    $stmt = $db->query("SELECT COUNT(*) as total FROM PRODUCTOS");
    $total = $stmt->fetch();
    echo "<div class='info'><strong>Total de productos en la base de datos: {$total['total']}</strong></div>";
    
    echo "<hr>";
    echo "<p><a href='index.html'><button>Ir a la Tienda</button></a> <a href='verificar-sistema.php'><button>Verificar Sistema</button></a></p>";
    
} catch (Exception $e) {
    echo "<div class='error'><strong>❌ Error:</strong> " . htmlspecialchars($e->getMessage()) . "</div>";
    echo "<div class='error'>Archivo: " . htmlspecialchars($e->getFile()) . "</div>";
    echo "<div class='error'>Línea: " . $e->getLine() . "</div>";
}
?>
    </div>
</body>
</html>

