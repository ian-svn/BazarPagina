@echo off
echo ========================================
echo   Crear Usuario Administrador
echo ========================================
echo.
echo Este script creara o actualizara el usuario admin
echo.
pause

node -e "const mysql = require('mysql2/promise'); const bcrypt = require('bcryptjs'); require('dotenv').config(); (async () => { try { const conn = await mysql.createConnection({ host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'sistema_bazar', port: process.env.DB_PORT || 3306 }); const [users] = await conn.execute('SELECT * FROM usuarios WHERE usuario = ?', ['admin']); if (users.length === 0) { const hash = await bcrypt.hash('admin123', 10); await conn.execute('INSERT INTO usuarios (nombre, usuario, contrasena, rol) VALUES (?, ?, ?, ?)', ['Administrador', 'admin', hash, 'gerencia']); console.log('Usuario admin creado exitosamente'); } else { const hash = await bcrypt.hash('admin123', 10); await conn.execute('UPDATE usuarios SET contrasena = ? WHERE usuario = ?', [hash, 'admin']); console.log('Contraseña del usuario admin actualizada'); } console.log('Usuario: admin'); console.log('Contraseña: admin123'); await conn.end(); } catch (e) { console.error('Error:', e.message); process.exit(1); } })();"

if errorlevel 1 (
    echo.
    echo ERROR: No se pudo crear/actualizar el usuario admin
    echo Verifica que MySQL este corriendo y la base de datos exista
) else (
    echo.
    echo ========================================
    echo   Usuario admin listo!
    echo ========================================
)

pause

