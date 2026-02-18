<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación del Sistema - Bazar</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 900px;
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
        .check { color: #4CAF50; }
        .error { color: #f44336; }
        .warning { color: #ff9800; }
        .step {
            background: #f9f9f9;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #ddd;
            border-radius: 5px;
        }
        .step.success { border-left-color: #4CAF50; }
        .step.error { border-left-color: #f44336; }
        .step.warning { border-left-color: #ff9800; }
        code {
            background: #e0e0e0;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
        }
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
        pre {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Verificación del Sistema - Bazar</h1>
        
        <?php
        $errors = [];
        $warnings = [];
        $success = [];
        
        // 1. Verificar PHP
        $success[] = "PHP " . phpversion() . " está funcionando";
        
        // 2. Verificar configuración
        if (file_exists('config.php')) {
            $success[] = "Archivo config.php encontrado";
            require_once 'config.php';
        } else {
            $errors[] = "Archivo config.php no encontrado";
        }
        
        // 3. Verificar conexión a BD
        if (defined('DB_HOST')) {
            try {
                $db = getDB();
                $success[] = "Conexión a la base de datos exitosa";
                $success[] = "Base de datos: " . DB_NAME;
                
                // 4. Verificar tablas
                $stmt = $db->query("SHOW TABLES");
                $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
                
                $required_tables = ['USUARIOS', 'CLIENTES', 'PROVEEDORES', 'PRODUCTOS', 'VENTAS', 'DETALLE_VENTA', 'PEDIDOS'];
                $missing_tables = array_diff($required_tables, $tables);
                
                if (empty($missing_tables)) {
                    $success[] = "Todas las tablas necesarias existen (" . count($tables) . " tablas)";
                } else {
                    $errors[] = "Faltan tablas: " . implode(', ', $missing_tables);
                    $errors[] = "Por favor, importa el archivo database.sql en phpMyAdmin";
                }
                
                // 5. Verificar productos
                if (in_array('PRODUCTOS', $tables)) {
                    $stmt = $db->query("SELECT COUNT(*) as total FROM PRODUCTOS");
                    $count = $stmt->fetch();
                    $productos_count = (int)$count['total'];
                    
                    if ($productos_count > 0) {
                        $success[] = "Hay $productos_count productos en la base de datos";
                        
                        // Mostrar algunos productos
                        $stmt = $db->query("SELECT id_producto, nombre, categoria, stock, precio FROM PRODUCTOS LIMIT 5");
                        $productos = $stmt->fetchAll();
                    } else {
                        $warnings[] = "No hay productos en la base de datos";
                        $warnings[] = "Ejecuta: <a href='insertar-productos.php'>insertar-productos.php</a> para agregar productos de ejemplo";
                    }
                }
                
                // 6. Verificar proveedores
                if (in_array('PROVEEDORES', $tables)) {
                    $stmt = $db->query("SELECT COUNT(*) as total FROM PROVEEDORES");
                    $count = $stmt->fetch();
                    $proveedores_count = (int)$count['total'];
                    
                    if ($proveedores_count > 0) {
                        $success[] = "Hay $proveedores_count proveedores en la base de datos";
                    } else {
                        $warnings[] = "No hay proveedores en la base de datos";
                    }
                }
                
            } catch (Exception $e) {
                $errors[] = "Error de conexión: " . $e->getMessage();
            }
        }
        
        // 7. Verificar archivos
        $required_files = ['index.html', 'script.js', 'styles.css', 'api/productos.php', 'api/ventas.php', 'api/clientes.php'];
        $missing_files = [];
        foreach ($required_files as $file) {
            if (!file_exists($file)) {
                $missing_files[] = $file;
            }
        }
        
        if (empty($missing_files)) {
            $success[] = "Todos los archivos necesarios están presentes";
        } else {
            $errors[] = "Faltan archivos: " . implode(', ', $missing_files);
        }
        
        // 8. Verificar carpeta assets
        if (is_dir('assets') && count(glob('assets/*')) > 0) {
            $success[] = "Carpeta assets encontrada con imágenes";
        } else {
            $warnings[] = "Carpeta assets no encontrada o vacía";
        }
        
        // Mostrar resultados
        foreach ($success as $msg) {
            echo "<div class='step success'><span class='check'>✓</span> $msg</div>";
        }
        
        foreach ($warnings as $msg) {
            echo "<div class='step warning'><span class='warning'>⚠</span> $msg</div>";
        }
        
        foreach ($errors as $msg) {
            echo "<div class='step error'><span class='error'>❌</span> $msg</div>";
        }
        
        // Mostrar productos si existen
        if (isset($productos) && !empty($productos)) {
            echo "<h2>Productos en la base de datos:</h2>";
            echo "<table border='1' cellpadding='10' style='width:100%; border-collapse:collapse;'>";
            echo "<tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th></tr>";
            foreach ($productos as $p) {
                echo "<tr>";
                echo "<td>{$p['id_producto']}</td>";
                echo "<td>{$p['nombre']}</td>";
                echo "<td>{$p['categoria']}</td>";
                echo "<td>\${$p['precio']}</td>";
                echo "<td>{$p['stock']}</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
        ?>
        
        <h2>Acciones Rápidas</h2>
        <button onclick="window.location.href='insertar-productos.php'">Insertar Productos de Ejemplo</button>
        <button onclick="window.location.href='api/test.php'">Probar API</button>
        <button onclick="window.location.href='index.html'">Ir a la Tienda</button>
        
        <h2>Prueba de API</h2>
        <p>Haz clic en el botón para probar la API de productos:</p>
        <button onclick="testAPI()">Probar API de Productos</button>
        <div id="apiResult"></div>
        
        <script>
        async function testAPI() {
            const resultDiv = document.getElementById('apiResult');
            resultDiv.innerHTML = '<p>Cargando...</p>';
            
            try {
                const response = await fetch('api/productos.php');
                const data = await response.json();
                
                if (data.productos) {
                    resultDiv.innerHTML = `
                        <div class="step success">
                            <strong>✓ API funcionando correctamente</strong><br>
                            Productos encontrados: ${data.productos.length}
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                        </div>
                    `;
                } else if (data.error) {
                    resultDiv.innerHTML = `
                        <div class="step error">
                            <strong>❌ Error en la API</strong><br>
                            ${data.error}
                        </div>
                    `;
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="step error">
                        <strong>❌ Error de conexión</strong><br>
                        ${error.message}
                    </div>
                `;
            }
        }
        </script>
    </div>
</body>
</html>

