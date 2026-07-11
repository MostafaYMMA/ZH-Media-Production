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

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${resolveDelay(entry.target)}ms`;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  };
})();
