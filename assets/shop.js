'use strict';
/* =====================================================================
   SHOP — catalogue, filters, cart, checkout
   Prices checked against TheCubicle / SpeedCubeShop in July 2026.
   `priceChecked: false` means the model is real but I could not confirm
   a current price — worth verifying before this goes anywhere real.
   Product photos: drop images into an `images/` folder next to this file,
   named exactly as the `img` field below. Missing files fall back to a
   placeholder tile automatically, so nothing breaks while you collect them.
   ===================================================================== */
const shop = { search:'', cats:new Set(), maxPrice:160, sort:'featured' };
let cart = store.get('rubik_cart', []);
if (!Array.isArray(cart)) cart = [];
const saveCart = () => store.set('rubik_cart', cart);

function fillProductImage(wrap, prod) {
  wrap.innerHTML = '';
  const img = document.createElement('img');
  img.alt = prod.name;
  img.loading = 'lazy';
  img.src = imgSrc(prod);
  img.addEventListener('load', () => wrap.classList.add('haspic'));
  img.addEventListener('error', () => {
    wrap.classList.remove('haspic');
    wrap.innerHTML = '';
    const ph = el('div', { class: 'ph' });
    ph.innerHTML = '<svg class="ic"><use href="#' + (isAccessory(prod) ? 'i-timer' : 'i-cube') + '"/></svg>';
    ph.appendChild(el('span', { text: imgSrc(prod) }));
    wrap.appendChild(ph);
  });
  wrap.appendChild(img);
}

function productImage(prod, cls) {
  const wrap = el('div', { class: cls });
  fillProductImage(wrap, prod);
  return wrap;
}

function thumbOnly(prod) {
  const box = el('div', { class: 'th' });
  const img = document.createElement('img');
  img.alt = ''; img.src = imgSrc(prod);
  img.addEventListener('load', () => box.classList.add('haspic'));
  img.addEventListener('error', () => {
    box.classList.remove('haspic');
    box.innerHTML = '<svg class="ic"><use href="#' + (isAccessory(prod) ? 'i-timer' : 'i-cube') + '"/></svg>';
  });
  box.appendChild(img);
  return box;
}

