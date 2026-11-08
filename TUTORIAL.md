# The Ganbicle — how the project works

A walkthrough of every file, what it does, and why it's built that way.

*Current as of 21 Aug 2026 — 33 products, 44 non-image files.*

---

## What changed recently

If you already knew the older version of this project, here's the delta. Everything below is expanded in the file-by-file section.

| Area | What's new |
|---|---|
| **Home page** | Logo hero, "Find your cube" recommender, "Contact & shipping" block. The banner carousel moved *below* the featured grid. |
| **Ratings** | Star bars with real fractional fill, plus a clickable "Rate this cube" control that blends your vote into the average. Replaces the old `starLine()` text stars. |
| **Sale pricing** | `pctOff()`, "On sale" badges, "From $X" with the deepest discount surfaced, and a "You save $X" line on product pages. |
| **Smart Cube filter** | `facetsOf()` lets one cube appear under both its size *and* "Smart Cube" without vanishing from either filter. |
| **Dark mode on Bootstrap pages** | `data-bs-sync` on `<body>` opts a page into Bootstrap 5.3's `data-bs-theme`, so cart/login/register finally follow the theme toggle. |
| **Responsive** | A real `RESPONSIVE` section in `style.css` at 900px and 640px, plus per-page media queries. |
| **Login page** | Remember me, forgot password, 10%-off promo. |
| **Contrast fixes** | Dark-mode `--border` lifted, and new `--card-border` variables so product cards have visible edges on dark. |

---

## The one idea that explains everything

Every HTML page in this project is a **near-empty shell**. It has almost no content — just some `<div>`s with IDs. The real content gets built by JavaScript at load time.

Two attributes on `<body>` drive all of it:

```html
<body class="dark" data-page="shop" data-root="../">
```

- **`data-page`** tells the shared scripts *which page this is*, so they know what to render and which nav tab to highlight.
- **`data-root`** is the path back to the project root (`""` for `index.html`, `"../"` for anything in `pages/` or `products/`). Every link and image path the scripts generate gets prefixed with this, so the same code works from any folder depth.

A third attribute appeared recently:

- **`data-bs-sync`** — present (with no value) on the three Bootstrap pages. It's an opt-in flag meaning "this page wants Bootstrap's own dark mode too."

Every page then loads the same three scripts at the bottom, always in this order:

```html
<script src="../assets/common.js"></script>
<script src="../assets/data.js"></script>
<script src="../assets/shop.js"></script>
```

That order matters — `shop.js` runs immediately on load and needs both the helpers from `common.js` and the product list from `data.js` to already exist.

---

## `assets/common.js` — the shell every page gets

~10 KB, 188 lines. This is the "chrome" — the stuff that appears on every page regardless of what page it is. It runs top to bottom and *does things immediately*, no waiting for `DOMContentLoaded`.

**`ROOT` and `$`** (lines 3–4). `ROOT` reads `data-root` off the body. `$` is a one-character shortcut for `document.getElementById`.

**`store`** (6–18). A wrapper around `localStorage` that saves/loads JSON. The important part is the `try/catch`: if localStorage is blocked (private browsing, `file://` restrictions), it silently falls back to an in-memory object `_mem` so the site keeps working instead of throwing. Everything persistent goes through this:

| Key | Holds |
|---|---|
| `rubik_theme` | `'dark'` or `'light'` |
| `rubik_cart` | array of `{id, qty}` |
| `rubik_ratings` | your own star votes, `{productId: 1–5}` |
| `rubik_pb`, `rubik_pb_history`, `rubik_sessions` | timer personal bests and solve history |

**`ICON_SPRITE`** (21–51). One big hidden `<svg>` containing 24 `<symbol>` definitions, injected as the first child of `<body>`. After that any page can draw an icon with:

```html
<svg class="ic"><use href="#i-cart"/></svg>
```

