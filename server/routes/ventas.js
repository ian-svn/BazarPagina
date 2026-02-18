const express = require('express');
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Obtener todas las ventas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [ventas] = await pool.execute(
      `SELECT v.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre 
       FROM ventas v 
       LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
       LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
       ORDER BY v.fecha DESC, v.id_venta DESC`
    );
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Obtener una venta por ID con detalles
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [ventas] = await pool.execute(
      `SELECT v.*, c.nombre as cliente_nombre, c.telefono, c.email, u.nombre as usuario_nombre 
       FROM ventas v 
       LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
       LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
       WHERE v.id_venta = ?`,
      [req.params.id]
    );
    
    if (ventas.length === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    
    const [detalles] = await pool.execute(
      `SELECT dv.*, p.nombre as producto_nombre, p.imagen_url 
       FROM detalle_venta dv 
       JOIN productos p ON dv.id_producto = p.id_producto
       WHERE dv.id_venta = ?`,
      [req.params.id]
    );
    
    res.json({ ...ventas[0], detalles });
  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Crear venta (público para e-commerce)
router.post('/public', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { id_cliente, forma_pago, productos } = req.body;
    const fecha = new Date().toISOString().split('T')[0];
    
    // Calcular total
    let total = 0;
    for (const item of productos) {
      const [productos_db] = await connection.execute(
        'SELECT precio, stock, nombre FROM productos WHERE id_producto = ?',
        [item.id_producto]
      );
      if (productos_db.length === 0) {
        throw new Error(`Producto ${item.id_producto} no encontrado`);
      }
      if (productos_db[0].stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${productos_db[0].nombre}`);
      }
      total += productos_db[0].precio * item.cantidad;
    }
    
    // Crear venta (sin usuario, es venta pública)
    const [ventaResult] = await connection.execute(
      'INSERT INTO ventas (fecha, id_cliente, id_usuario, forma_pago, total) VALUES (?, ?, ?, ?, ?)',
      [fecha, id_cliente || null, null, forma_pago, total]
    );
    
    const id_venta = ventaResult.insertId;
    
    // Crear detalles y actualizar stock
    for (const item of productos) {
      const [productos_db] = await connection.execute(
        'SELECT precio FROM productos WHERE id_producto = ?',
        [item.id_producto]
      );
      
      await connection.execute(
        'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [id_venta, item.id_producto, item.cantidad, productos_db[0].precio]
      );
      
      await connection.execute(
        'UPDATE productos SET stock = stock - ? WHERE id_producto = ?',
        [item.cantidad, item.id_producto]
      );
    }
    
    await connection.commit();
    res.status(201).json({ id: id_venta, message: 'Venta registrada exitosamente', total });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear venta:', error);
    res.status(500).json({ error: error.message || 'Error del servidor' });
  } finally {
    connection.release();
  }
});

// Crear venta (panel admin)
router.post('/', authenticateToken, authorizeRoles('ventas', 'administracion', 'gerencia'), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { id_cliente, forma_pago, productos, id_usuario } = req.body;
    const fecha = new Date().toISOString().split('T')[0];
    
    // Calcular total
    let total = 0;
    for (const item of productos) {
      const [productos_db] = await connection.execute(
        'SELECT precio, stock, nombre FROM productos WHERE id_producto = ?',
        [item.id_producto]
      );
      if (productos_db.length === 0) {
        throw new Error(`Producto ${item.id_producto} no encontrado`);
      }
      if (productos_db[0].stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${productos_db[0].nombre}`);
      }
      total += productos_db[0].precio * item.cantidad;
    }
    
    // Crear venta
    const [ventaResult] = await connection.execute(
      'INSERT INTO ventas (fecha, id_cliente, id_usuario, forma_pago, total) VALUES (?, ?, ?, ?, ?)',
      [fecha, id_cliente || null, id_usuario || req.user.id, forma_pago, total]
    );
    
    const id_venta = ventaResult.insertId;
    
    // Crear detalles y actualizar stock
    for (const item of productos) {
      const [productos_db] = await connection.execute(
        'SELECT precio FROM productos WHERE id_producto = ?',
        [item.id_producto]
      );
      
      await connection.execute(
        'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [id_venta, item.id_producto, item.cantidad, productos_db[0].precio]
      );
      
      await connection.execute(
        'UPDATE productos SET stock = stock - ? WHERE id_producto = ?',
        [item.cantidad, item.id_producto]
      );
    }
    
    await connection.commit();
    res.status(201).json({ id: id_venta, message: 'Venta registrada exitosamente', total });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear venta:', error);
    res.status(500).json({ error: error.message || 'Error del servidor' });
  } finally {
    connection.release();
  }
});

module.exports = router;

