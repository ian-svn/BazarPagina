// Configuración de la API
const API_BASE = 'api';

const pesos = (value) =>
  value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

const state = {
  filter: 'all',
  cart: JSON.parse(localStorage.getItem('cart') || '[]'),
  products: [],
  loading: false,
};

const els = {
  grid: document.getElementById('productGrid'),
  nav: document.querySelector('.nav'),
  cartButton: document.getElementById('cartButton'),
  cartPanel: document.getElementById('cartPanel'),
  closeCart: document.getElementById('closeCart'),
  cartItems: document.getElementById('cartItems'),
  cartTotal: document.getElementById('cartTotal'),
  cartCount: document.getElementById('cartCount'),
  checkout: document.getElementById('checkout'),
};

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(state.cart));
}

function updateCartBadge() {
  const count = state.cart.reduce((acc, item) => acc + item.qty, 0);
  els.cartCount.textContent = count.toString();
}

async function loadProducts() {
  state.loading = true;
  try {
    const categoria = state.filter === 'all' ? '' : `?categoria=${state.filter}`;
    const response = await fetch(`${API_BASE}/productos.php${categoria}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Error del servidor:', data.error);
      els.grid.innerHTML = `<p class="error-message">Error: ${data.error}<br><small>Verifica que la base de datos esté configurada correctamente.</small></p>`;
      return;
    }
    
    if (data.productos !== undefined) {
      state.products = data.productos || [];
      renderProducts();
    } else {
      console.error('Respuesta inesperada:', data);
      els.grid.innerHTML = '<p class="error-message">Error al cargar los productos. Por favor, recarga la página.</p>';
    }
  } catch (error) {
    console.error('Error:', error);
    els.grid.innerHTML = `<p class="error-message">
      <strong>Error de conexión:</strong> ${error.message}<br><br>
      <strong>Soluciones rápidas:</strong><br>
      <small>
      1. Abre: <a href="diagnostico-completo.php" style="color: #F493BD;">diagnostico-completo.php</a> para ver qué está fallando<br>
      2. Verifica que Apache y MySQL estén corriendo en XAMPP<br>
      3. Si no hay productos, abre: <a href="insertar-productos.php" style="color: #F493BD;">insertar-productos.php</a><br>
      4. Abre la consola del navegador (F12) para ver más detalles
      </small>
    </p>`;
  } finally {
    state.loading = false;
  }
}

function renderProducts() {
  if (state.loading) {
    els.grid.innerHTML = '<p class="loading-message">Cargando productos...</p>';
    return;
  }
  
  if (state.products.length === 0) {
    els.grid.innerHTML = '<p class="empty-message">No hay productos disponibles en esta categoría.</p>';
    return;
  }
  
  els.grid.innerHTML = state.products.map(p => `
    <article class="product-card">
      <div class="product-media">
        <img src="${p.imagen_url}" alt="${p.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect fill=\'%23f0f0f0\' width=\'200\' height=\'200\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\'%3EImagen no disponible%3C/text%3E%3C/svg%3E';" />
      </div>
      <div class="product-body">
        <h3 class="product-title">${p.name}</h3>
        <div class="product-meta">${p.category}</div>
        <div class="product-price">${pesos(p.price)}</div>
        ${p.stock > 0 ? `
          <div class="product-stock">Stock: ${p.stock}</div>
          <div class="product-actions">
            <button class="button primary" data-add="${p.id}">Agregar</button>
            <button class="button secondary" data-buy="${p.id}">Comprar</button>
          </div>
        ` : `
          <div class="product-stock out-of-stock">Sin stock</div>
          <div class="product-actions">
            <button class="button primary" disabled>Agotado</button>
          </div>
        `}
      </div>
    </article>
  `).join('');
}

function renderCart() {
  if (state.cart.length === 0) {
    els.cartItems.innerHTML = '<li class="cart-empty">Tu carrito está vacío</li>';
    els.cartTotal.textContent = pesos(0);
    updateCartBadge();
    return;
  }
  
  els.cartItems.innerHTML = state.cart.map(item => `
    <li class="cart-item">
      <div class="cart-thumb">
        <img src="${item.imagen_url || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'56\' height=\'56\'%3E%3Crect fill=\'%23f0f0f0\' width=\'56\' height=\'56\'/%3E%3C/svg%3E'}" alt="${item.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'56\' height=\'56\'%3E%3Crect fill=\'%23f0f0f0\' width=\'56\' height=\'56\'/%3E%3C/svg%3E';" />
      </div>
      <div>
        <div><strong>${item.name}</strong></div>
        <div class="qty">
          <button data-dec="${item.id}">-</button>
          <span>${item.qty}</span>
          <button data-inc="${item.id}">+</button>
          <button data-del="${item.id}" title="Quitar">🗑️</button>
        </div>
      </div>
      <div><strong>${pesos(item.price * item.qty)}</strong></div>
    </li>
  `).join('');

  const total = state.cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  els.cartTotal.textContent = pesos(total);
  updateCartBadge();
}

function addToCart(productId, qty = 1) {
  const product = state.products.find(p => p.id === productId);
  if (!product) {
    console.error('Producto no encontrado:', productId);
    return;
  }
  
  if (product.stock <= 0) {
    alert('Este producto no tiene stock disponible');
    return;
  }
  
  const existing = state.cart.find(i => i.id === productId);
  if (existing) {
    const newQty = existing.qty + qty;
    if (newQty > product.stock) {
      alert(`Solo hay ${product.stock} unidades disponibles`);
      return;
    }
    existing.qty = newQty;
  } else {
    if (qty > product.stock) {
      alert(`Solo hay ${product.stock} unidades disponibles`);
      return;
    }
    state.cart.push({ ...product, qty });
  }
  saveCart();
  renderCart();
}

function setFilter(category) {
  state.filter = category;
  document.querySelectorAll('.nav-link').forEach(b => b.classList.toggle('active', b.dataset.filter === category));
  loadProducts();
}

// Events
document.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const filter = target.dataset.filter;
  if (filter) {
    setFilter(filter);
    return;
  }

  const add = target.dataset.add;
  if (add) {
    addToCart(add, 1);
    return;
  }

  const buy = target.dataset.buy;
  if (buy) {
    addToCart(buy, 1);
    els.cartPanel.classList.add('open');
    els.cartPanel.setAttribute('aria-hidden', 'false');
    return;
  }

  const inc = target.dataset.inc;
  if (inc) {
    const item = state.cart.find(i => i.id === inc);
    if (item) item.qty += 1;
    saveCart();
    renderCart();
    return;
  }

  const dec = target.dataset.dec;
  if (dec) {
    const item = state.cart.find(i => i.id === dec);
    if (item) item.qty = Math.max(1, item.qty - 1);
    saveCart();
    renderCart();
    return;
  }

  const del = target.dataset.del;
  if (del) {
    state.cart = state.cart.filter(i => i.id !== del);
    saveCart();
    renderCart();
  }
});

els.cartButton.addEventListener('click', () => {
  const open = els.cartPanel.classList.toggle('open');
  els.cartPanel.setAttribute('aria-hidden', open ? 'false' : 'true');
});

els.closeCart.addEventListener('click', () => {
  els.cartPanel.classList.remove('open');
  els.cartPanel.setAttribute('aria-hidden', 'true');
});

els.checkout.addEventListener('click', async () => {
  if (!state.cart.length) { 
    alert('Tu carrito está vacío'); 
    return; 
  }
  
  // Solicitar datos del cliente
  const nombreCliente = prompt('Ingrese su nombre:');
  if (!nombreCliente) {
    alert('El nombre es requerido para finalizar la compra');
    return;
  }
  
  const telefono = prompt('Ingrese su teléfono (opcional):') || null;
  const email = prompt('Ingrese su email (opcional):') || null;
  const formaPago = prompt('Forma de pago (efectivo, tarjeta, transferencia):') || 'efectivo';
  
  try {
    // Crear o buscar cliente
    let idCliente;
    const clienteResponse = await fetch(`${API_BASE}/clientes.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombreCliente, telefono, email })
    });
    const clienteData = await clienteResponse.json();
    idCliente = clienteData.id || clienteData.cliente?.id_cliente;
    
    if (!idCliente) {
      // Si no se creó, buscar cliente existente
      const buscarResponse = await fetch(`${API_BASE}/clientes.php`);
      const buscarData = await buscarResponse.json();
      const clienteExistente = buscarData.clientes?.find(c => c.nombre.toLowerCase() === nombreCliente.toLowerCase());
      if (clienteExistente) {
        idCliente = clienteExistente.id_cliente;
      } else {
        throw new Error('No se pudo crear o encontrar el cliente');
      }
    }
    
    // Preparar datos de la venta
    const productosVenta = state.cart.map(item => ({
      id_producto: item.id_producto,
      cantidad: item.qty
    }));
    
    // Crear venta (usuario 1 por defecto - en producción deberías usar el usuario logueado)
    const ventaResponse = await fetch(`${API_BASE}/ventas.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_cliente: idCliente,
        id_usuario: 1, // Usuario por defecto
        forma_pago: formaPago,
        productos: productosVenta
      })
    });
    
    const ventaData = await ventaResponse.json();
    
    if (ventaData.error) {
      alert('Error al procesar la venta: ' + ventaData.error);
      return;
    }
    
    alert(`¡Gracias por tu compra! Total: ${pesos(ventaData.total)}\nID de venta: ${ventaData.id_venta}`);
    state.cart = [];
    saveCart();
    renderCart();
    loadProducts(); // Recargar productos para actualizar stock
  } catch (error) {
    console.error('Error:', error);
    alert('Error al procesar la compra. Por favor, intenta nuevamente.');
  }
});

// Init
document.getElementById('year').textContent = new Date().getFullYear().toString();
loadProducts();
renderCart();



