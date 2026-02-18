import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../config/axios';
import './Carrito.css';

const Carrito = () => {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const [cliente, setCliente] = useState({ nombre: '', telefono: '', email: '', direccion: '' });
  const [formaPago, setFormaPago] = useState('efectivo');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear o buscar cliente
      let clienteId = null;
      if (cliente.nombre) {
        const clienteResponse = await api.post('/api/clientes', cliente);
        clienteId = clienteResponse.data.id;
      }

      // Crear venta
      const ventaData = {
        id_cliente: clienteId,
        forma_pago: formaPago,
        productos: cart.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad
        }))
      };

      await api.post('/api/ventas/public', ventaData);
      
      alert('¡Pedido realizado exitosamente!');
      clearCart();
      navigate('/productos');
    } catch (error) {
      console.error('Error al realizar pedido:', error);
      alert(error.response?.data?.error || 'Error al realizar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="carrito-vacio">
        <h2>Tu carrito está vacío</h2>
        <button onClick={() => navigate('/productos')}>Ver Productos</button>
      </div>
    );
  }

  return (
    <div className="carrito-page">
      <h1>Carrito de Compras</h1>
      <div className="carrito-container">
        <div className="carrito-items">
          {cart.map(item => (
            <div key={item.id_producto} className="carrito-item">
              <img 
                src={item.imagen_url || '/assets/Logo.png'} 
                alt={item.nombre}
                onError={(e) => {
                  e.target.src = '/assets/Logo.png';
                }}
              />
              <div className="item-info">
                <h3>{item.nombre}</h3>
                <p>${item.precio.toLocaleString()} c/u</p>
              </div>
              <div className="item-controls">
                <button onClick={() => updateQuantity(item.id_producto, item.cantidad - 1)}>-</button>
                <span>{item.cantidad}</span>
                <button onClick={() => updateQuantity(item.id_producto, item.cantidad + 1)}>+</button>
              </div>
              <div className="item-total">
                <p>${(item.precio * item.cantidad).toLocaleString()}</p>
                <button onClick={() => removeFromCart(item.id_producto)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-form">
          <h2>Finalizar Compra</h2>
          <form onSubmit={handleCheckout}>
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                required
                value={cliente.nombre}
                onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                value={cliente.telefono}
                onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={cliente.email}
                onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                value={cliente.direccion}
                onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Forma de Pago *</label>
              <select
                required
                value={formaPago}
                onChange={(e) => setFormaPago(e.target.value)}
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="cuenta_corriente">Cuenta Corriente</option>
              </select>
            </div>
            <div className="total-section">
              <h3>Total: ${getTotal().toLocaleString()}</h3>
            </div>
            <button type="submit" className="checkout-btn" disabled={loading}>
              {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Carrito;

