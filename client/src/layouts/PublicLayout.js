import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './PublicLayout.css';

const PublicLayout = () => {
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="header-container">
          <Link to="/" className="logo">
            <img src="/assets/Logo.png" alt="MerchDecoBazar" />
          </Link>
          <nav className="nav-menu">
            <Link to="/">Inicio</Link>
            <Link to="/productos">Productos</Link>
            <Link to="/pedido-personalizado">Pedido Personalizado</Link>
            <button className="cart-button" onClick={() => navigate('/carrito')}>
              🛒 Carrito ({getItemCount()})
            </button>
            <Link to="/admin/login" className="admin-link">Admin</Link>
          </nav>
        </div>
      </header>
      <main className="public-main">
        <Outlet />
      </main>
      <footer className="public-footer">
        <p>&copy; 2024 MerchDecoBazar. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;

