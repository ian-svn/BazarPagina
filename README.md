# 🛍️ MerchDecoBazar - Sistema de E-commerce

Sistema completo de e-commerce público y panel de administración.

## 🚀 Inicio Rápido (Después de clonar)

### Requisitos Previos
- ✅ Node.js instalado
- ✅ XAMPP instalado (o MySQL corriendo)

### Pasos para Iniciar

1. **Asegúrate de que XAMPP esté corriendo**
   - Abre XAMPP Control Panel
   - Inicia el servicio **MySQL**

2. **Inicializar la base de datos** (solo primera vez)
   - Doble clic en `inicializar-db.bat`
   - Espera a que termine (creará la base de datos y el usuario admin)

3. **Iniciar el sistema**
   - Doble clic en `iniciar.bat`
   - El sistema se abrirá automáticamente en http://localhost:3000

### Credenciales de Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`

## 🌐 Hosting en la Nube

**GitHub Pages NO funciona** para esta aplicación (necesita backend y base de datos).

### Opciones Recomendadas:
- **Vercel + PlanetScale** (Recomendado) - Ver `DEPLOY-VERCEL.md`
- **Railway** (Todo en uno) - Ver `DEPLOY-RAILWAY.md`
- **Render** - Ver `HOSTING.md`

Ver `README-HOSTING.md` para comparación de opciones.

## 📋 Requisitos

- Node.js (v14+)
- MySQL (v5.7+) o XAMPP
- MySQL debe estar corriendo antes de iniciar

## ⚙️ Configuración

Edita `.env` si necesitas cambiar:
- Credenciales de MySQL
- Puerto del servidor (default: 5000)

## 📝 Notas Importantes

- La primera vez puede tardar varios minutos (instalación de dependencias)
- Si el login no funciona, ejecuta `SOLUCIONAR-LOGIN.bat`
- Cambia la contraseña del admin después del primer inicio de sesión

## 🔧 Solución de Problemas

### Si el login no funciona:
1. Ejecuta `SOLUCIONAR-LOGIN.bat` - Este script verificará y corregirá automáticamente:
   - Creará el archivo .env si no existe
   - Verificará y creará el usuario admin
   - Verificará la conexión a MySQL

### Credenciales por defecto:
- Usuario: `admin`
- Contraseña: `admin123`

## 📚 Documentación Adicional

- `INSTRUCCIONES-CLONAR.md` - Instrucciones detalladas para clonar
- `DEPLOY-VERCEL.md` - Guía completa para deploy en Vercel
- `DEPLOY-RAILWAY.md` - Guía completa para deploy en Railway
- `HOSTING.md` - Información general de hosting
- `README-HOSTING.md` - Comparación de opciones de hosting
