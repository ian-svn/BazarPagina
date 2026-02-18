const express = require('express');
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los pedidos personalizados
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [pedidos] = await pool.execute(
      `SELECT p.*, c.nombre as cliente_nombre, c.telefono, c.email 
       FROM pedidos_personalizados p 
       LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
       ORDER BY p.fecha_pedido DESC, p.id_pedido DESC`
    );
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Obtener un pedido por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [pedidos] = await pool.execute(
      `SELECT p.*, c.nombre as cliente_nombre, c.telefono, c.email, c.direccion 
       FROM pedidos_personalizados p 
       LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
       WHERE p.id_pedido = ?`,
      [req.params.id]
    );
    
    if (pedidos.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    res.json(pedidos[0]);
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Crear pedido personalizado (público para e-commerce)
router.post('/', async (req, res) => {
  try {
    const { id_cliente, descripcion } = req.body;
    const fecha_pedido = new Date().toISOString().split('T')[0];
    
    const [result] = await pool.execute(
      'INSERT INTO pedidos_personalizados (id_cliente, descripcion, fecha_pedido, estado) VALUES (?, ?, ?, ?)',
      [id_cliente || null, descripcion, fecha_pedido, 'pendiente']
    );
    
    res.status(201).json({ id: result.insertId, message: 'Pedido creado exitosamente' });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Actualizar estado del pedido
router.put('/:id/estado', authenticateToken, authorizeRoles('produccion', 'administracion', 'gerencia'), async (req, res) => {
  try {
    const { estado } = req.body;
    
    if (!['pendiente', 'en_produccion', 'finalizado', 'entregado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    
    await pool.execute(
      'UPDATE pedidos_personalizados SET estado = ? WHERE id_pedido = ?',
      [estado, req.params.id]
    );
    
    res.json({ message: 'Estado del pedido actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Actualizar pedido completo
router.put('/:id', authenticateToken, authorizeRoles('produccion', 'administracion', 'gerencia'), async (req, res) => {
  try {
    const { descripcion, estado, id_cliente } = req.body;
    
    await pool.execute(
      'UPDATE pedidos_personalizados SET descripcion = ?, estado = ?, id_cliente = ? WHERE id_pedido = ?',
      [descripcion, estado, id_cliente, req.params.id]
    );
    
    res.json({ message: 'Pedido actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;

