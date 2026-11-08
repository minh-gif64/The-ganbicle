'use strict';
/* The Ganbicle catalogue. Add products here; groups sharing a `group`
   key collapse into one card + one page with a version picker. */

const PRODUCTS = [
  { id:'gan16-max', name:'GAN16 MagLev MAX UV 3x3', brand:'GAN', series:'Flagship', category:'3x3 Cube', price:84.99,
    rating:4.9, reviews:412, stock:8, featured:1, img:'3x3/Gan16 MagLev Max.webp', group:'gan16', groupName:'GAN16 MagLev 3x3', variantLabel:'MagLev MAX UV',
    tags:['magnetic','maglev'],
    blurb:'GAN current flagship. 136 magnets in a MagLev core, 72-setting numerical tensioning and a UV-coated shell. The cube most record holders are turning right now.',
    specs:{'Size':'56 mm','Magnets':'136 (MagLev)','Core':'Ball-core','Coating':'UV','Tensions':'72 settings'} },

  { id:'gan16-wr', name:'GAN16 MagLev MAX UV 3x3 - Dual-WR Limited Edition', brand:'GAN', series:'Flagship', category:'3x3 Cube', price:84.99,
    rating:4.9, reviews:96, stock:3, featured:1.4, img:'3x3/Gan 16 Maglev Max UV.jpg', group:'gan16', groupName:'GAN16 MagLev 3x3', variantLabel:'MagLev MAX UV (Dual-WR LE)',
    tags:['magnetic','maglev','limited'],
    blurb:'Commemorates XuanYi Geng 3.05 s single and 3.84 s average world records. Limited to 1,111 units worldwide.',
    specs:{'Size':'56 mm','Edition':'1,111 units','Magnets':'136 (MagLev)','Coating':'UV'} },

  { id:'gan16-uv', name:'GAN16 MagLev UV 3x3', brand:'GAN', series:'Flagship', category:'3x3 Cube', price:69.99,
    rating:4.8, reviews:174, stock:12, featured:1.6, img:'3x3/Gan 16 Maglev.jpg', group:'gan16', groupName:'GAN16 MagLev 3x3', variantLabel:'MagLev UV',
    tags:['magnetic','maglev'],
    blurb:'The standard GAN16 with 88 magnets rather than the MAX 136. Lighter and a touch cheaper, with the same MagLev core feel.',
    specs:{'Size':'56 mm','Magnets':'88 (MagLev)','Core':'Ball-core','Coating':'UV'} },

  { id:'gan16-maxl', name:'GAN16 MagLev MAXL UV 3x3', brand:'GAN', series:'Flagship', category:'3x3 Cube', price:84.99,
    rating:4.8, reviews:120, stock:10, featured:1.2, img:'3x3/Gan16 MagLev Max.webp', group:'gan16', groupName:'GAN16 MagLev 3x3', variantLabel:'MagLev MAXL UV',
    tags:['magnetic','maglev'],
    blurb:'The 57 mm build of the MAX - identical 136-magnet MagLev core and UV shell, 1 mm larger for cubers with bigger hands who want more to grip.',
    specs:{'Size':'57 mm','Magnets':'136 (MagLev)','Core':'Ball-core','Coating':'UV','Build':'Large (L)'} },

  { id:'gan16-aqualis', name:'GAN16 MagLev MAX AQUALIS 3x3 - Summer Limited Edition', brand:'GAN', series:'Flagship', category:'3x3 Cube', price:99.99,
    rating:4.9, reviews:58, stock:4, featured:1.8, img:'3x3/Gan 16 Maglev Max Aqualis.webp', group:'gan16', groupName:'GAN16 MagLev 3x3', variantLabel:'MagLev MAX AQUALIS (Summer LE)',
    tags:['magnetic','maglev','limited'],
    blurb:'Summer limited edition of the MAX in the AQUALIS colourway. Full MAX internals under a seasonal shell.',
    specs:{'Size':'56 mm','Edition':'Summer limited','Magnets':'136 (MagLev)','Core':'Ball-core','Coating':'UV'} },

  { id:'gan15-uv', name:'GAN15 MagLev UV 3x3', brand:'GAN', series:'Flagship', category:'3x3 Cube', price:44.99,
    rating:4.8, reviews:238, stock:20, featured:4, img:'3x3/GAN15 Maglev UV 3x3.webp', group:'gan15', groupName:'GAN15 MagLev 3x3', variantLabel:'MagLev UV',
    tags:['magnetic','maglev'],
    blurb:'Ultra-lightweight at 58.6 g. The GAN15 trades a little heft for speed, and it is the value pick in the flagship line.',
    specs:{'Size':'56 mm','Weight':'58.6 g','Magnets':'MagLev','Core':'Ball-core','Coating':'UV'} },

  { id:'gan15-frosted', name:'GAN15 MagLev 3x3 (Frosted)', brand:'GAN', series:'Flagship', category:'3x3 Cube', price:39.99,
    rating:4.7, reviews:141, stock:24, featured:5, img:'3x3/GAN15 MagLev Frosted 3x3.webp', group:'gan15', groupName:'GAN15 MagLev 3x3', variantLabel:'MagLev Frosted',
    tags:['magnetic','maglev'],
    blurb:'The GAN15 in a frosted, non-UV finish for a bit more grip and a lower price. Same lightweight internals.',
    specs:{'Size':'56 mm','Weight':'58.6 g','Magnets':'MagLev','Coating':'Frosted'} },

  { id:'gan15-newblack', name:'GAN15 NewBlack UV Coated 3x3', brand:'GAN', series:'Flagship', category:'3x3 Cube', price:49.99,
    rating:4.9, reviews:186, stock:15, featured:4.5, img:'3x3/GAN15 UV 3x3 New Black.webp', group:'gan15', groupName:'GAN15 MagLev 3x3', variantLabel:'NewBlack UV',
    tags:['magnetic','maglev'],
    blurb:'Car-grade black plastic internals make this the smoothest, quietest GAN15 yet - less friction, less noise, and more durability than the standard build.',
    specs:{'Size':'56 mm','Weight':'59.5 g','Magnets':'Core magnets + MagLev','Internals':'Car-grade black plastic','Coating':'UV','Tuning':'GES Pro+'} },

  { id:'gan14-pro', name:'GAN14 Pro 3x3', brand:'GAN', series:'Enthusiast', category:'3x3 Cube', price:77.99,
    rating:4.7, reviews:203, stock:10, featured:6, img:'3x3/GAN14-Maglev-Pro.webp',
    tags:['magnetic','maglev'],
    blurb:'Refined edges, center-locking and a secure latch system for stability. The GAN14 Pro leans control over raw speed.',
    specs:{'Size':'55 mm','Magnets':'MagLev','Feature':'Center-locking','Configs':'1296'} },

  { id:'gan13-maglev', name:'GAN13 MagLev 3x3', brand:'GAN', series:'Enthusiast', category:'3x3 Cube', price:62.99,
    rating:4.7, reviews:311, stock:28, featured:7, img:'3x3/GAN13-Maglev.webp',
    tags:['magnetic','maglev'],
    blurb:'Deep numerical tuning at a mid price: 6 elasticity levels, 6 center-travel settings and 6 magnet strengths for 216 combinations.',
    specs:{'Size':'56 mm','Magnets':'MagLev','Configs':'216','Tuning':'Numerical'} },

  /* GAN12 family. Prices and specs from TheCubicle, August 2026. The two MagLev
     finishes are listed there as versions of one product sharing 291 reviews
     (distribution 234/35/9/5/8 -> 4.66). The M Leap has its own 18 reviews
     (12/3/2/0/1 -> 4.39). The stickered edition's price and rating are
     placeholders - TheCubicle does not stock it, so nothing to check against. */
  { id:'gan12-maglev-uv', name:'GAN12 M MagLev UV 3x3', brand:'GAN', series:'Enthusiast', category:'3x3 Cube', price:58.99,
    rating:4.7, reviews:291, stock:16, featured:7.5, img:'3x3/Gan12_Maglev_UV.jpg', group:'gan12', groupName:'GAN12 3x3', variantLabel:'M MagLev UV',
    tags:['magnetic','maglev'],
    blurb:'The flagship that introduced MagLev. Opposing magnets replace the springs, cutting friction and spring noise, with adjustable piece magnets on top. Glossy UV-coated shell.',
    specs:{'Size':'56 mm','Weight':'66 g','Magnets':'MagLev + adjustable','Coating':'UV'} },

  { id:'gan12-maglev-frosted', name:'GAN12 M MagLev Frosted 3x3', brand:'GAN', series:'Enthusiast', category:'3x3 Cube', price:51.99,
    rating:4.7, reviews:291, stock:19, featured:7.51, img:'3x3/Gan_12_Maglev_Frosted.webp', group:'gan12', groupName:'GAN12 3x3', variantLabel:'M MagLev Frosted',
    tags:['magnetic','maglev'],
    blurb:'The same MagLev internals in a matte frosted shell. More grip and less glare than the UV version, for a few dollars less.',
    specs:{'Size':'56 mm','Weight':'66 g','Magnets':'MagLev + adjustable','Coating':'Frosted'} },

  { id:'gan12-leap', name:'GAN12 M Leap 3x3', brand:'GAN', series:'Enthusiast', category:'3x3 Cube', price:45.99,
    rating:4.4, reviews:18, stock:11, featured:7.52, img:'3x3/Gan_12_M_Leap.webp', group:'gan12', groupName:'GAN12 3x3', variantLabel:'M Leap',
    tags:['magnetic'],
    blurb:'The spring version of the GAN12. Adjustable piece magnets and an adjustable compression system, in a frosted stickerless finish. Louder than MagLev, but firmer.',
    specs:{'Size':'56 mm','Weight':'61 g','Magnets':'Adjustable','Tensioning':'Spring compression'} },

  { id:'gan12-stickered', name:'GAN12 M MagLev 3x3 (Stickered)', brand:'GAN', series:'Enthusiast', category:'3x3 Cube', price:49.99,
    priceChecked:false,
    rating:4.6, reviews:37, stock:8, featured:7.53, img:'3x3/gan12-maglev-sticker.webp', group:'gan12', groupName:'GAN12 3x3', variantLabel:'M MagLev Stickered',
    tags:['magnetic','maglev'],
    blurb:'The MagLev build on a black body with factory stickers, for anyone who prefers sticker shades to stickerless plastic.',
    specs:{'Size':'56 mm','Weight':'66 g','Magnets':'MagLev + adjustable','Finish':'Black body, stickered'} },

  { id:'gan356-maglev', name:'GAN356 MagLev 3x3', brand:'GAN', series:'Essential', category:'3x3 Cube', price:42.99,
    rating:4.6, reviews:520, stock:40, featured:8, img:'3x3/Gan356-maglev.webp',
    tags:['magnetic','maglev','budget'],
    blurb:'The long-running GAN356, now with MagLev. A dependable, affordable entry into the GAN feel.',
    specs:{'Size':'56 mm','Magnets':'MagLev','Core':'GES','Coating':'Frosted'} },

  { id:'gan251-ui', name:'GAN251 ui Smart Cube 2x2', brand:'GAN', series:'Smart', category:'2x2 Cube', price:79.99,
    rating:4.8, reviews:64, stock:9, featured:8.1, img:'2x2/gan-251-ui.webp',
    tags:['magnetic','smart','new'],
    blurb:'The first smart 2x2. Bluetooth move tracking and app training on a competition-ready 251 chassis, with a charging dock in the box.',
    specs:{'Size':'50 mm','Smart':'Bluetooth','Charging':'Dock included','Magnets':'Magnetic'} },

  { id:'gan251-m-air', name:'GAN251 M Air 2x2', brand:'GAN', series:'Flagship', category:'2x2 Cube', price:23.99,
    rating:4.7, reviews:288, stock:26, featured:8.21, img:'2x2/gan-251-air.webp', group:'gan251m', groupName:'GAN251 M Series', variantLabel:'251 M Air',
    tags:['magnetic'],
    blurb:'The lightweight 251. Airy, fast and forgiving, and the usual starting point for anyone getting serious about 2x2.',
    specs:{'Size':'50 mm','Magnets':'Magnetic','Build':'Lightweight'} },

  { id:'gan251-m-pro', name:'GAN251 M Pro 2x2', brand:'GAN', series:'Flagship', category:'2x2 Cube', price:32.99,
    rating:4.8, reviews:310, stock:250, featured:8.26, img:'2x2/gan251-m-pro.webp', group:'gan251m', groupName:'GAN251 M Series', variantLabel:'251 M Pro',
    tags:['magnetic'],
    blurb:'TheCubicle pick for best 2x2 of 2026. Adjustable magnets and the tight, controllable feel that 2x2 demands.',
    specs:{'Size':'50 mm','Magnets':'Adjustable','Core':'GES core'} },

  { id:'gan251-leap-uv', name:'GAN251 M Leap UV Coated 2x2', brand:'GAN', series:'Flagship', category:'2x2 Cube', price:45.99,
    rating:4.9, reviews:74, stock:47, featured:8.22, img:'2x2/gan251-leap-uv.webp', group:'gan251m', groupName:'GAN251 M Series', variantLabel:'251 M Leap UV Coated',
    tags:['magnetic'],
    blurb:'The Leap build with a UV-coated shell. Smoother surface and a more premium finish than the frosted version.',
    specs:{'Size':'50 mm','Magnets':'Magnetic','Build':'Leap','Coating':'UV'} },

  { id:'gan251-leap-frosted', name:'GAN251 M Leap Frosted 2x2', brand:'GAN', series:'Flagship', category:'2x2 Cube', price:39.99,
    rating:4.7, reviews:61, stock:0, featured:8.25, img:'2x2/gan251-leap-frosted.webp', group:'gan251m', groupName:'GAN251 M Series', variantLabel:'251 M Leap Frosted',
    tags:['magnetic'],
    blurb:'The Leap build with a frosted finish for extra grip. Same internals as the UV version, different feel in the hand.',
    specs:{'Size':'50 mm','Magnets':'Magnetic','Build':'Leap','Coating':'Frosted'} },

    { id:'gan249-v2', name:'GAN249 V2 2x2', brand:'GAN', series:'Essential', category:'2x2 Cube', price:16.99,
    rating:4.6, reviews:410, stock:38, featured:8.4, img:'2x2/gan249-v2.webp',
    tags:['budget'],
    blurb:'The 49 mm budget 2x2. Smaller, cheaper and non-magnetic, and still the cube most people learn 2x2 on.',
    specs:{'Size':'49 mm','Magnets':'None','Core':'Standard'} },

  { id:'gan251-v2', name:'GAN251 V2 2x2', brand:'GAN', series:'Essential', category:'2x2 Cube', price:19.99,
    rating:4.6, reviews:225, stock:30, featured:8.5, img:'2x2/gan251-v2.webp',
    tags:['budget'],
    blurb:'The non-magnetic 251. Full-size 50 mm feel at an entry price, and an easy upgrade path to the M versions.',
    specs:{'Size':'50 mm','Magnets':'None','Core':'GES core'} },

  { id:'gan251-air-giftset', name:'GAN251 M Air Ten Years Classic Gift Set', brand:'GAN', series:'Flagship', category:'2x2 Cube', price:29.99,
    rating:4.8, reviews:52, stock:12, featured:8.24, img:'2x2/gan251-air-giftset.webp', group:'gan251m', groupName:'GAN251 M Series', variantLabel:'251 M Air Ten Years Classic Gift Set',
    tags:['magnetic','limited'],
    blurb:'Anniversary boxed set built around the M Air, in the Ten Years presentation packaging.',
    specs:{'Size':'50 mm','Edition':'Ten Years Classic','Magnets':'Magnetic','Includes':'Gift packaging'} },

  { id:'gan251-leap-giftset', name:'GAN251 M Leap 10 YEARS Grand Gift Set', brand:'GAN', series:'Flagship', category:'2x2 Cube', price:49.99,
    rating:4.9, reviews:38, stock:6, featured:8.23, img:'2x2/gan251-leap-giftset.webp', group:'gan251m', groupName:'GAN251 M Series', variantLabel:'251 M Leap Ten Years Grand Gift Set',
    tags:['magnetic','limited'],
    blurb:'The top-tier anniversary set: the M Leap 2x2 in a display case with the full 10 Years collector packaging.',
    specs:{'Size':'50 mm','Edition':'10 Years Grand','Magnets':'Magnetic','Includes':'Display case, collector box'} },

  { id:'gan460-uv', name:'GAN460 M V2 4x4 (UV Coated)', brand:'GAN', series:'Flagship', category:'4x4 Cube', price:64.99,
    rating:4.8, reviews:196, stock:12, featured:9.51, img:'4x4/gan-460m-v2.webp', group:'gan460', groupName:'GAN460 M V2 4x4', variantLabel:'UV Coated',
    tags:['magnetic'],
    blurb:'GAN 4x4 flagship. A dual-track mechanism keeps the inner layers stable and cuts pops, backed by 160 magnets across the outer, inner and middle layers plus the core. UV-coated shell.',
    specs:{'Size':'60 mm','Magnets':'160 (outer, inner, middle, core)','Mechanism':'Dual track','Coating':'UV'} },

  { id:'gan460-frosted', name:'GAN460 M V2 4x4 (Frosted)', brand:'GAN', series:'Flagship', category:'4x4 Cube', price:59.99,
    rating:4.7, reviews:88, stock:14, featured:9.52, img:'4x4/gan-460m-v2-frosted.webp', group:'gan460', groupName:'GAN460 M V2 4x4', variantLabel:'Frosted',
    tags:['magnetic'],
    blurb:'The same dual-track 460 internals with a frosted finish for extra grip in the hand.',
    specs:{'Size':'60 mm','Magnets':'160 (outer, inner, middle, core)','Mechanism':'Dual track','Coating':'Frosted'} },

  { id:'gan460-sp-frosted', name:'GAN460 M SP V2 4x4 (Frosted)', brand:'GAN', series:'Flagship', category:'4x4 Cube', price:54.99,
    rating:4.8, reviews:54, stock:8, featured:9.53, img:'4x4/gan-460m-sp-v2.webp', group:'gan460', groupName:'GAN460 M V2 4x4', variantLabel:'460 M SP V2 Frosted',
    tags:['magnetic'],
    blurb:'The SP build of the 460 in a frosted finish - the upgraded specification of GAN 4x4 flagship.',
    specs:{'Size':'60 mm','Magnets':'160 (outer, inner, middle, core)','Mechanism':'Dual track','Build':'SP','Coating':'Frosted'} },

  { id:'gan562-uv', name:'GAN562 M 5x5 (UV Coated)', brand:'GAN', series:'Flagship', category:'5x5 Cube', price:67.99,
    rating:4.8, reviews:132, stock:9, featured:9.61, img:'5x5/Gan562-uv.webp', group:'gan562', groupName:'GAN562 M 5x5', variantLabel:'UV Coated',
    tags:['magnetic'],
    blurb:'GAN 5x5 flagship. Fully magnetic across every layer with a light, controlled turn that keeps big-cube solves from feeling like hard work. UV-coated shell.',
    specs:{'Size':'62 mm','Magnets':'Full magnetic system','Coating':'UV'} },

  { id:'gan562-frosted', name:'GAN562 M 5x5 (Frosted)', brand:'GAN', series:'Flagship', category:'5x5 Cube', price:58.99,
    rating:4.7, reviews:61, stock:11, featured:9.62, img:'5x5/Gan562-frosted.webp', group:'gan562', groupName:'GAN562 M 5x5', variantLabel:'Frosted',
    tags:['magnetic'],
    blurb:'The same 562 internals with a frosted finish for extra grip during long 5x5 solves.',
    specs:{'Size':'62 mm','Magnets':'Full magnetic system','Coating':'Frosted'} },

    { id:'gan-icarry4', name:'GAN i Carry 4 Smart Cube 3x3', brand:'GAN', series:'Smart', category:'3x3 Cube', price:34.99,
    rating:4.7, reviews:265, stock:18, featured:10, img:'3x3/GAN-i-carry-4.webp',
    tags:['magnetic','smart'],
    blurb:'Bluetooth smart cube with a matte finish and replaceable button batteries good for 150 hours. Tracks moves and syncs to the Cube Station app.',
    specs:{'Size':'56 mm','Smart':'Bluetooth','Battery':'150 h, replaceable','App':'Cube Station'} },

  { id:'gan-robot-v2', name:'GAN Robot V2 (Auto-Solving)', brand:'GAN', series:'Accessories', category:'Robots', price:125.99,
    rating:4.8, reviews:142, stock:6, featured:11, img:'accessories/Gan-robot-v2.webp',
    tags:['smart'],
    blurb:'Auto-solving robot with a voice system and servo-driven arms. Pair a GAN smart cube and watch it scramble and solve on its own.',
    specs:{'Type':'Auto-solving robot','Voice':'Yes','Pairs with':'GAN smart cubes'} },

  { id:'gan-smart-timer', name:'GAN Smart Timer', brand:'GAN', series:'Accessories', category:'Timers', price:27.99,
    rating:4.7, reviews:198, stock:22, featured:12, img:'accessories/Gan-smart-timer.webp',
    tags:['smart'],
    blurb:'Bluetooth timer that syncs solves to the Cube Station app. Works with the training mat and GAN smart cubes.',
    specs:{'Connectivity':'Bluetooth','App':'Cube Station','Pairs with':'GAN12 UI mat'} },

  { id:'gan-mat', name:'GAN12 UI Training Mat', brand:'GAN', series:'Accessories', category:'Mats', price:6.99,
    rating:4.7, reviews:110, stock:16, featured:13, img:'accessories/gan-mat-12-ui.webp',
    tags:[],
    blurb:'Training mat with pre-drilled holes to lock the timer in place. Sized for solo practice and competition setups.',
    specs:{'Use':'Solo practice','Timer':'Pre-drilled mount'} },

  { id:'gan-lube', name:'GAN Speed Cube Lube - Full Set', brand:'GAN', series:'Accessories', category:'Lubricants', price:12.57, was:13.97,
    rating:4.8, reviews:640, stock:70, featured:14.0, img:'accessories/GANLubeBundle.jpg', group:'ganlube', groupName:'GAN Speed Cube Lube', variantLabel:'All three - bundle',
    tags:[],
    blurb:'All three GAN lubricants together: Maintenance, Accel and Mastery. Everything needed to set up a cube and keep it turning well.',
    specs:{'Type':'Cube lube set','Contains':'Versions I, II and III','For':'GAN cubes'} },

  { id:'gan-lube-1', name:'GAN Speed Cube Lube - Version I Maintenance', brand:'GAN', series:'Accessories', category:'Lubricants', price:3.99,
    rating:4.8, reviews:212, stock:60, featured:14.1, img:'accessories/Gan_lube_1.webp', group:'ganlube', groupName:'GAN Speed Cube Lube', variantLabel:'Version I - Maintenance',
    tags:[],
    blurb:'The upkeep lube. Applied to the core and pieces to keep a cube feeling consistent and to slow down one that has gone too fast.',
    specs:{'Type':'Maintenance lube','Volume':'5 ml','For':'GAN cubes'} },

  { id:'gan-lube-2', name:'GAN Speed Cube Lube - Version II Accel', brand:'GAN', series:'Accessories', category:'Lubricants', price:4.99,
    rating:4.8, reviews:198, stock:55, featured:14.2, img:'accessories/Gan_lube_2.webp', group:'ganlube', groupName:'GAN Speed Cube Lube', variantLabel:'Version II - Accel',
    tags:[],
    blurb:'The speed lube. Cuts friction between pieces for a faster, lighter turn when a cube feels sluggish.',
    specs:{'Type':'Speed lube','Volume':'5 ml','For':'GAN cubes'} },

  { id:'gan-lube-3', name:'GAN Speed Cube Lube - Version III Mastery', brand:'GAN', series:'Accessories', category:'Lubricants', price:4.99,
    rating:4.9, reviews:176, stock:48, featured:14.3, img:'accessories/Gan_lube_3.webp', group:'ganlube', groupName:'GAN Speed Cube Lube', variantLabel:'Version III - Mastery',
    tags:[],
    blurb:'The fine-tuning lube, for dialling in the exact feel you want once the cube is already broken in.',
    specs:{'Type':'Fine-tuning lube','Volume':'5 ml','For':'GAN cubes'} }
];

