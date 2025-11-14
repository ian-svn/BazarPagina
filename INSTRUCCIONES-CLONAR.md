# 📋 Instrucciones para Clonar e Iniciar el Proyecto

## ✅ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
- **Node.js** (v14 o superior) - [Descargar](https://nodejs.org/)
- **XAMPP** (incluye MySQL) - [Descargar](https://www.apachefriends.org/)

## 🚀 Pasos para Iniciar

### 1. Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd Bazar
```

### 2. Iniciar XAMPP
1. Abre **XAMPP Control Panel**
2. Haz clic en **Start** junto a **MySQL**
3. Espera a que el estado cambie a verde

### 3. Inicializar la Base de Datos (Solo Primera Vez)
- Doble clic en `inicializar-db.bat`
- Este script:
  - Crea el archivo `.env` si no existe
  - Instala dependencias si faltan
  - Crea la base de datos `sistema_bazar`
  - Crea las tablas necesarias
  - Crea el usuario administrador

### 4. Iniciar el Sistema
- Doble clic en `iniciar.bat`
- Este script:
  - Verifica y libera puertos si están ocupados
  - Instala dependencias si faltan
  - Inicia el servidor backend (puerto 5000)
  - Inicia el frontend React (puerto 3000)

### 5. Acceder al Sistema
- **E-commerce**: http://localhost:3000
- **Panel Admin**: http://localhost:3000/admin/login
  - Usuario: `admin`
  - Contraseña: `admin123`

## 🔧 Solución de Problemas

### Si el login no funciona:
Ejecuta `SOLUCIONAR-LOGIN.bat` - Verifica y corrige automáticamente los problemas

### Si hay errores de puerto:
El script `iniciar.bat` libera automáticamente los puertos 3000 y 5000 si están ocupados

### Si MySQL no conecta:
1. Verifica que XAMPP MySQL esté corriendo
2. Verifica las credenciales en el archivo `.env`:
   - DB_HOST=localhost
   - DB_USER=root
   - DB_PASSWORD= (vacío por defecto en XAMPP)

## 📝 Notas

- La primera ejecución puede tardar varios minutos (instalación de dependencias)
- No cierres la ventana del servidor mientras uses la aplicación
- Para detener el servidor, presiona `Ctrl+C` en la ventana
- Cambia la contraseña del admin después del primer inicio de sesión

## 🎯 Resumen Rápido

```
1. Iniciar XAMPP MySQL
2. Ejecutar: inicializar-db.bat (solo primera vez)
3. Ejecutar: iniciar.bat
4. Abrir: http://localhost:3000
```

