const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los usuarios
router.get('/', authenticateToken, authorizeRoles('administracion', 'gerencia'), async (req, res) => {
  try {
    const [usuarios] = await pool.execute(
      'SELECT id_usuario, nombre, usuario, rol FROM usuarios ORDER BY nombre'
    );
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Crear usuario
router.post('/', authenticateToken, authorizeRoles('administracion', 'gerencia'), async (req, res) => {
  try {
    const { nombre, usuario, contrasena, rol } = req.body;
    
    if (!['ventas', 'administracion', 'deposito', 'produccion', 'gerencia'].includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre, usuario, contrasena, rol) VALUES (?, ?, ?, ?)',
      [nombre, usuario, hashedPassword, rol]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Usuario creado exitosamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Actualizar usuario
router.put('/:id', authenticateToken, authorizeRoles('administracion', 'gerencia'), async (req, res) => {
  try {
    const { nombre, usuario, contrasena, rol } = req.body;
    
    if (rol && !['ventas', 'administracion', 'deposito', 'produccion', 'gerencia'].includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    
    let query = 'UPDATE usuarios SET nombre = ?, usuario = ?';
    let params = [nombre, usuario];
    
    if (contrasena) {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      query += ', contrasena = ?';
      params.push(hashedPassword);
    }
    
    if (rol) {
      query += ', rol = ?';
      params.push(rol);
    }
    
    query += ' WHERE id_usuario = ?';
    params.push(req.params.id);
    
    await pool.execute(query, params);
    
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Eliminar usuario
router.delete('/:id', authenticateToken, authorizeRoles('administracion', 'gerencia'), async (req, res) => {
  try {
    await pool.execute('DELETE FROM usuarios WHERE id_usuario = ?', [req.params.id]);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;