This is why icons inherit the current text colour — the symbols set no fill, and `.ic` in CSS uses `stroke:currentColor`.

Four icons were added for the contact block: `i-mail`, `i-phone`, `i-clock`, `i-truck`. Note that **none of them are actually used yet** — the contact section on the home page ended up using plain text labels ("Phone:", "Email:") instead. The `.cc .ic` styling is sitting there ready if you want to swap them in.

**The nav bar** (54–69). Built as an HTML string and inserted after the sprite. It reads `data-page` to decide which tab gets the `active` class, and prefixes every `href` with `ROOT`. Note the cart link is `pages/shopping%20cart.html` — the `%20` is a URL-encoded space, because that file literally has a space in its name.

**The footer** (72–78). Injected at the end of `<body>` with the current year. It first checks `if (document.querySelector('footer.site-footer')) return;` so a page can supply its own and this won't duplicate it.

**Theme** (81–106). `darkMode` is read from storage (defaults to dark). `applyTheme()` toggles the `dark` class on `<body>`. There's a `Ctrl+D` shortcut. `themeHooks` is an array other scripts can register callbacks into via `onThemeChange()` — the timer's 3D cube uses this to repaint when the theme flips.

The **new** part is lines 86–91:

```js
if (document.body.dataset.bsSync !== undefined) {
  document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
}
```

Bootstrap 5.3 recolours its own components (tables, inputs, buttons, `<hr>`, `.text-muted`) when it sees `data-bs-theme` on `<html>`. Rather than force that on every page, it's **opt-in**: only pages carrying `data-bs-sync` get it. Pages with a deliberate hand-picked palette keep it.

Also worth noticing: `dataset.bsSync` is how JS reads `data-bs-sync` — the dataset API converts `kebab-case` to `camelCase`. And the check is `!== undefined` rather than truthiness, because a bare attribute with no value reads as an empty string, which is falsy.

**Modal system** (109–152). `openModal(buildFn, opts)` creates an overlay + dialog, appends them to `#modalRoot`, and hands your builder function the dialog element plus a `close` function. `modalStack` tracks nesting so Escape only closes the topmost one. `infoModal` and `confirmModal` wrap this in Promises, so you can `await confirmModal('Delete?', '...')` and get `true`/`false`.

**`el(tag, props, ...children)`** (154–165). The most-used function in the codebase. A tiny element builder:

```js
el('button', { class: 'btn primary', text: 'Add to cart', onclick: () => addToCart(id, 1) })
```

Keys starting with `on` become event listeners, `text` sets textContent, `class` and `style` map to their properties, anything else becomes an attribute.

---

## `assets/data.js` — the catalogue

~18 KB, 33 products. **This is the file you edit to change the shop.**

A typical entry:

```js
{ id:'gan16-max', name:'GAN16 MagLev MAX UV 3x3', brand:'GAN', series:'Flagship',
  category:'3x3 Cube', price:84.99, rating:4.9, reviews:412, stock:8, featured:1,
  img:'3x3/Gan16 MagLev Max.webp',
  group:'gan16', groupName:'GAN16 MagLev 3x3', variantLabel:'MagLev MAX UV',
  tags:['magnetic','maglev'],
  blurb:'GAN current flagship...',
  specs:{'Size':'56 mm','Magnets':'136 (MagLev)', ... } }
```

Fields worth understanding:

- **`featured`** — a sort key, not a boolean. Lower sorts first, and it uses decimals (`8.21`, `14.3`) to slot new products between existing ones without renumbering everything.
- **`stock`** — drives the "Only 3 left" / "Sold out" badges and caps how many you can add to the cart.
- **`group` / `groupName` / `variantLabel`** — the variant system. Any products sharing a `group` collapse into **one card** on the shop grid and **one page** with version buttons. The six groups are `gan16`, `gan15`, `gan251m`, `gan460`, `gan562`, `ganlube`.
- **`was`** — optional old price. If present you get sale styling, a percentage badge and a "You save" line. Currently only `gan-lube` has one.
- **`tags`** — free-form, but three are load-bearing: `limited` (badge), `smart` (badge *and* the Smart Cube facet), `maglev` (the home picker filters on it).

