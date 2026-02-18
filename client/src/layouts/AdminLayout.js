import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>MerchDecoBazar</h2>
          <p className="user-info">{user?.nombre} ({user?.rol})</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin/dashboard">📊 Dashboard</Link>
          <Link to="/admin/productos">📦 Productos</Link>
          <Link to="/admin/ventas">💰 Ventas</Link>
          <Link to="/admin/pedidos">📋 Pedidos</Link>
          <Link to="/admin/clientes">👥 Clientes</Link>
          <Link to="/admin/proveedores">🏭 Proveedores</Link>
          <Link to="/admin/stock">📊 Stock</Link>
          {(user?.rol === 'administracion' || user?.rol === 'gerencia') && (
            <Link to="/admin/usuarios">👤 Usuarios</Link>
          )}
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

