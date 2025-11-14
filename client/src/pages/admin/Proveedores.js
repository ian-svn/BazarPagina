import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import './Proveedores.css';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: ''
  });

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await api.get('/api/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProveedor) {
        await api.put(`/api/proveedores/${editingProveedor.id_proveedor}`, formData);
      } else {
        await api.post('/api/proveedores', formData);
      }
      fetchProveedores();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      alert('Error al guardar proveedor');
    }
  };

  const handleEdit = (proveedor) => {
    setEditingProveedor(proveedor);
    setFormData({
      nombre: proveedor.nombre,
      contacto: proveedor.contacto || '',
      telefono: proveedor.telefono || '',
      email: proveedor.email || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este proveedor?')) return;
    try {
      await api.delete(`/api/proveedores/${id}`);
      fetchProveedores();
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      alert('Error al eliminar proveedor');
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', contacto: '', telefono: '', email: '' });
    setEditingProveedor(null);
  };

  if (loading) {
    return <div className="loading">Cargando proveedores...</div>;
  }

  return (
    <div className="proveedores-page">
      <div className="page-header">
        <h1>Gestión de Proveedores</h1>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          + Nuevo Proveedor
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map(proveedor => (
              <tr key={proveedor.id_proveedor}>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.contacto || '-'}</td>
                <td>{proveedor.telefono || '-'}</td>
                <td>{proveedor.email || '-'}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(proveedor)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(proveedor.id_proveedor)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
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
                <label>Contacto</label>
                <input
                  type="text"
                  value={formData.contacto}
                  onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
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

export default Proveedores;

