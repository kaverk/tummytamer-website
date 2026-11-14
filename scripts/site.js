(function () {
  document.documentElement.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Top bar: solid background once scrolled, mobile menu toggle
  var bar = document.querySelector('.topbar');
  if (bar) {
    var sync = function () { bar.classList.toggle('is-solid', window.scrollY > 24); };
    sync();
    window.addEventListener('scroll', sync, { passive: true });

    var burger = bar.querySelector('.burger');
    if (burger) {
      var setOpen = function (open) {
        bar.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
        burger.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      };
      burger.addEventListener('click', function () { setOpen(!bar.classList.contains('is-open')); });
      bar.querySelectorAll('.menu a').forEach(function (a) {
        a.addEventListener('click', function () { setOpen(false); });
      });
    }
  }

  // Hero phones rise into place after load
  var stage = document.querySelector('.hero__stage');
  if (stage) {
    requestAnimationFrame(function () {
      setTimeout(function () { stage.classList.add('is-in'); }, reduceMotion ? 0 : 250);
    });
  }

  // Scroll reveal
  var items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Cursor-following glow on feature cards
  document.querySelectorAll('.spot').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--y', (e.clientY - r.top) + 'px');
    });
  });

  // App tour tabs (WAI-ARIA tabs pattern)
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  if (tabs.length) {
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panel.hidden = !on;
        panel.classList.remove('is-entering');
        if (on && !reduceMotion) {
          void panel.offsetWidth;
          panel.classList.add('is-entering');
        }
      });
      if (focus) { tab.focus(); }
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') { next = tabs[(i + 1) % tabs.length]; }
        if (e.key === 'ArrowLeft') { next = tabs[(i - 1 + tabs.length) % tabs.length]; }
        if (e.key === 'Home') { next = tabs[0]; }
        if (e.key === 'End') { next = tabs[tabs.length - 1]; }
        if (next) {
          e.preventDefault();
          select(next, true);
        }
      });
    });

    select(tabs[0]);
    document.querySelector('.panel.is-entering') && document.querySelector('.panel.is-entering').classList.remove('is-entering');
  }

  var year = document.querySelector('[data-year]');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
