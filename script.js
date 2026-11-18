document.documentElement.classList.add('js');

// Menú móvil
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}

burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// Aparición de bloques al hacer scroll
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('is-in'));
}

document.getElementById('anio').textContent = new Date().getFullYear();

/* ==========================================================================
   Tienda — el catálogo vive en productos.js
   ========================================================================== */
const TIENDA = window.TIENDA;
const $ = (sel) => document.querySelector(sel);

const dinero = new Intl.NumberFormat('es-MX', { style: 'currency', currency: TIENDA.moneda, maximumFractionDigits: 0 });
const precioTexto = (p) => (p.precio == null ? 'Precio por WhatsApp' : dinero.format(p.precio));
const buscar = (id) => TIENDA.productos.find((p) => p.id === id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Catálogo y filtros
const grid = $('#productos');
const filtros = $('#filtros');
let filtro = 'todo';

function tarjeta(p) {
  const c = p.colores[0];
  const tag = p.agotado
    ? '<span class="tag tag--off">Agotado</span>'
    : p.etiqueta ? `<span class="tag">${esc(p.etiqueta)}</span>` : '';
  const colores = p.colores.length > 1
    ? `<div class="swatches" role="group" aria-label="Colores">${p.colores.map((col, i) =>
        `<button class="swatch" type="button" data-color="${i}" style="--c:${esc(col.hex)}" aria-label="${esc(col.nombre)}" aria-pressed="${i === 0}"></button>`).join('')}</div>`
    : `<p class="card__one">${esc(c.nombre)}</p>`;

  return `<article class="card" data-id="${esc(p.id)}" data-color="0">
    <button class="card__media" type="button" data-ver aria-label="Ver ${esc(p.nombre)}">
      <img src="${esc(c.img)}" alt="${esc(p.nombre)}, color ${esc(c.nombre)}" loading="lazy">
      ${tag}
      <span class="card__add" aria-hidden="true">${p.agotado ? 'Ver producto' : 'Elegir talla'}</span>
    </button>
    <div class="card__info">
      <h3>${esc(p.nombre)}</h3>
      <p class="price">${precioTexto(p)}</p>
    </div>
    ${colores}
  </article>`;
}

// Recuadros de «Compra por categoría»
$('#categorias').innerHTML = TIENDA.categorias.map((c) => {
  const n = TIENDA.productos.filter((p) => p.categoria === c.id).length;
  return `<a class="tile" href="#tienda" data-filtro="${esc(c.id)}">
    <img src="${esc(c.img)}" alt="" loading="lazy">
    <span class="tile__label"><strong>${esc(c.nombre)}</strong><span>${n} ${n === 1 ? 'modelo' : 'modelos'}</span></span>
  </a>`;
}).join('');
$('#categorias').addEventListener('click', (e) => {
  const tile = e.target.closest('[data-filtro]');
  if (tile) filtrar(tile.dataset.filtro);
});

function pintarFiltros() {
  const todos = [{ id: 'todo', nombre: 'Todo' }, ...TIENDA.categorias];
  filtros.innerHTML = todos.map((c) =>
    `<button class="chip" type="button" data-filtro="${esc(c.id)}" aria-pressed="${c.id === filtro}">${esc(c.nombre)}</button>`).join('');
}

const enlaceWa = (texto) => `https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent(texto)}`;

// Cierra la cuadrícula: ocupa los huecos que deja la última fila
const AYUDA = `<aside class="help">
    <h3>¿No ves tu talla o color?</h3>
    <p>Escríbenos y te decimos qué hay en tienda.</p>
    <a class="btn btn--sm" href="${enlaceWa(`Hola ${TIENDA.nombre}, busco una prenda que no veo en la tienda en línea`)}" target="_blank" rel="noopener">Preguntar por WhatsApp</a>
  </aside>`;

function ajustarAyuda() {
  const ayuda = grid.querySelector('.help');
  if (!ayuda) return;
  const columnas = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  const sobran = grid.querySelectorAll('.card').length % columnas;
  // En pantallas angostas una sola columna queda apretada: ahí va a todo lo ancho
  const ancho = sobran === 0 || columnas < 3 ? columnas : columnas - sobran;
  ayuda.style.gridColumn = `span ${ancho}`;
  ayuda.classList.toggle('help--wide', ancho > 1);
}

function pintarProductos() {
  const lista = TIENDA.productos.filter((p) => filtro === 'todo' || p.categoria === filtro);
  grid.innerHTML = lista.map(tarjeta).join('') + AYUDA;
  ajustarAyuda();
}

window.addEventListener('resize', ajustarAyuda);

function filtrar(id) {
  filtro = id;
  pintarFiltros();
  pintarProductos();
}

// Categorías del pie de página
$('#pie-categorias').insertAdjacentHTML('beforeend', TIENDA.categorias.map((c) =>
  `<li><a href="#tienda" data-filtro="${esc(c.id)}">${esc(c.nombre)}</a></li>`).join(''));
$('#pie-categorias').addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (a) filtrar(a.dataset.filtro || 'todo');
});

