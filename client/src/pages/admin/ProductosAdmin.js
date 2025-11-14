import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import './ProductosAdmin.css';

const ProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    stock: 0,
    precio: 0,
    imagen_url: '',
    id_proveedor: ''
  });

  useEffect(() => {
    fetchProductos();
    fetchProveedores();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await api.get('/api/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await api.get('/api/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProducto) {
        await api.put(`/api/productos/${editingProducto.id_producto}`, formData);
      } else {
        await api.post('/api/productos', formData);
      }
      fetchProductos();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar producto');
    }
  };

  const handleEdit = (producto) => {
    setEditingProducto(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      stock: producto.stock,
      precio: producto.precio,
      imagen_url: producto.imagen_url,
      id_proveedor: producto.id_proveedor || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await api.delete(`/api/productos/${id}`);
      fetchProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar producto');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      stock: 0,
      precio: 0,
      imagen_url: '',
      id_proveedor: ''
    });
    setEditingProducto(null);
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="productos-admin">
      <div className="page-header">
        <h1>Gestión de Productos</h1>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          + Nuevo Producto
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id_producto}>
                <td>
                  <img src={producto.imagen_url} alt={producto.nombre} className="product-thumb" />
                </td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>
                  <span className={`stock-badge ${producto.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {producto.stock}
                  </span>
                </td>
                <td>${producto.precio.toLocaleString()}</td>
                <td>{producto.proveedor_nombre || '-'}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(producto)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(producto.id_producto)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProducto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
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
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Precio *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>URL de Imagen *</label>
                <input
                  type="text"
                  required
                  value={formData.imagen_url}
                  onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                  placeholder="/assets/nombre-imagen.png"
                />
              </div>
              <div className="form-group">
                <label>Proveedor</label>
                <select
                  value={formData.id_proveedor}
                  onChange={(e) => setFormData({ ...formData, id_proveedor: e.target.value })}
                >
                  <option value="">Sin proveedor</option>
                  {proveedores.map(prov => (
                    <option key={prov.id_proveedor} value={prov.id_proveedor}>
                      {prov.nombre}
                    </option>
                  ))}
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

export default ProductosAdmin;

