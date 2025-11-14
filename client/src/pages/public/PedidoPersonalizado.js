import React, { useState } from 'react';
import api from '../../config/axios';
import './PedidoPersonalizado.css';

const PedidoPersonalizado = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear cliente si se proporciona información
      let clienteId = null;
      if (formData.nombre) {
        const clienteResponse = await api.post('/api/clientes', {
          nombre: formData.nombre,
          telefono: formData.telefono || null,
          email: formData.email || null
        });
        clienteId = clienteResponse.data.id;
      }

      // Crear pedido personalizado
      await api.post('/api/pedidos', {
        id_cliente: clienteId,
        descripcion: formData.descripcion
      });

      setSuccess(true);
      setFormData({ nombre: '', telefono: '', email: '', descripcion: '' });
    } catch (error) {
      console.error('Error al crear pedido:', error);
      alert('Error al enviar el pedido. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pedido-success">
        <h2>¡Pedido Enviado Exitosamente!</h2>
        <p>Nos pondremos en contacto contigo pronto.</p>
        <button onClick={() => setSuccess(false)}>Hacer Otro Pedido</button>
      </div>
    );
  }

  return (
    <div className="pedido-personalizado-page">
      <h1>Pedido Personalizado</h1>
      <p className="subtitle">¿Necesitas algo especial? Cuéntanos qué estás buscando y lo haremos realidad.</p>
      
      <form className="pedido-form" onSubmit={handleSubmit}>
        <div className="form-row">
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
            <label>Teléfono</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Descripción del Pedido *</label>
          <textarea
            required
            rows="8"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Describe en detalle lo que necesitas: tipo de producto, cantidad, colores, personalizaciones, etc."
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Pedido'}
        </button>
      </form>
    </div>
  );
};

export default PedidoPersonalizado;

