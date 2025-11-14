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

// Servir archivos estáticos (imágenes)
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Routes
app.use('/auth', require('../server/routes/auth'));
app.use('/productos', require('../server/routes/productos'));
app.use('/clientes', require('../server/routes/clientes'));
app.use('/ventas', require('../server/routes/ventas'));
app.use('/pedidos', require('../server/routes/pedidos'));
app.use('/proveedores', require('../server/routes/proveedores'));
app.use('/usuarios', require('../server/routes/usuarios'));

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error del servidor' });
});

// Verificar variables de entorno críticas
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  ADVERTENCIA: JWT_SECRET no está configurado. Usando valor por defecto.');
  process.env.JWT_SECRET = 'merchdecobazar_secret_key_2024_cambiar_en_produccion';
}

module.exports = app;