filtros.addEventListener('click', (e) => {
  const chip = e.target.closest('[data-filtro]');
  if (!chip) return;
  filtrar(chip.dataset.filtro);
  filtros.querySelector('[aria-pressed="true"]').focus();
});

grid.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (!card) return;
  const p = buscar(card.dataset.id);

  const swatch = e.target.closest('.swatch');
  if (swatch) {
    const col = p.colores[swatch.dataset.color];
    const img = card.querySelector('img');
    card.dataset.color = swatch.dataset.color;
    img.src = col.img;
    img.alt = `${p.nombre}, color ${col.nombre}`;
    card.querySelectorAll('.swatch').forEach((s) => s.setAttribute('aria-pressed', String(s === swatch)));
    return;
  }
  if (e.target.closest('[data-ver]')) abrirFicha(p, Number(card.dataset.color));
});

// Lookbook: cada foto abre la prenda que muestra
const rail = $('#lookbook');
const looks = (TIENDA.looks || []).map((l) => {
  const p = buscar(l.producto);
  return p && { ...l, p, i: Math.max(0, p.colores.findIndex((c) => c.nombre === l.color)) };
}).filter(Boolean);

if (looks.length) {
  rail.innerHTML = looks.map((l, n) =>
    `<button class="look" type="button" data-look="${n}" aria-label="Ver ${esc(l.p.nombre)}, color ${esc(l.p.colores[l.i].nombre)}">
      <img src="${esc(l.img)}" alt="" loading="lazy">
      <span class="look__tag"><strong>${esc(l.p.nombre)}</strong><span>${esc(l.p.colores[l.i].nombre)} · Ver prenda</span></span>
    </button>`).join('');
  rail.addEventListener('click', (e) => {
    const look = looks[e.target.closest('[data-look]')?.dataset.look];
    if (look) abrirFicha(look.p, look.i);
  });
  document.querySelectorAll('[data-rail]').forEach((b) => b.addEventListener('click', () =>
    rail.scrollBy({ left: Number(b.dataset.rail) * rail.clientWidth * 0.8, behavior: 'smooth' })));
} else {
  $('#looks').hidden = true;
}

// Producto destacado («Lo nuevo»)
const nuevo = buscar(TIENDA.destacado);
let nuevoColor = 0;

function pintarNuevo() {
  const col = nuevo.colores[nuevoColor];
  $('#nuevo-img').src = col.img;
  $('#nuevo-img').alt = `${nuevo.nombre}, color ${col.nombre}`;
  $('#nuevo-color').textContent = col.nombre;
  $('#nuevo-colores').innerHTML = nuevo.colores.map((c, i) =>
    `<button class="swatch" type="button" data-color="${i}" style="--c:${esc(c.hex)}" aria-label="${esc(c.nombre)}" aria-pressed="${i === nuevoColor}"></button>`).join('');
}

if (nuevo) {
  $('#nuevo').hidden = false;
  $('#nuevo-nombre').textContent = nuevo.nombre;
  $('#nuevo-desc').textContent = nuevo.descripcion;
  pintarNuevo();
  $('#nuevo-colores').addEventListener('click', (e) => {
    const swatch = e.target.closest('[data-color]');
    if (!swatch) return;
    nuevoColor = Number(swatch.dataset.color);
    pintarNuevo();
    $(`#nuevo-colores [data-color="${nuevoColor}"]`).focus();
  });
  $('#nuevo-ver').addEventListener('click', () => abrirFicha(nuevo, nuevoColor));
} else {
  document.querySelector('.hero a[href="#nuevo"]')?.remove();
}

// Ficha de producto
const ficha = $('#ficha');
const sel = { producto: null, color: 0, talla: null, cant: 1 };

