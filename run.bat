@echo off
chcp 65001 >nul
title MerchDeco Bazar

echo ========================================
echo   MerchDeco Bazar
echo ========================================
echo.

netstat -an | findstr ":3306.*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo MySQL ya está en ejecución.
    goto :listo_bd
)

echo MySQL no está en ejecución. Intentando iniciar...
net start MySQL 2>nul
if %errorlevel% equ 0 (
    echo MySQL iniciado correctamente.
    timeout /t 2 /nobreak >nul
    goto :listo_bd
)

net start MySQL80 2>nul
if %errorlevel% equ 0 (
    echo MySQL iniciado correctamente.
    timeout /t 2 /nobreak >nul
    goto :listo_bd
)

net start MySQL57 2>nul
if %errorlevel% equ 0 (
    echo MySQL iniciado correctamente.
    timeout /t 2 /nobreak >nul
    goto :listo_bd
)

timeout /t 1 /nobreak >nul
netstat -an | findstr ":3306.*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo MySQL en ejecución.
    goto :listo_bd
)

echo.
echo No se pudo iniciar MySQL automáticamente.
echo Abre el Panel de Control de XAMPP e inicia MySQL, luego ejecuta este script de nuevo.
echo.
pause
exit /b 1

:listo_bd
echo.

if not exist ".env" (
    echo Creando .env...
    if exist ".env.example" (
        copy .env.example .env >nul
    ) else (
        (
        echo DB_HOST=localhost
        echo DB_USER=root
        echo DB_PASSWORD=
        echo DB_NAME=sistema_bazar
        echo DB_PORT=3306
        echo JWT_SECRET=merchdecobazar_secret_key_2024_cambiar_en_produccion
        echo PORT=5000
        echo NODE_ENV=development
        echo CLIENT_URL=http://localhost:3000
        ) > .env
    )
)

if not exist "node_modules" (
    echo Instalando dependencias del backend...
    call npm install
    if errorlevel 1 ( echo ERROR instalando dependencias. & pause & exit /b 1 )
)
echo Instalando/actualizando dependencias del frontend...
cd client
call npm install
cd ..
if errorlevel 1 ( echo ERROR instalando frontend. & pause & exit /b 1 )

echo Inicializando base de datos...
node server/scripts/init-db.js 2>nul
if errorlevel 1 (
    node verificar-admin.js 2>nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000" ^| findstr "LISTENING" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
timeout /t 1 /nobreak >nul

echo.
echo ========================================
echo   Iniciando aplicación
echo ========================================
echo   E-commerce:  http://localhost:3000
echo   Panel Admin: http://localhost:3000/admin/login
echo   Usuario: admin   Contrasena: admin123
echo ========================================
echo   Presiona Ctrl+C para detener.
echo.

call npm run dev
pause