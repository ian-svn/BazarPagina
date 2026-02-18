const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los clientes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [clientes] = await pool.execute('SELECT * FROM clientes ORDER BY nombre');
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Obtener un cliente por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [clientes] = await pool.execute('SELECT * FROM clientes WHERE id_cliente = ?', [req.params.id]);
    if (clientes.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(clientes[0]);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Crear cliente (público para e-commerce, autenticado para panel)
router.post('/', async (req, res) => {
  try {
    const { nombre, telefono, direccion, email } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO clientes (nombre, telefono, direccion, email) VALUES (?, ?, ?, ?)',
      [nombre, telefono || null, direccion || null, email || null]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Cliente creado exitosamente' });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Actualizar cliente
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { nombre, telefono, direccion, email } = req.body;
    
    await pool.execute(
      'UPDATE clientes SET nombre = ?, telefono = ?, direccion = ?, email = ? WHERE id_cliente = ?',
      [nombre, telefono, direccion, email, req.params.id]
    );
    
    res.json({ message: 'Cliente actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Eliminar cliente
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.execute('DELETE FROM clientes WHERE id_cliente = ?', [req.params.id]);
    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;

