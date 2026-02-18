import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import './Stock.css';

const Stock = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const handleStockUpdate = async (id, nuevoStock) => {
    try {
      const producto = productos.find(p => p.id_producto === id);
      await api.put(`/api/productos/${id}`, {
        ...producto,
        stock: nuevoStock
      });
      fetchProductos();
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      alert('Error al actualizar stock');
    }
  };

  const filteredProductos = productos.filter(producto => {
    if (filter === 'low') return producto.stock < 10;
    if (filter === 'out') return producto.stock === 0;
    return true;
  });

  if (loading) {
    return <div className="loading">Cargando stock...</div>;
  }

  return (
    <div className="stock-page">
      <div className="page-header">
        <h1>Gestión de Stock</h1>
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button
            className={filter === 'low' ? 'active' : ''}
            onClick={() => setFilter('low')}
          >
            Stock Bajo (&lt;10)
          </button>
          <button
            className={filter === 'out' ? 'active' : ''}
            onClick={() => setFilter('out')}
          >
            Sin Stock
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock Actual</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Actualizar Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.map(producto => (
              <tr key={producto.id_producto}>
                <td>
                  <div className="product-info">
                    <img 
                      src={producto.imagen_url || '/assets/Logo.png'} 
                      alt={producto.nombre} 
                      className="product-thumb"
                      onError={(e) => {
                        e.target.src = '/assets/Logo.png';
                      }}
                    />
                    <div>
                      <strong>{producto.nombre}</strong>
                      <p className="product-desc">{producto.descripcion}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`stock-value ${producto.stock === 0 ? 'out' : producto.stock < 10 ? 'low' : 'ok'}`}>
                    {producto.stock}
                  </span>
                </td>
                <td>${producto.precio.toLocaleString()}</td>
                <td>
                  {producto.stock === 0 ? (
                    <span className="status-badge out">Sin Stock</span>
                  ) : producto.stock < 10 ? (
                    <span className="status-badge low">Stock Bajo</span>
                  ) : (
                    <span className="status-badge ok">Disponible</span>
                  )}
                </td>
                <td>
                  <StockEditor
                    currentStock={producto.stock}
                    onUpdate={(newStock) => handleStockUpdate(producto.id_producto, newStock)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StockEditor = ({ currentStock, onUpdate }) => {
  const [value, setValue] = useState(currentStock);
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    if (value >= 0) {
      onUpdate(value);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <div className="stock-editor">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value) || 0)}
          className="stock-input"
          autoFocus
        />
        <button className="btn-save" onClick={handleSave}>✓</button>
        <button className="btn-cancel-small" onClick={() => { setValue(currentStock); setEditing(false); }}>✕</button>
      </div>
    );
  }

  return (
    <button className="btn-edit-stock" onClick={() => setEditing(true)}>
      Editar
    </button>
  );
};

export default Stock;

