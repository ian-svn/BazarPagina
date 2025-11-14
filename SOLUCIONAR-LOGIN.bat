@echo off
echo ========================================
echo   Solucionar Problemas de Login
echo ========================================
echo.
echo Este script verificara y corregira:
echo   1. Archivo .env
echo   2. Usuario admin en la base de datos
echo   3. Conexion a MySQL
echo.
pause

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
)

echo.
echo [3/3] Verificando y creando usuario admin...
node verificar-admin.js

if errorlevel 1 (
    echo.
    echo ========================================
    echo   ERROR: No se pudo solucionar
    echo ========================================
    echo.
    echo Verifica que:
    echo   1. MySQL este corriendo
    echo   2. La base de datos exista (ejecuta inicializar-db.bat)
    echo   3. Las credenciales en .env sean correctas
    echo.
) else (
    echo.
    echo ========================================
    echo   Todo listo!
    echo ========================================
    echo.
    echo Credenciales:
    echo   Usuario: admin
    echo   Contraseña: admin123
    echo.
    echo Ahora puedes iniciar sesion en:
    echo   http://localhost:3000/admin/login
    echo.
)

pause