### The facet system — the newest idea in this file

```js
function facetsOf(p) {
  const out = [p.category];
  if (p.tags.includes('smart') && !isAccessory(p) && !out.includes('Smart Cube')) out.push('Smart Cube');
  return out;
}
```

The problem this solves: a cube has exactly one physical size, so `category` can only be `'2x2 Cube'`. But `Smart Cube` was also in `CATEGORY_ORDER` as a filter option. Before this, a smart 2x2 had to pick one — and whichever it picked, it disappeared from the other filter.

Now `category` stays the single source of truth for size, and "Smart Cube" is **derived** from the `smart` tag at read time. Both the sidebar counts and the filter test go through `facetsOf`, so the same cube is legitimately counted and matched under both. That's why the facet counts add up to more than 33.

The filter test in `shop.js` changed to match:

```js
if (shop.cats.size && !facetsOf(p).some(f => shop.cats.has(f))) return false;
```

Note it's `.some()` — OR, not AND. Ticking both "2x2" and "3x3" widens the results rather than returning nothing.

### The rest of the config

```js
const CATEGORY_ORDER  = ['Smart Cube','2x2 Cube','3x3 Cube','4x4 Cube','5x5 Cube','Minx Cube','Shape Mods Cube'];
const ACCESSORY_ORDER = ['Timers','Mats','Lubricants','Robots','Bags'];
const isAccessory = p => ACCESSORY_ORDER.includes(p.category);
const SHIP_FLAT = 4.95, FREE_SHIP_OVER = 75;
const money = n => '$' + n.toFixed(2);
```

`isAccessory` is the single line that splits the Shop page from the Accessories page.

Three entries are currently placeholders with no products behind them: **Minx Cube**, **Shape Mods Cube** and **Bags**. That's harmless — `renderFilters` does `.filter(c => catCounts[c])`, so a category with zero products simply doesn't render a checkbox. The matching empty `Img/minx/` and `Img/shape mods/` folders suggest that's a planned expansion rather than a mistake.

**`imgSrc(prod)`** turns `'3x3/cube.webp'` into `ROOT + 'Img/3x3/cube.webp'`, skipping the prefix if the value is already a full URL or site-root path.

**`productPageUrl(prod)`** returns `ROOT + 'products/' + (group || id) + '.html'`. This is why a grouped product's page filename must match its `group` key, and an ungrouped one must match its `id`.

---

## `assets/shop.js` — everything commerce

~29 KB, 671 lines. The workhorse. It defines a pile of functions, then at the very bottom (lines 621–671) it looks at what's actually on the page and wires up accordingly.

**Image handling** (16–51). `fillProductImage` attaches `load` and `error` listeners. On error it swaps in a placeholder tile showing a cube or timer icon plus the missing path — so a missing image never shows a broken-image icon, and tells you which file to add.

**`visibleProducts()`** (53–77). Scopes the list by `data-page`, then applies facet filters, the max-price slider, and the search box. Search builds a "haystack" string from name + series + category + group name + variant label + tags and does a substring match.

### Ratings (lines 84–158) — the biggest new block

The old version printed `'★'.repeat(Math.round(p.rating))`, which meant 4.6 and 4.9 both rendered as five identical stars. The new approach is a **two-layer star bar**:

```js
function starBar(score) {
  const bar = el('div', { class: 'starbar' });
  bar.appendChild(el('span', { class: 'sb-track', text: '★★★★★' }));   // grey, underneath
  const fill = el('span', { class: 'sb-fill', text: '★★★★★' });        // gold, on top
  fill.style.width = (score / 5 * 100).toFixed(2) + '%';
  bar.appendChild(fill);
  return bar;
}
```