const CATEGORY_ORDER  = ['Smart Cube','2x2 Cube','3x3 Cube','4x4 Cube','5x5 Cube','Minx Cube','Shape Mods Cube'];
const ACCESSORY_ORDER = ['Timers','Mats','Lubricants','Robots','Bags'];
const isAccessory = p => ACCESSORY_ORDER.includes(p.category);

/* A cube has one size (`category`) but can also be smart, so "Smart Cube" is
   derived from the `smart` tag rather than stored as a category. Without this
   a smart 2x2 had to choose between the 2x2 filter and the Smart filter and
   would vanish from the other. Sidebar counts and filtering both use this. */
function facetsOf(p) {
  const out = [p.category];
  if (p.tags.includes('smart') && !isAccessory(p) && !out.includes('Smart Cube')) out.push('Smart Cube');
  return out;
}
const SHIP_FLAT = 4.95, FREE_SHIP_OVER = 75;
const money = n => '$' + n.toFixed(2);


const IMG_DIR = 'Img/';
/* Bare filenames live in IMG_DIR next to index.html; values containing a
   slash are used as written. ROOT makes both work from product pages too. */
function imgSrc(prod) {
  const f = prod.img;
  if (/^(https?:)?\//.test(f)) return f;                // full URL or site-root path, used as-is
  const p = f.startsWith(IMG_DIR) ? f : IMG_DIR + f;    // anything else lives inside IMG_DIR,
  return ROOT + p;                                      // so '2x2/cube.webp' -> 'Img/2x2/cube.webp'
}
function productPageUrl(prod) {
  return ROOT + 'products/' + (prod.group || prod.id) + '.html';
}
