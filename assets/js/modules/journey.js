window.ZH = window.ZH || {};

/* ==========================================================================
   JOURNEY — lights up each "How we work together" step, and with it that
   step's segment of the connecting line, as it reaches the middle of the
   screen.

   IntersectionObserver only; no scroll handler. The line fills because every
   step owns the piece of line beneath it (journey.css), so lighting the steps
   in order IS the fill.

   The lit state is the CSS default — this module only ever adds `is-lit`, and
   the dimmed state is gated behind `.js` in the stylesheet. So a page where
   this never runs shows every step fully lit, which is exactly the state the
   brief asks for with no JS and under reduced motion.

   Steps are unobserved once lit: scrolling back up should not drain a line
   the visitor has already watched fill.
   ========================================================================== */
window.ZH.initJourney = function () {
  const steps = document.querySelectorAll("[data-journey-step]");
  if (!steps.length) return;

  const litAll = function () {
    Array.prototype.forEach.call(steps, function (step) {
      step.classList.add("is-lit");
    });
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    litAll();
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-lit");
        observer.unobserve(entry.target);
      });
    },
    // A thin band across the middle of the viewport: a step lights as it
    // arrives there, not when it first peeks in at the bottom.
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
  );

  Array.prototype.forEach.call(steps, function (step) {
    observer.observe(step);
  });

  // Same safety net as scrollReveal: a fast flick-scroll can coalesce an
  // enter+leave between frames and skip a step, which would strand a dark
  // gap in the middle of a filled line. Sweep anything already above the
  // viewport middle once things settle.
  const sweep = function () {
    const middle = window.innerHeight / 2;
    Array.prototype.forEach.call(steps, function (step) {
      if (step.classList.contains("is-lit")) return;
      if (step.getBoundingClientRect().top < middle) {
        step.classList.add("is-lit");
        observer.unobserve(step);
      }
    });
  };

  let sweepTimer = 0;
  window.addEventListener(
    "scroll",
    function () {
      window.clearTimeout(sweepTimer);
      sweepTimer = window.setTimeout(sweep, 250);
    },
    { passive: true }
  );
  window.setTimeout(sweep, 2500);
};