function visibleProducts() {
  const q = shop.search.trim().toLowerCase();
  /* the Accessories page shows only accessories; the cube shop shows only cubes */
  const page = document.body.dataset.page;
  const scope = page === 'accessories' ? PRODUCTS.filter(isAccessory)
              : page === 'shop'        ? PRODUCTS.filter(p => !isAccessory(p))
              : PRODUCTS;
  const list = scope.filter(p => {
    if (shop.cats.size && !facetsOf(p).some(f => shop.cats.has(f))) return false;
    if (p.price > shop.maxPrice) return false;
    if (q) {
      const hay = (p.name + ' ' + p.series + ' ' + p.category + ' ' + (p.groupName || '') + ' ' + (p.variantLabel || '') + ' ' + p.tags.join(' ')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const s = shop.sort;
  list.sort((a, b) =>
    s === 'price-asc' ? a.price - b.price :
    s === 'price-desc' ? b.price - a.price :
    s === 'rating' ? (ratingOf(b).score - ratingOf(a).score) || (b.reviews - a.reviews) :
    s === 'name' ? a.name.localeCompare(b.name) :
    a.featured - b.featured);
  return list;
}

/* discount label, e.g. "−17%". Only meaningful when p.was is set. */
function pctOff(p) {
  return '−' + Math.round((1 - p.price / p.was) * 100) + '%';
}

/* =====================================================================
   RATINGS
   A star bar is two stacked rows of ★★★★★: a grey track, and a gold
   overlay clipped by width. That gives real fractional fill, so 4.6 and
   4.9 no longer round to the same five solid stars.
   ===================================================================== */
const USER_RATINGS_KEY = 'rubik_ratings';
let userRatings = store.get(USER_RATINGS_KEY, {});
if (!userRatings || typeof userRatings !== 'object' || Array.isArray(userRatings)) userRatings = {};

/* the score shown blends the catalogue average with this visitor's own vote */
function ratingOf(p) {
  const mine = userRatings[p.id] || 0;
  if (!mine) return { score: p.rating, count: p.reviews, mine: 0 };
  return { score: (p.rating * p.reviews + mine) / (p.reviews + 1), count: p.reviews + 1, mine: mine };
}

function starBar(score) {
  const bar = el('div', { class: 'starbar' });
  bar.appendChild(el('span', { class: 'sb-track', text: '★★★★★' }));
  const fill = el('span', { class: 'sb-fill', text: '★★★★★' });
  fill.style.width = (Math.max(0, Math.min(5, score)) / 5 * 100).toFixed(2) + '%';
  bar.appendChild(fill);
  return bar;
}

function ratingRow(p, big) {
  const r = ratingOf(p);
  const row = el('div', { class: 'rating' + (big ? ' big' : '') });
  row.appendChild(starBar(r.score));
  row.appendChild(el('span', { class: 'r-score', text: r.score.toFixed(1) }));
  row.appendChild(el('span', { class: 'r-count', text: r.count + (r.count === 1 ? ' review' : ' reviews') }));
  if (r.mine) row.appendChild(el('span', { class: 'r-mine', text: 'rated ' + r.mine + '★' }));
  return row;
}

/* Clickable 5-star control. Clicking the star you already picked clears it. */
function ratePicker(prod, onChange) {
  const box = el('div', { class: 'rate-box' });
  box.appendChild(el('span', { class: 'r-lab', text: 'Rate this cube' }));
  const pick = el('div', { class: 'rate-stars' });
  const hint = el('span', { class: 'r-hint' });
  const btns = [];

  function paint(preview) {
    const n = preview || userRatings[prod.id] || 0;
    for (let i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('on', i < n);
      btns[i].classList.toggle('preview', !!preview && i < preview);
    }
    if (!preview) hint.textContent = userRatings[prod.id] ? 'Click the same star to undo' : '';
  }

  for (let i = 1; i <= 5; i++) {
    const b = el('button', { class: 'rate-star', type: 'button', text: '★',
      title: i + ' out of 5', 'aria-label': 'Rate ' + i + ' out of 5' });
    b.addEventListener('mouseenter', () => paint(i));
    b.addEventListener('focus', () => paint(i));
    b.addEventListener('blur', () => paint(0));
    b.addEventListener('click', () => {
      if (userRatings[prod.id] === i) delete userRatings[prod.id];
      else userRatings[prod.id] = i;
      store.set(USER_RATINGS_KEY, userRatings);
      paint(0);
      onChange();
    });
    btns.push(b);
    pick.appendChild(b);
  }
  pick.addEventListener('mouseleave', () => paint(0));
  box.appendChild(pick);
  box.appendChild(hint);
  paint(0);
  return box;
}

function renderFilters() {
  /* counted over facets, so a smart 2x2 is tallied under both 2x2 and Smart */
  const catCounts = {};
  for (const p of PRODUCTS) for (const f of facetsOf(p)) catCounts[f] = (catCounts[f] || 0) + 1;
  const build = (host, items, set, labelOf, countOf) => {
    host.innerHTML = '';
    for (const key of items) {
      const cb = el('input', { type: 'checkbox' });
      cb.checked = set.has(key);
      cb.addEventListener('change', () => { cb.checked ? set.add(key) : set.delete(key); renderShop(); });
      const lab = el('label', { class: 'fopt' }, cb, labelOf(key));
      lab.appendChild(el('span', { class: 'n', text: String(countOf(key)) }));
      host.appendChild(lab);
    }
  };
  if ($('fCategory')) {
    build($('fCategory'), CATEGORY_ORDER.filter(c => catCounts[c]), shop.cats, c => c, c => catCounts[c]);
  }
  if ($('fAccessory')) {
    build($('fAccessory'), ACCESSORY_ORDER.filter(c => catCounts[c]), shop.cats, c => c, c => catCounts[c]);
  }
}

/* gridEl lets a page render a second, independent row of cards (the home page
   "Best products" strip). The filter label and result count belong to the main
   shop grid only, so they are left alone when drawing into another target. */
function renderShop(explicitList, gridEl) {
  const list = explicitList || visibleProducts();
  const grid = gridEl || $('productGrid');
  const isMain = !gridEl;
  grid.innerHTML = '';
  if (isMain && $('fPriceLab')) $('fPriceLab').textContent = shop.maxPrice >= 160 ? 'Any' : 'Up to ' + money(shop.maxPrice);

  // collapse version groups (e.g. the GAN16 family) into a single card
  const seen = new Set();
  const entries = [];
  for (const p of list) {
    if (p.group) {
      if (seen.has(p.group)) continue;
      seen.add(p.group);
      entries.push({ rep: p, variants: list.filter(x => x.group === p.group) });
    } else entries.push({ rep: p, variants: null });
  }
  if (isMain && $('resultCount')) $('resultCount').textContent = entries.length + (entries.length === 1 ? ' product' : ' products');

  if (!entries.length) {
    grid.appendChild(el('div', { class: 'empty-state', style: 'grid-column:1/-1',
      text: 'Nothing matches those filters. Try clearing a couple.' }));
    return;
  }
  for (const entry of entries) {
    const p = entry.rep;
    const variants = entry.variants;
    const grouped = variants && variants.length > 1;
    const card = el('div', { class: 'card' });
    const thumb = productImage(p, 'thumb');
    const badges = el('div', { class: 'badges' });
    if (grouped) {
      badges.appendChild(el('span', { class: 'badge', text: variants.length + ' versions' }));
      if (variants.some(v => v.was)) badges.appendChild(el('span', { class: 'badge sale', text: 'On sale' }));
      if (variants.some(v => v.tags.includes('limited'))) badges.appendChild(el('span', { class: 'badge', text: 'Limited available' }));
      const outCount = variants.filter(v => v.stock === 0).length;
      if (outCount === variants.length) badges.appendChild(el('span', { class: 'badge soldout', text: 'Sold out' }));
      else if (outCount) badges.appendChild(el('span', { class: 'badge soldout', text: outCount + ' sold out' }));
    } else {
      if (p.was) badges.appendChild(el('span', { class: 'badge sale', text: 'Save ' + money(p.was - p.price) }));
      if (p.tags.includes('limited')) badges.appendChild(el('span', { class: 'badge', text: 'Limited' }));
      if (p.tags.includes('smart') && !isAccessory(p)) badges.appendChild(el('span', { class: 'badge', text: 'Smart cube' }));
      if (p.stock === 0) badges.appendChild(el('span', { class: 'badge soldout', text: 'Sold out' }));
      else if (p.stock <= 5) badges.appendChild(el('span', { class: 'badge out', text: 'Only ' + p.stock + ' left' }));
    }
    thumb.appendChild(badges);
    card.appendChild(thumb);
    const body = el('div', { class: 'cbody' });
    body.appendChild(el('div', { class: 'cbrand', text: p.brand.toUpperCase() }));
    body.appendChild(el('div', { class: 'cname', text: p.groupName || p.name }));
    body.appendChild(ratingRow(p));
    const row = el('div', { class: 'crow' });
    if (grouped) {
      /* a group can hold a discounted variant; surface the deepest cut so the
         saving is not swallowed by the "From" price */
      const onSale = variants.filter(v => v.was);
      const best = onSale.sort((a, b) => (1 - b.price / b.was) - (1 - a.price / a.was))[0];
      row.appendChild(el('span', { class: 'cfrom', text: 'From' }));
      row.appendChild(el('span', { class: 'cprice' + (best ? ' sale' : ''),
        text: money(Math.min.apply(null, variants.map(v => v.price))) }));
      if (best) row.appendChild(el('span', { class: 'csave', text: pctOff(best) }));
    } else {
      row.appendChild(el('span', { class: 'cprice' + (p.was ? ' sale' : ''), text: money(p.price) }));
      if (p.was) {
        row.appendChild(el('span', { class: 'cwas', text: money(p.was) }));
        row.appendChild(el('span', { class: 'csave', text: pctOff(p) }));
      }
    }
    body.appendChild(row);
    const soldOut = !grouped && p.stock === 0;
    const add = el('button', { class: 'btn primary sm add',
      text: grouped ? 'Choose version' : (soldOut ? 'Sold out' : 'Add to cart') });
    add.disabled = soldOut;
    add.addEventListener('click', e => {
      e.stopPropagation();
      if (grouped) openProduct(p.id); else addToCart(p.id, 1);
    });
    body.appendChild(add);
    card.appendChild(body);
    card.addEventListener('click', () => openProduct(p.id));
    grid.appendChild(card);
  }
}

function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (p) location.href = productPageUrl(p);
}

/* Renders a full product page into #productHost (per-product HTML files). */
function renderProductPage() {
  const host = $('productHost');
  if (!host || !host.dataset.product) return;
  const key = host.dataset.product;
  let variants = PRODUCTS.filter(x => x.group === key);
  if (!variants.length) {
    const single = PRODUCTS.find(x => x.id === key);
    if (!single) {
      host.appendChild(el('div', { class: 'empty-state', text: 'Product not found.' }));
      return;
    }
    variants = [single];
  }
  variants.sort((a, b) => a.featured - b.featured);
  const first = variants[0];
  let sel = variants.find(v => v.stock > 0) || first;   // never open on a sold-out version
  let qty = 1;

  const back = el('a', { class: 'pd-page-back', href: ROOT + 'pages/shop.html' });
  back.innerHTML = '<svg class="ic"><use href="#i-back"/></svg>Back to the shop';
  host.appendChild(back);

  const wrap = el('div', { class: 'pd' });
  const imgHost = el('div', { class: 'pd-img' });
  wrap.appendChild(imgHost);
  const info = el('div', { class: 'pd-info' });
  info.appendChild(el('div', { class: 'cbrand', text: first.brand.toUpperCase() }));
  info.appendChild(el('h2', { text: first.groupName || first.name }));
  const stars = el('div', { class: 'stars-host' });
  const priceRow = el('div', { class: 'pd-price' });
  const blurb = el('div', { class: 'pd-blurb' });
  info.appendChild(stars);
  info.appendChild(priceRow);

  const verBtns = new Map();
  if (variants.length > 1) {
    info.appendChild(el('div', { class: 'cbrand', text: 'VERSIONS' }));
    /* pd-versions owns layout and spacing; .case-btn itself is shared with the
       timer's dense OLL/PLL/F2L grids and must stay compact there */
    const vhost = el('div', { class: 'pd-versions' });
    for (const v of variants) {
      const b = el('button', { class: 'case-btn' + (v.stock === 0 ? ' oos' : ''),
        text: v.variantLabel || v.name });
      if (v.stock === 0) b.title = 'Sold out';
      b.addEventListener('click', () => { sel = v; render(); });
      verBtns.set(v.id, b);
      vhost.appendChild(b);
    }
    info.appendChild(vhost);
  }
  info.appendChild(blurb);
  const specsHost = el('div');
  info.appendChild(specsHost);

  const qtyBox = el('div', { class: 'qty' });
  const label = el('span', { text: '1' });
  qtyBox.appendChild(el('button', { text: '-', onclick: () => { qty = Math.max(1, qty - 1); label.textContent = String(qty); } }));
  qtyBox.appendChild(label);
  qtyBox.appendChild(el('button', { text: '+', onclick: () => { qty = Math.min(sel.stock, qty + 1); label.textContent = String(qty); } }));
  /* also outside a modal, so it needs its own flex rule rather than .row */
  const actions = el('div', { class: 'pd-actions' });
  actions.appendChild(qtyBox);
  const addBtn = el('button', { class: 'btn primary', text: 'Add to cart',
    onclick: () => { if (sel.stock > 0) addToCart(sel.id, qty); } });
  actions.appendChild(addBtn);
  info.appendChild(actions);

  function render() {
    fillProductImage(imgHost, sel);
    stars.innerHTML = '';
    stars.appendChild(ratingRow(sel, true));
    stars.appendChild(ratePicker(sel, () => {
      /* redraw just the average line so the vote shows up immediately */
      stars.replaceChild(ratingRow(sel, true), stars.firstChild);
    }));
    priceRow.innerHTML = '';
    priceRow.className = 'pd-price' + (sel.was ? ' sale' : '');
    priceRow.appendChild(el('span', { class: 'pd-now', text: money(sel.price) }));
    if (sel.was) {
      priceRow.appendChild(el('span', { class: 'cwas', text: money(sel.was) }));
      priceRow.appendChild(el('span', { class: 'csave', text: pctOff(sel) }));
      priceRow.appendChild(el('span', { class: 'pd-save', text: 'You save ' + money(sel.was - sel.price) }));
    }
    blurb.textContent = sel.blurb;
    specsHost.innerHTML = '';
    const tbl = el('table', { class: 'spectable' });
    for (const kv of Object.entries(sel.specs)) {
      const tr = el('tr');
      tr.appendChild(el('td', { text: kv[0] }));
      tr.appendChild(el('td', { text: kv[1] }));
      tbl.appendChild(tr);
    }
    const trS = el('tr');
    trS.appendChild(el('td', { text: 'Availability' }));
    trS.appendChild(el('td', { text: sel.stock === 0 ? 'Sold out' : sel.stock + ' in stock' }));
    tbl.appendChild(trS);
    specsHost.appendChild(tbl);
    for (const pair of verBtns) pair[1].classList.toggle('on', pair[0] === sel.id);
    const out = sel.stock === 0;
    addBtn.textContent = out ? 'Sold out' : 'Add to cart';
    addBtn.disabled = out;
    qtyBox.style.display = out ? 'none' : '';
    qty = Math.max(1, Math.min(qty, sel.stock || 1));
    label.textContent = String(qty);
  }
  render();

  wrap.appendChild(info);
  host.appendChild(wrap);
}

function cartLines() {
  return cart.map(l => ({ line: l, p: PRODUCTS.find(x => x.id === l.id) })).filter(x => x.p);
}
function cartSubtotal() { return cartLines().reduce((s, { line, p }) => s + p.price * line.qty, 0); }
function cartQtyTotal() { return cart.reduce((n, l) => n + l.qty, 0); }
function shippingFor(sub) { return sub === 0 || sub >= FREE_SHIP_OVER ? 0 : SHIP_FLAT; }

function addToCart(id, qty) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const line = cart.find(l => l.id === id);
  const already = line ? line.qty : 0;
  const want = Math.min(p.stock, already + qty);
  if (want === already) { flashShop('Sorry, no more ' + p.name + ' in stock'); return; }
  if (line) line.qty = want; else cart.push({ id: id, qty: want });
  saveCart(); renderCart();
  flashShop(p.name + ' added to cart');
}
function setQty(id, qty) {
  const p = PRODUCTS.find(x => x.id === id);
  const line = cart.find(l => l.id === id);
  if (!line || !p) return;
  line.qty = Math.max(0, Math.min(p.stock, qty));
  if (line.qty === 0) cart = cart.filter(l => l.id !== id);
  saveCart(); renderCart();
}
function removeFromCart(id) { cart = cart.filter(l => l.id !== id); saveCart(); renderCart(); }

let flashTimer = null;
function shopSubtitleDefault() {
  return 'The complete GAN range · ' + PRODUCTS.length + ' products · free delivery over ' + money(FREE_SHIP_OVER);
}
function flashShop(msg) {
  const sub = $('shopSubtitle');
  if (!sub) return;
  sub.textContent = msg;
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => { sub.textContent = shopSubtitleDefault(); }, 2600);
}

/* renderCart runs on every page. The badge is always there (common.js puts it
   in the nav); the table only exists on pages/shopping cart.html, so the page
   renderer bails out harmlessly everywhere else. */
function renderCart() {
  renderCartBadge();
  renderCartPage();
}

function renderCartBadge() {
  const badge = $('cartCount');
  if (!badge) return;
  const n = cartQtyTotal();
  badge.textContent = String(n);
  badge.hidden = n === 0;
}

function renderCartPage() {
  const rows = $('cartRows');
  if (!rows) return;
  rows.innerHTML = '';
  const lines = cartLines();

  const empty = $('cartEmpty');
  if (empty) empty.hidden = lines.length > 0;
  const table = $('Table');
  if (table) table.hidden = lines.length === 0;

  for (const { line, p } of lines) {
    const tr = el('tr');

    const tdImg = el('td', { class: 'text-center' });
    const img = el('img', { class: 'product-img', alt: p.name });
    img.src = imgSrc(p);
    tdImg.appendChild(img);
    tr.appendChild(tdImg);

    const tdName = el('td');
    tdName.appendChild(el('a', { class: 'cart-name', href: productPageUrl(p), text: p.name }));
    tr.appendChild(tdName);

    tr.appendChild(el('td', { class: 'text-end', text: money(p.price) }));

    const tdQty = el('td', { class: 'text-center' });
    const minus = el('button', { class: 'btn btn-outline-secondary btn-sm',
      text: '-', onclick: () => setQty(p.id, line.qty - 1) });
    const plus = el('button', { class: 'btn btn-outline-secondary btn-sm',
      text: '+', onclick: () => setQty(p.id, line.qty + 1) });
    plus.disabled = line.qty >= p.stock;
    tdQty.appendChild(minus);
    tdQty.appendChild(el('span', { class: 'qty-num', text: String(line.qty) }));
    tdQty.appendChild(plus);
    tr.appendChild(tdQty);

    tr.appendChild(el('td', { class: 'text-end', text: money(p.price * line.qty) }));

    const tdDel = el('td', { class: 'text-center' });
    tdDel.appendChild(el('button', { class: 'btn btn-danger btn-sm',
      text: 'Delete', onclick: () => removeFromCart(p.id) }));
    tr.appendChild(tdDel);

    rows.appendChild(tr);
  }

  const sub = cartSubtotal(), ship = shippingFor(sub);
  const put = (id, txt) => { const n = $(id); if (n) n.textContent = txt; };
  put('cartSubtotal', money(sub));
  put('cartShip', sub === 0 ? '-' : (ship === 0 ? 'Free' : money(ship)));
  put('cartTotal', money(sub + ship));

  const note = $('cartShipNote');
  if (note) {
    note.hidden = !(sub > 0 && ship > 0);
    note.textContent = 'Spend ' + money(Math.max(0, FREE_SHIP_OVER - sub)) + ' more for free delivery';
  }
  const go = $('cartCheckout');
  if (go) go.disabled = lines.length === 0;
}

function luhn(num) {
  if (!/^\d{12,19}$/.test(num)) return false;
  let sum = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = +num[i];
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return sum % 10 === 0;
}

function validExpiry(v) {
  const m = v.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m) return false;
  const mm = +m[1], yy = +m[2];
  if (mm < 1 || mm > 12) return false;
  return new Date(2000 + yy, mm, 1) > new Date();
}

