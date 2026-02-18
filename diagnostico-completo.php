<?php
// Diagnóstico completo del sistema
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Diagnóstico Completo - Bazar</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1000px; margin: 20px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; }
        .test { margin: 15px 0; padding: 15px; border-radius: 5px; border-left: 4px solid #ddd; }
        .success { background: #e8f5e9; border-left-color: #4CAF50; }
        .error { background: #ffebee; border-left-color: #f44336; }
        .warning { background: #fff3e0; border-left-color: #ff9800; }
        .info { background: #e3f2fd; border-left-color: #2196F3; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; font-size: 12px; }
        code { background: #e0e0e0; padding: 2px 6px; border-radius: 3px; }
        button { background: #F493BD; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px; }
        button:hover { background: #e082a8; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Diagnóstico Completo del Sistema</h1>
        
        <?php
        $tests = [];
        
        // Test 1: PHP
        $tests[] = ['name' => 'PHP', 'status' => 'success', 'message' => 'Versión: ' . phpversion()];
        
        // Test 2: Config
        if (file_exists('config.php')) {
            require_once 'config.php';
            $tests[] = ['name' => 'Archivo config.php', 'status' => 'success', 'message' => 'Encontrado'];
        } else {
            $tests[] = ['name' => 'Archivo config.php', 'status' => 'error', 'message' => 'NO ENCONTRADO'];
        }
        
        // Test 3: Conexión BD
        if (defined('DB_HOST')) {
            try {
                $db = getDB();
                $tests[] = ['name' => 'Conexión a Base de Datos', 'status' => 'success', 'message' => 'Conectado a ' . DB_NAME];
                
                // Test 4: Tablas
                $stmt = $db->query("SHOW TABLES");
                $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
                $required = ['USUARIOS', 'CLIENTES', 'PROVEEDORES', 'PRODUCTOS', 'VENTAS', 'DETALLE_VENTA', 'PEDIDOS'];
                $missing = array_diff($required, $tables);
                
                if (empty($missing)) {
                    $tests[] = ['name' => 'Tablas de Base de Datos', 'status' => 'success', 'message' => count($tables) . ' tablas encontradas'];
                } else {
                    $tests[] = ['name' => 'Tablas de Base de Datos', 'status' => 'error', 'message' => 'Faltan: ' . implode(', ', $missing)];
                }
                
                // Test 5: Proveedores
                if (in_array('PROVEEDORES', $tables)) {
                    $stmt = $db->query("SELECT COUNT(*) as total FROM PROVEEDORES");
                    $count = $stmt->fetch();
                    if ($count['total'] > 0) {
                        $tests[] = ['name' => 'Proveedores', 'status' => 'success', 'message' => $count['total'] . ' proveedores'];
                    } else {
                        $tests[] = ['name' => 'Proveedores', 'status' => 'warning', 'message' => 'No hay proveedores'];
                    }
                }
                
                // Test 6: Productos
                if (in_array('PRODUCTOS', $tables)) {
                    $stmt = $db->query("SELECT COUNT(*) as total FROM PRODUCTOS");
                    $count = $stmt->fetch();
                    if ($count['total'] > 0) {
                        $tests[] = ['name' => 'Productos', 'status' => 'success', 'message' => $count['total'] . ' productos'];
                        
                        // Mostrar productos
                        $stmt = $db->query("SELECT id_producto, nombre, categoria, stock, precio, imagen_url FROM PRODUCTOS LIMIT 10");
                        $productos = $stmt->fetchAll();
                    } else {
                        $tests[] = ['name' => 'Productos', 'status' => 'error', 'message' => 'NO HAY PRODUCTOS - Este es el problema principal'];
                    }
                } else {
                    $tests[] = ['name' => 'Productos', 'status' => 'error', 'message' => 'La tabla PRODUCTOS no existe'];
                }
                
            } catch (Exception $e) {
                $tests[] = ['name' => 'Conexión a Base de Datos', 'status' => 'error', 'message' => $e->getMessage()];
            }
        }
        
        // Test 7: Archivos API
        $api_files = ['api/productos.php', 'api/ventas.php', 'api/clientes.php'];
        foreach ($api_files as $file) {
            if (file_exists($file)) {
                $tests[] = ['name' => "Archivo $file", 'status' => 'success', 'message' => 'Encontrado'];
            } else {
                $tests[] = ['name' => "Archivo $file", 'status' => 'error', 'message' => 'NO ENCONTRADO'];
            }
        }
        
        // Test 8: Carpeta assets
        if (is_dir('assets')) {
            $images = glob('assets/*.{png,jpg,jpeg}', GLOB_BRACE);
            if (count($images) > 0) {
                $tests[] = ['name' => 'Carpeta assets', 'status' => 'success', 'message' => count($images) . ' imágenes encontradas'];
            } else {
                $tests[] = ['name' => 'Carpeta assets', 'status' => 'warning', 'message' => 'Carpeta existe pero está vacía'];
            }
        } else {
            $tests[] = ['name' => 'Carpeta assets', 'status' => 'error', 'message' => 'NO ENCONTRADA'];
        }
        
        // Test 9: Probar API directamente
        echo '<h2>Prueba de API</h2>';
        echo '<div id="apiTest">';
        echo '<button onclick="testAPI()">Probar API de Productos</button>';
        echo '<div id="apiResult"></div>';
        echo '</div>';
        
        // Mostrar resultados
        echo '<h2>Resultados de las Pruebas</h2>';
        foreach ($tests as $test) {
            $icon = $test['status'] === 'success' ? '✓' : ($test['status'] === 'error' ? '❌' : '⚠');
            echo "<div class='test {$test['status']}'>";
            echo "<strong>{$icon} {$test['name']}:</strong> {$test['message']}";
            echo "</div>";
        }
        
        // Mostrar productos si existen
        if (isset($productos) && !empty($productos)) {
            echo '<h2>Productos en la Base de Datos</h2>';
            echo '<table border="1" cellpadding="10" style="width:100%; border-collapse:collapse; font-size:12px;">';
            echo '<tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Imagen</th></tr>';
            foreach ($productos as $p) {
                $img_exists = file_exists($p['imagen_url']) ? '✓' : '❌';
                echo "<tr>";
                echo "<td>{$p['id_producto']}</td>";
                echo "<td>{$p['nombre']}</td>";
                echo "<td>{$p['categoria']}</td>";
                echo "<td>\${$p['precio']}</td>";
                echo "<td>{$p['stock']}</td>";
                echo "<td>{$p['imagen_url']} {$img_exists}</td>";
                echo "</tr>";
            }
            echo '</table>';
        }
        
        // Test 10: Probar query directa
        if (isset($db) && in_array('PRODUCTOS', $tables ?? [])) {
            echo '<h2>Prueba de Query Directa</h2>';
            try {
                $stmt = $db->prepare("SELECT p.*, pr.nombre as proveedor_nombre 
                                      FROM PRODUCTOS p 
                                      INNER JOIN PROVEEDORES pr ON p.id_proveedor = pr.id_proveedor 
                                      WHERE p.stock > 0
                                      ORDER BY p.nombre");
                $stmt->execute();
                $result = $stmt->fetchAll();
                
                if (empty($result)) {
                    echo '<div class="test error">❌ La query no devuelve resultados (puede ser que no haya productos con stock > 0)</div>';
                } else {
                    echo '<div class="test success">✓ La query devuelve ' . count($result) . ' productos</div>';
                    echo '<pre>' . json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . '</pre>';
                }
            } catch (Exception $e) {
                echo '<div class="test error">❌ Error en la query: ' . htmlspecialchars($e->getMessage()) . '</div>';
            }
        }
        ?>
        
        <h2>Acciones Rápidas</h2>
        <a href="insertar-productos.php"><button>Insertar Productos</button></a>
        <a href="verificar-sistema.php"><button>Verificar Sistema</button></a>
        <a href="index.html"><button>Ir a la Tienda</button></a>
        <a href="api/test.php"><button>Probar API (JSON)</button></a>
        
        <script>
        async function testAPI() {
            const resultDiv = document.getElementById('apiResult');
            resultDiv.innerHTML = '<div class="test info">Probando API...</div>';
            
            try {
                const response = await fetch('api/productos.php');
                const text = await response.text();
                
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    resultDiv.innerHTML = `
                        <div class="test error">
                            <strong>❌ Error: La respuesta no es JSON válido</strong><br>
                            <pre>${text}</pre>
                        </div>
                    `;
                    return;
                }
                
                if (!response.ok) {
                    resultDiv.innerHTML = `
                        <div class="test error">
                            <strong>❌ Error HTTP ${response.status}</strong><br>
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                        </div>
                    `;
                    return;
                }
                
                if (data.error) {
                    resultDiv.innerHTML = `
                        <div class="test error">
                            <strong>❌ Error del servidor:</strong><br>
                            ${data.error}
                        </div>
                    `;
                } else if (data.productos) {
                    resultDiv.innerHTML = `
                        <div class="test success">
                            <strong>✓ API funcionando correctamente</strong><br>
                            Productos encontrados: ${data.productos.length}
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <div class="test warning">
                            <strong>⚠ Respuesta inesperada:</strong><br>
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                        </div>
                    `;
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="test error">
                        <strong>❌ Error de conexión:</strong><br>
                        ${error.message}<br>
                        <small>Verifica que Apache esté corriendo y que la URL sea correcta</small>
                    </div>
                `;
            }
        }
        </script>
    </div>
</body>
</html>

