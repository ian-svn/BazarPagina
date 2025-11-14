# 🚀 Deploy en Vercel - Guía Paso a Paso

## 📋 Requisitos Previos

1. Cuenta en GitHub
2. Cuenta en Vercel (gratis) - https://vercel.com
3. Cuenta en PlanetScale (gratis) - https://planetscale.com

## 🔧 Paso 1: Configurar Base de Datos (PlanetScale)

1. Ve a https://planetscale.com y crea una cuenta
2. Crea un nuevo proyecto
3. Crea una base de datos MySQL
4. Ve a "Connect" y copia las credenciales:
   - Host
   - Usuario
   - Contraseña
   - Puerto (generalmente 3306)

5. Ejecuta el script de inicialización:
   ```bash
   # Actualiza el .env con las credenciales de PlanetScale
   node server/scripts/init-db.js
   ```

## 🚀 Paso 2: Deploy en Vercel

### Opción A: Desde GitHub (Recomendado)

1. **Sube tu código a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [URL_DE_TU_REPO]
   git push -u origin main
   ```

2. **Conecta con Vercel:**
   - Ve a https://vercel.com
   - Haz clic en "New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración

3. **Configuración del Proyecto:**
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install && cd client && npm install`

4. **Configura Variables de Entorno:**
   En la configuración del proyecto, agrega:
   ```
   DB_HOST=tu-host-planetscale
   DB_USER=tu-usuario
   DB_PASSWORD=tu-password
   DB_NAME=tu-base-de-datos
   DB_PORT=3306
   JWT_SECRET=tu-secreto-super-seguro
   NODE_ENV=production
   CLIENT_URL=https://tu-proyecto.vercel.app
   ```

5. **Deploy:**
   - Haz clic en "Deploy"
   - Espera a que termine
   - Tu aplicación estará en: `https://tu-proyecto.vercel.app`

**Nota:** Vercel usará el archivo `api/index.js` para las rutas `/api/*`

### Opción B: Desde CLI

1. **Instala Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Configura variables de entorno:**
   ```bash
   vercel env add DB_HOST
   vercel env add DB_USER
   vercel env add DB_PASSWORD
   vercel env add DB_NAME
   vercel env add JWT_SECRET
   ```

## 📝 Notas Importantes

- Vercel hostea automáticamente el frontend y backend
- Las variables de entorno se configuran en el dashboard de Vercel
- El archivo `vercel.json` ya está configurado
- La base de datos debe estar accesible desde internet (PlanetScale lo es)

## 🔗 URLs

- Frontend: `https://tu-proyecto.vercel.app`
- API: `https://tu-proyecto.vercel.app/api`
- Panel Admin: `https://tu-proyecto.vercel.app/admin/login`

