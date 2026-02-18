# Despliegue en producción

Este proyecto necesita **Node.js** y **MySQL**. GitHub Pages no puede hostearlo. Opciones recomendadas:

---

## Opción 1: Vercel + PlanetScale (recomendada)

### Base de datos (PlanetScale)

1. Crea cuenta en [PlanetScale](https://planetscale.com).
2. Crea una base de datos y anota host, usuario, contraseña y nombre.

### Código en GitHub

```bash
git add .
git commit -m "Deploy"
git remote add origin https://github.com/TU_USUARIO/Bazar.git
git push -u origin main
```

### Vercel

1. Entra en [Vercel](https://vercel.com) y conecta el repo de GitHub.
2. **Configuración del proyecto:**
   - Framework: **Other**
   - Root: `./`
   - Build: `npm run vercel-build`
   - Output: `client/build`
   - Install: `npm install`

3. **Variables de entorno** (Settings → Environment Variables):

   | Variable     | Valor                          |
   |-------------|----------------------------------|
   | DB_HOST     | host de PlanetScale             |
   | DB_USER     | usuario                         |
   | DB_PASSWORD | contraseña                      |
   | DB_NAME     | nombre de la base               |
   | DB_PORT     | 3306                            |
   | JWT_SECRET  | un secreto largo y aleatorio    |
   | NODE_ENV    | production                      |
   | CLIENT_URL  | https://tu-proyecto.vercel.app   |

4. Deploy.

### Inicializar la base de datos

**Opción A – Endpoint (si tu API lo expone):**  
Después del deploy, llama una vez al endpoint de init-db (por ejemplo con un `secret` en query). Revisa si existe `api/init-db` o similar en el proyecto y la URL que te da Vercel.

**Opción B – Desde tu PC:**  
Pon en tu `.env` local las mismas credenciales de PlanetScale y ejecuta:

```bash
node server/scripts/init-db.js
```

Luego en producción usa: **admin** / **admin123** (y cambia la contraseña).

---

## Opción 2: Railway

1. [Railway](https://railway.app) → New Project → Deploy from GitHub repo.
2. Añade un servicio **MySQL** en el mismo proyecto.
3. En Variables, enlaza las variables de la base de datos y añade:
   - `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=https://tu-dominio.railway.app`
4. Inicializa la BD desde tu máquina (`.env` con credenciales de Railway) con:
   ```bash
   node server/scripts/init-db.js
   ```

---

## Comprobar después del deploy

- Página principal y rutas del frontend cargan.
- Login admin: `admin` / `admin123`.
- Imágenes: que estén en `client/public/assets/` y se referencien con rutas tipo `/assets/...`.

Si algo falla, revisa logs en el panel de Vercel/Railway y que las variables de entorno (sobre todo BD y `CLIENT_URL`) estén bien configuradas.