Two identical rows of five stars stacked on top of each other. The gold one is absolutely positioned with `overflow:hidden` and a percentage width, so it gets **clipped mid-star**. 4.6 out of 5 is 92% width — you see four gold stars and about 60% of a fifth. That's real fractional fill with no half-star images and no SVG masking.

**`ratingOf(p)`** blends the catalogue average with your own vote using a weighted mean:

```js
(p.rating * p.reviews + mine) / (p.reviews + 1)
```

Your single vote is weighted as one review among hundreds, so it barely moves the number — which is the honest behaviour. If you haven't voted, it returns the catalogue figures untouched.

**`ratePicker(prod, onChange)`** is the clickable control. Five buttons, with a `paint(preview)` function that handles three states: your saved rating, a hover/focus preview, and empty. Clicking the star you already picked **clears** your vote (`delete userRatings[prod.id]`), which is a nice touch — most star widgets trap you once you've clicked. It's wired to `mouseenter`, `focus` *and* `blur`, so keyboard users get the same preview behaviour as mouse users.

Votes live in `localStorage` under `rubik_ratings`. They're per-browser only — nothing is sent anywhere.

### Sale pricing

```js
function pctOff(p) {
  return '−' + Math.round((1 - p.price / p.was) * 100) + '%';
}
```

(That leading character is a proper minus sign `−`, not a hyphen.)

The subtle bit is on grouped cards (lines 234–242). A group shows "From $X" using the *cheapest* variant — but the cheapest variant isn't necessarily the discounted one, so a sale could be invisible. So it separately finds the variant with the **deepest percentage cut** and shows that badge alongside:

```js
const onSale = variants.filter(v => v.was);
const best = onSale.sort((a, b) => (1 - b.price / b.was) - (1 - a.price / a.was))[0];
```

**`renderShop()`** (183–264) builds the product cards. The grouping loop walks the list and, the first time it sees a `group` key, creates one entry holding all variants and skips the rest. Grouped cards show "N versions" and "From $X" with a **Choose version** button; single cards show the price and **Add to cart**.

**`renderProductPage()`** (272–381) runs on the individual product pages. It reads `data-product` off `#productHost`, finds either all variants in that group or the single matching product, and builds the whole page. There's a local `render()` closure that redraws whenever you click a different version — this is why switching variants is instant with no page load. It opens on the first *in-stock* variant, never a sold-out one (line 287).

The rating block gets rebuilt surgically:

```js
stars.replaceChild(ratingRow(sel, true), stars.firstChild);
```

Only the average line is swapped, leaving the star picker itself untouched — so your click doesn't reset the control you just clicked.

Two layout classes were split out here — `pd-versions` and `pd-actions` — because the version buttons reuse `.case-btn`, which is shared with the timer's dense OLL/PLL grids. The timer needs those compact; the product page needs them roomy. Putting the spacing on the parent lets both coexist.

**Cart** (383–499). `cart` is an array of `{id, qty}` saved under `rubik_cart`. Only IDs and quantities are stored — prices and names are looked up fresh from `PRODUCTS` each render, so a price change in `data.js` updates existing carts automatically.

`renderCart()` calls `renderCartBadge()` (the nav number — every page) and `renderCartPage()` (the table — cart page only). `renderCartPage` bails out with `if (!rows) return;` when it can't find `#cartRows`, which is how the same function safely runs everywhere.

**Checkout** (501–619). `luhn()` is the real credit-card checksum — doubles every second digit from the right, subtracts 9 if over 9, sum must be divisible by 10. `validExpiry()` parses MM/YY and confirms it's in the future. On success it generates a fake ref (`GNB-XXXXXX`), empties the cart, and shows a confirmation. Nothing is sent anywhere.

**The bottom of the file** is the dispatch:

