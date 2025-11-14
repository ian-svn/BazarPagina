import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import './Ventas.css';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id_cliente: '',
    forma_pago: 'efectivo',
    productos: []
  });

  useEffect(() => {
    fetchVentas();
    fetchClientes();
    fetchProductos();
  }, []);

  const fetchVentas = async () => {
    try {
      const response = await api.get('/api/ventas');
      setVentas(response.data);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await api.get('/api/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await api.get('/api/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await api.get(`/api/ventas/${id}`);
      setSelectedVenta(response.data);
    } catch (error) {
      console.error('Error al cargar detalles:', error);
    }
  };

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      productos: [...formData.productos, { id_producto: '', cantidad: 1 }]
    });
  };

  const handleProductChange = (index, field, value) => {
    const newProductos = [...formData.productos];
    newProductos[index][field] = field === 'cantidad' ? parseInt(value) : value;
    setFormData({ ...formData, productos: newProductos });
  };

  const handleRemoveProduct = (index) => {
    setFormData({
      ...formData,
      productos: formData.productos.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/ventas', formData);
      fetchVentas();
      setShowModal(false);
      setFormData({ id_cliente: '', forma_pago: 'efectivo', productos: [] });
    } catch (error) {
      alert(error.response?.data?.error || 'Error al crear venta');
    }
  };

  if (loading) {
    return <div className="loading">Cargando ventas...</div>;
  }

  return (
    <div className="ventas-page">
      <div className="page-header">
        <h1>Gestión de Ventas</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Nueva Venta
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Forma de Pago</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(venta => (
              <tr key={venta.id_venta}>
                <td>#{venta.id_venta}</td>
                <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                <td>{venta.cliente_nombre || 'Cliente ocasional'}</td>
                <td>{venta.usuario_nombre || '-'}</td>
                <td>{venta.forma_pago.replace('_', ' ')}</td>
                <td>${parseFloat(venta.total).toLocaleString()}</td>
                <td>
                  <button className="btn-view" onClick={() => handleViewDetails(venta.id_venta)}>
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedVenta && (
        <div className="modal-overlay" onClick={() => setSelectedVenta(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Detalles de Venta #{selectedVenta.id_venta}</h2>
            <div className="venta-details">
              <p><strong>Fecha:</strong> {new Date(selectedVenta.fecha).toLocaleDateString()}</p>
              <p><strong>Cliente:</strong> {selectedVenta.cliente_nombre || 'Cliente ocasional'}</p>
              <p><strong>Forma de Pago:</strong> {selectedVenta.forma_pago.replace('_', ' ')}</p>
              <h3>Productos:</h3>
              <table className="details-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedVenta.detalles?.map((detalle, idx) => (
                    <tr key={idx}>
                      <td>{detalle.producto_nombre}</td>
                      <td>{detalle.cantidad}</td>
                      <td>${parseFloat(detalle.precio_unitario).toLocaleString()}</td>
                      <td>${(detalle.cantidad * parseFloat(detalle.precio_unitario)).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="total-section">
                <strong>Total: ${parseFloat(selectedVenta.total).toLocaleString()}</strong>
              </div>
            </div>
            <button className="btn-cancel" onClick={() => setSelectedVenta(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>Nueva Venta</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Cliente</label>
                <select
                  value={formData.id_cliente}
                  onChange={(e) => setFormData({ ...formData, id_cliente: e.target.value })}
                >
                  <option value="">Cliente ocasional</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id_cliente} value={cliente.id_cliente}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Forma de Pago *</label>
                <select
                  required
                  value={formData.forma_pago}
                  onChange={(e) => setFormData({ ...formData, forma_pago: e.target.value })}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="cuenta_corriente">Cuenta Corriente</option>
                </select>
              </div>
              <div className="productos-section">
                <div className="section-header">
                  <h3>Productos</h3>
                  <button type="button" className="btn-add" onClick={handleAddProduct}>
                    + Agregar Producto
                  </button>
                </div>
                {formData.productos.map((producto, index) => {
                  const selectedProduct = productos.find(p => p.id_producto === parseInt(producto.id_producto));
                  return (
                    <div key={index} className="producto-row">
                      <select
                        required
                        value={producto.id_producto}
                        onChange={(e) => handleProductChange(index, 'id_producto', e.target.value)}
                      >
                        <option value="">Seleccionar producto</option>
                        {productos.map(p => (
                          <option key={p.id_producto} value={p.id_producto}>
                            {p.nombre} - Stock: {p.stock} - ${p.precio}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        max={selectedProduct?.stock || 0}
                        required
                        value={producto.cantidad}
                        onChange={(e) => handleProductChange(index, 'cantidad', e.target.value)}
                        placeholder="Cantidad"
                      />
                      <button type="button" className="btn-remove" onClick={() => handleRemoveProduct(index)}>
                        Eliminar
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={formData.productos.length === 0}>
                  Crear Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;

