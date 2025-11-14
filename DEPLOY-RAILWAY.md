# 🚀 Deploy en Railway - Guía Paso a Paso

## 📋 Requisitos Previos

1. Cuenta en GitHub
2. Cuenta en Railway (gratis) - https://railway.app
3. Tarjeta de crédito (solo para verificación, no se cobra)

## 🔧 Paso 1: Preparar el Proyecto

1. Asegúrate de que tu código esté en GitHub
2. El archivo `railway.json` ya está configurado

## 🚀 Paso 2: Deploy en Railway

1. **Ve a Railway:**
   - https://railway.app
   - Crea una cuenta (puedes usar GitHub)

2. **Crea un Nuevo Proyecto:**
   - Haz clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio

3. **Crea la Base de Datos:**
   - En el dashboard, haz clic en "+ New"
   - Selecciona "Database" → "MySQL"
   - Railway creará automáticamente la base de datos

4. **Configura Variables de Entorno:**
   - Ve a "Variables"
   - Railway ya tiene las variables de la base de datos
   - Agrega manualmente:
     ```
     JWT_SECRET=tu-secreto-super-seguro
     NODE_ENV=production
     CLIENT_URL=https://tu-proyecto.railway.app
     ```

5. **Inicializa la Base de Datos:**
   - Ve a la base de datos MySQL
   - Copia las credenciales de conexión
   - Actualiza tu `.env` local
   - Ejecuta: `node server/scripts/init-db.js`

6. **Deploy:**
   - Railway detectará automáticamente Node.js
   - El deploy comenzará automáticamente
   - Espera a que termine

## 📝 Notas

- Railway ofrece $5 gratis mensuales
- La base de datos se crea automáticamente
- Las variables de entorno se configuran fácilmente
- El dominio será: `tu-proyecto.railway.app`

## 🔗 URLs

- Aplicación: `https://tu-proyecto.railway.app`
- Panel Admin: `https://tu-proyecto.railway.app/admin/login`

