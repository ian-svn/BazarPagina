@echo off
echo ========================================
echo   Verificar/Crear Usuario Admin
echo ========================================
echo.

node verificar-admin.js

if errorlevel 1 (
    echo.
    echo ERROR: No se pudo verificar/crear el usuario admin
    echo Verifica que MySQL este corriendo y la base de datos exista
) else (
    echo.
    echo Usuario admin listo para usar!
)

pause

