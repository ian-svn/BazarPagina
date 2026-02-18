const express = require('express');
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los proveedores
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [proveedores] = await pool.execute('SELECT * FROM proveedores ORDER BY nombre');
    res.json(proveedores);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Obtener un proveedor por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [proveedores] = await pool.execute('SELECT * FROM proveedores WHERE id_proveedor = ?', [req.params.id]);
    if (proveedores.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(proveedores[0]);
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Crear proveedor
router.post('/', authenticateToken, authorizeRoles('administracion', 'gerencia'), async (req, res) => {
  try {
    const { nombre, contacto, telefono, email } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO proveedores (nombre, contacto, telefono, email) VALUES (?, ?, ?, ?)',
      [nombre, contacto || null, telefono || null, email || null]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Proveedor creado exitosamente' });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Actualizar proveedor
router.put('/:id', authenticateToken, authorizeRoles('administracion', 'gerencia'), async (req, res) => {
  try {
    const { nombre, contacto, telefono, email } = req.body;
    
    await pool.execute(
      'UPDATE proveedores SET nombre = ?, contacto = ?, telefono = ?, email = ? WHERE id_proveedor = ?',
      [nombre, contacto, telefono, email, req.params.id]
    );
    
    res.json({ message: 'Proveedor actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Eliminar proveedor
router.delete('/:id', authenticateToken, authorizeRoles('administracion', 'gerencia'), async (req, res) => {
  try {
    await pool.execute('DELETE FROM proveedores WHERE id_proveedor = ?', [req.params.id]);
    res.json({ message: 'Proveedor eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;

