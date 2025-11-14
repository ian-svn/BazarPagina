@echo off
echo ========================================
echo   Inicializando Base de Datos
echo ========================================
echo.
echo IMPORTANTE: Asegurate de que XAMPP MySQL este corriendo
echo.

echo [1/3] Verificando archivo .env...
if not exist ".env" (
    echo Creando archivo .env...
    (
        echo # Database Configuration
        echo DB_HOST=localhost
        echo DB_USER=root
        echo DB_PASSWORD=
        echo DB_NAME=sistema_bazar
        echo DB_PORT=3306
        echo.
        echo # JWT Secret
        echo JWT_SECRET=merchdecobazar_secret_key_2024_cambiar_en_produccion
        echo.
        echo # Server Configuration
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # Frontend URL
        echo CLIENT_URL=http://localhost:3000
    ) > .env
    echo Archivo .env creado.
) else (
    echo Archivo .env existe.
)

echo.
echo [2/3] Verificando dependencias...
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
echo [3/3] Ejecutando script de inicialización...
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