```js
if ($('productGrid') && page === 'accessories') { ...filters + listeners... }
else if ($('productGrid') && page === 'home')   { ...featured + pinned... }
else if ($('productGrid'))                       { ...full shop... }
renderProductPage();   // no-ops unless #productHost exists
renderCart();          // badge everywhere, table only on the cart page
```

The home branch gained a pinning mechanism:

```js
const HOME_PINNED = ['gan251-m-pro'];
...
if (pin) featured.push(Object.assign({}, pin, { group: null, groupName: null }));
```

Normally the home page shows one card per *family*, so the GAN251 M Pro would be swallowed into a generic "GAN251 M Series — From $23.99" card. Pinning it pushes a **shallow copy** with `group` stripped, so it renders as itself with its own name, photo and price. The original entry in `PRODUCTS` is untouched, so the shop page still groups it normally — and because the card's click handler uses `openProduct(p.id)` and `productPageUrl` reads the *real* record, it still links through to the family page correctly.

---

## `assets/timer.js` — the speedcubing timer

83 KB, 2181 lines. Unchanged recently, and completely independent of the shop — only `pages/timer.html` loads it. It borrows `store`, `el`, `openModal` and `onThemeChange` from `common.js`.

| Lines | What |
|---|---|
| 1–135 | Config: puzzle types, cube sizes, and the full **OLL** (57 cases) and **PLL** (21 cases) algorithm tables |
| 137–224 | Storage keys, time formatting, scramble inversion, F2L algorithm remapping |
| 226–784 | **The 3D cube renderer.** ~550 lines of hand-written 3D math on a `<canvas>` — face normals, cubie definitions, Rodrigues' rotation formula, painter's-algorithm depth sorting, drag-to-rotate. No Three.js. |
| 785–911 | Scramble generators — WCA-legal random moves for NxN, plus Pyraminx, Megaminx, Skewb, Square-1 and Clock |
| 1063–1155 | The solve-history graph, on a second canvas |
| 1156–1480 | Timer state machine: inspection → solve → stop, spacebar handling, session tracking |
| 1481–1587 | Averages — `calculateMo3`, and `calculateAverage` (WCA Ao5: drop best and worst, mean the rest) |
| 1588–1985 | Dialogs: OLL/PLL/F2L case pickers, colour scheme, help, manage-PBs |
| 1986–2181 | The cube solver, including a move-validation regex for pasted scrambles |

Both "pages" live in the same file — `#timerPage` and `#solverPage` — and `showSolver(show)` toggles between them with CSS.

---

## The CSS — two separate systems

### `css/style.css` (29 KB) — the custom design system

Used by **index.html, shop, accessories, timer, and all product pages**. No framework, all hand-written.

It opens with two blocks of CSS custom properties: `:root` for light, `body.dark` for dark. Same variable names, different values. Every rule below uses `var(--bg)` etc. rather than literal colours — so the theme switch is just one class toggle on `<body>`, with `transition:background .18s,color .18s` making it fade.

Unusually, this file **declares variables in more than one place**. There's the main block at the top, then topic-local ones next to the rules that use them:

```css
/* ---------- prices ---------- */
:root{--sale:#a12b25; --sale-soft:#fdecec}
body.dark{--sale:#f2a9a3; --sale-soft:#3a1d1b}

/* ---------- ratings ---------- */
:root{--star:#f0a020; --star-track:#d6dbe4; --star-glow:none}
body.dark{--star:#ffc247; --star-track:#39404f; --star-glow:0 0 10px rgba(255,194,71,.28)}
```

That's legal and keeps related things together. The tradeoff is you can no longer read the top of the file and know the full palette.

`--star-glow` is a nice detail: it's a `text-shadow` value that's `none` in light mode and a soft amber halo in dark. Gold on near-black can look flat, and the glow gives it back some presence — but the same glow on white would look smudged, so it's themed rather than constant.

**Two contrast fixes** in the dark palette, both documented in comments:

