'use strict';

const ROOT = document.body.dataset.root || '';
const $ = id => document.getElementById(id);

const _mem = {};
const store = {
  get(key, dflt) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? dflt : JSON.parse(v);
    } catch (e) { return key in _mem ? _mem[key] : dflt; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); }
    catch (e) { _mem[key] = val; }
  }
};

/* ---------- accounts, browser only ----------------------------------------
   IMPORTANT: this is not security. Everything below lives in localStorage,
   which anyone can read and edit from the browser's devtools, and the check
   runs on the visitor's own machine. A real sign-in has to be verified on a
   server. What this does give us is a believable account flow for the demo.

   The one habit worth copying from the real thing: the password itself is
   never stored. We keep a salted hash of it and compare hashes instead, so
   the saved account never contains the password in readable form. */
const USER_KEY = 'rubik_user';        // the account, survives signing out
const SESSION_KEY = 'rubik_session';  // whether that account is signed in now

const getUser = () => store.get(USER_KEY, null);
const setUser = u => store.set(USER_KEY, u);
const isSignedIn = () => !!getUser() && store.get(SESSION_KEY, false) === true;
const signIn = () => store.set(SESSION_KEY, true);
const signOut = () => store.set(SESSION_KEY, false);

/* random salt so two people with the same password get different hashes */
function makeSalt() {
  const a = new Uint8Array(8);
  if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(a);
  else for (let i = 0; i < a.length; i++) a[i] = Math.floor(Math.random() * 256);
  return Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
}

/* SHA-256 where the browser offers it (localhost and https both count).
   The fallback only exists so the pages still work when opened straight from
   disk - it is weak, and labelled so nobody mistakes it for the real thing. */
