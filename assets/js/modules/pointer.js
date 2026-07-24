window.ZH = window.ZH || {};

// Cursor-reactive lighting. Writes --mx / --my (percentages) onto any element
// that opts in, so CSS can paint a glow that tracks the pointer:
//   [data-spotlight]  — the hero's ambient volt spotlight
//   [data-glow]       — cards that light up under the cursor
// Everything degrades to a static idle state: with no JS the custom properties
// simply fall back to their CSS defaults, and reduced-motion users are skipped.
(function () {
  function track(el) {
    // rAF-throttled so rapid pointer moves coalesce to one write per frame.
    let frame = null;
    let px = 50;
    let py = 50;

    function apply() {
      frame = null;
      el.style.setProperty("--mx", px + "%");
      el.style.setProperty("--my", py + "%");
    }

    el.addEventListener("pointermove", function (e) {
      const rect = el.getBoundingClientRect();
      px = ((e.clientX - rect.left) / rect.width) * 100;
      py = ((e.clientY - rect.top) / rect.height) * 100;
      if (frame === null) frame = requestAnimationFrame(apply);
    });
  }

  window.ZH.initPointerFX = function () {
    // Fine pointers only (mouse/trackpad); touch devices skip the effect.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document
      .querySelectorAll("[data-spotlight], [data-glow]")
      .forEach(track);
  };
})();
