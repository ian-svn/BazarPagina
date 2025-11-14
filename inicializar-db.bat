@echo off
echo ========================================
echo   Inicializando Base de Datos
echo ========================================
echo.

echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

echo.
echo Ejecutando script de inicialización...
node server/scripts/init-db.js

if errorlevel 1 (
    echo.
    echo ERROR: No se pudo inicializar la base de datos
    echo Verifica que MySQL esté corriendo y las credenciales en .env sean correctas
) else (
    echo.
    echo ========================================
    echo   Base de datos inicializada!
    echo ========================================
    echo.
    echo Usuario admin creado:
    echo   Usuario: admin
    echo   Contraseña: admin123
    echo.
    echo IMPORTANTE: Cambia la contraseña después del primer inicio de sesion
    echo.
)

pause