function pintarFicha() {
  const p = sel.producto;
  const col = p.colores[sel.color];
  $('#ficha-img').src = col.img;
  $('#ficha-img').alt = `${p.nombre}, color ${col.nombre}`;
  $('#ficha-color').textContent = col.nombre;
  $('#ficha-cant').textContent = sel.cant;
  $('#ficha-colores').innerHTML = p.colores.map((c, i) =>
    `<button class="thumb" type="button" data-color="${i}" aria-label="${esc(c.nombre)}" aria-pressed="${i === sel.color}"><img src="${esc(c.img)}" alt=""></button>`).join('');
  $('#ficha-tallas').innerHTML = p.tallas.map((t) =>
    `<button class="size" type="button" data-talla="${esc(t)}" aria-pressed="${t === sel.talla}">${esc(t)}</button>`).join('');
}

function abrirFicha(p, color) {
  Object.assign(sel, { producto: p, color, talla: p.tallas.length === 1 ? p.tallas[0] : null, cant: 1 });
  const cat = TIENDA.categorias.find((c) => c.id === p.categoria);
  $('#ficha-categoria').textContent = cat ? cat.nombre : '';
  $('#ficha-nombre').textContent = p.nombre;
  $('#ficha-precio').textContent = precioTexto(p);
  $('#ficha-desc').textContent = p.descripcion;
  $('#ficha-error').hidden = true;
  const agregar = $('#ficha-agregar');
  agregar.disabled = Boolean(p.agotado);
  agregar.textContent = p.agotado ? 'Agotado' : 'Agregar al carrito';
  $('#ficha-duda').href = enlaceWa(`Hola ${TIENDA.nombre}, tengo una duda con la talla de: ${p.nombre}`);
  pintarFicha();
  if (!ficha.open) ficha.showModal();
  ficha.scrollTop = 0;
  $('#ficha-form').scrollTop = 0;
  // Cada prenda tiene su propio enlace para poder compartirla
  history.replaceState(null, '', `#p=${p.id}`);
}

ficha.addEventListener('close', () => {
  if (location.hash.startsWith('#p=')) history.replaceState(null, '', location.pathname + location.search);
});

function abrirDesdeEnlace() {
  const p = location.hash.startsWith('#p=') && buscar(decodeURIComponent(location.hash.slice(3)));
  if (p) abrirFicha(p, 0);
}
window.addEventListener('hashchange', abrirDesdeEnlace);

$('#ficha-compartir').addEventListener('click', async (e) => {
  const boton = e.currentTarget;
  const datos = { title: `${sel.producto.nombre} | ${TIENDA.nombre}`, url: location.href };
  try {
    if (navigator.share) { await navigator.share(datos); return; }
    await navigator.clipboard.writeText(datos.url);
    boton.textContent = 'Enlace copiado';
  } catch (error) {
    if (error.name === 'AbortError') return; // la persona cerró el menú de compartir
    boton.textContent = 'No se pudo copiar el enlace';
  }
  setTimeout(() => { boton.textContent = 'Compartir esta prenda'; }, 2500);
});

ficha.addEventListener('click', (e) => {
  const color = e.target.closest('[data-color]');
  const talla = e.target.closest('[data-talla]');
  const cant = e.target.closest('[data-cant]');
  if (color) sel.color = Number(color.dataset.color);
  else if (talla) { sel.talla = talla.dataset.talla; $('#ficha-error').hidden = true; }
  else if (cant) sel.cant = Math.min(10, Math.max(1, sel.cant + Number(cant.dataset.cant)));
  else return;
  pintarFicha();
  // Al repintar se pierde el foco: lo devolvemos al botón equivalente
  const attr = color ? `[data-color="${sel.color}"]` : talla ? `[data-talla="${CSS.escape(sel.talla)}"]` : `[data-cant="${cant.dataset.cant}"]`;
  ficha.querySelector(attr)?.focus();
});

$('#ficha-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!sel.talla) {
    $('#ficha-error').hidden = false;
    $('#ficha-tallas').scrollIntoView({ block: 'center' });
    return;
  }
  agregar(sel.producto.id, sel.producto.colores[sel.color].nombre, sel.talla, sel.cant);
  ficha.close();
  carritoEl.showModal();
});

// Carrito (se guarda en este navegador)
const CLAVE = 'templefit-carrito';
const carritoEl = $('#carrito');
let carrito = leerCarrito();

function leerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE)) || [];
    // Descarta lo que ya no exista en el catálogo
    return datos.filter((l) => {
      const p = buscar(l.id);
      return p && !p.agotado && p.colores.some((c) => c.nombre === l.color) && p.tallas.includes(l.talla) && l.cant >= 1;
    });
  } catch {
    return [];
  }
}

