# MerchDeco Bazar

Sistema de e-commerce y gestión para Bazar (tienda online + panel de administración).

## Requisitos

- **Node.js** v14 o superior — [Descargar](https://nodejs.org/)
- **MySQL** (por ejemplo vía XAMPP) — [XAMPP](https://www.apachefriends.org/)

## Clonar e instalar

```bash
git clone https://github.com/TU_USUARIO/Bazar.git
cd Bazar
```

## Ejecutar el proyecto

### Windows (recomendado)

1. Inicia **MySQL** (XAMPP → Start en MySQL).
2. Doble clic en **`run.bat`** (único script con menú).
3. La primera vez elige la opción **1** (Primera vez / Instalar todo).
4. En ejecuciones siguientes usa la opción **2** (Iniciar aplicación).

### Manual (cualquier sistema)

1. Inicia MySQL.
2. Crea `.env` en la raíz (puedes copiar `.env.example` y ajustar valores).
3. Primera vez: `npm run install-all` y luego `node server/scripts/init-db.js`.
4. Iniciar: `npm run dev`.

## URLs

- **E-commerce:** http://localhost:3000  
- **Panel admin:** http://localhost:3000/admin/login  
  - Usuario: `admin`  
  - Contraseña: `admin123`  

*(Cambia la contraseña después del primer acceso.)*

## Estructura del proyecto

```
Bazar/
├── client/           # Frontend React (e-commerce + admin)
├── server/            # Backend Express (API + auth)
├── server/scripts/    # Scripts (init-db, etc.)
├── .env.example      # Plantilla de variables de entorno
├── run.bat           # Menú único: instalar, iniciar, init DB, etc.
├── package.json
└── README.md
```

## Variables de entorno

Copia `.env.example` a `.env` y configura:

| Variable     | Descripción           | Ejemplo (local)   |
|-------------|------------------------|-------------------|
| DB_HOST     | Host de MySQL          | localhost         |
| DB_USER     | Usuario MySQL          | root              |
| DB_PASSWORD | Contraseña MySQL       | (vacío en XAMPP)  |
| DB_NAME     | Nombre de la base      | sistema_bazar     |
| DB_PORT     | Puerto MySQL           | 3306              |
| JWT_SECRET  | Secreto para JWT       | (string seguro)   |
| PORT        | Puerto del backend     | 5000              |
| CLIENT_URL  | URL del frontend       | http://localhost:3000 |

El archivo `.env` no se sube a GitHub (está en `.gitignore`).

## Solución de problemas

### El login no funciona
- Ejecuta **`run.bat`** y elige la opción **4** (Solucionar login / verificar admin).
- Comprueba que MySQL esté corriendo y que `.env` tenga las credenciales correctas.

### Puertos 3000 o 5000 en uso
- `run.bat` puede liberar esos puertos al iniciar.
- O cierra la otra aplicación que los use.

### MySQL no conecta
- Comprueba que el servicio MySQL (XAMPP u otro) esté iniciado.
- Revisa en `.env`: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`.

### La base de datos no existe o está vacía
- Ejecuta **`run.bat`** → opción **3** (Solo inicializar base de datos).
- O manualmente: `node server/scripts/init-db.js`.

## Despliegue

Para desplegar en Vercel, Railway u otros servicios, ver **[DEPLOY.md](DEPLOY.md)** (base de datos en la nube, variables de entorno e inicialización de la BD en producción).

## Licencia

ISC
