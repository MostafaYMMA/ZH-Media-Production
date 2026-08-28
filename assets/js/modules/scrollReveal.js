window.ZH = window.ZH || {};

(function () {
  const GROUP_STAGGER_MS = 90;

  // Explicit data-reveal-delay always wins. Otherwise, if the element sits inside
  // a [data-reveal-group] container, stagger it by its position among reveal
  // siblings in that group so grid/card layouts fade in one after another.
  function resolveDelay(el) {
    if (el.dataset.revealDelay !== undefined) return Number(el.dataset.revealDelay);

    const group = el.closest("[data-reveal-group]");
    if (!group) return 0;

    const groupItems = Array.prototype.filter.call(group.children, function (child) {
      return child.hasAttribute("data-reveal");
    });
    const index = groupItems.indexOf(el);
    return index >= 0 ? index * GROUP_STAGGER_MS : 0;
  }

  window.ZH.initScrollReveal = function () {
    const targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const reveal = function (el) {
      el.style.transitionDelay = `${resolveDelay(el)}ms`;
      el.classList.add("is-visible");
    };

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      // threshold 0 so tall elements (which may never cover 15% of a phone
      // viewport) still trigger the moment any part scrolls in.
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });

    // Safety net: nothing that scrolled past should stay invisible. A stuck
    // observer, a layout race, or a fast flick-scroll (the observer can coalesce
    // an enter+leave that happens between frames) must never leave content
    // permanently blank — so sweep anything already scrolled into view.
    const sweep = function () {
      targets.forEach(function (el) {
        if (!el.classList.contains("is-visible")) {
          const box = el.getBoundingClientRect();
          if (box.top < window.innerHeight) {
            el.style.transitionDelay = "0ms";
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        }
      });
    };

    window.setTimeout(sweep, 2500);

    // Re-sweep once the user stops scrolling. The whole site is one long page,
    // so a single post-load check isn't enough to cover every section.
    let sweepTimer = 0;
    window.addEventListener(
      "scroll",
      function () {
        window.clearTimeout(sweepTimer);
        sweepTimer = window.setTimeout(sweep, 250);
      },
      { passive: true }
    );
  };
})();
