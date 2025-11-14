import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a MerchDecoBazar</h1>
          <p>Productos ecológicos y personalizados para tu hogar</p>
          <Link to="/productos" className="cta-button">
            Ver Catálogo
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🌱 Ecológicos</h3>
          <p>Productos sostenibles y amigables con el medio ambiente</p>
        </div>
        <div className="feature-card">
          <h3>🎨 Personalizados</h3>
          <p>Hacemos pedidos personalizados según tus necesidades</p>
        </div>
        <div className="feature-card">
          <h3>🚚 Entrega Rápida</h3>
          <p>Envíos rápidos y seguros a todo el país</p>
        </div>
      </section>
    </div>
  );
};

export default Home;