```css
/* lifted one step: the old #252b37 sat at 1.2:1 against --surface, which read
   as no border at all on dark panels */
--border:#343d4d; --border-strong:#4a5668;
```

and a new pair specifically for product cards, since even the lifted border wasn't enough on a card-shaped surface:

```css
--card-border:var(--border); --card-border-hover:var(--border-strong);   /* light */
--card-border:#414c60; --card-border-hover:#63718a;                       /* dark */
```

In light mode the card is white on grey so its shape is obvious; in dark mode both are dark, so the border has to do all the work.

**The `RESPONSIVE` section at the end** is new. Two breakpoints:

- **900px** — the timer's side-by-side cube/timer split stacks; the shop's filter sidebar moves above the grid; the PB columns go single-column.
- **640px** — nav wraps, search box goes full width, timer stats drop from 4 columns to 2, the checkout form grid collapses to one column, and the rating controls get bigger tap targets (`.rate-star{font-size:26px}` — small stars are hard to hit with a thumb).

Note `.time-label{font-size:clamp(40px,15vw,72px)}` — the timer digits scale with viewport width between a 40px floor and 72px ceiling, so they stay as large as will fit without overflowing.

### `css/chrome.css` (17 KB) — the compatibility layer

Used by **cart, login, register** — the three Bootstrap pages.

Those pages get their layout from Bootstrap's CDN stylesheet. But `common.js` still injects the nav, footer and modals into them, and those need the custom styling. `chrome.css` is a **trimmed copy of `style.css`** containing only the variables and the shared component rules. Its header says "Generated from css/style.css."

It's been kept in sync with the recent additions — `--sale`, `--star`, `.starbar` and `.pd-versions` are all present.

**Practical consequence:** if you restyle a shared component, you have to change it in *both* files or the two halves of the site drift apart.

### `css/cart.css`, `css/login.css`, `css/register.css`

Small per-page overrides on top of Bootstrap. All three gained a `dark mode` section that follows the same division of labour, spelled out in the comments:

> Bootstrap's own components (table, inputs, buttons, hr, .text-muted) follow `data-bs-theme`, which common.js sets because `<body>` carries `data-bs-sync`. These rules cover the hand-written pieces Bootstrap does not know about.

So `body.dark .box-card`, `body.dark #login`, `body.dark #image` and so on repaint the hand-coloured panels, and Bootstrap handles everything else. `body.dark { background-color: #0d1a18 }` is described as "the same mint hue as the light background, taken right down" — keeping the page's identity across themes rather than snapping to a generic dark grey.

`login.css` also has the clearest comment in the project, and it's worth reading twice:

> body is a column flex container, so auto margins on all four sides absorb the leftover space evenly — that centres the card horizontally and vertically. The card's own auto margins push the footer to the bottom, so the footer must drop the `margin-top:auto` it inherits from chrome.css or the space gets split three ways and the card sits too high.

That's the whole centring strategy: `#login { margin: auto }` plus `.site-footer { margin-top: 0 }`. Two competing `auto` margins would each try to claim the free space, so one has to yield.

The fixed `width: 66.6%` also moved out of an inline `style` attribute and into CSS, where it can have a breakpoint (`@media (max-width:768px) { width: 92% }`).

---

## The pages

### `index.html` — the home page

By far the most-changed file (4 KB → 16 KB). It's now five stacked sections:

```
logo hero  →  featured cubes  →  banner carousel  →  find your cube  →  contact
```

The banner used to be first; it's now third, below the featured grid. The logo hero takes the top slot instead, which is why the inline CSS starts with:

```css
body[data-page="home"] .nav{margin-bottom:0}
```

The shared nav carries `margin-bottom:14px` for pages whose content starts with a padded `.page` wrapper. The logo block sits flush, so the home page cancels it.

**The logo hero** reuses the exact same cube path as the nav brandmark and the login panel, just scaled up. Everything is fluid:

