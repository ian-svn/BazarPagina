const PRODUCTS = [
  { id: 'vaso-eco', name: 'Vaso reutilizable', category: 'vasos', price: 2200 },
  { id: 'plato-bambu', name: 'Plato de bambú', category: 'platos', price: 3500 },
  { id: 'contenedor-vidrio', name: 'Contenedor de vidrio', category: 'contenedores', price: 7800 },
  { id: 'compostera-hogar', name: 'Compostera para hogar', category: 'composteras', price: 19990 },
  { id: 'jarra-termica', name: 'Jarra térmica', category: 'jarras', price: 12500 },
  { id: 'cubiertos-acero', name: 'Set de cubiertos', category: 'cubiertos', price: 5200 },
  { id: 'vaso-termico', name: 'Vaso térmico', category: 'vasos', price: 6900 },
  { id: 'plato-postre', name: 'Plato postre', category: 'platos', price: 2800 },
];

const pesos = (value) =>
  value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

const state = {
  filter: 'all',
  cart: JSON.parse(localStorage.getItem('cart') || '[]'),
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

function renderProducts() {
  const items = PRODUCTS.filter(p => state.filter === 'all' || p.category === state.filter);
  els.grid.innerHTML = items.map(p => `
    <article class="product-card">
      <div class="product-media">🛒</div>
      <div class="product-body">
        <h3 class="product-title">${p.name}</h3>
        <div class="product-meta">${p.category}</div>
        <div class="product-price">${pesos(p.price)}</div>
        <div class="product-actions">
          <button class="button primary" data-add="${p.id}">Agregar</button>
          <button class="button secondary" data-buy="${p.id}">Comprar</button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderCart() {
  els.cartItems.innerHTML = state.cart.map(item => `
    <li class="cart-item">
      <div class="cart-thumb">🍃</div>
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
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = state.cart.find(i => i.id === productId);
  if (existing) existing.qty += qty; else state.cart.push({ ...product, qty });
  saveCart();
  renderCart();
}

function setFilter(category) {
  state.filter = category;
  document.querySelectorAll('.nav-link').forEach(b => b.classList.toggle('active', b.dataset.filter === category));
  renderProducts();
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

els.checkout.addEventListener('click', () => {
  if (!state.cart.length) { alert('Tu carrito está vacío'); return; }
  alert('Gracias por tu compra! (demo)');
  state.cart = [];
  saveCart();
  renderCart();
});

// Init
document.getElementById('year').textContent = new Date().getFullYear().toString();
renderProducts();
renderCart();


