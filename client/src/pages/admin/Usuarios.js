import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import './Usuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    contrasena: '',
    rol: 'ventas'
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/api/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUsuario) {
        await api.put(`/api/usuarios/${editingUsuario.id_usuario}`, formData);
      } else {
        await api.post('/api/usuarios', formData);
      }
      fetchUsuarios();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert(error.response?.data?.error || 'Error al guardar usuario');
    }
  };

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      contrasena: '',
      rol: usuario.rol
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await api.delete(`/api/usuarios/${id}`);
      fetchUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar usuario');
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', usuario: '', contrasena: '', rol: 'ventas' });
    setEditingUsuario(null);
  };

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="usuarios-page">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          + Nuevo Usuario
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id_usuario}>
                <td>{usuario.nombre}</td>
                <td>{usuario.usuario}</td>
                <td>
                  <span className="rol-badge">{usuario.rol}</span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(usuario)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(usuario.id_usuario)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Usuario *</label>
                <input
                  type="text"
                  required
                  value={formData.usuario}
                  onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>{editingUsuario ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}</label>
                <input
                  type="password"
                  required={!editingUsuario}
                  value={formData.contrasena}
                  onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Rol *</label>
                <select
                  required
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                >
                  <option value="ventas">Ventas</option>
                  <option value="administracion">Administración</option>
                  <option value="deposito">Depósito</option>
                  <option value="produccion">Producción</option>
                  <option value="gerencia">Gerencia</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;

