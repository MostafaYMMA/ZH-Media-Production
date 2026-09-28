window.ZH = window.ZH || {};

(function () {
  const DURATION_MS = 1200;

  // Ease-out so the number decelerates into its final value.
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animate(el) {
    const target = Number(el.dataset.countTo) || 0;
    const suffix = el.dataset.countSuffix || "";
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  window.ZH.initCounters = function () {
    const counters = document.querySelectorAll("[data-count-to]");
    if (!counters.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Respect reduced motion (and browsers without IntersectionObserver) by
    // jumping straight to the final value.
    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach(function (el) {
        el.textContent = (el.dataset.countTo || "0") + (el.dataset.countSuffix || "");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach(function (el) {
      // The markup carries the real final figure so the stats are correct with
      // JS off. Zero it only here — on the one path that is definitely going to
      // count it back up — so a visitor never sees a stat stuck at 0.
      el.textContent = "0" + (el.dataset.countSuffix || "");
      observer.observe(el);
    });
  };
})();
