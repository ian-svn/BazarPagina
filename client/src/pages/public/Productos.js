import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import { useCart } from '../../context/CartContext';
import './Productos.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProductos();
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

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="productos-page">
      <h1>Nuestros Productos</h1>
      <div className="productos-grid">
        {productos.map(producto => (
          <div key={producto.id_producto} className="producto-card">
            <div className="producto-image">
              <img 
                src={producto.imagen_url || '/assets/Logo.png'} 
                alt={producto.nombre}
                onError={(e) => {
                  e.target.src = '/assets/Logo.png';
                }}
              />
            </div>
            <div className="producto-info">
              <h3>{producto.nombre}</h3>
              <p className="producto-descripcion">{producto.descripcion}</p>
              <div className="producto-footer">
                <span className="producto-precio">${producto.precio.toLocaleString()}</span>
                <span className={`producto-stock ${producto.stock > 0 ? 'disponible' : 'agotado'}`}>
                  {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                </span>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={() => addToCart(producto)}
                disabled={producto.stock === 0}
              >
                {producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;

