# 🚀 Guía de Hosting - MerchDecoBazar

## ⚠️ Importante

GitHub Pages **NO puede hostear** aplicaciones con backend y base de datos. Necesitas usar servicios que soporten Node.js y MySQL.

## 🎯 Opciones Recomendadas (Gratuitas)

### Opción 1: Vercel + PlanetScale (RECOMENDADA) ⭐

**Ventajas:**
- ✅ Completamente gratuito
- ✅ Fácil de configurar
- ✅ Excelente rendimiento
- ✅ Base de datos MySQL gratuita

**Pasos:**

1. **Base de Datos (PlanetScale)**
   - Ve a https://planetscale.com
   - Crea cuenta gratuita
   - Crea una base de datos
   - Copia las credenciales de conexión

2. **Backend (Vercel)**
   - Ve a https://vercel.com
   - Conecta tu repositorio de GitHub
   - Configura las variables de entorno
   - Vercel detectará automáticamente el backend

3. **Frontend (Vercel)**
   - El mismo proyecto puede hostear frontend y backend
   - Vercel maneja ambos automáticamente

### Opción 2: Railway (Todo en uno)

**Ventajas:**
- ✅ Todo en un solo servicio
- ✅ Base de datos MySQL incluida
- ✅ $5 crédito gratis mensual

**Pasos:**
- Ve a https://railway.app
- Conecta tu repositorio
- Railway detecta automáticamente Node.js
- Crea una base de datos MySQL desde el dashboard

### Opción 3: Render (Alternativa)

**Ventajas:**
- ✅ Gratis con límites
- ✅ Fácil configuración
- ✅ Base de datos MySQL incluida

**Pasos:**
- Ve a https://render.com
- Crea cuenta gratuita
- Conecta repositorio
- Crea servicio Web y base de datos MySQL

## 📋 Configuración para Producción

### 1. Variables de Entorno

Crea un archivo `.env.production` con:

```env
DB_HOST=tu-host-de-planetscale
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_NAME=tu-base-de-datos
DB_PORT=3306

JWT_SECRET=tu-secreto-super-seguro-para-produccion

PORT=5000
NODE_ENV=production

CLIENT_URL=https://tu-dominio.vercel.app
```

### 2. Scripts de Build

Los scripts ya están configurados en `package.json`

### 3. Base de Datos en la Nube

Necesitarás ejecutar el script de inicialización en la base de datos en la nube.

## 🔧 Configuración Detallada por Servicio

Ver archivos:
- `vercel.json` - Configuración para Vercel
- `railway.json` - Configuración para Railway
- `render.yaml` - Configuración para Render

## 📝 Notas

- GitHub Pages solo puede hostear el frontend estático
- Para una aplicación completa necesitas servicios que soporten Node.js
- Las opciones recomendadas son todas gratuitas para proyectos pequeños

