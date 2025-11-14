import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import './PedidosAdmin.css';

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState(null);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await api.get('/api/pedidos');
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await api.put(`/api/pedidos/${id}/estado`, { estado: nuevoEstado });
      fetchPedidos();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar estado');
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await api.get(`/api/pedidos/${id}`);
      setSelectedPedido(response.data);
    } catch (error) {
      console.error('Error al cargar detalles:', error);
    }
  };

  const getEstadoBadgeClass = (estado) => {
    const classes = {
      pendiente: 'badge-warning',
      en_produccion: 'badge-info',
      finalizado: 'badge-success',
      entregado: 'badge-complete'
    };
    return classes[estado] || 'badge-default';
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      pendiente: 'Pendiente',
      en_produccion: 'En Producción',
      finalizado: 'Finalizado',
      entregado: 'Entregado'
    };
    return labels[estado] || estado;
  };

  if (loading) {
    return <div className="loading">Cargando pedidos...</div>;
  }

  return (
    <div className="pedidos-admin">
      <h1>Gestión de Pedidos Personalizados</h1>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(pedido => (
              <tr key={pedido.id_pedido}>
                <td>#{pedido.id_pedido}</td>
                <td>{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
                <td>{pedido.cliente_nombre || 'Cliente ocasional'}</td>
                <td>
                  <span className={`estado-badge ${getEstadoBadgeClass(pedido.estado)}`}>
                    {getEstadoLabel(pedido.estado)}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-view" onClick={() => handleViewDetails(pedido.id_pedido)}>
                      Ver
                    </button>
                    <select
                      value={pedido.estado}
                      onChange={(e) => handleEstadoChange(pedido.id_pedido, e.target.value)}
                      className="estado-select"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_produccion">En Producción</option>
                      <option value="finalizado">Finalizado</option>
                      <option value="entregado">Entregado</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPedido && (
        <div className="modal-overlay" onClick={() => setSelectedPedido(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Pedido #{selectedPedido.id_pedido}</h2>
            <div className="pedido-details">
              <p><strong>Fecha:</strong> {new Date(selectedPedido.fecha_pedido).toLocaleDateString()}</p>
              <p><strong>Cliente:</strong> {selectedPedido.cliente_nombre || 'Cliente ocasional'}</p>
              {selectedPedido.telefono && <p><strong>Teléfono:</strong> {selectedPedido.telefono}</p>}
              {selectedPedido.email && <p><strong>Email:</strong> {selectedPedido.email}</p>}
              {selectedPedido.direccion && <p><strong>Dirección:</strong> {selectedPedido.direccion}</p>}
              <p><strong>Estado:</strong> <span className={`estado-badge ${getEstadoBadgeClass(selectedPedido.estado)}`}>
                {getEstadoLabel(selectedPedido.estado)}
              </span></p>
              <div className="descripcion-section">
                <h3>Descripción del Pedido:</h3>
                <p className="descripcion-text">{selectedPedido.descripcion}</p>
              </div>
            </div>
            <button className="btn-cancel" onClick={() => setSelectedPedido(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosAdmin;

