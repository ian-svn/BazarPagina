const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes)
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/ventas', require('./routes/ventas'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/proveedores', require('./routes/proveedores'));
app.use('/api/usuarios', require('./routes/usuarios'));

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error del servidor' });
});

// En producción, servir React para todas las rutas no-API
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Verificar variables de entorno críticas
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  ADVERTENCIA: JWT_SECRET no está configurado. Usando valor por defecto.');
  process.env.JWT_SECRET = 'merchdecobazar_secret_key_2024_cambiar_en_produccion';
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Base de datos: ${process.env.DB_NAME || 'sistema_bazar'}`);
});

