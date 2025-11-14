@echo off
echo ========================================
echo   MerchDecoBazar - Iniciando Sistema
echo ========================================
echo.
echo IMPORTANTE: Asegurate de que XAMPP MySQL este corriendo
echo.

echo [1/5] Verificando archivo .env...
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
echo [2/5] Verificando puertos...
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo Puerto 3000 esta en uso. Liberando puerto...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
    echo Puerto 3000 liberado.
) else (
    echo Puerto 3000 disponible.
)

netstat -ano | findstr :5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo Puerto 5000 esta en uso. Liberando puerto...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
    echo Puerto 5000 liberado.
) else (
    echo Puerto 5000 disponible.
)

echo.
echo [3/5] Verificando dependencias del backend...
if not exist "node_modules" (
    echo Instalando dependencias del backend...
    call npm install
    if errorlevel 1 (
        echo ERROR: No se pudieron instalar las dependencias del backend
        pause
        exit /b 1
    )
) else (
    echo Dependencias del backend ya instaladas.
)

echo.
echo [4/5] Verificando dependencias del frontend...
if not exist "client\node_modules" (
    echo Instalando dependencias del frontend...
    cd client
    call npm install
    if errorlevel 1 (
        echo ERROR: No se pudieron instalar las dependencias del frontend
        pause
        exit /b 1
    )
    cd ..
) else (
    echo Dependencias del frontend ya instaladas.
)

echo.
echo [5/5] Iniciando servidor...
echo.
echo ========================================
echo   Sistema iniciado correctamente!
echo ========================================
echo.
echo E-commerce: http://localhost:3000
echo Panel Admin: http://localhost:3000/admin/login
echo Usuario: admin
echo Contraseña: admin123
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

call npm run dev

pause
