(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".nav")) setMenu(false);
    });

    window.matchMedia("(min-width: 761px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  // Scroll reveal
  var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showAll() {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  if (!items.length) return;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  // Stagger siblings within the same grid for a subtle cascade.
  items.forEach(function (el) {
    var parent = el.parentElement;
    var siblings = parent ? parent.querySelectorAll(":scope > .reveal") : [];
    if (siblings.length > 1) {
      var index = Array.prototype.indexOf.call(siblings, el);
      el.style.setProperty("--reveal-delay", Math.min(index, 6) * 0.07 + "s");
    }
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -40px 0px", threshold: 0.08 });

  items.forEach(function (el) { observer.observe(el); });
})();
