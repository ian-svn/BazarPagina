import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/public/Home';
import Productos from './pages/public/Productos';
import Carrito from './pages/public/Carrito';
import PedidoPersonalizado from './pages/public/PedidoPersonalizado';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProductosAdmin from './pages/admin/ProductosAdmin';
import Ventas from './pages/admin/Ventas';
import PedidosAdmin from './pages/admin/PedidosAdmin';
import Clientes from './pages/admin/Clientes';
import Proveedores from './pages/admin/Proveedores';
import Usuarios from './pages/admin/Usuarios';
import Stock from './pages/admin/Stock';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="productos" element={<Productos />} />
              <Route path="carrito" element={<Carrito />} />
              <Route path="pedido-personalizado" element={<PedidoPersonalizado />} />
              <Route path="admin/login" element={<Login />} />
            </Route>
            <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="productos" element={<ProductosAdmin />} />
              <Route path="ventas" element={<Ventas />} />
              <Route path="pedidos" element={<PedidosAdmin />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="proveedores" element={<Proveedores />} />
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="stock" element={<Stock />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