async function hashPassword(password, salt) {
  const text = salt + ':' + password;
  if (window.crypto && window.crypto.subtle) {
    const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return 'weak-' + (h >>> 0).toString(16);
}

/* ---------- icon sprite, injected on every page ---------- */
const ICON_SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="i-help" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.2 9.2a3 3 0 0 1 5.8 1c0 2-2.9 2.4-2.9 4.3"/><path d="M12 17.6v.01"/></symbol>
<symbol id="i-palette" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18h1.4a2 2 0 0 0 1.6-3.2 2 2 0 0 1 1.6-3.2H19a2 2 0 0 0 2-2A9 9 0 0 0 12 3Z"/><circle cx="7.6" cy="12.4" r="1"/><circle cx="9.6" cy="8.4" r="1"/><circle cx="14" cy="7.6" r="1"/></symbol>
<symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 4v16h16"/><path d="M8 16v-4"/><path d="M12 16V8"/><path d="M16 16v-6"/></symbol>
<symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 13.6A8.6 8.6 0 0 1 10.4 4a8.6 8.6 0 1 0 9.6 9.6Z"/></symbol>
<symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></symbol>
<symbol id="i-trash" viewBox="0 0 24 24"><path d="M4.5 7h15"/><path d="M10 11v6M14 11v6"/><path d="M6.5 7l.9 11.2A2 2 0 0 0 9.4 20h5.2a2 2 0 0 0 2-1.8L17.5 7"/><path d="M9.5 7V5.4A1.4 1.4 0 0 1 11 4h2a1.4 1.4 0 0 1 1.5 1.4V7"/></symbol>
<symbol id="i-dice" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3.2"/><circle cx="9" cy="9" r="1.1"/><circle cx="15" cy="9" r="1.1"/><circle cx="9" cy="15" r="1.1"/><circle cx="15" cy="15" r="1.1"/></symbol>
<symbol id="i-eye" viewBox="0 0 24 24"><path d="M2.5 12S6 6.2 12 6.2 21.5 12 21.5 12 18 17.8 12 17.8 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.6"/></symbol>
<symbol id="i-play" viewBox="0 0 24 24"><path d="M7.5 5.2 18.5 12 7.5 18.8Z"/></symbol>
<symbol id="i-stop" viewBox="0 0 24 24"><rect x="6.5" y="6.5" width="11" height="11" rx="2"/></symbol>
<symbol id="i-next" viewBox="0 0 24 24"><path d="M6.5 5.2 15.5 12 6.5 18.8Z"/><path d="M18.5 5.2v13.6"/></symbol>
<symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="9.5" rx="2.2"/><path d="M8.2 10.5V7.6a3.8 3.8 0 0 1 7.6 0v2.9"/></symbol>
<symbol id="i-cube" viewBox="0 0 24 24"><path d="M12 3.2 4 7.4v9.2l8 4.2 8-4.2V7.4Z"/><path d="M4 7.4l8 4.2 8-4.2M12 11.6v9.2"/></symbol>
<symbol id="i-back" viewBox="0 0 24 24"><path d="M15 5.5 8.5 12l6.5 6.5"/></symbol>
<symbol id="i-cart" viewBox="0 0 24 24"><circle cx="9.5" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/><path d="M2.5 3.5h2.2l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h8.5a1.6 1.6 0 0 0 1.6-1.25L20.5 7H6"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.3"/><path d="M15.4 15.4 20 20"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5 10 17.5 19 7"/></symbol>
<symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8.4" r="3.7"/><path d="M5 20.2a7 7 0 0 1 14 0"/></symbol>
<symbol id="i-timer" viewBox="0 0 24 24"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="M3.6 6.8 12 12.6l8.4-5.8"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path d="M7.6 3.6h3l1.4 3.5-2 1.4a11 11 0 0 0 5.5 5.5l1.4-2 3.5 1.4v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 5.6 5.8a2 2 0 0 1 2-2.2Z"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 6.8v5.4l3.4 2"/></symbol>
<symbol id="i-truck" viewBox="0 0 24 24"><path d="M2.5 6.5h10.5v9H2.5z"/><path d="M13 9.5h4l3 3v3h-7z"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></symbol>
</defs></svg>`;
(function () {
  const holder = document.createElement('div');
  holder.innerHTML = ICON_SPRITE;
  document.body.insertBefore(holder.firstElementChild, document.body.firstChild);
})();

/* ---------- global nav ---------- */
(function () {
  const page = document.body.dataset.page || 'shop';
  /* signed in, the account icon leads to the profile instead of the login form */
  const user = isSignedIn() ? getUser() : null;
  const acctPage = user ? 'profile.html' : 'login.html';
  const acctLabel = user
    ? 'Signed in as ' + String(user.username).replace(/[<>"&]/g, '')
    : 'Account';
  const nav = document.createElement('div');
  nav.className = 'nav';
  nav.innerHTML =
    '<a class="brandmark" href="' + ROOT + 'index.html"><svg class="ic"><use href="#i-cube"/></svg>The Ganbicle</a>' +
    '<a class="nav-tab' + (page === 'shop' ? ' active' : '') + '" href="' + ROOT + 'pages/shop.html">Cubes</a>' +
    '<a class="nav-tab' + (page === 'accessories' ? ' active' : '') + '" href="' + ROOT + 'pages/accessories.html">Accessories</a>' +
    '<a class="nav-tab' + (page === 'timer' ? ' active' : '') + '" href="' + ROOT + 'pages/timer.html">Timer</a>' +
    '<button id="btnDark" class="icon-btn" style="margin-left:auto" title="Toggle theme" aria-label="Toggle theme"><svg class="ic"><use href="#i-sun"/></svg></button>' +
    '<a class="icon-btn' + (page === 'login' || page === 'register' || page === 'profile' ? ' on' : '') +
      '" href="' + ROOT + 'pages/' + acctPage + '" title="' + acctLabel + '" aria-label="' + acctLabel +
      '"><svg class="ic"><use href="#i-user"/></svg></a>' +
    '<a class="icon-btn cart-btn' + (page === 'cart' ? ' on' : '') + '" id="btnCart" href="' + ROOT +
      'pages/shopping%20cart.html" title="Cart" aria-label="View cart"><svg class="ic"><use href="#i-cart"/></svg><span class="cart-count" id="cartCount" hidden>0</span></a>';
  document.body.insertBefore(nav, document.body.children[1] || null);
})();

/* ---------- global footer ---------- */
(function () {
  if (document.querySelector('footer.site-footer')) return;   // page supplied its own
  const foot = document.createElement('footer');
  foot.className = 'site-footer';
  foot.textContent = '© ' + new Date().getFullYear() + ' The Ganbicle. All rights reserved.';
  document.body.appendChild(foot);   // common.js loads last, so this lands after the content
})();

/* ---------- theme ---------- */
const themeHooks = [];
function onThemeChange(fn) { themeHooks.push(fn); }
let darkMode = store.get('rubik_theme', 'dark') === 'dark';
function applyTheme() {
  document.body.classList.toggle('dark', darkMode);
  /* Bootstrap pages opt in with data-bs-sync on <body>; Bootstrap 5.3 then
     recolours its own tables, inputs and buttons from data-bs-theme. Pages that
     do not opt in keep their hand-picked palette. */
  if (document.body.dataset.bsSync !== undefined) {
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
  }
  const btn = $('btnDark');
  btn.querySelector('use').setAttribute('href', darkMode ? '#i-sun' : '#i-moon');
  btn.title = darkMode ? 'Switch to light theme' : 'Switch to dark theme';
}
function toggleDarkMode() {
  darkMode = !darkMode;
  store.set('rubik_theme', darkMode ? 'dark' : 'light');
  applyTheme();
  for (const fn of themeHooks) fn(darkMode);
}
$('btnDark').addEventListener('click', toggleDarkMode);
document.addEventListener('keydown', e => {
  if (e.ctrlKey && (e.key === 'd' || e.key === 'D')) { e.preventDefault(); toggleDarkMode(); }
});
applyTheme();

/* ---------- modal system ---------- */
let modalRoot = $('modalRoot');
if (!modalRoot) {
  modalRoot = document.createElement('div');
  modalRoot.id = 'modalRoot';
  document.body.appendChild(modalRoot);
}
let modalStack = [];

function isModalOpen() { return modalStack.length > 0; }

function openModal(buildFn, opts = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay' + (opts.fullscreen ? ' full' : '');
  const dialog = document.createElement('div');
  dialog.className = 'modal' + (opts.fullscreen ? ' full' : '');
  if (opts.width && !opts.fullscreen) dialog.style.width = opts.width;
  overlay.appendChild(dialog);
  modalRoot.appendChild(overlay);
  modalRoot.classList.add('open');
  let escHandler = null;
  const close = () => {
    overlay.remove();
    modalStack = modalStack.filter(o => o !== overlay);
    if (!modalStack.length) modalRoot.classList.remove('open');
    if (escHandler) document.removeEventListener('keydown', escHandler);
  };
  modalStack.push(overlay);
  if (opts.closeX) {
    const x = el('button', { class: 'icon-btn modal-x' });
    x.setAttribute('aria-label', 'Close');
    x.title = 'Close';
    x.innerHTML = '<svg class="ic"><use href="#i-x"/></svg>';
    x.addEventListener('click', close);
    dialog.appendChild(x);
  }
  if (opts.fullscreen) {
    escHandler = e => {
      if (e.key === 'Escape' && modalStack[modalStack.length - 1] === overlay) close();
    };
    document.addEventListener('keydown', escHandler);
  }
  buildFn(dialog, close);
  return close;
}

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'style') node.style.cssText = v;
    else if (k === 'class') node.className = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  return node;
}

function infoModal(title, msg) {
  return new Promise(resolve => {
    openModal((dlg, close) => {
      dlg.appendChild(el('h3', { text: title }));
      dlg.appendChild(el('div', { class: 'msg', text: msg }));
      dlg.appendChild(el('div', { class: 'row' },
        el('button', { class: 'plain', text: 'OK', onclick: () => { close(); resolve(); } })));
    }, { width: '420px' });
  });
}

function confirmModal(title, msg) {
  return new Promise(resolve => {
    openModal((dlg, close) => {
      dlg.appendChild(el('h3', { text: title }));
      dlg.appendChild(el('div', { class: 'msg', text: msg }));
      dlg.appendChild(el('div', { class: 'row' },
        el('button', { class: 'plain', text: 'Yes', onclick: () => { close(); resolve(true); } }),
        el('button', { class: 'plain', text: 'No', onclick: () => { close(); resolve(false); } })));
    }, { width: '420px' });
  });
}