function openCheckout() {
  if (!cartLines().length) return;
  openModal((dlg, close) => {
    dlg.appendChild(el('h3', { text: 'Checkout' }));
    const summary = el('div', { style: 'margin-bottom:16px' });
    for (const { line, p } of cartLines()) {
      const r = el('div', { class: 'order-line' });
      r.appendChild(el('span', { text: line.qty + ' x ' + p.name }));
      r.appendChild(el('span', { text: money(p.price * line.qty) }));
      summary.appendChild(r);
    }
    const sub = cartSubtotal(), ship = shippingFor(sub);
    const sr = el('div', { class: 'order-line' });
    sr.appendChild(el('span', { text: 'Delivery' }));
    sr.appendChild(el('span', { text: ship === 0 ? 'Free' : money(ship) }));
    summary.appendChild(sr);
    const tr = el('div', { class: 'crow2 total' });
    tr.appendChild(el('span', { text: 'Total' }));
    tr.appendChild(el('span', { text: money(sub + ship) }));
    summary.appendChild(tr);
    dlg.appendChild(summary);

    const fields = [
      { id:'ck-name',  label:'Full name',      wide:true,  ph:'Alex Nguyen' },
      { id:'ck-email', label:'Email',          wide:true,  ph:'you@example.com' },
      { id:'ck-addr',  label:'Address',        wide:true,  ph:'12 Cube Lane' },
      { id:'ck-city',  label:'City',           wide:false, ph:'Hanoi' },
      { id:'ck-post',  label:'Postcode',       wide:false, ph:'100000' },
      { id:'ck-card',  label:'Card number',    wide:true,  ph:'4242 4242 4242 4242' },
      { id:'ck-exp',   label:'Expiry MM/YY',   wide:false, ph:'04/29' },
      { id:'ck-cvc',   label:'CVC',            wide:false, ph:'123' }
    ];
    const form = el('div', { class: 'form-grid' });
    const inputs = {};
    for (const f of fields) {
      const wrap = el('div', { class: 'field' + (f.wide ? ' wide' : '') });
      wrap.appendChild(el('label', { text: f.label }));
      const inp = el('input', { type: 'text', placeholder: f.ph });
      const err = el('div', { class: 'err' });
      wrap.appendChild(inp); wrap.appendChild(err);
      form.appendChild(wrap);
      inputs[f.id] = { inp: inp, err: err };
    }
    dlg.appendChild(form);

    const validators = {
      'ck-name':  v => v.trim().length >= 2 || 'Enter your name',
      'ck-email': v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter a valid email',
      'ck-addr':  v => v.trim().length >= 4 || 'Enter your address',
      'ck-city':  v => v.trim().length >= 2 || 'Enter your city',
      'ck-post':  v => v.trim().length >= 3 || 'Enter a postcode',
      'ck-card':  v => luhn(v.replace(/[\s-]/g, '')) || 'Card number looks wrong',
      'ck-exp':   v => validExpiry(v.trim()) || 'Use MM/YY, not in the past',
      'ck-cvc':   v => /^\d{3,4}$/.test(v.trim()) || '3 or 4 digits'
    };
    const validate = id => {
      const r = validators[id](inputs[id].inp.value);
      inputs[id].err.textContent = r === true ? '' : r;
      inputs[id].inp.classList.toggle('bad', r !== true);
      return r === true;
    };
    for (const id of Object.keys(validators)) {
      inputs[id].inp.addEventListener('blur', () => validate(id));
    }

    const pay = el('button', { class: 'btn primary',
      style: 'justify-content:center;width:100%;margin-top:12px', text: 'Pay ' + money(sub + ship) });
    pay.addEventListener('click', () => {
      let ok = true;
      for (const id of Object.keys(validators)) { if (!validate(id)) ok = false; }
      if (!ok) return;
      const order = {
        ref: 'GNB-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        total: sub + ship, items: cartQtyTotal(), email: inputs['ck-email'].inp.value.trim()
      };
      cart = []; saveCart(); renderCart();
      close();
      showOrderConfirmation(order);
    });
    dlg.appendChild(pay);
    dlg.appendChild(el('div', { class: 'msg', style: 'text-align:center;margin:10px 0 0;font-size:11.5px',
      text: 'Demo checkout. No card is charged and nothing is sent anywhere.' }));
    dlg.appendChild(el('div', { class: 'row' },
      el('button', { class: 'btn ghost sm', text: 'Back to cart', onclick: close })));
  }, { width: '520px' });
}

