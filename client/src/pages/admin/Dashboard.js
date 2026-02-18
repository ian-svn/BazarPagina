import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    ventas: 0,
    productos: 0,
    pedidos: 0,
    clientes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ventasRes, productosRes, pedidosRes, clientesRes] = await Promise.all([
        api.get('/api/ventas'),
        api.get('/api/productos'),
        api.get('/api/pedidos'),
        api.get('/api/clientes')
      ]);

      const totalVentas = ventasRes.data.reduce((sum, v) => sum + parseFloat(v.total), 0);
      const pedidosPendientes = pedidosRes.data.filter(p => p.estado === 'pendiente' || p.estado === 'en_produccion').length;

      setStats({
        ventas: totalVentas,
        productos: productosRes.data.length,
        pedidos: pedidosPendientes,
        clientes: clientesRes.data.length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Ventas</h3>
          <p className="stat-value">${stats.ventas.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Productos</h3>
          <p className="stat-value">{stats.productos}</p>
        </div>
        <div className="stat-card">
          <h3>Pedidos Pendientes</h3>
          <p className="stat-value">{stats.pedidos}</p>
        </div>
        <div className="stat-card">
          <h3>Clientes</h3>
          <p className="stat-value">{stats.clientes}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