function guardarCarrito() {
  try { localStorage.setItem(CLAVE, JSON.stringify(carrito)); } catch { /* sin almacenamiento: el carrito dura lo que la visita */ }
}

function agregar(id, color, talla, cant) {
  const linea = carrito.find((l) => l.id === id && l.color === color && l.talla === talla);
  if (linea) linea.cant = Math.min(10, linea.cant + cant);
  else carrito.push({ id, color, talla, cant });
  pintarCarrito();
}

function mensajePedido() {
  const lineas = carrito.map((l, i) => {
    const p = buscar(l.id);
    const importe = p.precio == null ? '' : ` (${dinero.format(p.precio * l.cant)})`;
    return `${i + 1}. ${p.nombre} | ${l.color} | Talla ${l.talla} | x${l.cant}${importe}`;
  });
  const total = totalCarrito();
  return [
    `Hola ${TIENDA.nombre}, quiero hacer este pedido:`,
    '',
    ...lineas,
    '',
    ...(total == null ? [] : [`Total: ${dinero.format(total)}`]),
    '¿Me confirman disponibilidad?'
  ].join('\n');
}

// null si algún producto todavía no tiene precio
function totalCarrito() {
  let total = 0;
  for (const l of carrito) {
    const p = buscar(l.id);
    if (p.precio == null) return null;
    total += p.precio * l.cant;
  }
  return total;
}

function pintarCarrito() {
  guardarCarrito();
  const piezas = carrito.reduce((n, l) => n + l.cant, 0);
  const vacio = carrito.length === 0;

  document.querySelectorAll('[data-carrito-n]').forEach((el) => { el.textContent = piezas; el.hidden = vacio; });
  document.querySelectorAll('[data-abrir-carrito]').forEach((el) =>
    el.setAttribute('aria-label', vacio ? 'Abrir carrito' : `Abrir carrito, ${piezas} ${piezas === 1 ? 'pieza' : 'piezas'}`));

  $('#carrito-cuenta').textContent = vacio ? '' : `(${piezas})`;
  $('#carrito-vacio').hidden = !vacio;
  $('#carrito-pie').hidden = vacio;
  $('#carrito-lineas').innerHTML = carrito.map((l, i) => {
    const p = buscar(l.id);
    const col = p.colores.find((c) => c.nombre === l.color);
    return `<li class="line">
      <img src="${esc(col.img)}" alt="">
      <div class="line__info">
        <h3>${esc(p.nombre)}</h3>
        <p>${esc(l.color)} · Talla ${esc(l.talla)}</p>
        <p class="price">${p.precio == null ? 'Precio por WhatsApp' : dinero.format(p.precio * l.cant)}</p>
      </div>
      <div class="line__tools">
        <div class="qty qty--sm">
          <button type="button" data-linea="${i}" data-d="-1" aria-label="Quitar uno">−</button>
          <output aria-label="Cantidad">${l.cant}</output>
          <button type="button" data-linea="${i}" data-d="1" aria-label="Agregar uno">+</button>
        </div>
        <button class="line__del" type="button" data-linea="${i}" data-d="0">Quitar</button>
      </div>
    </li>`;
  }).join('');

  if (vacio) return;
  const total = totalCarrito();
  $('#carrito-total').textContent = total == null ? 'Se confirma por WhatsApp' : dinero.format(total);
  $('#carrito-enviar').href = enlaceWa(mensajePedido());
}

$('#carrito-lineas').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-linea]');
  if (!btn) return;
  const i = Number(btn.dataset.linea);
  const d = Number(btn.dataset.d);
  if (d === 0 || carrito[i].cant + d < 1) carrito.splice(i, 1);
  else carrito[i].cant = Math.min(10, carrito[i].cant + d);
  pintarCarrito();
  // Mantiene el foco dentro del carrito después de repintar
  (carritoEl.querySelector(`[data-linea="${i}"][data-d="${d}"]`) || carritoEl.querySelector('[data-cerrar]')).focus();
});

document.querySelectorAll('[data-abrir-carrito]').forEach((el) =>
  el.addEventListener('click', () => { setMenu(false); carritoEl.showModal(); }));

// Cerrar ventanas: botón × o clic fuera
document.querySelectorAll('dialog').forEach((d) => {
  d.addEventListener('click', (e) => {
    if (e.target.closest('[data-cerrar]')) { d.close(); return; }
    if (e.target !== d) return;
    const r = d.getBoundingClientRect();
    const dentro = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!dentro) d.close();
  });
});

pintarFiltros();
pintarProductos();
pintarCarrito();
abrirDesdeEnlace();