```css
.logo-name{font-size:clamp(44px,9vw,140px); line-height:.9; letter-spacing:-.025em}
.logo-the{letter-spacing:.44em}
```

`clamp(min, preferred, max)` is the pattern throughout — the wordmark scales with viewport width but never below 44px or above 140px. The tight `line-height:.9` and negative letter-spacing are typical display-type treatment; wide `.44em` tracking on "THE" is the classic counterpoint to a heavy wordmark.

**The banner carousel** (script at lines 178–234) is unchanged in logic. It uses **two stacked `<img>` elements**. `changeBanner(direction)` puts the incoming image in `bannerImgNext`, positions it off-screen with transitions disabled, then:

```js
void bannerImgNext.offsetWidth;
```

That line looks pointless but isn't — reading `offsetWidth` forces the browser to recalculate layout immediately. Without it the browser batches the "jump off-screen" and "slide in" changes together and you get no animation. Forcing the reflow makes the off-screen position take effect *before* the transition is enabled. It's a genuinely common CSS-animation trick.

The `sliding` flag plus `COOLDOWN_MS = 550` blocks clicks mid-slide. `setInterval(..., 6000)` auto-advances. The image height is now responsive: 670px default, 380px on tablets, 220px on phones.

### "Find your cube" — the new recommender

An IIFE at the bottom of the page, deliberately placed *after* the three asset scripts so `PRODUCTS`, `el()`, `money()`, `ratingRow()`, `productImage()` and `addToCart()` all exist. It even guards for it:

```js
if (!qsHost || typeof PRODUCTS === 'undefined') return;
```

Three questions — size, budget, what matters most — with the answers held in a plain object seeded with sensible defaults (`3x3`, no limit, value). Every click re-runs `recommend()` and redraws; there's no submit button.

The interesting design decision is in `recommend()`, and the comment states it plainly:

> Size is the only hard filter. Budget and preference are relaxed if nothing matches, and every relaxation is reported rather than silently ignored.

So if you ask for a 5x5 under $40 and nothing qualifies, you don't get "no results" — you get the cheapest 5x5 plus a note explaining that nothing comes in under $40 and this is the closest. Same for preferences: ask for a MagLev 4x4 when none exists and it falls back to rating, and tells you why. Failing usefully instead of failing empty.

Two other touches:

```js
const isGiftSet = p => /gift ?set/i.test(p.name);
```

Gift sets are collector packaging, not an answer to "which cube should I buy", so the picker skips them — but only the picker. They stay visible everywhere else. (The `?` makes the space optional, so it catches both "gift set" and "giftset".)

And the ranking key:

```js
const key = p => want === 'value' ? p.rating / p.price : p.rating;
pool.sort((a, b) => (key(b) - key(a)) || (b.reviews - a.reviews) || (a.price - b.price));
```

"Value for money" is literally rating-per-dollar. The chained `||` is a tiebreaker cascade — equal scores fall through to review count, then to price. Each `||` only kicks in when the previous comparison returns `0`.

### The contact block

Mostly static markup, but the shipping line is rewritten from the constants at runtime:

```js
host.textContent = 'Shipping fees are ' + money(SHIP_FLAT) +
                   ', otherwise free for orders over $' + FREE_SHIP_OVER + ...
```

The HTML already contains the same sentence, so it reads fine if JS fails — but if you ever change `SHIP_FLAT` in `data.js`, the contact block can't end up quoting a stale price. Belt and braces.

The grid uses `repeat(auto-fit, minmax(215px, 1fr))`, which reflows from four columns to one without any media query — each cell is at least 215px, and as many fit per row as will.

### `pages/shop.html` and `pages/accessories.html`

Unchanged. Both are empty scaffolding: a search box, a filter sidebar (`#fCategory` vs `#fAccessory` — that ID difference is the only meaningful one), a sort dropdown, and `<div class="grid" id="productGrid"></div>`. `shop.js` fills all of it.

