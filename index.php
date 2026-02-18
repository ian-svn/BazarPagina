<?php
// Redirigir a index.html si existe, sino mostrar información
if (file_exists('index.html')) {
    header('Location: index.html');
    exit();
}

// Si no existe index.html, mostrar información de instalación
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bazar - Configuración</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
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
        .step {
            background: #f9f9f9;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #F493BD;
            border-radius: 5px;
        }
        .success { border-left-color: #4CAF50; }
        .error { border-left-color: #f44336; }
        .warning { border-left-color: #ff9800; }
        code {
            background: #e0e0e0;
            padding: 2px 6px;
            border-radius: 3px;
        }
        a {
            color: #F493BD;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛒 Bazar - Eco Tienda</h1>
        
        <h2>Estado del Sistema</h2>
        
        <?php
        // Verificar PHP
        echo '<div class="step success">';
        echo '<strong>✓ PHP está funcionando</strong><br>';
        echo 'Versión: ' . phpversion();
        echo '</div>';
        
        // Verificar base de datos
        require_once 'config.php';
        try {
            $db = getDB();
            echo '<div class="step success">';
            echo '<strong>✓ Conexión a la base de datos exitosa</strong><br>';
            echo 'Base de datos: ' . DB_NAME;
            echo '</div>';
            
            // Verificar si las tablas existen
            $stmt = $db->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            if (count($tables) > 0) {
                echo '<div class="step success">';
                echo '<strong>✓ Base de datos configurada</strong><br>';
                echo 'Tablas encontradas: ' . count($tables);
                echo '</div>';
            } else {
                echo '<div class="step warning">';
                echo '<strong>⚠ Base de datos vacía</strong><br>';
                echo 'Necesitas importar <code>database.sql</code> en phpMyAdmin';
                echo '</div>';
            }
        } catch (Exception $e) {
            echo '<div class="step error">';
            echo '<strong>❌ Error de conexión a la base de datos</strong><br>';
            echo 'Error: ' . htmlspecialchars($e->getMessage());
            echo '</div>';
        }
        
        // Verificar archivos
        $files = ['index.html', 'script.js', 'styles.css', 'api/productos.php'];
        $missing = [];
        foreach ($files as $file) {
            if (!file_exists($file)) {
                $missing[] = $file;
            }
        }
        
        if (empty($missing)) {
            echo '<div class="step success">';
            echo '<strong>✓ Todos los archivos están presentes</strong>';
            echo '</div>';
        } else {
            echo '<div class="step error">';
            echo '<strong>❌ Faltan algunos archivos:</strong><br>';
            echo implode('<br>', $missing);
            echo '</div>';
        }
        ?>
        
        <h2>Próximos Pasos</h2>
        
        <div class="step">
            <strong>1. Verificar base de datos:</strong><br>
            <a href="http://localhost/phpmyadmin" target="_blank">Abrir phpMyAdmin</a> e importar <code>database.sql</code>
        </div>
        
        <div class="step">
            <strong>2. Acceder a la aplicación:</strong><br>
            <a href="index.html">Abrir Bazar Eco Tienda</a>
        </div>
        
        <div class="step">
            <strong>3. Si ves errores:</strong><br>
            - Verifica que Apache y MySQL estén corriendo en XAMPP<br>
            - Asegúrate de haber importado <code>database.sql</code><br>
            - Revisa las credenciales en <code>config.php</code>
        </div>
    </div>
</body>
</html>

