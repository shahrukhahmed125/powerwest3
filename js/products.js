/* ==========================================================================
   P❤w3r catalogue + product artwork
   --------------------------------------------------------------------------
   EDIT HERE: names, prices (GBP), colours, sizes and copy for every product.
   Prices and product copy are placeholders for the client to confirm.
   Each product's picture is drawn in SVG by PW.art(), so no photos are
   needed. When real photos arrive, add them per colour (see PW.art below).
   ========================================================================== */
(function (w) {
  'use strict';

  var PW = w.PW = w.PW || {};

  /* ---------- Contact + store settings ---------- */
  PW.config = {
    brand: 'P❤w3r',
    currency: 'GBP',
    symbol: '£',
    whatsapp: '447470877892',
    phone: '+447470877892',
    phoneDisplay: '+44 7470 877892',
    email: 'hello@powerwest3.com',
    instagram: 'https://www.instagram.com/powerwest3/',
    tiktok: 'https://www.tiktok.com/@powerwest3',
    site: 'https://powerwest3.com/'
  };

  /* ---------- Colourways ----------
     base = fabric, deep = inside/shadow, print = logo ink, heart = heart ink */
  PW.colours = {
    black: { name: 'Black', base: '#1d1e23', deep: '#0e0f12', print: '#efeee9', heart: '#e3182c', stitch: 'rgba(255,255,255,.18)' },
    white: { name: 'Plate White', base: '#f1f0ec', deep: '#d3d2cb', print: '#141518', heart: '#d9091f', stitch: 'rgba(0,0,0,.2)' },
    red: { name: 'Postcode Red', base: '#bf1225', deep: '#880915', print: '#f6f5f1', heart: '#f6f5f1', stitch: 'rgba(0,0,0,.24)' },
    grey: { name: 'Concrete Grey', base: '#9b9b98', deep: '#727270', print: '#141518', heart: '#d9091f', stitch: 'rgba(0,0,0,.22)' },
    navy: { name: 'Night Navy', base: '#1f2840', deep: '#121829', print: '#efeee9', heart: '#e3182c', stitch: 'rgba(255,255,255,.16)' },
    steel: { name: 'Brushed Steel', base: '#c4c7cc', deep: '#8d9097', print: '#141518', heart: '#d9091f', stitch: 'rgba(0,0,0,.2)', metal: true },
    enamel: { name: 'Red Enamel', base: '#cf1028', deep: '#930a1c', print: '#eef0f3', heart: '#eef0f3', stitch: 'rgba(0,0,0,.2)' }
  };

  /* ---------- Categories (order = order in the shop) ---------- */
  PW.categories = [
    { id: 'tshirts', name: 'T-shirts', one: 'T-shirt', hero: 'heart-tee', colour: 'red', tone: '' },
    { id: 'hoodies', name: 'Hoodies', one: 'Hoodie', hero: 'heart-hoodie', colour: 'black', tone: 'alt' },
    { id: 'tracksuits', name: 'Tracksuits', one: 'Tracksuit', hero: 'w3-tracksuit', colour: 'grey', tone: 'ink' },
    { id: 'gym', name: 'Gym wear', one: 'Gym wear', hero: 'training-shorts', colour: 'black', tone: '' },
    { id: 'boxers', name: 'Boxers', one: 'Boxers', hero: 'boxers-3', colour: 'black', tone: 'alt' },
    { id: 'socks', name: 'Socks', one: 'Socks', hero: 'socks-3', colour: 'white', tone: 'red' },
    { id: 'skimasks', name: 'Ski masks', one: 'Ski mask', hero: 'w3-ski-mask', colour: 'black', tone: '' },
    { id: 'bottles', name: 'Water bottles', one: 'Water bottle', hero: 'power-bottle', colour: 'steel', tone: 'alt' },
    { id: 'keyrings', name: 'Keyrings', one: 'Keyring', hero: 'heart-keyring', colour: 'enamel', tone: 'ink' }
  ];

  var APPAREL = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  var ONE = ['One size'];

  var DELIVERY = 'We deliver across the UK and worldwide. Delivery cost and timing are confirmed in our reply to your order, before you pay. Unworn items can be returned within 14 days of delivery. Message us to arrange it.';

  /* ---------- Products ---------- */
  PW.products = [
    {
      id: 'heart-hoodie', name: 'Pure Heart Hoodie', cat: 'hoodies', price: 70, art: 'hoodie', print: 'wordmark',
      colours: ['black', 'grey', 'red'], sizes: APPAREL, featured: 1,
      desc: 'The P❤w3r wordmark across the chest of a heavyweight hoodie with a lined hood, kangaroo pocket and ribbed cuffs.',
      details: ['Brushed-back fleece', 'Lined hood with flat drawcords', 'Kangaroo pocket', 'Printed P❤w3r wordmark'],
      fit: 'Relaxed fit. Size down for a closer fit.',
      care: 'Wash cold, inside out. Do not tumble dry. Do not iron the print.'
    },
    {
      id: 'heart-tee', name: 'Pure Heart Tee', cat: 'tshirts', price: 35, art: 'tee', print: 'wordmark',
      colours: ['black', 'white', 'red'], sizes: APPAREL, featured: 2,
      desc: 'The everyday tee. Soft cotton, a clean neckline and the P❤w3r wordmark printed on the chest.',
      details: ['Cotton jersey', 'Ribbed crew neck', 'Printed P❤w3r wordmark'],
      fit: 'Regular fit. Size up for an oversized look.',
      care: 'Wash cold, inside out. Do not iron the print.'
    },
    {
      id: 'postcode-tee', name: 'Postcode Tee', cat: 'tshirts', price: 35, art: 'tee', print: 'w3',
      colours: ['white', 'black'], sizes: APPAREL, featured: 5,
      desc: 'A big W3 on the chest for the postcode that gave P❤w3r its 3. Home, worn where everyone can see it.',
      details: ['Cotton jersey', 'Ribbed crew neck', 'Printed W3 and West London graphic'],
      fit: 'Regular fit. Size up for an oversized look.',
      care: 'Wash cold, inside out. Do not iron the print.'
    },
    {
      id: 'w3-tracksuit', name: 'W3 Tracksuit', cat: 'tracksuits', price: 120, art: 'tracksuit', print: 'heart',
      colours: ['black', 'navy', 'grey'], sizes: APPAREL, featured: 3,
      desc: 'Full zip jacket and matching joggers with contrast stripes down the arms and legs, and the heart on the chest.',
      details: ['Jacket and joggers sold as a set', 'Full-length zip and stand collar', 'Elasticated waist with drawcord', 'Ribbed cuffs'],
      fit: 'Regular fit. Choose your usual size.',
      care: 'Wash cold with similar colours. Do not tumble dry.'
    },
    {
      id: 'training-vest', name: 'Training Vest', cat: 'gym', price: 28, art: 'vest', print: 'wordmark',
      colours: ['black', 'white'], sizes: APPAREL, featured: 8,
      desc: 'A light, open-arm vest for heavy sessions. Moves when you move, with the wordmark front and centre.',
      details: ['Lightweight training fabric', 'Deep armholes', 'Printed P❤w3r wordmark'],
      fit: 'Athletic fit. Size up for a looser vest.',
      care: 'Wash cold. Do not use fabric softener.'
    },
    {
      id: 'training-shorts', name: 'Training Shorts', cat: 'gym', price: 32, art: 'shorts', print: 'wordmark',
      colours: ['black', 'grey'], sizes: APPAREL, featured: 6,
      desc: 'Gym shorts with an elasticated waist and drawcord, cut above the knee so nothing slows you down.',
      details: ['Lightweight training fabric', 'Elasticated waist with drawcord', 'Printed P❤w3r wordmark on the leg'],
      fit: 'Regular fit. Choose your usual size.',
      care: 'Wash cold. Do not use fabric softener.'
    },
    {
      id: 'power-bottle', name: 'Power Bottle', cat: 'bottles', price: 22, art: 'bottle', print: 'wordmark',
      colours: ['steel', 'black', 'white'], sizes: ONE, featured: 9,
      desc: 'A stainless steel water bottle with a carry loop and the P❤w3r wordmark running down the side.',
      details: ['Stainless steel', 'Screw cap with carry loop', 'Printed P❤w3r wordmark'],
      fit: 'One size.',
      care: 'Hand wash only.'
    },
    {
      id: 'w3-ski-mask', name: 'W3 Ski Mask', cat: 'skimasks', price: 25, art: 'skimask', print: 'heart',
      colours: ['black', 'red'], sizes: ONE, featured: 4,
      desc: 'A rib-knit ski mask with the heart stitched on the forehead. Warm for winter, sharp all year.',
      details: ['Rib knit', 'Two eye openings', 'Stitched heart on the forehead'],
      fit: 'One size, stretches to fit.',
      care: 'Hand wash cold. Dry flat.'
    },
    {
      id: 'boxers-3', name: 'Boxers, 3-pack', cat: 'boxers', price: 30, art: 'boxers', print: 'waistband',
      colours: ['black', 'grey'], sizes: ['S', 'M', 'L', 'XL'], featured: 7,
      desc: 'Three pairs of soft stretch boxers with the P❤w3r wordmark woven into the waistband.',
      details: ['Pack of 3, same colour', 'Soft stretch cotton', 'P❤w3r waistband'],
      fit: 'Regular fit. Choose your usual size.',
      care: 'Machine wash at 30°C.'
    },
    {
      id: 'socks-3', name: 'Crew Socks, 3-pack', cat: 'socks', price: 16, art: 'socks', print: 'heart',
      colours: ['white', 'black'], sizes: ['UK 4–7', 'UK 8–11'], featured: 10,
      desc: 'Three pairs of cushioned crew socks with ribbed cuffs and the heart on the ankle.',
      details: ['Pack of 3, same colour', 'Cushioned sole', 'Ribbed cuff', 'Heart on the ankle'],
      fit: 'Choose your UK shoe size range.',
      care: 'Machine wash at 30°C.'
    },
    {
      id: 'heart-keyring', name: 'Heart Keyring', cat: 'keyrings', price: 10, art: 'keyring', print: 'w3',
      colours: ['enamel', 'steel'], sizes: ONE, featured: 11,
      desc: 'A metal heart with W3 engraved in the middle, on a split ring. Carry it with your keys.',
      details: ['Metal heart charm', 'W3 engraved', 'Split ring and short chain'],
      fit: 'One size.',
      care: 'Wipe clean with a dry cloth.'
    }
  ];

  /* ---------- Look-ups ---------- */
  var byId = {};
  PW.products.forEach(function (p) { byId[p.id] = p; });

  PW.product = function (id) { return byId[id] || null; };

  PW.category = function (id) {
    for (var i = 0; i < PW.categories.length; i++) {
      if (PW.categories[i].id === id) { return PW.categories[i]; }
    }
    return null;
  };

  var fmtWhole = null;
  var fmtExact = null;
  try {
    fmtWhole = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    fmtExact = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } catch (e) { fmtWhole = null; fmtExact = null; }

  PW.money = function (n, exact) {
    var v = Number(n) || 0;
    var whole = !exact && v % 1 === 0;
    if (fmtExact) { return (whole ? fmtWhole : fmtExact).format(v); }
    return PW.config.symbol + (whole ? v : v.toFixed(2));
  };

  PW.fromPrice = function (catId) {
    var min = null;
    PW.products.forEach(function (p) {
      if (p.cat === catId && (min === null || p.price < min)) { min = p.price; }
    });
    return min;
  };

  /* ==========================================================================
     Artwork
     All pieces are drawn on a 400 x 480 canvas (5:6), lit from the top left.
     ========================================================================== */

  /* Wordmark outlines from Archivo ExtraCondensed Black (cap height 100) */
  var WM = {
    P: 'M26.82 100L0 100L0-0.29L38.34-0.29Q47.81-0.29 53.64 3.86Q59.48 8.02 62.03 15.60Q64.58 23.18 64.58 33.38L64.58 33.38Q64.58 43.88 61.81 51.82Q59.04 59.77 53.13 64.29Q47.23 68.80 37.90 68.80L37.90 68.80L26.82 68.80L26.82 100ZM26.82 21.72L26.82 47.08L32.36 47.08Q35.57 47.08 36.59 43.37Q37.61 39.65 37.61 34.26L37.61 34.26Q37.61 30.61 37.24 27.77Q36.88 24.93 35.71 23.32Q34.55 21.72 32.36 21.72L32.36 21.72L26.82 21.72Z',
    W: 'M196.35 100L166.32 100L150.58-0.29L178.13-0.29L181.19 45.48Q181.34 46.65 181.48 49.34Q181.63 52.04 181.85 55.25Q182.06 58.45 182.21 61.22L182.21 61.22L183.52 61.22Q183.67 59.18 183.89 56.85Q184.10 54.52 184.32 52.26Q184.54 50 184.69 48.18Q184.83 46.36 184.83 45.48L184.83 45.48L190.37-0.29L219.38-0.29L223.61 45.48Q223.76 46.94 223.97 49.71Q224.19 52.48 224.41 55.61Q224.63 58.75 224.78 61.22L224.78 61.22L226.09 61.22Q226.09 59.48 226.23 57.22Q226.38 54.96 226.52 52.77Q226.67 50.58 226.82 48.69Q226.96 46.79 227.11 45.48L227.11 45.48L231.34-0.29L256.85-0.29L241.10 100L210.93 100L205.68 54.23Q205.53 52.19 205.31 49.34Q205.10 46.50 204.88 43.59Q204.66 40.67 204.51 38.48L204.51 38.48L203.20 38.48Q203.06 40.96 202.76 44.10Q202.47 47.23 202.18 50Q201.89 52.77 201.74 54.23L201.74 54.23L196.35 100Z',
    T: 'M292.13 101.75L292.13 101.75Q282.21 101.75 276.02 98.18Q269.82 94.61 266.83 88.12Q263.85 81.63 263.85 73.03L263.85 73.03L263.85 70.12L287.17 70.12L287.17 72.45Q287.17 76.68 288.19 79.45Q289.21 82.22 292.42 82.22L292.42 82.22Q295.92 82.22 296.94 79.15Q297.96 76.09 297.96 69.39L297.96 69.39Q297.96 65.89 297.45 63.56Q296.94 61.22 295.70 59.99Q294.46 58.75 292.27 58.75L292.27 58.75L285.42 58.75L285.42 39.94L291.54 39.94Q293.58 39.94 294.53 38.56Q295.48 37.17 295.77 34.33Q296.06 31.49 296.06 26.97L296.06 26.97Q296.06 23.91 295.84 21.79Q295.62 19.68 294.82 18.51Q294.02 17.35 292.13 17.35L292.13 17.35Q290.38 17.35 289.50 18.44Q288.63 19.53 288.34 21.43Q288.04 23.32 288.04 25.80L288.04 25.80L288.04 27.55L265.89 27.55L265.89 24.93Q265.89 17.06 269.09 10.93Q272.30 4.81 278.42 1.38Q284.55-2.04 293.87-2.04L293.87-2.04Q302.62-2.04 308.52 1.38Q314.43 4.81 317.42 10.79Q320.41 16.76 320.41 24.78L320.41 24.78Q320.41 31.20 318.73 35.64Q317.05 40.09 314.65 42.86Q312.24 45.63 309.91 47.08L309.91 47.08L309.91 47.96Q315.30 50.58 318.80 56.12Q322.30 61.66 322.30 71.14L322.30 71.14Q322.30 80.03 319.09 86.95Q315.89 93.88 309.25 97.81Q302.62 101.75 292.13 101.75Z',
    R: 'M356.12 100L329.30 100L329.30-0.29L366.03-0.29Q377.26-0.29 383.53 3.79Q389.80 7.87 392.35 14.87Q394.90 21.87 394.90 30.47L394.90 30.47Q394.90 38.34 393.29 45.26Q391.69 52.19 386.73 57.29L386.73 57.29L397.81 100L370.26 100L363.27 66.33L356.12 66.33L356.12 100ZM356.12 21.57L356.12 45.19L362.39 45.19Q365.89 45.19 367.06 41.47Q368.22 37.76 368.22 33.09L368.22 33.09Q368.22 29.88 367.71 27.33Q367.20 24.78 365.96 23.18Q364.72 21.57 362.39 21.57L362.39 21.57L356.12 21.57Z',
    H: 'M107.58 101.5C83.82 76.78 71.58 55.15 71.58 29.4C71.58 10.86 80.22 -1.5 91.02 -1.5C98.94 -1.5 104.7 4.68 107.58 16.01C110.46 4.68 116.22 -1.5 124.14 -1.5C134.94 -1.5 143.58 10.86 143.58 29.4C143.58 55.15 131.34 76.78 107.58 101.5Z',
    width: 397.81
  };
  WM.letters = WM.P + WM.W + WM.T + WM.R;
  PW.WM = WM;

  var uidN = 0;
  function r(n) { return Math.round(n * 100) / 100; }

  function heartD(x, y, wd, ht) {
    function X(t) { return r(x + wd * t); }
    function Y(t) { return r(y + ht * t); }
    return 'M' + X(.5) + ' ' + Y(1) + 'C' + X(.17) + ' ' + Y(.76) + ' ' + X(0) + ' ' + Y(.55) + ' ' + X(0) + ' ' + Y(.3) +
      'C' + X(0) + ' ' + Y(.12) + ' ' + X(.12) + ' ' + Y(0) + ' ' + X(.27) + ' ' + Y(0) +
      'C' + X(.38) + ' ' + Y(0) + ' ' + X(.46) + ' ' + Y(.06) + ' ' + X(.5) + ' ' + Y(.17) +
      'C' + X(.54) + ' ' + Y(.06) + ' ' + X(.62) + ' ' + Y(0) + ' ' + X(.73) + ' ' + Y(0) +
      'C' + X(.88) + ' ' + Y(0) + ' ' + X(1) + ' ' + Y(.12) + ' ' + X(1) + ' ' + Y(.3) +
      'C' + X(1) + ' ' + Y(.55) + ' ' + X(.83) + ' ' + Y(.76) + ' ' + X(.5) + ' ' + Y(1) + 'Z';
  }
  PW.heartD = heartD;

  function wordmark(x, y, width, fill, heartFill) {
    var s = width / WM.width;
    return '<g transform="translate(' + r(x) + ' ' + r(y) + ') scale(' + r(s * 1000) / 1000 + ')">' +
      '<path fill="' + fill + '" d="' + WM.letters + '"/>' +
      '<path fill="' + heartFill + '" d="' + WM.H + '"/></g>';
  }

  /* "W3" built from the W and 3 glyphs (ink spans 150.58 to 322.30) */
  function w3(x, y, width, fill) {
    var s = width / 171.72;
    return '<g transform="translate(' + r(x - 150.58 * s) + ' ' + r(y) + ') scale(' + r(s * 1000) / 1000 + ')">' +
      '<path fill="' + fill + '" d="' + WM.W + WM.T + '"/></g>';
  }

  function ribs(x1, x2, y1, y2, step, colour) {
    var d = '';
    for (var x = x1; x <= x2; x += step) { d += 'M' + r(x) + ' ' + y1 + 'V' + y2; }
    return '<path d="' + d + '" stroke="' + colour + '" stroke-width="1.6" fill="none"/>';
  }

  function stitch(d, c) {
    return '<path d="' + d + '" fill="none" stroke="' + c.stitch + '" stroke-width="1.6" stroke-dasharray="4 4" stroke-linecap="round"/>';
  }

  function folds(id, dark, light) {
    var out = '<g filter="url(#b' + id + ')">';
    (dark || []).forEach(function (d) { out += '<path d="' + d + '" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="12" stroke-linecap="round"/>'; });
    (light || []).forEach(function (d) { out += '<path d="' + d + '" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="30" stroke-linecap="round"/>'; });
    return out + '</g>';
  }

  function defs(id, extra) {
    return '<defs>' +
      '<linearGradient id="l' + id + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".48" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/>' +
      '</linearGradient>' +
      '<linearGradient id="m' + id + '" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#000" stop-opacity=".32"/><stop offset=".15" stop-color="#fff" stop-opacity=".3"/><stop offset=".3" stop-color="#fff" stop-opacity=".04"/>' +
        '<stop offset=".72" stop-color="#000" stop-opacity=".05"/><stop offset=".9" stop-color="#000" stop-opacity=".24"/><stop offset="1" stop-color="#000" stop-opacity=".36"/>' +
      '</linearGradient>' +
      '<linearGradient id="t' + id + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#f6f7f9"/><stop offset=".3" stop-color="#a3a7ae"/><stop offset=".52" stop-color="#eef0f2"/><stop offset=".78" stop-color="#83878f"/><stop offset="1" stop-color="#d4d7db"/>' +
      '</linearGradient>' +
      '<filter id="b' + id + '" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>' +
      '<filter id="s' + id + '" x="-40%" y="-200%" width="180%" height="500%"><feGaussianBlur stdDeviation="10"/></filter>' +
      (extra || '') + '</defs>';
  }

  function ground(id, rx, cy) {
    return '<ellipse cx="200" cy="' + (cy || 452) + '" rx="' + (rx || 140) + '" ry="13" fill="#000" opacity=".26" filter="url(#s' + id + ')"/>';
  }

  /* A fabric piece: fill, folds, light, outline. clip keeps folds inside. */
  function piece(id, key, shape, c, inner) {
    var cid = 'c' + id + key;
    return '<clipPath id="' + cid + '"><path d="' + shape + '"/></clipPath>' +
      '<g clip-path="url(#' + cid + ')">' +
        '<path d="' + shape + '" fill="' + c.base + '"/>' +
        (inner || '') +
        '<path d="' + shape + '" fill="url(#l' + id + ')"/>' +
      '</g>' +
      '<path d="' + shape + '" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="1.5" stroke-linejoin="round"/>';
  }

  var DRAW = {};

  DRAW.tee = function (id, c, p) {
    var shape = 'M156 58C171 66 229 66 244 58L298 76C318 83 333 93 345 107L380 151L328 196L298 166L300 408Q300 424 284 424L116 424Q100 424 100 408L102 166L72 196L20 151L55 107C67 93 82 83 102 76Z';
    var inner = folds(id,
      ['M135 196C150 262 138 330 150 424', 'M265 204C252 272 262 340 248 424', 'M62 140C82 150 96 164 104 182', 'M338 140C318 150 304 164 296 182'],
      ['M200 112C206 200 192 300 204 424']);
    var print = '';
    if (p.print === 'w3') {
      print = '<path d="' + heartD(191, 98, 18, 16.6) + '" fill="' + c.heart + '"/>' +
        w3(134, 124, 132, c.print) +
        '<text x="200" y="226" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-weight="800" font-stretch="125%" font-size="14" letter-spacing="3" fill="' + c.print + '">WEST LONDON</text>';
    } else {
      print = wordmark(125, 140, 150, c.print, c.heart);
    }
    return ground(id, 150) +
      piece(id, 'a', shape, c, inner) +
      '<path d="M156 58C171 66 229 66 244 58C238 92 162 92 156 58Z" fill="' + c.deep + '"/>' +
      '<path d="M156 58C162 92 238 92 244 58" fill="none" stroke="' + c.base + '" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M156 58C162 92 238 92 244 58" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="1.2"/>' +
      stitch('M151 62C159 103 241 103 249 62', c) +
      stitch('M28 158L77 200', c) + stitch('M372 158L323 200', c) +
      stitch('M102 406L298 406', c) +
      print;
  };

  DRAW.hoodie = function (id, c) {
    var hood = 'M142 112C134 62 162 24 200 22C238 24 266 62 258 112Z';
    var body = 'M146 98C170 112 230 112 254 98L302 112C324 120 338 138 344 162L362 380L364 412L322 416L318 386L300 204L300 432L100 432L100 204L82 386L78 416L36 412L38 380L56 162C62 138 76 120 98 112Z';
    var inner = folds(id,
      ['M128 214C140 282 132 342 140 392', 'M272 218C262 282 270 342 262 392', 'M66 204C72 262 74 322 68 380', 'M334 204C328 262 326 322 332 380'],
      ['M200 124C206 222 194 300 204 392']);
    var cuffs = ribs(41, 79, 384, 412, 5, 'rgba(0,0,0,.16)') + ribs(321, 359, 384, 412, 5, 'rgba(0,0,0,.16)');
    return ground(id, 160, 456) +
      piece(id, 'h', hood, c, '<path d="' + hood + '" fill="#000" fill-opacity=".14"/>') +
      piece(id, 'b', body, c, inner + ribs(104, 296, 395, 430, 6, 'rgba(0,0,0,.12)') + cuffs) +
      '<path d="M166 106C168 74 184 50 200 50C216 50 232 74 234 106C220 116 180 116 166 106Z" fill="' + c.deep + '"/>' +
      '<path d="M163 108C163 70 182 44 200 44C218 44 237 70 237 108" fill="none" stroke="' + c.base + '" stroke-width="8"/>' +
      '<path d="M163 108C163 70 182 44 200 44C218 44 237 70 237 108" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="1.2"/>' +
      '<path d="M100 392L300 392M38 382L80 386M362 382L320 386" stroke="#000" stroke-opacity=".2" stroke-width="2"/>' +
      '<path d="M138 306L262 306L282 376L118 376Z" fill="#000" fill-opacity=".05"/>' +
      stitch('M140 310L260 310', c) +
      '<path d="M138 306L118 376M262 306L282 376" stroke="#000" stroke-opacity=".3" stroke-width="2.5"/>' +
      '<path d="M185 112L181 192M215 112L219 194" stroke="' + c.print + '" stroke-width="4.5" stroke-linecap="round"/>' +
      '<path d="M181 188L180.4 204M219 190L219.6 206" stroke="#b9bcc1" stroke-width="6" stroke-linecap="round"/>' +
      wordmark(122, 218, 156, c.print, c.heart);
  };

  DRAW.tracksuit = function (id, c) {
    var pants = 'M140 270L260 270L262 292L282 452L284 472L218 474L216 458L200 338L184 458L182 474L116 472L118 452L138 292Z';
    var jacket = 'M160 66C180 74 220 74 240 66L292 84C314 92 326 110 330 132L346 300L348 326L312 330L308 304L292 170L292 312L108 312L108 170L92 304L88 330L52 326L54 300L70 132C74 110 86 92 108 84Z';
    var collar = 'M158 68L158 42C178 36 222 36 242 42L242 68C222 76 178 76 158 68Z';
    return ground(id, 150, 470) +
      piece(id, 'p', pants, c, folds(id, ['M160 300C166 360 156 420 150 472', 'M240 300C234 360 244 420 250 472'], []) + ribs(121, 181, 454, 472, 5, 'rgba(0,0,0,.16)') + ribs(219, 281, 454, 472, 5, 'rgba(0,0,0,.16)')) +
      '<path d="M139 296L120 452M261 296L280 452" stroke="' + c.print + '" stroke-width="6"/>' +
      '<path d="M194 292C192 304 190 312 188 324M206 292C208 304 210 314 212 326" stroke="' + c.print + '" stroke-width="3" stroke-linecap="round"/>' +
      piece(id, 'j', jacket, c, folds(id, ['M130 180C140 232 134 272 138 312', 'M270 180C262 232 268 272 262 312', 'M78 160C80 220 74 270 70 316', 'M322 160C320 220 326 270 330 316'], ['M200 90C204 160 196 240 200 300']) + ribs(110, 290, 298, 312, 5, 'rgba(0,0,0,.14)') + ribs(54, 90, 304, 328, 5, 'rgba(0,0,0,.14)') + ribs(310, 346, 304, 328, 5, 'rgba(0,0,0,.14)')) +
      '<path d="M71 136L54 300M329 136L346 300" stroke="' + c.print + '" stroke-width="6"/>' +
      piece(id, 'k', collar, c, '<path d="' + collar + '" fill="#fff" fill-opacity=".05"/>') +
      '<path d="M158 56C178 62 222 62 242 56" stroke="#000" stroke-opacity=".2" stroke-width="1.5" fill="none"/>' +
      '<path d="M200 72L200 312" stroke="' + c.deep + '" stroke-width="7" stroke-dasharray="2 2"/>' +
      '<path d="M200 40L200 312" stroke="#cdd0d4" stroke-width="2"/>' +
      '<rect x="195" y="74" width="10" height="22" rx="3" fill="#d6d8dc"/><rect x="197.5" y="88" width="5" height="6" rx="1.5" fill="#8d9097"/>' +
      '<path d="' + heartD(229, 104, 22, 20) + '" fill="' + c.heart + '"/>';
  };

  DRAW.vest = function (id, c) {
    var shape = 'M150 40L172 40C176 98 224 98 228 40L250 40C254 112 272 152 300 168L300 410Q300 426 284 426L116 426Q100 426 100 410L100 168C128 152 146 112 150 40Z';
    return ground(id, 130) +
      piece(id, 'v', shape, c, folds(id, ['M130 206C140 282 132 350 140 426', 'M270 206C260 282 268 350 260 426'], ['M200 110C204 200 196 320 202 426'])) +
      '<path d="M172 40C186 50 214 50 228 40C224 94 176 94 172 40Z" fill="' + c.deep + '"/>' +
      '<path d="M172 40C176 98 224 98 228 40M150 40C146 112 128 152 100 168M250 40C254 112 272 152 300 168" fill="none" stroke="' + c.base + '" stroke-width="7"/>' +
      '<path d="M172 40C176 98 224 98 228 40M150 40C146 112 128 152 100 168M250 40C254 112 272 152 300 168" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="1.2"/>' +
      stitch('M101 408L299 408', c) +
      wordmark(130, 178, 140, c.print, c.heart);
  };

  DRAW.shorts = function (id, c) {
    var shape = 'M108 96L292 96L294 124L318 352Q320 364 308 366L218 374Q208 374 206 364L200 252L194 364Q192 374 182 374L92 366Q80 364 82 352L106 124Z';
    return ground(id, 140, 400) +
      piece(id, 's', shape, c, folds(id, ['M140 140C150 222 136 300 130 370', 'M262 140C254 222 266 300 272 370'], ['M200 130C202 180 200 220 200 250']) + ribs(110, 290, 98, 122, 5, 'rgba(0,0,0,.12)')) +
      '<path d="M106 124L294 124M200 124L200 252" stroke="#000" stroke-opacity=".2" stroke-width="2"/>' +
      '<path d="M194 126C190 150 186 160 182 178M206 126C210 150 214 160 218 180" stroke="' + c.print + '" stroke-width="3.5" stroke-linecap="round" fill="none"/>' +
      stitch('M86 350L190 360', c) + stitch('M210 360L314 350', c) +
      wordmark(104, 316, 76, c.print, c.heart);
  };

  DRAW.bottle = function (id, c) {
    var body = 'M168 120L232 120C252 128 262 142 262 162L262 422Q262 442 242 442L158 442Q138 442 138 422L138 162C138 142 148 128 168 120Z';
    var neck = 'M172 98L228 98L232 122L168 122Z';
    var cap = 'M168 56Q168 46 178 46L222 46Q232 46 232 56L232 100L168 100Z';
    var metal = c.metal;
    var fillBody = metal ? 'url(#t' + id + ')' : c.base;
    return ground(id, 86, 448) +
      '<path d="M184 52C184 20 216 20 216 52" fill="none" stroke="#202126" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="' + neck + '" fill="' + (metal ? '#b6b9bf' : c.deep) + '"/>' +
      '<path d="' + body + '" fill="' + fillBody + '"/>' +
      '<path d="' + body + '" fill="url(#m' + id + ')" opacity="' + (metal ? '.9' : '.75') + '"/>' +
      '<path d="M150 150C148 230 148 360 150 430" stroke="#fff" stroke-opacity="' + (metal ? '.55' : '.22') + '" stroke-width="6" stroke-linecap="round" filter="url(#b' + id + ')"/>' +
      '<path d="M138 426L262 426" stroke="#000" stroke-opacity=".18" stroke-width="2"/>' +
      '<path d="' + body + '" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="1.5"/>' +
      '<path d="' + cap + '" fill="#202126"/>' +
      ribs(174, 226, 50, 98, 6, 'rgba(255,255,255,.09)') +
      '<path d="' + cap + '" fill="url(#m' + id + ')" opacity=".6"/>' +
      '<g transform="rotate(-90 200 290)">' + wordmark(100, 265, 200, c.print, c.heart) + '</g>';
  };

  DRAW.skimask = function (id, c) {
    var head = 'M200 38C276 38 314 96 314 170L314 298C314 340 302 362 298 382L316 452Q318 464 304 464L96 464Q82 464 84 452L102 382C98 362 86 340 86 298L86 170C86 96 124 38 200 38Z';
    var eyes = 'M128 196C142 170 186 170 196 200C182 220 142 222 128 196ZM272 196C258 170 214 170 204 200C218 220 258 222 272 196Z';
    var extra = '<mask id="k' + id + '"><rect width="400" height="480" fill="#fff"/><path d="' + eyes + '" fill="#000"/></mask>' +
      '<pattern id="n' + id + '" width="7" height="10" patternUnits="userSpaceOnUse"><path d="M3.5 0V10" stroke="#000" stroke-opacity=".16" stroke-width="2.4"/><path d="M0.5 0V10" stroke="#fff" stroke-opacity=".06" stroke-width="1"/></pattern>';
    return '<defs>' + extra + '</defs>' + ground(id, 140, 466) +
      '<g mask="url(#k' + id + ')">' +
        piece(id, 'm', head, c, '<path d="' + head + '" fill="url(#n' + id + ')"/>' + folds(id, ['M112 262C130 302 120 342 112 382', 'M288 262C270 302 280 342 288 382', 'M130 380C170 396 230 396 270 380'], ['M150 76C180 64 220 64 250 76'])) +
      '</g>' +
      '<path d="' + eyes + '" fill="none" stroke="' + c.deep + '" stroke-width="6"/>' +
      '<path d="M102 384C150 395 250 395 298 384" stroke="#000" stroke-opacity=".24" stroke-width="2" fill="none"/>' +
      '<path d="' + heartD(183, 100, 34, 31) + '" fill="' + c.heart + '"/>' +
      '<path d="' + heartD(183, 100, 34, 31) + '" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1.2" stroke-dasharray="2 2"/>';
  };

  DRAW.boxers = function (id, c) {
    var band = 'M104 108L296 108L298 156L102 156Z';
    var body = 'M102 156L298 156L314 330Q316 344 302 346L222 354Q210 354 208 342L200 292L192 342Q190 354 178 354L98 346Q84 344 86 330Z';
    var bandC = { base: c.print, stitch: c.stitch };
    return ground(id, 140, 380) +
      piece(id, 'x', body, c, folds(id, ['M130 172C140 232 126 300 120 348', 'M270 172C262 232 274 300 280 348'], ['M200 170C202 210 200 250 200 288'])) +
      stitch('M200 160C178 200 174 252 194 292', c) + stitch('M200 160C222 200 226 252 206 292', c) +
      stitch('M90 334L190 344', c) + stitch('M210 344L310 334', c) +
      piece(id, 'w', band, bandC, ribs(106, 294, 110, 154, 4, 'rgba(0,0,0,.08)')) +
      wordmark(116, 124, 66, c.base, c.heart) + wordmark(218, 124, 66, c.base, c.heart);
  };

  DRAW.socks = function (id, c) {
    var sock = 'M120 40L200 40L200 292C200 314 214 326 234 334L300 362C326 374 336 404 320 426C306 446 280 450 256 440L156 396C130 384 120 360 120 334Z';
    function one(key, shade) {
      var inner = ribs(123, 197, 42, 96, 5, 'rgba(0,0,0,.13)') +
        '<path d="M120 96L200 96" stroke="#000" stroke-opacity=".16" stroke-width="2"/>' +
        '<ellipse cx="136" cy="372" rx="30" ry="44" fill="#000" fill-opacity=".1"/>' +
        '<ellipse cx="306" cy="410" rx="40" ry="48" transform="rotate(-30 306 410)" fill="#000" fill-opacity=".1"/>' +
        folds(id, ['M146 120C152 180 148 240 154 300', 'M200 300C220 330 250 346 290 362'], ['M178 110C182 180 180 240 182 290']) +
        (shade ? '<path d="' + sock + '" fill="#000" fill-opacity=".1"/>' : '');
      return piece(id, key, sock, c, inner);
    }
    return ground(id, 150, 470) +
      '<g transform="translate(58 20)">' + one('b', true) + '</g>' +
      one('a', false) +
      '<path d="' + heartD(146, 130, 28, 26) + '" fill="' + c.heart + '"/>';
  };

  DRAW.keyring = function (id, c) {
    var charm = heartD(100, 178, 200, 190);
    var inset = heartD(114, 194, 172, 158);
    var metal = 'url(#t' + id + ')';
    var face = c.metal ? metal : c.base;
    var engrave = c.metal ? 'rgba(0,0,0,.42)' : '#e9ebee';
    return ground(id, 110, 420) +
      '<circle cx="200" cy="92" r="46" fill="none" stroke="' + metal + '" stroke-width="9"/>' +
      '<circle cx="200" cy="92" r="50" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>' +
      '<circle cx="200" cy="92" r="41.5" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1"/>' +
      '<ellipse cx="200" cy="146" rx="8" ry="13" fill="none" stroke="' + metal + '" stroke-width="4.5"/>' +
      '<ellipse cx="200" cy="168" rx="8" ry="13" fill="none" stroke="' + metal + '" stroke-width="4.5" transform="rotate(90 200 168)"/>' +
      '<path d="' + charm + '" fill="' + metal + '"/>' +
      '<path d="' + inset + '" fill="' + face + '"/>' +
      '<path d="' + inset + '" fill="url(#l' + id + ')"/>' +
      '<path d="' + inset + '" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>' +
      '<path d="M150 218C164 202 186 200 196 214" stroke="#fff" stroke-opacity=".55" stroke-width="6" stroke-linecap="round" fill="none" filter="url(#b' + id + ')"/>' +
      '<circle cx="200" cy="186" r="9" fill="none" stroke="' + metal + '" stroke-width="4"/>' +
      w3(163, 240, 74, engrave) +
      '<path d="' + charm + '" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1.2"/>';
  };

  /* Detail crops for the product gallery (same 5:6 ratio) */
  var DETAIL = {
    tee: '90 92 220 264', hoodie: '104 150 192 230', tracksuit: '120 40 160 192', vest: '104 120 192 230',
    shorts: '70 236 160 192', bottle: '130 36 140 168', skimask: '120 70 160 192', boxers: '96 92 160 192',
    socks: '108 88 140 168', keyring: '120 196 160 192'
  };

  /* PW.art(productIdOrObject, colourKey, { view: 'detail' }) returns an SVG string */
  /* Real photos: add a "photos" object to a product, keyed by colour, e.g.
       photos: { black: 'images/products/heart-tee-black.jpg' }
     Use 1000 x 1200 px images (5:6) on a plain background. Any colour without
     a photo keeps its drawing. */
  PW.art = function (prod, colourKey, opts) {
    var p = typeof prod === 'string' ? PW.product(prod) : prod;
    if (!p) { return ''; }
    opts = opts || {};
    var key = colourKey && p.colours.indexOf(colourKey) > -1 ? colourKey : p.colours[0];
    var c = PW.colours[key];
    if (p.photos && p.photos[key]) {
      return '<img src="' + p.photos[key] + '" alt="" width="1000" height="1200" loading="lazy" decoding="async"' +
        (opts.view === 'detail' ? ' class="is-detail"' : '') + '>';
    }
    var id = 'pw' + (++uidN);
    var draw = DRAW[p.art];
    var vb = opts.view === 'detail' ? DETAIL[p.art] : '0 0 400 480';
    return '<svg viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">' +
      defs(id) + draw(id, c, p) + '</svg>';
  };

  PW.artLabel = function (prod, colourKey) {
    var p = typeof prod === 'string' ? PW.product(prod) : prod;
    if (!p) { return ''; }
    var key = colourKey && p.colours.indexOf(colourKey) > -1 ? colourKey : p.colours[0];
    return p.name + ' in ' + PW.colours[key].name;
  };
})(window);