### `pages/shopping cart.html`

Bootstrap layout with an empty `<tbody id="cartRows">` that `renderCartPage()` fills. Changes: `data-bs-sync` added, and the hardcoded `bg-white` class dropped from the table so it can follow the theme.

The discount code box is still decorative — no handler.

### `pages/login.html`

Fleshed out: input placeholders, a "Remember me" checkbox, "Forgot password?" link, an `<hr>` divider, and a "first order is 10% off" promo. The stray `<br><br>` tags between fields are gone, replaced by Bootstrap's `mb-3` margin utilities — which is the right way round, since spacing is presentation, not content.

### `pages/register.html`

Rewritten with placeholders on every field and a confirm-password input.

**The forms on both pages still don't submit anywhere** — no `action`, no handler. They're presentation only.

### `products/*.html` — 25 files, two kinds

**16 real pages**, each 4 lines of actual content:

```html
<body class="dark" data-page="shop" data-root="../">
<div class="page"><div id="productHost" data-product="gan16"></div></div>
```

`data-product` is the lookup key. `renderProductPage()` matches it against a `group` key first, then falls back to an `id`.

**9 redirect stubs**, each ~350 bytes:

```html
<meta http-equiv="refresh" content="0; url=gan15.html">
```

Leftovers from when each variant had its own page. When variants were merged into groups, the old files were turned into redirects so existing bookmarks still land somewhere sensible. All nine currently point at valid targets.

### `.vscode/settings.json`

Two lines, pinning Live Server to port 5501 so the dev URL stays consistent.

### `Img/`

Organised by category: `2x2/`, `3x3/`, `4x4/`, `5x5/`, `accessories/`, `banners/`, and the two new empty folders `minx/` and `shape mods/`. Mostly `.webp`. All 33 products currently resolve to a real file.

### `The Ganbicle - project presentation.pptx`

1 MB, sitting at the project root. Not referenced by any HTML, CSS or JS — it's a project document, not part of the site. Worth being aware of if you ever deploy this folder as-is, since it would get uploaded along with everything else.

---

## Adding a product, end to end

1. Drop the image in `Img/<category>/`.
2. Add an object to `PRODUCTS` in `data.js` — set `img` to `'<category>/<filename>'`, pick a `featured` number to place it in the ordering.
3. Copy an existing product page in `products/`, rename it to match the `id` (or `group`), and set `data-product`.

The card, filters, search, product page, cart and checkout all pick it up automatically.

**To put a product on sale:** add `was: 13.97` alongside `price`. The badge, struck-through price, percentage and "You save" line all appear on their own.

**To add a new filter category:** add the name to `CATEGORY_ORDER` and set it as a product's `category`. Empty categories don't render, so you can add the name first and fill it later.

---

## Loose ends worth knowing about

**Unused icons.** `i-mail`, `i-phone`, `i-clock` and `i-truck` were added to the sprite for the contact block, but the markup uses text labels instead. Either wire them up or drop them.

**`register.html` has an unclosed `<div>`.** Six opening tags, five closing. The `.container` is never closed, and the `<script>` tags sit inside it. Browsers auto-close at `</body>` so it renders fine, but it's malformed — and it's the kind of thing that breaks confusingly the moment you add anything after it.

**Dead CSS.** `style.css` still has rules for `#cartDrawer` and `#cartScrim` — a slide-out cart panel. Nothing creates those elements any more; the cart became its own page.

**A stale comment.** The header of `shop.js` says images live in an `images/` folder — they're in `Img/`. It also mentions a `priceChecked` flag that no product actually has.

**Duplicated chrome styles.** `style.css` and `chrome.css` both define the nav and modals independently, and have to be kept in sync by hand.

**No form handling** on login/register. Currently decorative.

**Ratings are per-browser.** `rubik_ratings` lives in localStorage, so "your" rating follows the browser, not an account. Clearing site data resets it.
