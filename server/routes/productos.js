const express = require('express');
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los productos (público)
router.get('/', async (req, res) => {
  try {
    const [productos] = await pool.execute(
      `SELECT p.*, pr.nombre as proveedor_nombre 
       FROM productos p 
       LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
       ORDER BY p.nombre`
    );
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Obtener un producto por ID (público)
router.get('/:id', async (req, res) => {
  try {
    const [productos] = await pool.execute(
      `SELECT p.*, pr.nombre as proveedor_nombre 
       FROM productos p 
       LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
       WHERE p.id_producto = ?`,
      [req.params.id]
    );
    if (productos.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(productos[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Crear producto (solo admin/ventas)
router.post('/', authenticateToken, authorizeRoles('ventas', 'administracion', 'gerencia'), async (req, res) => {
  try {
    const { nombre, descripcion, stock, precio, imagen_url, id_proveedor } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO productos (nombre, descripcion, stock, precio, imagen_url, id_proveedor) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, stock || 0, precio, imagen_url, id_proveedor || null]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Producto creado exitosamente' });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Actualizar producto
router.put('/:id', authenticateToken, authorizeRoles('ventas', 'administracion', 'gerencia', 'deposito'), async (req, res) => {
  try {
    const { nombre, descripcion, stock, precio, imagen_url, id_proveedor } = req.body;
    
    await pool.execute(
      'UPDATE productos SET nombre = ?, descripcion = ?, stock = ?, precio = ?, imagen_url = ?, id_proveedor = ? WHERE id_producto = ?',
      [nombre, descripcion, stock, precio, imagen_url, id_proveedor || null, req.params.id]
    );
    
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Eliminar producto
router.delete('/:id', authenticateToken, authorizeRoles('administracion', 'gerencia'), async (req, res) => {
  try {
    await pool.execute('DELETE FROM productos WHERE id_producto = ?', [req.params.id]);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;