function showOrderConfirmation(order) {
  openModal((dlg, close) => {
    const tick = el('div', { class: 'ok-tick' });
    tick.innerHTML = '<svg class="ic"><use href="#i-check"/></svg>';
    dlg.appendChild(tick);
    dlg.appendChild(el('h3', { text: 'Order confirmed' }));
    dlg.appendChild(el('div', { class: 'msg', style: 'text-align:center',
      text: 'Reference ' + order.ref + '\n' + order.items + ' item' + (order.items === 1 ? '' : 's') +
            ' for ' + money(order.total) + '\nA receipt would go to ' + order.email }));
    dlg.appendChild(el('div', { class: 'row' },
      el('button', { class: 'btn primary', text: 'Keep shopping', onclick: close })));
  }, { width: '420px' });
}

/* ---------- cart page hookup (no-op on other pages) ---------- */
if ($('cartCheckout')) $('cartCheckout').addEventListener('click', openCheckout);

if ($('productGrid') && document.body.dataset.page === 'accessories') {
  $('shopSubtitle').textContent = 'Timers, mats, lubricants and the solving robot';
  renderFilters();
  renderShop();
  $('shopSearch').addEventListener('input', e => { shop.search = e.target.value; renderShop(); });
  $('shopSort').addEventListener('change', e => { shop.sort = e.target.value; renderShop(); });
  $('fPrice').addEventListener('input', e => { shop.maxPrice = +e.target.value; renderShop(); });
  $('fClear').addEventListener('click', () => {
    shop.cats.clear(); shop.maxPrice = 160; shop.search = '';
    $('fPrice').value = 160; $('shopSearch').value = '';
    renderFilters(); renderShop();
  });
} else if ($('productGrid') && document.body.dataset.page === 'home') {
  /* home page: one card per product family, five highest-featured, no filter sidebar.
     HOME_PINNED items are shown on their own instead of being folded into their
     family, so they keep their real name, photo and price on the card. */
  const HOME_PINNED = ['gan251-m-pro'];
  const seenHome = new Set();
  const featured = PRODUCTS.slice().sort((x, y) => x.featured - y.featured).filter(pr => {
    if (HOME_PINNED.includes(pr.id)) return false;   // added separately below
    const key = pr.group || pr.id;
    if (seenHome.has(key)) return false;
    seenHome.add(key);
    return true;
  }).slice(0, 5);
  for (const id of HOME_PINNED) {
    const pin = PRODUCTS.find(x => x.id === id);
    /* strip the family link on this copy only; the real entry is untouched, so
       the card still links through to the family page via openProduct(id) */
    if (pin) featured.push(Object.assign({}, pin, { group: null, groupName: null }));
  }
  renderShop(featured);
} else if ($('productGrid')) {
  $('shopSubtitle').textContent = shopSubtitleDefault();
  renderFilters();
  renderShop();
  $('shopSearch').addEventListener('input', e => { shop.search = e.target.value; renderShop(); });
  $('shopSort').addEventListener('change', e => { shop.sort = e.target.value; renderShop(); });
  $('fPrice').addEventListener('input', e => { shop.maxPrice = +e.target.value; renderShop(); });
  $('fClear').addEventListener('click', () => {
    shop.cats.clear();
    shop.maxPrice = 160; shop.search = '';
    $('fPrice').value = 160; $('shopSearch').value = '';
    renderFilters(); renderShop();
  });
}
renderProductPage();
renderCart();
