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

// --- Helpers ---
function fmt(n) { return '$' + n.toLocaleString('es-CL'); }

function getProd(id) {
  for (const cat of CATEGORIAS) {
    const p = cat.productos.find(x => x.id === id);
    if (p) return p;
  }
}

// --- Tabs ---
function renderTabs() {
  const container = document.getElementById('tabs-container');
  const allTabs = [...CATEGORIAS.map(c => ({ id: c.id, label: c.label })),
                   { id: 'historial', label: '📋 Historial' }];
  container.innerHTML = allTabs.map(t =>
    `<button class="tab ${t.id === tabActivo ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`
  ).join('');
  container.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => setTab(btn.dataset.tab));
  });
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
          <button class="btn-product" id="btn-${p.id}" data-id="${p.id}">
            <span class="emoji">${p.emoji}</span>
            <span class="prod-name">${p.nombre}</span>
            <span class="prod-price">${fmt(p.precio)}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `).join('') + `<div id="tab-historial" class="tab-content" hidden></div>`;

  container.querySelectorAll('.btn-product').forEach(btn => {
    btn.addEventListener('click', () => agregar(btn.dataset.id));
  });
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
  const btnCobrar = document.getElementById('btn-cobrar');

  if (ids.length === 0) {
    body.innerHTML = '<div class="cart-empty">Toca un producto para agregar ☝️</div>';
    countEl.textContent = '';
    document.getElementById('total-display').textContent = '$0';
    if (btnCobrar) btnCobrar.disabled = true;
    return;
  }

  let total = 0, itemCount = 0, html = '';
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
          <button class="qty-btn" data-id="${id}" data-delta="-1">−</button>
          <span class="qty-num">${qty}</span>
          <button class="qty-btn" data-id="${id}" data-delta="1">+</button>
        </div>
        <span class="cart-item-total">${fmt(sub)}</span>
      </div>`;
  });
  body.innerHTML = html;
  body.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => cambiarQty(btn.dataset.id, parseInt(btn.dataset.delta)));
  });
  countEl.textContent = itemCount + ' ítem' + (itemCount !== 1 ? 's' : '');
  document.getElementById('total-display').textContent = fmt(total);
  if (btnCobrar) btnCobrar.disabled = false;
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

function cerrarModal() {
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
  cerrarModal();
  setTab('historial');
  setTimeout(() => setTab(CATEGORIAS[0].id), 1800);
}

// --- Impresión térmica ---
function imprimirTicket() {
  const ids = Object.keys(carrito);
  if (ids.length === 0) return;
  const total = totalCarrito();
  const now = new Date();
  const fecha = now.toLocaleDateString('es-CL', { weekday:'short', day:'2-digit', month:'2-digit', year:'numeric' });
  const hora  = now.toLocaleTimeString('es-CL', { hour:'2-digit', minute:'2-digit' });

  document.getElementById('tk-logo').textContent = EVENTO.nombre;
  document.getElementById('tk-num').textContent  = 'Venta #' + ventaNum;
  document.getElementById('tk-fecha').textContent = fecha + ' · ' + hora;
  document.getElementById('tk-total').textContent = fmt(total);

  let rows = '';
  ids.forEach(id => {
    const p = getProd(id); const qty = carrito[id];
    rows += `<tr>
      <td>${p.emoji} ${p.nombre}${qty > 1 ? ' ×' + qty : ''}</td>
      <td class="td-price">${fmt(p.precio * qty)}</td>
    </tr>`;
  });
  document.getElementById('tk-items').innerHTML = rows;
  window.print();
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
      <button class="btn-clear-hist" id="btn-borrar-hist">Borrar todo</button>
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
  document.getElementById('btn-borrar-hist').addEventListener('click', borrarHistorial);
}

function borrarHistorial() {
  historial = [];
  ventaNum = 1;
  try { localStorage.removeItem('caja_hist'); } catch(e) {}
  renderHistorial();
}

// --- Init ---
function init() {
  document.getElementById('event-name').textContent = EVENTO.nombre;
  renderTabs();
  renderGrids();
  renderCarrito();

  document.getElementById('btn-cobrar').addEventListener('click', abrirModal);
  document.getElementById('btn-limpiar').addEventListener('click', limpiarCarrito);
  document.getElementById('btn-confirmar').addEventListener('click', confirmarCobro);
  document.getElementById('btn-imprimir').addEventListener('click', imprimirTicket);
  document.getElementById('btn-volver').addEventListener('click', cerrarModal);
  document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) cerrarModal();
  });
}

init();
