// ============================================================
//  APP.JS — Lógica principal (no editar)
// ============================================================

let carrito = {};
let historial = [];
let ventaNum = 1;
let tabActivo = CATEGORIAS[0].id;

try {
  const stored = JSON.parse(localStorage.getItem('caja_hist') || '[]');
  historial = stored;
  ventaNum = stored.length + 1;
} catch(e) {}

// --- Init ---
function init() {
  document.getElementById('event-name').textContent = EVENTO.nombre;
  renderTabs();
  renderGrids();
  renderCarrito();
}

// --- Tabs ---
function renderTabs() {
  const container = document.getElementById('tabs-container');
  const allTabs = [...CATEGORIAS.map(c => ({ id: c.id, label: c.label })),
                   { id: 'historial', label: '📋 Historial' }];
  container.innerHTML = allTabs.map(t =>
    `<button class="tab ${t.id === tabActivo ? 'active' : ''}" onclick="setTab('${t.id}')">${t.label}</button>`
  ).join('');
}

function setTab(id) {
  tabActivo = id;
  renderTabs();
  document.querySelectorAll('.tab-content').forEach(el => el.hidden = true);
  const el = document.getElementById('tab-' + id);
  if (el) el.hidden = false;
  if (id === 'historial') renderHistorial();
}

// --- Grids ---
function renderGrids() {
  const container = document.getElementById('grids-container');
  container.innerHTML = CATEGORIAS.map((cat, i) => `
    <div id="tab-${cat.id}" class="tab-content" ${i !== 0 ? 'hidden' : ''}>
      <div class="grid" id="grid-${cat.id}">
        ${cat.productos.map(p => `
          <button class="btn-product" id="btn-${p.id}" onclick="agregar('${p.id}')">
            <span class="emoji">${p.emoji}</span>
            <span class="prod-name">${p.nombre}</span>
            <span class="prod-price">${fmt(p.precio)}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `).join('') + `<div id="tab-historial" class="tab-content" hidden></div>`;
}

// --- Helpers ---
function fmt(n) { return '$' + n.toLocaleString('es-CL'); }

function getProd(id) {
  for (const cat of CATEGORIAS) {
    const p = cat.productos.find(x => x.id === id);
    if (p) return p;
  }
}

// --- Carrito ---
function agregar(id) {
  carrito[id] = (carrito[id] || 0) + 1;
  renderCarrito();
  renderBadges();
}

function cambiarQty(id, delta) {
  const n = (carrito[id] || 0) + delta;
  if (n <= 0) delete carrito[id];
  else carrito[id] = n;
  renderCarrito();
  renderBadges();
}

function renderBadges() {
  document.querySelectorAll('.btn-product').forEach(b => {
    b.classList.remove('in-cart');
    const badge = b.querySelector('.badge');
    if (badge) badge.remove();
  });
  Object.entries(carrito).forEach(([id, qty]) => {
    const btn = document.getElementById('btn-' + id);
    if (!btn) return;
    btn.classList.add('in-cart');
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = qty;
    btn.appendChild(badge);
  });
}

function renderCarrito() {
  const ids = Object.keys(carrito);
  const body = document.getElementById('cart-body');
  const countEl = document.getElementById('cart-count');

  if (ids.length === 0) {
    body.innerHTML = '<div class="cart-empty">Toca un producto para agregar ☝️</div>';
    countEl.textContent = '';
    document.getElementById('total-display').textContent = '$0';
    return;
  }

  let total = 0;
  let itemCount = 0;
  let html = '';
  ids.forEach(id => {
    const p = getProd(id);
    const qty = carrito[id];
    const sub = p.precio * qty;
    total += sub;
    itemCount += qty;
    html += `
      <div class="cart-item">
        <span style="font-size:1.2rem">${p.emoji}</span>
        <span class="cart-item-name">${p.nombre}</span>
        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="cambiarQty('${id}',-1)">−</button>
          <span class="qty-num">${qty}</span>
          <button class="qty-btn" onclick="cambiarQty('${id}',1)">+</button>
        </div>
        <span class="cart-item-total">${fmt(sub)}</span>
      </div>`;
  });
  body.innerHTML = html;
  countEl.textContent = itemCount + ' ítem' + (itemCount !== 1 ? 's' : '');
  document.getElementById('total-display').textContent = fmt(total);
}

function totalCarrito() {
  return Object.entries(carrito).reduce((acc, [id, qty]) => acc + getProd(id).precio * qty, 0);
}

function limpiarCarrito() {
  carrito = {};
  renderCarrito();
  renderBadges();
}

// --- Modal ---
function abrirModal() {
  const ids = Object.keys(carrito);
  if (ids.length === 0) return;
  const total = totalCarrito();
  document.getElementById('modal-total').textContent = fmt(total);
  document.getElementById('modal-items').innerHTML = ids.map(id => {
    const p = getProd(id); const qty = carrito[id];
    return `<div class="modal-row"><span>${p.emoji} ${p.nombre} ×${qty}</span><span>${fmt(p.precio * qty)}</span></div>`;
  }).join('');
  document.getElementById('modal').hidden = false;
}

function cerrarModal(e) {
  if (!e || e.target === document.getElementById('modal'))
    document.getElementById('modal').hidden = true;
}

function confirmarCobro() {
  const ids = Object.keys(carrito);
  if (ids.length === 0) return;
  const total = totalCarrito();
  const desc = ids.map(id => {
    const p = getProd(id); const qty = carrito[id];
    return `${p.emoji}${p.nombre}${qty > 1 ? ' ×'+qty : ''}`;
  }).join(', ');
  historial.unshift({ num: ventaNum++, desc, total });
  try { localStorage.setItem('caja_hist', JSON.stringify(historial)); } catch(e) {}
  limpiarCarrito();
  document.getElementById('modal').hidden = true;
  setTab('historial');
  setTimeout(() => setTab(CATEGORIAS[0].id), 1800);
}

// --- Historial ---
function renderHistorial() {
  const sec = document.getElementById('tab-historial');
  if (historial.length === 0) {
    sec.innerHTML = '<div class="cart-empty" style="padding:24px;text-align:center;color:var(--fg2)">Sin ventas aún 🎵</div>';
    return;
  }
  const totalAcum = historial.reduce((a, v) => a + v.total, 0);
  sec.innerHTML = `
    <div class="historial-title">
      <span>Ventas de hoy (${historial.length})</span>
      <button class="btn-clear-hist" onclick="borrarHistorial()">Borrar todo</button>
    </div>
    <div class="total-acumulado">
      <span class="ta-label">💰 Total recaudado</span>
      <span class="ta-monto">${fmt(totalAcum)}</span>
    </div>
    ${historial.map(v => `
      <div class="historial-item">
        <span class="historial-num">#${v.num}</span>
        <span class="historial-desc">${v.desc}</span>
        <span class="historial-monto">${fmt(v.total)}</span>
      </div>`).join('')}
  `;
}

function borrarHistorial() {
  historial = [];
  ventaNum = 1;
  try { localStorage.removeItem('caja_hist'); } catch(e) {}
  renderHistorial();
}

init();
