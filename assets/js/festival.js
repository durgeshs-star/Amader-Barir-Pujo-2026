/*==============================================================================
  Festival Panel — switches the site into Hindu festival mode.
  ----------------------------------------------------------------------------
  Activates one of 4 festival stylesheets (Holi, Diwali, Navaratri, Hanuman
  Jayanti) and injects any decorative overlay elements required by that
  festival (dust particles, diyas, countdown, etc).
  Follows the same pattern as the Theme Colors panel (`mht-theme-switch`).
==============================================================================*/

(function () {
  'use strict';

  // Festival config — key = name used for link id & body class
  var FESTIVALS = {
    'holi': {
      css:   'assets/css/festivals/holi.css',
      bodyClass: 'fest-holi',
      onActivate: function () {
        injectHoliOverlays();
      },
      onDeactivate: function () {
        removeByClass('fest-holi-particles');
        removeByClass('fest-holi-burst');
      }
    },
    'diwali': {
      css:   'assets/css/festivals/diwali.css',
      bodyClass: 'fest-diwali',
      onActivate: function () {
        injectDiwaliDiyas();
      },
      onDeactivate: function () {
        removeByClass('fest-diwali-diyas');
      }
    },
    'navaratri': {
      css:   'assets/css/festivals/navaratri.css',
      bodyClass: 'fest-navaratri',
      onActivate: function () {
        injectNavaratriCountdown();
      },
      onDeactivate: function () {
        removeByClass('fest-navaratri-countdown');
        if (window.__navCountdownTimer) {
          clearInterval(window.__navCountdownTimer);
          window.__navCountdownTimer = null;
        }
      }
    },
    'hanuman-jayanti': {
      css:   'assets/css/festivals/hanuman-jayanti.css',
      bodyClass: 'fest-hanuman-jayanti',
      onActivate: function () {},
      onDeactivate: function () {}
    },
    'janmashtami': {
      css: 'assets/css/festivals/janmashtami.css',
      bodyClass: 'fest-janmashtami',
      onActivate: function () {
        injectJanmashtami();
      },
      onDeactivate: function () {
        removeByClass('fest-janmashtami-feathers');
        removeByClass('fest-janmashtami-flute');
      }
    },
    'ganesh-chaturthi': {
      css: 'assets/css/festivals/ganesh-chaturthi.css',
      bodyClass: 'fest-ganesh-chaturthi',
      onActivate: function () {
        injectGaneshChaturthi();
      },
      onDeactivate: function () {
        removeByClass('fest-ganesh-marquee');
        removeByClass('fest-ganesh-petals');
      }
    },
    'shivaratri': {
      css: 'assets/css/festivals/shivaratri.css',
      bodyClass: 'fest-shivaratri',
      onActivate: function () {
        injectShivaratri();
      },
      onDeactivate: function () {
        removeByClass('fest-shivaratri-moon');
        removeByClass('fest-shivaratri-drops');
      }
    },
    'raksha-bandhan': {
      css: 'assets/css/festivals/raksha-bandhan.css',
      bodyClass: 'fest-raksha-bandhan',
      onActivate: function () {
        injectRakshaBandhan();
      },
      onDeactivate: function () {
        removeByClass('fest-raksha-charm');
      }
    },
    'makar-sankranti': {
      css: 'assets/css/festivals/makar-sankranti.css',
      bodyClass: 'fest-makar-sankranti',
      onActivate: function () {
        injectMakarSankranti();
      },
      onDeactivate: function () {
        removeByClass('fest-makar-kites');
        removeByClass('fest-makar-kolam');
      }
    }
  };

  // ---------- Helpers ----------
  function removeByClass(cls) {
    var els = document.querySelectorAll('.' + cls);
    for (var i = 0; i < els.length; i++) els[i].parentNode.removeChild(els[i]);
  }
  function removeLink() {
    var l = document.getElementById('mht-festival-link');
    if (l) l.parentNode.removeChild(l);
  }
  function removeAllFestBodyClasses() {
    for (var key in FESTIVALS) {
      document.body.classList.remove(FESTIVALS[key].bodyClass);
    }
  }
  function cleanupAllOverlays() {
    for (var key in FESTIVALS) {
      if (FESTIVALS[key].onDeactivate) FESTIVALS[key].onDeactivate();
    }
  }

  // ---------- Activate a festival ----------
  function activate(name) {
    var fest = FESTIVALS[name];
    if (!fest) return;

    // 1. cleanup previous
    removeLink();
    removeAllFestBodyClasses();
    cleanupAllOverlays();

    // 2. inject stylesheet link
    var link = document.createElement('link');
    link.id = 'mht-festival-link';
    link.rel = 'stylesheet';
    link.href = fest.css;
    document.head.appendChild(link);

    // 3. add body class
    document.body.classList.add(fest.bodyClass);

    // 4. run festival-specific overlay injection (after stylesheet loads)
    link.addEventListener('load', function () {
      if (fest.onActivate) fest.onActivate();
    });

    // 5. update panel active state
    var btns = document.querySelectorAll('.mht-festival-tab');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('is-active', btns[i].getAttribute('data-festival') === name);
    }
  }

  // ---------- Deactivate / reset to default theme ----------
  function deactivate() {
    removeLink();
    removeAllFestBodyClasses();
    cleanupAllOverlays();
    var btns = document.querySelectorAll('.mht-festival-tab');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('is-active');
  }

  // ---------- Festival-specific overlay injections ----------

  // HOLI — colourful dust particles raining + corner color bursts
  function injectHoliOverlays() {
    var particles = document.createElement('div');
    particles.className = 'fest-holi-particles';
    var colors = ['#e91e63', '#ffb700', '#4caf50', '#2196f3', '#9c27b0', '#ff5722', '#00bcd4', '#8bc34a'];
    for (var i = 0; i < 50; i++) {
      var dot = document.createElement('span');
      dot.className = 'holi-dot';
      var size = 6 + Math.random() * 14;
      dot.style.width  = size + 'px';
      dot.style.height = size + 'px';
      dot.style.left   = Math.random() * 100 + 'vw';
      dot.style.background = colors[Math.floor(Math.random() * colors.length)];
      dot.style.animationDuration = (6 + Math.random() * 8) + 's';
      dot.style.animationDelay    = (Math.random() * 5) + 's';
      dot.style.setProperty('--dx', (Math.random() * 200 - 100) + 'px');
      particles.appendChild(dot);
    }
    document.body.appendChild(particles);

    // 4 corner bursts
    ['tl','tr','bl','br'].forEach(function(pos){
      var b = document.createElement('div');
      b.className = 'fest-holi-burst burst-' + pos;
      document.body.appendChild(b);
    });
  }

  // DIWALI — row of 8 candles with rising smoke
  function injectDiwaliDiyas() {
    var wrap = document.createElement('div');
    wrap.className = 'fest-diwali-diyas';
    for (var i = 0; i < 8; i++) {
      var diya = document.createElement('div');
      diya.className = 'fest-diwali-diya';
      diya.innerHTML =
        '<img class="smoke-img" src="assets/img/coffee_smoke.png" alt="" aria-hidden="true">' +
        '<img class="diya-img"  src="assets/img/11312104.png"    alt="" aria-hidden="true">';
      wrap.appendChild(diya);
    }
    document.body.appendChild(wrap);
  }

  // NAVARATRI — fixed bottom-right countdown widget + 9-night dots
  function injectNavaratriCountdown() {
    var widget = document.createElement('div');
    widget.className = 'fest-navaratri-countdown';
    widget.innerHTML =
      '<h6>Navaratri begins in</h6>' +
      '<div class="nav-timer">' +
        '<div class="nav-timer-unit"><strong id="nav-d">--</strong><span>Days</span></div>' +
        '<div class="nav-timer-unit"><strong id="nav-h">--</strong><span>Hrs</span></div>' +
        '<div class="nav-timer-unit"><strong id="nav-m">--</strong><span>Min</span></div>' +
        '<div class="nav-timer-unit"><strong id="nav-s">--</strong><span>Sec</span></div>' +
      '</div>' +
      '<div class="nav-dots">' +
        '<span class="nav-dot n1" title="Night 1 — Shailaputri"></span>' +
        '<span class="nav-dot n2" title="Night 2 — Brahmacharini"></span>' +
        '<span class="nav-dot n3" title="Night 3 — Chandraghanta"></span>' +
        '<span class="nav-dot n4" title="Night 4 — Kushmanda"></span>' +
        '<span class="nav-dot n5" title="Night 5 — Skandamata"></span>' +
        '<span class="nav-dot n6" title="Night 6 — Katyayani"></span>' +
        '<span class="nav-dot n7" title="Night 7 — Kalaratri"></span>' +
        '<span class="nav-dot n8" title="Night 8 — Mahagauri"></span>' +
        '<span class="nav-dot n9" title="Night 9 — Siddhidatri"></span>' +
      '</div>' +
      '<span class="nav-label">Nine nights of the Goddess</span>';
    document.body.appendChild(widget);

    // Target: Next October 3rd (approximate next Navaratri)
    function nextNavaratriStart() {
      var now = new Date();
      var year = now.getFullYear();
      var target = new Date(year, 9, 3, 0, 0, 0); // Oct 3 this year
      if (target < now) target = new Date(year + 1, 9, 3, 0, 0, 0);
      return target;
    }
    var target = nextNavaratriStart();

    function tick() {
      var now = new Date();
      var diff = target - now;
      if (diff <= 0) {
        // Navaratri is happening — show which night
        document.getElementById('nav-d').textContent = '0';
        document.getElementById('nav-h').textContent = '0';
        document.getElementById('nav-m').textContent = '0';
        document.getElementById('nav-s').textContent = '0';
        return;
      }
      var d = Math.floor(diff / (1000 * 60 * 60 * 24));
      var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var s = Math.floor((diff % (1000 * 60)) / 1000);
      document.getElementById('nav-d').textContent = d;
      document.getElementById('nav-h').textContent = h;
      document.getElementById('nav-m').textContent = m;
      document.getElementById('nav-s').textContent = s;
    }
    tick();
    window.__navCountdownTimer = setInterval(tick, 1000);
  }

  // ---------- JANMASHTAMI — falling peacock feathers + flute ----------
  function injectJanmashtami() {
    var wrap = document.createElement('div');
    wrap.className = 'fest-janmashtami-feathers';
    for (var i = 0; i < 22; i++) {
      var f = document.createElement('div');
      f.className = 'janma-feather';
      f.style.left = Math.random() * 100 + 'vw';
      f.style.animationDuration = (10 + Math.random() * 10) + 's';
      f.style.animationDelay    = (Math.random() * 8) + 's';
      f.style.setProperty('--swing',  (Math.random() * 120 - 60) + 'px');
      f.style.setProperty('--swing2', (Math.random() * 120 - 60) + 'px');
      // Inline peacock feather SVG — elongated eye with blue/green/gold
      f.innerHTML =
        '<svg viewBox="0 0 30 80" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<radialGradient id="peak' + i + '" cx="50%" cy="30%" r="55%">' +
              '<stop offset="0%"  stop-color="#fcd34d"/>' +
              '<stop offset="40%" stop-color="#1e3a8a"/>' +
              '<stop offset="70%" stop-color="#0891b2"/>' +
              '<stop offset="100%" stop-color="#065f46"/>' +
            '</radialGradient>' +
          '</defs>' +
          '<path d="M15 2 C4 18 2 38 6 56 C8 68 15 78 15 78 C15 78 22 68 24 56 C28 38 26 18 15 2 Z" fill="url(#peak' + i + ')" stroke="#fcd34d" stroke-width=".8" opacity=".95"/>' +
          '<circle cx="15" cy="22" r="5" fill="#1e3a8a"/>' +
          '<circle cx="15" cy="22" r="3" fill="#fcd34d"/>' +
          '<line x1="15" y1="78" x2="15" y2="95" stroke="#78350f" stroke-width="1"/>' +
        '</svg>';
      wrap.appendChild(f);
    }
    document.body.appendChild(wrap);

    // Flute fixed bottom-left
    var flute = document.createElement('div');
    flute.className = 'fest-janmashtami-flute';
    flute.innerHTML =
      '<svg viewBox="0 0 220 30" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="0" y="10" width="220" height="10" rx="5" fill="#78350f" stroke="#fcd34d" stroke-width="1"/>' +
        '<circle cx="30"  cy="15" r="1.8" fill="#fcd34d"/>' +
        '<circle cx="60"  cy="15" r="1.8" fill="#fcd34d"/>' +
        '<circle cx="90"  cy="15" r="1.8" fill="#fcd34d"/>' +
        '<circle cx="120" cy="15" r="1.8" fill="#fcd34d"/>' +
        '<circle cx="150" cy="15" r="1.8" fill="#fcd34d"/>' +
        '<circle cx="180" cy="15" r="1.8" fill="#fcd34d"/>' +
        '<rect x="210" y="8" width="10" height="14" rx="2" fill="#fcd34d"/>' +
      '</svg>';
    document.body.appendChild(flute);
  }

  // ---------- GANESH CHATURTHI — marquee + marigold petals ----------
  function injectGaneshChaturthi() {
    var marquee = document.createElement('div');
    marquee.className = 'fest-ganesh-marquee';
    marquee.innerHTML =
      '<div class="fest-ganesh-marquee-track">' +
        '<span>Ganpati Bappa Morya</span><span>गणपति बप्पा मोरया</span>' +
        '<span>Mangalmurti Morya</span><span>मंगलमूर्ति मोरया</span>' +
        '<span>Ganpati Bappa Morya</span><span>गणपति बप्पा मोरया</span>' +
        '<span>Mangalmurti Morya</span><span>मंगलमूर्ति मोरया</span>' +
      '</div>';
    document.body.appendChild(marquee);

    var petals = document.createElement('div');
    petals.className = 'fest-ganesh-petals';
    for (var i = 0; i < 30; i++) {
      var p = document.createElement('span');
      p.className = 'ganesh-petal';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (8 + Math.random() * 8) + 's';
      p.style.animationDelay    = (Math.random() * 6) + 's';
      p.style.setProperty('--sway',  (Math.random() * 80 - 40) + 'px');
      p.style.setProperty('--sway2', (Math.random() * 80 - 40) + 'px');
      var size = 10 + Math.random() * 8;
      p.style.width  = size + 'px';
      p.style.height = size + 'px';
      petals.appendChild(p);
    }
    document.body.appendChild(petals);
  }

  // ---------- SHIVARATRI — crescent moon + falling water drops ----------
  function injectShivaratri() {
    var moon = document.createElement('div');
    moon.className = 'fest-shivaratri-moon';
    document.body.appendChild(moon);

    var drops = document.createElement('div');
    drops.className = 'fest-shivaratri-drops';
    for (var i = 0; i < 60; i++) {
      var d = document.createElement('span');
      d.className = 'shiva-drop';
      d.style.left = Math.random() * 100 + 'vw';
      d.style.animationDuration = (2 + Math.random() * 3) + 's';
      d.style.animationDelay    = (Math.random() * 4) + 's';
      drops.appendChild(d);
    }
    document.body.appendChild(drops);
  }

  // ---------- RAKSHA BANDHAN — charm badge top-right ----------
  function injectRakshaBandhan() {
    var charm = document.createElement('div');
    charm.className = 'fest-raksha-charm';
    charm.innerHTML = '<span>&hearts;</span>';
    document.body.appendChild(charm);
  }

  // ---------- MAKAR SANKRANTI — flying kites + kolam ----------
  function injectMakarSankranti() {
    var kites = document.createElement('div');
    kites.className = 'fest-makar-kites';
    var colors = [
      ['#e91e63', '#ffeb3b'],
      ['#2196f3', '#ff9800'],
      ['#4caf50', '#e91e63'],
      ['#9c27b0', '#ffeb3b'],
      ['#ff5722', '#2196f3']
    ];
    for (var i = 0; i < 5; i++) {
      var k = document.createElement('div');
      k.className = 'sankranti-kite';
      k.style.top = (6 + Math.random() * 25) + '%';
      k.style.animationDuration = (14 + Math.random() * 10) + 's';
      k.style.animationDelay    = (Math.random() * 8) + 's';
      var c = colors[i % colors.length];
      k.innerHTML =
        '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
          '<polygon points="30,2 58,30 30,58 2,30" fill="' + c[0] + '" stroke="#222" stroke-width="1"/>' +
          '<polygon points="30,2 30,58" stroke="#222" stroke-width="1" fill="none"/>' +
          '<polygon points="2,30 58,30" stroke="#222" stroke-width="1" fill="none"/>' +
          '<polygon points="30,2 30,30 2,30" fill="' + c[1] + '" opacity=".7"/>' +
          '<polygon points="30,58 30,30 58,30" fill="' + c[1] + '" opacity=".7"/>' +
          '<path d="M30 58 Q 38 68 30 76 Q 22 84 34 94" stroke="#666" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
        '</svg>';
      kites.appendChild(k);
    }
    document.body.appendChild(kites);

    // Two rotating kolam patterns (bottom-left + bottom-right)
    var kolamSVG =
      '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<g stroke="#d84315" stroke-width="1.5" fill="none">' +
          '<circle cx="60" cy="60" r="8"/>' +
          '<circle cx="60" cy="60" r="18"/>' +
          '<circle cx="60" cy="60" r="28"/>' +
          '<circle cx="60" cy="60" r="40"/>' +
          '<circle cx="60" cy="60" r="52"/>' +
        '</g>' +
        '<g fill="#ff6f00">' +
          '<circle cx="60" cy="10"  r="3"/>' +
          '<circle cx="110" cy="60" r="3"/>' +
          '<circle cx="60" cy="110" r="3"/>' +
          '<circle cx="10"  cy="60" r="3"/>' +
          '<circle cx="95" cy="25" r="3"/>' +
          '<circle cx="95" cy="95" r="3"/>' +
          '<circle cx="25" cy="25" r="3"/>' +
          '<circle cx="25" cy="95" r="3"/>' +
        '</g>' +
        '<g stroke="#ffd600" stroke-width="2" fill="none">' +
          '<path d="M30 60 Q 60 30 90 60 Q 60 90 30 60 Z"/>' +
          '<path d="M60 30 Q 90 60 60 90 Q 30 60 60 30 Z"/>' +
        '</g>' +
      '</svg>';
    ['kolam-left', 'kolam-right'].forEach(function (side) {
      var k = document.createElement('div');
      k.className = 'fest-makar-kolam ' + side;
      k.innerHTML = kolamSVG;
      document.body.appendChild(k);
    });
  }

  // ---------- Wire up panel clicks ----------
  document.addEventListener('DOMContentLoaded', function () {
    // Toggle panel open/close
    var toggle = document.querySelector('.mht-festival-switch');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var panel = document.querySelector('.mht-festival-panel-wrap');
        if (panel) panel.classList.toggle('is-open');
      });
    }

    // Tab click handlers
    var tabs = document.querySelectorAll('.mht-festival-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function (e) {
        e.preventDefault();
        var name = this.getAttribute('data-festival');
        // If clicking the already-active festival, deactivate
        if (this.classList.contains('is-active')) {
          deactivate();
        } else {
          activate(name);
        }
      });
    }

    // Reset button
    var reset = document.querySelector('.mht-festival-reset');
    if (reset) {
      reset.addEventListener('click', function (e) {
        e.preventDefault();
        deactivate();
      });
    }
  });
})();
