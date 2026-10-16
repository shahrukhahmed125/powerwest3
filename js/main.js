/* ==========================================================================
   P❤w3r main.js (jQuery 3.7.1)
   The bag and the Loved list are saved in this browser (localStorage).
   Checkout and the contact form send through WhatsApp or the visitor's
   own email app. There is no server, no payment and no tracking.
   ========================================================================== */
(function ($, w, d) {
  'use strict';

  var PW = w.PW;
  if (!PW || !$) { return; }

  var CFG = PW.config;
  var BRAND = 'P❤w3r';
  var $doc = $(d);
  var $html = $(d.documentElement);
  var $body;
  var mqReduce = w.matchMedia('(prefers-reduced-motion: reduce)');
  var mqFine = w.matchMedia('(hover: hover) and (pointer: fine)');
  var mqDesk = w.matchMedia('(min-width: 900px)');
  var hasIO = 'IntersectionObserver' in w;
  var HEART = 'M50 92C17 69.92 0 50.6 0 27.6C0 11.04 12 0 27 0C38 0 46 5.52 50 15.64C54 5.52 62 0 73 0C88 0 100 11.04 100 27.6C100 50.6 83 69.92 50 92Z';

  /* ---------- Helpers ---------- */
  function reduced() { return mqReduce.matches; }

  function onMQ(mq, fn) {
    if (mq.addEventListener) { mq.addEventListener('change', fn); } else if (mq.addListener) { mq.addListener(fn); }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function icon(name, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>';
  }

  function loveSvg() {
    return '<svg viewBox="-4 -4 108 100" aria-hidden="true" focusable="false"><path class="love__shape" vector-effect="non-scaling-stroke" d="' + HEART + '"/></svg>';
  }

  function heartOutline(cls) {
    return '<svg class="' + cls + '" viewBox="-3 -3 106 98" aria-hidden="true" focusable="false"><path vector-effect="non-scaling-stroke" d="' + HEART + '"/></svg>';
  }

  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }

  /* The brand name in running text: red heart for sighted readers, "Power" for screen readers */
  var NAME_HTML = '<span class="pw" translate="no"><span aria-hidden="true">P<svg class="pw__heart" viewBox="0 0 100 92" focusable="false"><use href="#i-heart"></use></svg>w3r</span><span class="sr-only">Power</span></span>';
  function brandify(html) { return String(html).replace(/P❤w3r/g, NAME_HTML); }

  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  function qs(name) {
    try { return new URLSearchParams(w.location.search).get(name); } catch (e) { return null; }
  }

  function waLink(text) { return 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(text); }

  function mailLink(subject, body) {
    return 'mailto:' + CFG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function openExternal(url) {
    var a = d.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    d.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
  }

  function replay($el, cls) {
    $el.removeClass(cls);
    if ($el[0]) { void $el[0].offsetWidth; }
    $el.addClass(cls);
  }

  /* ---------- Storage (fails quietly in private modes) ---------- */
  var storage = (function () {
    var ok = false;
    try {
      w.localStorage.setItem('__pw', '1');
      w.localStorage.removeItem('__pw');
      ok = true;
    } catch (e) { ok = false; }
    return {
      get: function (key, fallback) {
        if (!ok) { return fallback; }
        try { var v = w.localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
      },
      set: function (key, val) {
        if (!ok) { return; }
        try { w.localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage full or blocked */ }
      },
      raw: function (key, val) {
        if (!ok) { return null; }
        try {
          if (val === undefined) { return w.localStorage.getItem(key); }
          w.localStorage.setItem(key, val);
        } catch (e) { return null; }
        return val;
      }
    };
  })();

  /* ---------- Bag ---------- */
  var Bag = {
    KEY: 'pw-bag-v1',
    items: [],
    load: function () {
      var raw = storage.get(this.KEY, []);
      this.items = (Array.isArray(raw) ? raw : []).filter(function (it) {
        var p = it && PW.product(it.id);
        return p && p.colours.indexOf(it.colour) > -1 && p.sizes.indexOf(it.size) > -1;
      }).map(function (it) {
        return { id: it.id, colour: it.colour, size: it.size, qty: clamp(parseInt(it.qty, 10) || 1, 1, 10) };
      });
    },
    save: function () { storage.set(this.KEY, this.items); $doc.trigger('pw:bag'); },
    key: function (it) { return it.id + '|' + it.colour + '|' + it.size; },
    find: function (key) {
      for (var i = 0; i < this.items.length; i++) { if (this.key(this.items[i]) === key) { return i; } }
      return -1;
    },
    add: function (id, colour, size, qty) {
      var item = { id: id, colour: colour, size: size, qty: qty || 1 };
      var i = this.find(this.key(item));
      if (i > -1) { this.items[i].qty = clamp(this.items[i].qty + item.qty, 1, 10); } else { this.items.push(item); }
      this.save();
    },
    setQty: function (key, qty) {
      var i = this.find(key);
      if (i < 0) { return; }
      this.items[i].qty = clamp(qty, 1, 10);
      this.save();
    },
    remove: function (key) {
      var i = this.find(key);
      if (i < 0) { return null; }
      var removed = { item: this.items.splice(i, 1)[0], index: i };
      this.save();
      return removed;
    },
    restore: function (r) {
      if (!r) { return; }
      this.items.splice(Math.min(r.index, this.items.length), 0, r.item);
      this.save();
    },
    clear: function () { this.items = []; this.save(); },
    count: function () { return this.items.reduce(function (n, it) { return n + it.qty; }, 0); },
    total: function () { return this.items.reduce(function (n, it) { return n + PW.product(it.id).price * it.qty; }, 0); }
  };

  /* ---------- Loved list ---------- */
  var Love = {
    KEY: 'pw-loved-v1',
    ids: [],
    load: function () {
      var raw = storage.get(this.KEY, []);
      this.ids = (Array.isArray(raw) ? raw : []).filter(function (id) { return !!PW.product(id); });
    },
    has: function (id) { return this.ids.indexOf(id) > -1; },
    toggle: function (id) {
      var i = this.ids.indexOf(id);
      if (i > -1) { this.ids.splice(i, 1); } else { this.ids.push(id); }
      storage.set(this.KEY, this.ids);
      $doc.trigger('pw:love');
      return i < 0;
    }
  };

  Bag.load();
  Love.load();

  /* Keep tabs in sync */
  w.addEventListener('storage', function (e) {
    if (e.key === Bag.KEY) { Bag.load(); $doc.trigger('pw:bag'); }
    if (e.key === Love.KEY) { Love.load(); $doc.trigger('pw:love'); }
  });

  /* ---------- Artwork ---------- */
  function paintArt(scope) {
    $(scope || d).find('[data-art]').each(function () {
      var $a = $(this);
      if ($a.data('painted')) { return; }
      $a.html(PW.art($a.attr('data-art'), $a.attr('data-colour'), { view: $a.attr('data-view') }));
      $a.data('painted', true);
    });
  }

  function swapArt($a, id, colour, view) {
    if (!$a.length) { return; }
    var html = PW.art(id, colour, { view: view });
    $a.attr('data-colour', colour);
    if ($a.is('[role="img"]')) { $a.attr('aria-label', PW.artLabel(id, colour)); }
    if (reduced() || !$a.children('svg, img').length) { $a.html(html); return; }
    var $old = $a.children('svg, img').addClass('is-leaving');
    var $new = $(html).addClass('is-entering');
    $a.append($new);
    w.setTimeout(function () { $old.remove(); $new.removeClass('is-entering'); }, 380);
  }

  /* ---------- Counts ---------- */
  function syncCounts(animate) {
    var n = Bag.count();
    var l = Love.ids.length;
    $('[data-bag-count]').text(n).toggleClass('is-empty', n === 0);
    $('[data-bag-btn]').attr('aria-label', 'Bag, ' + plural(n, 'item', 'items'));
    $('[data-loved-count]').text(l).toggleClass('is-empty', l === 0);
    $('[data-loved-link]').attr('aria-label', 'Loved, ' + plural(l, 'item', 'items'));
    if (animate && !reduced()) { replay($('[data-bag-btn]'), 'is-bump'); }
  }

  function syncLove(scope) {
    $(scope || d).find('[data-love]').each(function () {
      $(this).attr('aria-pressed', Love.has($(this).attr('data-love')) ? 'true' : 'false');
    });
  }

  /* ---------- Toast ---------- */
  var toastTimer = null;
  var toastAction = null;

  function toast(msg, actionLabel, actionFn) {
    var $t = $('[data-toast]');
    $t.find('.toast__msg').text(msg);
    $t.find('.toast__action').text(actionLabel || '');
    toastAction = actionFn || null;
    $t.addClass('is-on');
    $t.data('wait', actionLabel ? 6500 : 3400);
    armToast();
  }

  function armToast() {
    var $t = $('[data-toast]');
    w.clearTimeout(toastTimer);
    toastTimer = w.setTimeout(function () { $t.removeClass('is-on'); toastAction = null; }, $t.data('wait') || 3400);
  }

  /* ---------- Chrome (bag drawer, scrim, toast) ---------- */
  function buildChrome() {
    $body.append(
      '<div class="scrim" data-scrim></div>' +
      '<div class="drawer" id="bag" role="dialog" aria-modal="true" aria-labelledby="bag-title" tabindex="-1" inert>' +
        '<div class="drawer__head">' +
          '<h2 class="drawer__title" id="bag-title">Bag <small data-bag-summary></small></h2>' +
          '<button class="icon-btn" type="button" data-bag-close aria-label="Close bag">' + icon('close') + '</button>' +
        '</div>' +
        '<div class="drawer__body" data-bag-body></div>' +
        '<div class="drawer__foot" data-bag-foot hidden></div>' +
      '</div>' +
      '<div class="toast" data-toast role="status" aria-live="polite"><p class="toast__msg"></p><button class="toast__action" type="button"></button></div>'
    );
  }

  function upsellHTML() {
    var inBag = Bag.items.map(function (it) { return it.id; });
    var picks = PW.products.filter(function (p) {
      return p.sizes.length === 1 && inBag.indexOf(p.id) < 0;
    }).sort(function (a, b) { return a.price - b.price; }).slice(0, 2);
    if (!picks.length) { return ''; }
    return '<div class="upsell"><p class="upsell__title">Add a little extra</p><ul class="upsell__list">' +
      picks.map(function (p) {
        return '<li class="upsell__item">' +
          '<span class="upsell__art"><span class="art" data-art="' + p.id + '" data-colour="' + p.colours[0] + '"></span></span>' +
          '<div><p class="upsell__name">' + esc(p.name) + '</p><span class="small muted price">' + PW.money(p.price) + '</span></div>' +
          '<button class="btn btn--sm btn--ghost btn--plain" type="button" data-upsell="' + p.id + '" aria-label="Add ' + esc(p.name) + ' to bag">Add</button>' +
        '</li>';
      }).join('') + '</ul></div>';
  }

  function renderBag() {
    var $b = $('[data-bag-body]');
    var $foot = $('[data-bag-foot]');
    if (!$b.length) { return; }
    var n = Bag.count();
    $('[data-bag-summary]').text(n ? plural(n, 'item', 'items') : '');

    if (!n) {
      $b.html(
        '<div class="bag-empty">' + heartOutline('bag-empty__heart') +
          '<h3>Your bag is empty</h3>' +
          '<p>Find something you love. Your bag stays saved on this device.</p>' +
          '<a class="btn" href="shop.html"><span>Shop the drop</span><span class="btn__icon">' + icon('arrow') + '</span></a>' +
        '</div>'
      );
      $foot.prop('hidden', true).empty();
      return;
    }

    var lines = Bag.items.map(function (it) {
      var p = PW.product(it.id);
      var c = PW.colours[it.colour];
      var key = Bag.key(it);
      var href = 'product.html?id=' + p.id + '&amp;colour=' + it.colour;
      var variant = c.name + (it.size !== 'One size' ? ', ' + it.size : '');
      return '<li class="bag-line" data-key="' + esc(key) + '">' +
        '<a class="bag-line__art" href="' + href + '" tabindex="-1" aria-hidden="true"><span class="art" data-art="' + p.id + '" data-colour="' + it.colour + '"></span></a>' +
        '<div>' +
          '<div class="bag-line__top"><a class="bag-line__name" href="' + href + '">' + esc(p.name) + '</a><span class="price">' + PW.money(p.price * it.qty, true) + '</span></div>' +
          '<p class="bag-line__meta">' + esc(variant) + ' / ' + PW.money(p.price) + ' each</p>' +
          '<div class="bag-line__bottom">' +
            '<div class="qty" role="group" aria-label="Quantity of ' + esc(p.name) + '">' +
              '<button type="button" data-qty="-1" aria-label="Remove one"' + (it.qty <= 1 ? ' aria-disabled="true"' : '') + '>' + icon('minus') + '</button>' +
              '<output>' + it.qty + '</output>' +
              '<button type="button" data-qty="1" aria-label="Add one"' + (it.qty >= 10 ? ' aria-disabled="true"' : '') + '>' + icon('plus') + '</button>' +
            '</div>' +
            '<button class="text-btn" type="button" data-remove aria-label="Remove ' + esc(p.name + ', ' + variant) + ' from bag">Remove</button>' +
          '</div>' +
        '</div>' +
      '</li>';
    }).join('');

    $b.html('<ul class="bag-list">' + lines + '</ul>' + upsellHTML());
    paintArt($b);
    $foot.prop('hidden', false).html(
      '<div class="totals">' +
        '<div class="totals__row totals__row--big"><span>Subtotal</span><span class="price">' + PW.money(Bag.total(), true) + '</span></div>' +
        '<p class="totals__note">Delivery is confirmed when we reply to your order. Nothing is charged on this site.</p>' +
      '</div>' +
      '<a class="btn btn--accent btn--block" href="checkout.html" data-magnetic><span>Checkout</span><span class="btn__icon">' + icon('arrow') + '</span></a>' +
      '<div class="drawer__alt"><button type="button" data-bag-close>Keep shopping</button></div>'
    );
  }

  var lastFocus = null;
  var pendingFocus = null;

  /* The mobile buy bar is only reachable while it is showing */
  function syncBuybarInert() {
    $('[data-buybar]').each(function () {
      if ($(this).hasClass('is-on')) { this.removeAttribute('inert'); } else { this.setAttribute('inert', ''); }
    });
  }

  function applyPendingFocus() {
    if (!pendingFocus) { return; }
    var f = pendingFocus;
    pendingFocus = null;
    if (f.close) { $('#bag [data-bag-close]').first().trigger('focus'); return; }
    var $line = $('#bag [data-key]').filter(function () { return $(this).attr('data-key') === f.key; });
    var $t = $line.find(f.sel).first();
    if ($t.attr('aria-disabled') === 'true') { $t = $line.find('[data-qty]').not('[aria-disabled="true"]').first(); }
    if ($t.length) { $t.trigger('focus'); } else { $('#bag [data-bag-close]').first().trigger('focus'); }
  }

  function openBag() {
    closeMenu(false);
    closeQuick(false);
    renderBag();
    var $dr = $('#bag');
    if (!$dr.hasClass('is-open')) { lastFocus = d.activeElement; }
    $dr.removeAttr('inert').addClass('is-open');
    $('[data-scrim]').addClass('is-on');
    $body.addClass('is-locked');
    $('[data-inertable], [data-buybar], main').attr('inert', '');
    $('[data-bag-open]').attr('aria-expanded', 'true');
    w.setTimeout(function () { $dr.find('[data-bag-close]').first().trigger('focus'); }, 80);
  }

  function closeBag() {
    var $dr = $('#bag');
    if (!$dr.hasClass('is-open')) { return; }
    $dr.removeClass('is-open').attr('inert', '');
    $('[data-scrim]').removeClass('is-on');
    $body.removeClass('is-locked');
    $('[data-inertable], main').removeAttr('inert');
    syncBuybarInert();
    $('[data-bag-open]').attr('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus && d.contains(lastFocus)) { lastFocus.focus(); }
    lastFocus = null;
  }

  /* ---------- Mobile menu ---------- */
  function openMenu() {
    var $m = $('#menu');
    if (!$m.length) { return; }
    $m.removeAttr('inert').addClass('is-open');
    $('[data-menu-toggle]').attr('aria-expanded', 'true').find('.sr-only').text('Close menu');
    $body.addClass('is-locked');
    $('main, .footer, .wa-float, .buybar').attr('inert', '');
    $('.site-header').removeClass('is-hidden');
    w.setTimeout(function () { $m.find('a').first().trigger('focus'); }, 90);
  }

  function closeMenu(returnFocus) {
    var $m = $('#menu');
    if (!$m.hasClass('is-open')) { return; }
    $m.removeClass('is-open').attr('inert', '');
    $('[data-menu-toggle]').attr('aria-expanded', 'false').find('.sr-only').text('Open menu');
    $body.removeClass('is-locked');
    $('main, .footer, .wa-float').removeAttr('inert');
    syncBuybarInert();
    if (returnFocus) { $('[data-menu-toggle]').trigger('focus'); }
  }

  /* ---------- Theme ---------- */
  function themeNow() {
    var t = $html.attr('data-theme');
    if (t) { return t; }
    return w.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncTheme() {
    var dark = themeNow() === 'dark';
    if ($html.attr('data-theme')) {
      $('meta[name="theme-color"]').attr('content', dark ? '#121316' : '#F4F4F1');
    }
    $('[data-theme-toggle]').each(function () {
      var $b = $(this);
      $b.attr('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      $b.find('use').attr('href', dark ? '#i-sun' : '#i-moon');
      $b.find('[data-theme-label]').text(dark ? 'Light mode' : 'Dark mode');
    });
  }

  /* ---------- Scroll engine: one passive listener, one frame ---------- */
  var scrollers = [];
  var resizers = [];
  var ticking = false;

  /* Each scroller reads layout and returns a function that writes styles.
     All reads run first, then all writes, so layout happens once per frame. */
  function frame() {
    ticking = false;
    var y = w.pageYOffset;
    var writes = [];
    for (var i = 0; i < scrollers.length; i++) {
      var write = scrollers[i](y);
      if (typeof write === 'function') { writes.push(write); }
    }
    for (var j = 0; j < writes.length; j++) { writes[j](); }
  }

  function requestTick() {
    if (!ticking) { ticking = true; w.requestAnimationFrame(frame); }
  }

  /* ---------- Reveal, counters ---------- */
  var revealIO = null;

  function runCounter(el) {
    var to = parseFloat(el.getAttribute('data-count'));
    var from = parseFloat(el.getAttribute('data-from') || '0');
    if (reduced()) { el.textContent = to; return; }
    var dur = 1700;
    var start = null;
    function step(ts) {
      if (!start) { start = ts; }
      var t = Math.min(1, (ts - start) / dur);
      var e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = Math.round(from + (to - from) * e);
      if (t < 1) { w.requestAnimationFrame(step); }
    }
    w.requestAnimationFrame(step);
  }

  function reveal(el) {
    $(el).addClass('is-in');
    if (el.hasAttribute('data-count')) { runCounter(el); }
  }

  function observeReveals(scope) {
    var $els = $(scope || d).find('[data-reveal], [data-lines], [data-count], [data-glitch]').filter(function () {
      return !$(this).data('watched');
    });
    $els.each(function () {
      $(this).data('watched', true);
      if (this.hasAttribute('data-count') && !reduced()) { this.textContent = this.getAttribute('data-from') || '0'; }
      if (revealIO) { revealIO.observe(this); } else { reveal(this); }
    });
  }

  /* ---------- Buybox (home spotlight + product page) ---------- */
  var boxN = 0;

  function buyboxHTML(p, colour) {
    var n = ++boxN;
    var single = p.sizes.length === 1;
    var swatches = p.colours.map(function (k) {
      var c = PW.colours[k];
      return '<label class="swatch" title="' + esc(c.name) + '">' +
        '<input class="sr-only" type="radio" name="colour-' + n + '" value="' + k + '"' + (k === colour ? ' checked' : '') + '>' +
        '<span class="swatch__dot" style="--sw:' + c.base + '"></span><span class="sr-only">' + esc(c.name) + '</span></label>';
    }).join('');
    var sizes = single ? '' :
      '<fieldset class="opt" data-opt="size">' +
        '<legend class="opt__label">Size <span data-size-label>Choose a size</span></legend>' +
        '<div class="opt__row">' + p.sizes.map(function (s) {
          return '<label class="size"><input class="sr-only" type="radio" name="size-' + n + '" value="' + esc(s) + '"><span>' + esc(s) + '</span></label>';
        }).join('') + '</div>' +
        '<p class="opt-error" role="alert" hidden>' + icon('warning') + 'Choose a size to add this to your bag.</p>' +
      '</fieldset>';
    return '<form class="buybox" novalidate data-buybox-form data-id="' + p.id + '">' +
      '<fieldset class="opt" data-opt="colour"><legend class="opt__label">Colour <span data-colour-label>' + esc(PW.colours[colour].name) + '</span></legend>' +
        '<div class="opt__row">' + swatches + '</div></fieldset>' +
      sizes +
      (single ? '<p class="opt__label opt__label--note">Size <span>One size</span></p>' : '') +
      '<div class="buybox__actions">' +
        '<button class="btn btn--accent" type="submit" data-add data-magnetic><span data-add-label>Add to bag</span><span class="btn__icon">' + icon('bag') + '</span></button>' +
        '<button class="love love--inline" type="button" data-love="' + p.id + '" aria-pressed="' + (Love.has(p.id) ? 'true' : 'false') + '" aria-label="Love ' + esc(p.name) + '">' + loveSvg() + '</button>' +
      '</div>' +
    '</form>';
  }

  function addFromForm($f, p) {
    var colour = $f.find('input[name^="colour"]:checked').val() || p.colours[0];
    var size = p.sizes.length === 1 ? p.sizes[0] : $f.find('input[name^="size"]:checked').val();
    if (!size) {
      var $opt = $f.find('[data-opt="size"]');
      $opt.removeClass('is-invalid');
      void $opt[0].offsetWidth;
      $opt.addClass('is-invalid');
      $f.find('.opt-error').prop('hidden', false);
      $f.find('input[name^="size"]').first().trigger('focus');
      return false;
    }
    Bag.add(p.id, colour, size, 1);
    var $btn = $f.find('[data-add]');
    $btn.addClass('is-done').find('[data-add-label]').text('Added');
    $btn.find('use').attr('href', '#i-check');
    w.setTimeout(function () {
      $btn.removeClass('is-done').find('[data-add-label]').text('Add to bag');
      $btn.find('use').attr('href', '#i-bag');
    }, 1800);
    openBag();
    return true;
  }

  function mountBuybox($host, p, colour, onColour) {
    $host.html(buyboxHTML(p, colour));
    var $f = $host.find('form');
    $f.on('change', 'input[name^="colour"]', function () {
      $f.find('[data-colour-label]').text(PW.colours[this.value].name);
      if (onColour) { onColour(this.value); }
    });
    $f.on('change', 'input[name^="size"]', function () {
      $f.find('[data-size-label]').text(this.value);
      $f.find('[data-opt="size"]').removeClass('is-invalid');
      $f.find('.opt-error').prop('hidden', true);
    });
    $f.on('submit', function (e) { e.preventDefault(); addFromForm($f, p); });
    return $f;
  }

  /* ---------- Product cards ---------- */
  function cardHTML(p, i) {
    var colour = p.colours[0];
    var single = p.sizes.length === 1;
    var dots = p.colours.map(function (k, j) {
      var c = PW.colours[k];
      return '<button type="button" class="dot-btn" data-dot="' + k + '" aria-pressed="' + (j === 0 ? 'true' : 'false') + '" aria-label="Show ' + esc(c.name) + '"><span style="--sw:' + c.base + '"></span></button>';
    }).join('');
    var sizes = single ? '' :
      '<div class="quick-sizes" id="qs-' + p.id + '" data-quick-panel role="group" aria-label="Choose a size for ' + esc(p.name) + '">' +
        '<div class="quick-sizes__head"><span>Choose a size</span><button class="icon-btn" type="button" data-quick-close aria-label="Close sizes">' + icon('close') + '</button></div>' +
        '<div class="quick-sizes__row">' + p.sizes.map(function (s) {
          return '<button type="button" data-quick-size="' + esc(s) + '">' + esc(s) + '</button>';
        }).join('') + '</div>' +
      '</div>';
    return '<li class="card" data-card="' + p.id + '" data-colour="' + colour + '" data-reveal style="--i:' + (i % 4) + '">' +
      '<div class="card__media">' +
        '<div class="art" data-art="' + p.id + '" data-colour="' + colour + '"></div>' +
      '</div>' +
      '<div class="card__overlay">' +
        '<button class="love" type="button" data-love="' + p.id + '" aria-pressed="' + (Love.has(p.id) ? 'true' : 'false') + '" aria-label="Love ' + esc(p.name) + '">' + loveSvg() + '</button>' +
        '<div class="card__quick"><button class="quick-btn" type="button" data-quick' + (single ? '' : ' aria-expanded="false" aria-controls="qs-' + p.id + '"') + '>' +
          icon(single ? 'bag' : 'plus') + '<span class="quick-btn__label">' + (single ? 'Add' : 'Quick add') + '</span><span class="sr-only"> ' + esc(p.name) + '</span></button></div>' +
        sizes +
      '</div>' +
      '<div class="card__body">' +
        '<h3 class="card__title"><a href="product.html?id=' + p.id + '" data-card-link>' + esc(p.name) + '</a></h3>' +
        '<p class="card__price price">' + PW.money(p.price) + '</p>' +
        '<div class="card__meta">' +
          (p.colours.length > 1 ? '<div class="card__dots" role="group" aria-label="Colours for ' + esc(p.name) + '">' + dots + '</div>' : '') +
          '<span>' + plural(p.colours.length, 'colour', 'colours') + '</span>' +
        '</div>' +
      '</div>' +
    '</li>';
  }

  function closeQuick(returnFocus) {
    $('[data-quick-panel].is-open').each(function () {
      var $c = $(this).closest('[data-card]');
      $(this).removeClass('is-open');
      var $q = $c.find('[data-quick]').attr('aria-expanded', 'false');
      if (returnFocus) { $q.trigger('focus'); }
    });
  }

  function mountCards($list, products) {
    $list.html(products.map(cardHTML).join(''));
    paintArt($list);
    observeReveals($list);
  }

  /* ---------- Shop page ---------- */
  function initShop() {
    var $grid = $('[data-shop-grid]');
    if (!$grid.length) { return; }
    var state = {
      cat: qs('cat') || 'all',
      loved: qs('view') === 'loved',
      sort: qs('sort') || 'featured'
    };
    if (state.cat !== 'all' && !PW.category(state.cat)) { state.cat = 'all'; }
    var $chips = $('[data-shop-chips]');
    var $sort = $('[data-shop-sort]');
    var $status = $('[data-shop-status]');
    var $empty = $('[data-shop-empty]');
    var $title = $('[data-shop-title]');
    var baseTitle = d.title;

    var chips = '<button class="chip" type="button" data-cat="all">All <span class="chip__n">' + PW.products.length + '</span></button>';
    PW.categories.forEach(function (c) {
      var n = PW.products.filter(function (p) { return p.cat === c.id; }).length;
      chips += '<button class="chip" type="button" data-cat="' + c.id + '">' + esc(c.name) + ' <span class="chip__n">' + n + '</span></button>';
    });
    $chips.html(chips);
    $sort.val(state.sort);
    if (!$sort.val()) { state.sort = 'featured'; $sort.val('featured'); }

    var sorters = {
      featured: function (a, b) { return a.featured - b.featured; },
      'price-asc': function (a, b) { return a.price - b.price || a.featured - b.featured; },
      'price-desc': function (a, b) { return b.price - a.price || a.featured - b.featured; },
      name: function (a, b) { return a.name.localeCompare(b.name); }
    };

    function syncUrl() {
      var parts = [];
      if (state.loved) { parts.push('view=loved'); } else if (state.cat !== 'all') { parts.push('cat=' + state.cat); }
      if (state.sort !== 'featured') { parts.push('sort=' + state.sort); }
      try { w.history.replaceState(null, '', 'shop.html' + (parts.length ? '?' + parts.join('&') : '')); } catch (e) { /* file:// may refuse */ }
    }

    function render() {
      $chips.find('[data-cat]').each(function () {
        $(this).attr('aria-pressed', (!state.loved && $(this).attr('data-cat') === state.cat) ? 'true' : 'false');
      });
      $('[data-shop-loved]').attr('aria-pressed', state.loved ? 'true' : 'false');
      $('[data-shop-loved] .chip__n').text(Love.ids.length);

      var list = PW.products.filter(function (p) {
        if (state.loved) { return Love.has(p.id); }
        return state.cat === 'all' || p.cat === state.cat;
      }).sort(sorters[state.sort] || sorters.featured);

      var cat = PW.category(state.cat);
      var heading = state.loved ? 'Loved' : (cat ? cat.name : 'Shop');
      $title.text(heading);
      d.title = (state.loved || cat) ? heading + ' | Shop ' + BRAND : baseTitle;

      var n = list.length;
      var status = state.loved ? plural(n, 'loved piece', 'loved pieces') :
        (cat ? plural(n, cat.one.toLowerCase(), cat.name.toLowerCase()) : 'All ' + plural(n, 'piece', 'pieces'));
      $status.text(status);

      if (!n) {
        $grid.empty();
        $empty.prop('hidden', false);
      } else {
        $empty.prop('hidden', true);
        mountCards($grid, list);
      }
      syncUrl();
    }

    $chips.on('click', '[data-cat]', function () {
      state.cat = $(this).attr('data-cat');
      state.loved = false;
      render();
    });
    $('[data-shop-loved]').on('click', function () {
      state.loved = !state.loved;
      render();
    });
    $sort.on('change', function () { state.sort = $(this).val(); render(); });
    $doc.on('click', '[data-shop-reset]', function () {
      state.cat = 'all';
      state.loved = false;
      render();
      $chips.find('[data-cat="all"]').trigger('focus');
    });
    $doc.on('pw:love', function () {
      $('[data-shop-loved] .chip__n').text(Love.ids.length);
      if (state.loved) { render(); }
    });

    render();
  }

  /* ---------- Product page ---------- */
  function setMeta(selector, attr, value) { $(selector).attr(attr, value); }

  function initProduct() {
    var $root = $('[data-pdp]');
    if (!$root.length) { return; }
    var p = PW.product(qs('id') || '');

    if (!p) {
      d.title = 'Piece not found | ' + BRAND;
      $root.html(
        '<div class="empty notfound-product">' + heartOutline('') +
          '<h1 class="display t-48">We can’t find that piece</h1>' +
          '<p>The link may be old, or the piece may have sold out. Everything we have right now is in the shop.</p>' +
          '<a class="btn" href="shop.html"><span>Shop the drop</span><span class="btn__icon">' + icon('arrow') + '</span></a>' +
        '</div>'
      );
      $('[data-related-wrap], [data-buybar]').remove();
      return;
    }

    var colour = qs('colour');
    if (p.colours.indexOf(colour) < 0) { colour = p.colours[0]; }
    var cat = PW.category(p.cat);
    var view = 'front';
    var url = CFG.site + 'product.html?id=' + p.id;

    d.title = p.name + ' | ' + BRAND + ' Official Store';
    setMeta('meta[name="description"]', 'content', p.desc);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:title"]', 'content', p.name + ' | ' + BRAND);
    setMeta('meta[property="og:description"]', 'content', p.desc);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[name="twitter:title"]', 'content', p.name + ' | ' + BRAND);
    setMeta('meta[name="twitter:description"]', 'content', p.desc);

    var schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          name: p.name,
          description: p.desc,
          sku: p.id,
          category: cat ? cat.name : '',
          brand: { '@type': 'Brand', name: BRAND },
          image: CFG.site + 'images/og-image.png',
          url: url,
          offers: {
            '@type': 'Offer',
            priceCurrency: CFG.currency,
            price: p.price.toFixed(2),
            availability: 'https://schema.org/InStock',
            url: url,
            seller: { '@type': 'Organization', name: BRAND }
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: CFG.site },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: CFG.site + 'shop.html' },
            { '@type': 'ListItem', position: 3, name: cat ? cat.name : 'Shop', item: CFG.site + 'shop.html?cat=' + p.cat },
            { '@type': 'ListItem', position: 4, name: p.name, item: url }
          ]
        }
      ]
    };
    $('<script type="application/ld+json"></script>').text(JSON.stringify(schema)).appendTo('head');

    var details = '<ul>' + p.details.map(function (x) { return '<li>' + brandify(esc(x)) + '</li>'; }).join('') + '</ul>';
    $root.html(
      '<nav class="crumbs" aria-label="Breadcrumb"><ol>' +
        '<li><a href="index.html">Home</a></li><li><a href="shop.html">Shop</a></li>' +
        '<li><a href="shop.html?cat=' + p.cat + '">' + esc(cat ? cat.name : 'Shop') + '</a></li>' +
        '<li aria-current="page">' + esc(p.name) + '</li></ol></nav>' +
      '<div class="pdp__grid">' +
        '<div class="pdp__gallery">' +
          '<div class="shell pdp__main"><div class="shell__core shell__core--plinth">' +
            '<div class="art" data-pdp-art role="img" aria-label="' + esc(PW.artLabel(p, colour)) + '" data-art="' + p.id + '" data-colour="' + colour + '"></div>' +
          '</div></div>' +
          '<div class="pdp__views" role="group" aria-label="Choose a view">' +
            '<button class="view-btn" type="button" data-view-btn="front" aria-pressed="true" aria-label="Full view"><span class="art" data-art="' + p.id + '" data-colour="' + colour + '"></span></button>' +
            '<button class="view-btn" type="button" data-view-btn="detail" aria-pressed="false" aria-label="Close-up"><span class="art" data-art="' + p.id + '" data-colour="' + colour + '" data-view="detail"></span></button>' +
          '</div>' +
        '</div>' +
        '<div class="pdp__info">' +
          '<p class="pdp__cat"><a class="link" href="shop.html?cat=' + p.cat + '">' + esc(cat ? cat.name : 'Shop') + '</a></p>' +
          '<h1 class="pdp__title display">' + esc(p.name) + '</h1>' +
          '<p class="pdp__price price">' + PW.money(p.price) + '</p>' +
          '<p class="pdp__desc lede">' + brandify(esc(p.desc)) + '</p>' +
          '<div data-pdp-buy></div>' +
          '<p class="pdp__fit">' + esc(p.fit) + ' <a href="contact.html?topic=sizing#contact-form">Ask us about sizing</a></p>' +
          '<ul class="perks buybox__perks">' +
            '<li>' + icon('chat') + '<span>Order through WhatsApp or email. We reply to confirm stock, delivery and payment.</span></li>' +
            '<li>' + icon('truck') + '<span>UK and worldwide delivery. The cost is confirmed before you pay.</span></li>' +
            '<li>' + icon('shield') + '<span>The only official ' + NAME_HTML + ' store. We never DM you asking for money.</span></li>' +
          '</ul>' +
          '<div class="acc pdp__more">' +
            '<details open><summary><span>Details</span><span class="acc__mark" aria-hidden="true"></span></summary><div class="acc__body">' + details + '</div></details>' +
            '<details><summary><span>Delivery and returns</span><span class="acc__mark" aria-hidden="true"></span></summary><div class="acc__body"><p>We deliver across the UK and worldwide. Delivery cost and timing are confirmed in our reply to your order, before you pay.</p><p>You can return unworn items within 14 days of delivery. Message us first and we’ll tell you where to send them.</p></div></details>' +
            '<details><summary><span>Care</span><span class="acc__mark" aria-hidden="true"></span></summary><div class="acc__body"><p>' + esc(p.care) + '</p></div></details>' +
            '<details><summary><span>How ordering works</span><span class="acc__mark" aria-hidden="true"></span></summary><div class="acc__body"><p>Add pieces to your bag, then send your order from the checkout on WhatsApp or by email. We reply with the total including delivery and how to pay. Nothing is charged on this site.</p></div></details>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    paintArt($root);

    var $main = $root.find('[data-pdp-art]');
    var $form = mountBuybox($root.find('[data-pdp-buy]'), p, colour, function (k) {
      colour = k;
      swapArt($main, p.id, k, view === 'detail' ? 'detail' : '');
      $root.find('[data-view-btn]').each(function () {
        swapArt($(this).find('.art'), p.id, k, $(this).attr('data-view-btn') === 'detail' ? 'detail' : '');
      });
      try { w.history.replaceState(null, '', 'product.html?id=' + p.id + '&colour=' + k); } catch (e) { /* file:// */ }
    });

    $root.on('click', '[data-view-btn]', function () {
      view = $(this).attr('data-view-btn');
      $root.find('[data-view-btn]').attr('aria-pressed', 'false');
      $(this).attr('aria-pressed', 'true');
      swapArt($main, p.id, colour, view === 'detail' ? 'detail' : '');
    });

    /* Related pieces: same category first, then the rest by featured order */
    var related = PW.products.filter(function (x) { return x.id !== p.id && x.cat === p.cat; })
      .concat(PW.products.filter(function (x) { return x.id !== p.id && x.cat !== p.cat; }).sort(function (a, b) { return a.featured - b.featured; }))
      .slice(0, 4);
    mountCards($('[data-related]'), related);

    /* Mobile buy bar */
    var $bar = $('[data-buybar]');
    if ($bar.length) {
      $bar.find('[data-buybar-name]').text(p.name);
      $bar.find('[data-buybar-price]').text(PW.money(p.price));
      $bar.attr('inert', '');
      $bar.on('click', '[data-buybar-add]', function () { addFromForm($form, p); });
      if (hasIO) {
        var barIO = new IntersectionObserver(function (entries) {
          var visible = entries[0].isIntersecting;
          var on = !visible && !mqDesk.matches;
          $bar.toggleClass('is-on', on);
          if (!$body.hasClass('is-locked')) { syncBuybarInert(); }
          $body.toggleClass('has-buybar', on);
        });
        barIO.observe($form.find('.buybox__actions')[0]);
      }
    }
  }

  /* ---------- Checkout ---------- */
  var checkoutOn = false;
  var sentRef = null;

  function renderCheckoutSummary() {
    var n = Bag.count();
    $('[data-co-empty]').prop('hidden', n > 0 || !!sentRef);
    $('[data-co-main]').prop('hidden', n === 0 && !sentRef);
    $('[data-co-summary-wrap]').prop('hidden', n === 0);
    if (!n) { return; }
    var lines = Bag.items.map(function (it) {
      var p = PW.product(it.id);
      var c = PW.colours[it.colour];
      return '<li class="co-line">' +
        '<span class="co-line__art"><span class="art" data-art="' + p.id + '" data-colour="' + it.colour + '"></span></span>' +
        '<div><p class="co-line__name">' + esc(p.name) + '</p><p class="co-line__meta">' + esc(c.name + (it.size !== 'One size' ? ', ' + it.size : '')) + ' / Qty ' + it.qty + '</p></div>' +
        '<span class="price">' + PW.money(p.price * it.qty, true) + '</span>' +
      '</li>';
    }).join('');
    $('[data-co-lines]').html(lines);
    paintArt($('[data-co-lines]'));
    $('[data-co-count]').text(plural(n, 'item', 'items'));
    $('[data-co-subtotal]').text(PW.money(Bag.total(), true));
  }

  function fieldError($i, msg) {
    var $e = $('#' + $i.attr('id') + '-error');
    $e.html(msg ? icon('warning') + esc(msg) : '');
    $i.attr('aria-invalid', msg ? 'true' : 'false');
  }

  function validateForm($f) {
    var $first = null;
    $f.find('[data-required]').each(function () {
      var $i = $(this);
      var v = $.trim($i.val());
      var msg = '';
      if (!v) {
        msg = $i.attr('data-required');
      } else if ($i.attr('type') === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        msg = 'Enter an email address like name@example.com.';
      }
      fieldError($i, msg);
      if (msg && !$first) { $first = $i; }
    });
    $f.find('input[type="tel"]').each(function () {
      var $i = $(this);
      var v = $.trim($i.val());
      if (v && !/^\+?[0-9 ()-]{7,20}$/.test(v)) {
        fieldError($i, 'Enter a phone number using digits, like +44 7700 900123.');
        if (!$first) { $first = $i; }
      } else if (!$i.is('[data-required]')) {
        fieldError($i, '');
      }
    });
    $f.data('checked', true);
    if ($first) { $first.trigger('focus'); }
    return !$first;
  }

  function liveRevalidate($f) {
    $f.on('input change', 'input, select, textarea', function () {
      var $i = $(this);
      if (!$f.data('checked') || $i.attr('aria-invalid') !== 'true') { return; }
      var v = $.trim($i.val());
      var ok = $i.is('[data-required]') ? !!v : true;
      if (ok && $i.attr('type') === 'email') { ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
      if (ok && $i.attr('type') === 'tel' && v) { ok = /^\+?[0-9 ()-]{7,20}$/.test(v); }
      if (ok) { fieldError($i, ''); }
    });
  }

  function orderRef() {
    var t = Date.now().toString(36).toUpperCase().slice(-5);
    var r = Math.random().toString(36).toUpperCase().slice(2, 4);
    return 'PW3-' + t + r;
  }

  function orderText(ref, f) {
    var lines = Bag.items.map(function (it) {
      var p = PW.product(it.id);
      return it.qty + ' × ' + p.name + ' (' + PW.colours[it.colour].name + (it.size !== 'One size' ? ', ' + it.size : '') + ') ' + PW.money(p.price * it.qty, true);
    });
    return [
      'Hi ' + BRAND + ', I’d like to place an order.',
      'Order ref: ' + ref,
      '',
      lines.join('\n'),
      '',
      'Subtotal: ' + PW.money(Bag.total(), true) + ' (delivery to be confirmed)',
      '',
      'Name: ' + f.name,
      'Email: ' + f.email,
      f.phone ? 'Phone: ' + f.phone : null,
      'Deliver to: ' + [f.address1, f.address2, f.city, f.postcode, f.country].filter(Boolean).join(', '),
      f.notes ? 'Notes: ' + f.notes : null,
      'Please reply by: ' + f.reply
    ].filter(function (x) { return x !== null; }).join('\n');
  }

  function initCheckout() {
    var $co = $('[data-checkout]');
    if (!$co.length) { return; }
    checkoutOn = true;
    var $f = $('[data-co-form]');
    liveRevalidate($f);
    renderCheckoutSummary();

    function send(channel) {
      if (!Bag.count()) { return; }
      if (!validateForm($f)) {
        $('[data-co-status]').text('Some details are missing. Check the highlighted fields.');
        return;
      }
      $('[data-co-status]').text('');
      var f = {
        name: $.trim($('#co-name').val()),
        email: $.trim($('#co-email').val()),
        phone: $.trim($('#co-phone').val()),
        address1: $.trim($('#co-address1').val()),
        address2: $.trim($('#co-address2').val()),
        city: $.trim($('#co-city').val()),
        postcode: $.trim($('#co-postcode').val()),
        country: $('#co-country').val(),
        notes: $.trim($('#co-notes').val()),
        reply: $f.find('input[name="reply"]:checked').val() || 'Email'
      };
      var ref = orderRef();
      var text = orderText(ref, f);
      var url = channel === 'whatsapp' ? waLink(text) : mailLink('Order ' + ref + ' from ' + f.name, text);
      if (channel === 'whatsapp') { openExternal(url); } else { w.location.href = url; }
      sentRef = ref;

      var $done = $('[data-co-done]');
      $done.find('[data-co-ref]').text(ref);
      $done.find('[data-co-channel]').text(channel === 'whatsapp' ? 'WhatsApp' : 'your email app');
      $done.find('[data-co-again]').attr('href', url).find('span').first().text(channel === 'whatsapp' ? 'Open WhatsApp again' : 'Open email again');
      if (channel === 'whatsapp') { $done.find('[data-co-again]').attr({ target: '_blank', rel: 'noopener' }); } else { $done.find('[data-co-again]').removeAttr('target rel'); }
      $done.find('[data-co-message]').val(text);
      $('[data-co-form-wrap]').prop('hidden', true);
      $done.prop('hidden', false);
      $('[data-step="details"]').removeAttr('aria-current').addClass('is-done');
      $('[data-step="send"]').attr('aria-current', 'step');
      w.setTimeout(function () { $done.find('h2').trigger('focus'); }, 60);
    }

    $f.on('submit', function (e) { e.preventDefault(); send('whatsapp'); });
    $doc.on('click', '[data-send]', function () { send($(this).attr('data-send')); });

    $doc.on('click', '[data-co-copy]', function () {
      var text = $('[data-co-message]').val();
      function done() { toast('Order copied. Paste it into WhatsApp or an email to ' + CFG.email + '.'); }
      if (w.navigator.clipboard && w.isSecureContext) {
        w.navigator.clipboard.writeText(text).then(done, function () {
          $('[data-co-message]').trigger('select');
          toast('Select the order text and copy it.');
        });
      } else {
        var ta = $('[data-co-message]')[0];
        ta.select();
        try { d.execCommand('copy'); done(); } catch (e) { toast('Select the order text and copy it.'); }
      }
    });

    $doc.on('click', '[data-co-clear]', function () {
      var $btn = $(this);
      var saved = Bag.items.slice();
      Bag.clear();
      $btn.prop('disabled', true);
      $('[data-co-cleared]').prop('hidden', false);
      toast('Your bag is clear. Thank you for ordering.', 'Undo', function () {
        Bag.items = saved;
        Bag.save();
        $btn.prop('disabled', false);
        $('[data-co-cleared]').prop('hidden', true);
      });
    });

    $doc.on('click', '[data-co-edit]', function () { openBag(); });
  }

  /* ---------- Contact form ---------- */
  function initContact() {
    var $f = $('[data-contact-form]');
    if (!$f.length) { return; }
    liveRevalidate($f);
    var topic = qs('topic');
    if (topic) { $('#ct-topic').val(topic); if (!$('#ct-topic').val()) { $('#ct-topic').val('order'); } }

    function compose(channel) {
      if (!validateForm($f)) {
        $('[data-contact-status]').text('Some details are missing. Check the highlighted fields.');
        return;
      }
      var name = $.trim($('#ct-name').val());
      var email = $.trim($('#ct-email').val());
      var topicLabel = $('#ct-topic option:selected').text();
      var ref = $.trim($('#ct-ref').val());
      var msg = $.trim($('#ct-message').val());
      var body = ['Hi ' + BRAND + ',', '', msg, '', 'Name: ' + name, 'Email: ' + email, ref ? 'Order ref: ' + ref : null]
        .filter(function (x) { return x !== null; }).join('\n');
      if (channel === 'whatsapp') {
        openExternal(waLink(topicLabel + '\n\n' + body));
        $('[data-contact-status]').text('WhatsApp should open with your message ready. Press send there to reach us.');
      } else {
        w.location.href = mailLink(topicLabel + ': message from ' + name, body);
        $('[data-contact-status]').text('Your email app should open with your message ready. Press send there. If nothing opened, email us at ' + CFG.email + '.');
      }
    }

    $f.on('submit', function (e) { e.preventDefault(); compose('email'); });
    $f.on('click', '[data-contact-wa]', function () { compose('whatsapp'); });
  }

  /* ---------- FAQ deep links ---------- */
  function openFromHash() {
    var h = w.location.hash;
    if (!h || h.length < 2) { return; }
    var el = d.getElementById(h.slice(1));
    if (el && el.tagName === 'DETAILS') { el.open = true; }
  }

  /* ---------- Motion modules ---------- */
  function initHero() {
    var $hero = $('.hero');
    if (!$hero.length || reduced()) { return; }
    var hero = $hero[0];
    var pieces = $hero.find('.hero__piece').toArray();
    scrollers.push(function (y) {
      if (y > w.innerHeight * 1.4) { return null; }
      var s = (y * -0.16).toFixed(1) + 'px';
      return function () {
        for (var i = 0; i < pieces.length; i++) { pieces[i].style.setProperty('--hs', s); }
      };
    });
    if (!mqFine.matches) { return; }
    var raf = null;
    var tx = 0;
    var ty = 0;
    $hero.on('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 28;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 20;
      if (raf) { return; }
      raf = w.requestAnimationFrame(function () {
        raf = null;
        for (var i = 0; i < pieces.length; i++) {
          pieces[i].style.setProperty('--hx', tx.toFixed(1) + 'px');
          pieces[i].style.setProperty('--hy', ty.toFixed(1) + 'px');
        }
      });
    });
    $hero.on('pointerleave', function () {
      for (var i = 0; i < pieces.length; i++) {
        pieces[i].style.setProperty('--hx', '0px');
        pieces[i].style.setProperty('--hy', '0px');
      }
    });
  }

  function initParallax() {
    if (reduced()) { return; }
    var items = [];
    $('[data-parallax]').each(function () {
      items.push({ el: this, ref: this.parentNode, speed: parseFloat($(this).attr('data-parallax')) || 0.12 });
    });
    var spins = [];
    $('[data-spin]').each(function () {
      spins.push({ el: this, f: parseFloat($(this).attr('data-spin')) || 0.05, base: parseFloat($(this).attr('data-spin-base')) || 0 });
    });
    if (!items.length && !spins.length) { return; }
    scrollers.push(function (y) {
      var vh = w.innerHeight;
      var values = [];
      for (var i = 0; i < items.length; i++) {
        var r = items[i].ref.getBoundingClientRect();
        if (r.bottom < -300 || r.top > vh + 300) { values.push(null); continue; }
        values.push(((r.top + r.height / 2 - vh / 2) * -items[i].speed).toFixed(1) + 'px');
      }
      return function () {
        for (var k = 0; k < items.length; k++) {
          if (values[k] !== null) { items[k].el.style.setProperty('--py', values[k]); }
        }
        for (var j = 0; j < spins.length; j++) {
          spins[j].el.style.setProperty('--spin', (spins[j].base + y * spins[j].f).toFixed(2) + 'deg');
        }
      };
    });
  }

  function initDecode() {
    var $s = $('[data-decode]');
    if (!$s.length || reduced()) { return; }
    var el = $s[0];
    var stage = 0;
    function set(n) {
      if (n === stage) { return; }
      stage = n;
      el.setAttribute('data-stage', n);
    }
    $s.addClass('is-live');
    set(1);
    scrollers.push(function () {
      var r = el.getBoundingClientRect();
      var total = r.height - w.innerHeight;
      if (r.bottom < 0 || r.top > w.innerHeight || total <= 0) { return null; }
      var p = clamp(-r.top / total, 0, 1);
      return function () { set(p < 0.34 ? 1 : (p < 0.68 ? 2 : 3)); };
    });
  }

  function initRange() {
    var $r = $('[data-range]');
    if (!$r.length) { return; }
    var el = $r[0];
    var track = $r.find('.range__track')[0];
    var dist = 0;
    var pinned = false;

    function measure() {
      var want = mqDesk.matches && !reduced();
      if (!want) {
        if (pinned) {
          pinned = false;
          $r.removeClass('is-pinned');
          el.style.height = '';
          track.style.setProperty('--range-x', '0px');
        }
        return;
      }
      $r.addClass('is-pinned');
      pinned = true;
      dist = Math.max(0, track.scrollWidth - d.documentElement.clientWidth);
      el.style.height = (w.innerHeight + dist) + 'px';
    }

    measure();
    resizers.push(measure);
    scrollers.push(function () {
      if (!pinned) { return null; }
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > w.innerHeight) { return null; }
      var p = dist ? clamp(-r.top / dist, 0, 1) : 0;
      return function () {
        track.style.setProperty('--range-x', (-p * dist).toFixed(1) + 'px');
        el.style.setProperty('--range-p', p.toFixed(4));
      };
    });

    $r.on('focusin', '.tile a', function () {
      if (!pinned || !dist) { return; }
      var tile = $(this).closest('.tile')[0];
      var pad = parseFloat(w.getComputedStyle(track).paddingLeft) || 0;
      var p = clamp((tile.offsetLeft - pad) / dist, 0, 1);
      var top = el.getBoundingClientRect().top + w.pageYOffset;
      w.scrollTo(0, top + p * dist);
    });
  }

  function initMarquee() {
    $('[data-marquee]').each(function () {
      var $m = $(this);
      var $track = $m.find('.marquee__track');
      $track.append($track.children().first().clone().attr('aria-hidden', 'true'));
      $m.on('click', '[data-marquee-toggle]', function () {
        var paused = $m.toggleClass('is-paused').hasClass('is-paused');
        $(this).attr('aria-label', paused ? 'Play scrolling text' : 'Pause scrolling text')
          .find('use').attr('href', paused ? '#i-play' : '#i-pause');
      });
    });
  }

  function initPointerFx() {
    if (!mqFine.matches || reduced()) { return; }
    $doc.on('pointermove', '.card', function (e) {
      var m = this.querySelector('.card__media');
      if (!m) { return; }
      var r = m.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      if (y > 1) { m.style.setProperty('--rx', '0deg'); m.style.setProperty('--ry', '0deg'); return; }
      m.style.setProperty('--px', (x * 100).toFixed(1) + '%');
      m.style.setProperty('--py', (y * 100).toFixed(1) + '%');
      m.style.setProperty('--rx', ((x - 0.5) * 7).toFixed(2) + 'deg');
      m.style.setProperty('--ry', ((0.5 - y) * 7).toFixed(2) + 'deg');
    }).on('pointerleave', '.card', function () {
      var m = this.querySelector('.card__media');
      if (!m) { return; }
      m.style.setProperty('--rx', '0deg');
      m.style.setProperty('--ry', '0deg');
    });
    $doc.on('pointermove', '[data-magnetic]', function (e) {
      var r = this.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      this.style.setProperty('--mx', clamp(dx * 0.18, -8, 8).toFixed(1) + 'px');
      this.style.setProperty('--my', clamp(dy * 0.3, -6, 6).toFixed(1) + 'px');
    }).on('pointerleave', '[data-magnetic]', function () {
      this.style.setProperty('--mx', '0px');
      this.style.setProperty('--my', '0px');
    });
  }

  function initYearRail() {
    var $box = $('[data-year-now]');
    if (!$box.length || !hasIO) { return; }
    var current = $.trim($box.text());
    function swap(y) {
      if (y === current) { return; }
      current = y;
      var $old = $box.children('span');
      if (reduced()) { $box.html('<span>' + esc(y) + '</span>'); return; }
      var $new = $('<span class="is-in-start"></span>').text(y);
      $box.append($new);
      $old.addClass('is-out');
      w.requestAnimationFrame(function () { w.requestAnimationFrame(function () { $new.removeClass('is-in-start'); }); });
      w.setTimeout(function () { $old.remove(); }, 820);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { swap($(en.target).attr('data-year')); } });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $('[data-year]').each(function () { io.observe(this); });
  }

  /* ---------- Boot ---------- */
  $(function () {
    $body = $(d.body);
    PW.booted = true;
    buildChrome();

    if (hasIO && !reduced()) {
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { reveal(en.target); revealIO.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    }

    /* Stagger indexes for grouped reveals and split lines */
    $('[data-stagger]').each(function () {
      $(this).children().each(function (i) { this.style.setProperty('--i', i); });
    });
    $('[data-lines]').each(function () {
      $(this).find('.line > span').each(function (i) { this.style.setProperty('--i', i); });
    });

    paintArt();
    syncCounts(false);
    syncLove();
    syncTheme();

    /* Home spotlight buybox */
    $('[data-buybox]').each(function () {
      var $host = $(this);
      var p = PW.product($host.attr('data-buybox'));
      if (!p) { return; }
      var $art = $('[data-spot-art]');
      mountBuybox($host, p, $art.attr('data-colour') || p.colours[0], function (k) { swapArt($art, p.id, k); });
    });

    initShop();
    initProduct();
    initCheckout();
    initContact();
    openFromHash();
    $(w).on('hashchange', openFromHash);

    initHero();
    initParallax();
    initDecode();
    initRange();
    initMarquee();
    initPointerFx();
    initYearRail();
    observeReveals();

    $('[data-this-year]').text(new Date().getFullYear());

    /* Header: hide on the way down, show on the way up; progress line */
    var $h = $('.site-header');
    var island = $('.island')[0];
    var lastY = w.pageYOffset;
    if ($h.length && island) {
      scrollers.push(function (y) {
        var max = d.documentElement.scrollHeight - w.innerHeight;
        var show = y < 120 || y < lastY - 4;
        var hide = !show && y > lastY + 4 && !$('#menu').hasClass('is-open') && !$h[0].contains(d.activeElement);
        lastY = y;
        return function () {
          island.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : '0');
          if (show) { $h.removeClass('is-hidden'); } else if (hide) { $h.addClass('is-hidden'); }
        };
      });
      $h.on('focusin', function () { $h.removeClass('is-hidden'); });
    }

    w.addEventListener('scroll', requestTick, { passive: true });
    var rT = null;
    w.addEventListener('resize', function () {
      w.clearTimeout(rT);
      rT = w.setTimeout(function () {
        for (var i = 0; i < resizers.length; i++) { resizers[i](); }
        requestTick();
      }, 140);
    });
    $(w).on('load', function () {
      for (var i = 0; i < resizers.length; i++) { resizers[i](); }
      requestTick();
    });
    requestTick();

    /* Intro: wait for fonts so the wordmark rises once, cleanly */
    var started = false;
    function go() {
      if (started) { return; }
      started = true;
      w.requestAnimationFrame(function () { $html.addClass('is-loaded'); });
    }
    if (d.fonts && d.fonts.ready) { d.fonts.ready.then(go); w.setTimeout(go, 900); } else { go(); }

    /* ---------- Delegated events ---------- */
    $doc.on('click', '[data-bag-open]', function (e) { e.preventDefault(); openBag(); });
    $doc.on('click', '[data-bag-close], [data-scrim]', function () { closeBag(); });

    $doc.on('click', '[data-qty]', function () {
      var $b = $(this);
      if ($b.attr('aria-disabled') === 'true') { return; }
      var key = $b.closest('[data-key]').attr('data-key');
      var i = Bag.find(key);
      if (i < 0) { return; }
      pendingFocus = { key: key, sel: '[data-qty="' + $b.attr('data-qty') + '"]' };
      Bag.setQty(key, Bag.items[i].qty + parseInt($b.attr('data-qty'), 10));
    });

    $doc.on('click', '[data-remove]', function () {
      var $li = $(this).closest('[data-key]');
      var key = $li.attr('data-key');
      var next = $li.next('[data-key]').attr('data-key') || $li.prev('[data-key]').attr('data-key');
      pendingFocus = next ? { key: next, sel: '.bag-line__name' } : { close: true };
      var r = Bag.remove(key);
      if (!r) { return; }
      var p = PW.product(r.item.id);
      toast('Removed ' + p.name + '.', 'Undo', function () { Bag.restore(r); });
    });

    $doc.on('click', '[data-upsell]', function () {
      var p = PW.product($(this).attr('data-upsell'));
      pendingFocus = { close: true };
      Bag.add(p.id, p.colours[0], p.sizes[0], 1);
      toast('Added ' + p.name + ' to your bag.');
    });

    $doc.on('click', '.toast__action', function () {
      var fn = toastAction;
      $('[data-toast]').removeClass('is-on');
      toastAction = null;
      if (fn) { fn(); }
    });
    $doc.on('mouseenter focusin', '[data-toast]', function () { w.clearTimeout(toastTimer); });
    $doc.on('mouseleave focusout', '[data-toast]', function () { if ($(this).hasClass('is-on')) { armToast(); } });

    $doc.on('click', '[data-menu-toggle]', function () {
      if ($('#menu').hasClass('is-open')) { closeMenu(true); } else { openMenu(); }
    });
    $doc.on('click', '#menu a', function () { closeMenu(false); });
    onMQ(mqDesk, function (e) { if (e.matches) { closeMenu(false); } });

    $doc.on('click', '[data-theme-toggle]', function () {
      var next = themeNow() === 'dark' ? 'light' : 'dark';
      $html.attr('data-theme', next);
      storage.raw('pw-theme', next);
      syncTheme();
    });

    $doc.on('click', '[data-love]', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var $b = $(this);
      var id = $b.attr('data-love');
      var on = Love.toggle(id);
      var p = PW.product(id);
      $('[data-love="' + id + '"]').attr('aria-pressed', on ? 'true' : 'false');
      if (on && !reduced()) { replay($b, 'is-popping'); }
      if (on) {
        toast('Saved ' + p.name + ' to Loved.', 'View', function () { w.location.href = 'shop.html?view=loved'; });
      } else {
        toast('Removed ' + p.name + ' from Loved.');
      }
    });
    $doc.on('animationend', '.love', function (e) {
      if (e.target === this || $(e.target).is('svg')) { $(this).removeClass('is-popping'); }
    });

    $doc.on('click', '[data-dot]', function () {
      var $b = $(this);
      var $card = $b.closest('[data-card]');
      var k = $b.attr('data-dot');
      var id = $card.attr('data-card');
      $card.attr('data-colour', k);
      $card.find('[data-dot]').attr('aria-pressed', 'false');
      $b.attr('aria-pressed', 'true');
      swapArt($card.find('.card__media > .art'), id, k);
      $card.find('[data-card-link]').attr('href', 'product.html?id=' + id + '&colour=' + k);
    });

    $doc.on('click', '[data-quick]', function (e) {
      e.stopPropagation();
      var $card = $(this).closest('[data-card]');
      var p = PW.product($card.attr('data-card'));
      if (p.sizes.length === 1) {
        Bag.add(p.id, $card.attr('data-colour'), p.sizes[0], 1);
        openBag();
        return;
      }
      var $panel = $card.find('[data-quick-panel]');
      var opening = !$panel.hasClass('is-open');
      closeQuick(false);
      if (opening) {
        $panel.addClass('is-open');
        $(this).attr('aria-expanded', 'true');
        w.setTimeout(function () { $panel.find('[data-quick-size]').first().trigger('focus'); }, 60);
      }
    });
    $doc.on('click', '[data-quick-close]', function (e) { e.stopPropagation(); closeQuick(true); });
    $doc.on('click', '[data-quick-size]', function (e) {
      e.stopPropagation();
      var $card = $(this).closest('[data-card]');
      Bag.add($card.attr('data-card'), $card.attr('data-colour'), $(this).attr('data-quick-size'), 1);
      closeQuick(false);
      openBag();
    });
    $doc.on('click', function (e) {
      if (!$(e.target).closest('[data-quick-panel], [data-quick]').length) { closeQuick(false); }
    });

    $doc.on('keydown', function (e) {
      if (e.key !== 'Escape') { return; }
      if ($('#bag').hasClass('is-open')) { closeBag(); return; }
      if ($('#menu').hasClass('is-open')) { closeMenu(true); return; }
      if ($('[data-quick-panel].is-open').length) { closeQuick(true); }
    });

    $doc.on('pw:bag', function () {
      syncCounts(true);
      if ($('#bag').hasClass('is-open')) { renderBag(); applyPendingFocus(); }
      if (checkoutOn) { renderCheckoutSummary(); }
    });
    $doc.on('pw:love', function () {
      syncCounts(false);
      syncLove();
    });
  });
})(window.jQuery, window, document);
