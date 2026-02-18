// Este archivo es para Vercel Serverless Functions
// Vercel automáticamente crea funciones serverless desde /api
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta especial para inicializar base de datos (solo en producción/Vercel)
app.get('/init-db', require('./init-db'));

// Routes - En Vercel, cuando se accede a /api/productos, Vercel llama a esta función
// y la ruta que llega aquí es /productos (sin el /api)
// Por eso mapeamos directamente sin /api
app.use('/auth', require('../server/routes/auth'));
app.use('/productos', require('../server/routes/productos'));
app.use('/clientes', require('../server/routes/clientes'));
app.use('/ventas', require('../server/routes/ventas'));
app.use('/pedidos', require('../server/routes/pedidos'));
app.use('/proveedores', require('../server/routes/proveedores'));
app.use('/usuarios', require('../server/routes/usuarios'));

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente en Vercel',
    timestamp: new Date().toISOString(),
    path: req.path,
    url: req.url,
    originalUrl: req.originalUrl
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en API:', err.stack);
  res.status(500).json({ 
    error: 'Error del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Verificar variables de entorno críticas
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  ADVERTENCIA: JWT_SECRET no está configurado. Usando valor por defecto.');
  process.env.JWT_SECRET = 'merchdecobazar_secret_key_2024_cambiar_en_produccion';
}

// Exportar como handler para Vercel
// Vercel espera que exportemos la app directamente
module.exports = app;
