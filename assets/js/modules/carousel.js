window.ZH = window.ZH || {};

/* ==========================================================================
   CAROUSEL — the video-testimonial strip.

   The strip itself is pure CSS: a scroll-snapping flex row, swipeable on
   touch and scrollable with the keyboard, which is why the arrows and dots
   below are BUILT HERE rather than sitting in the markup. Without JS there is
   nothing dead on the page — just a strip you swipe.

   Paging works off real scroll position (scrollLeft + slide geometry), never a
   transform we track ourselves, so native swiping and our arrows can never
   disagree about where the strip is.

   Direction is read from the computed style rather than assumed left-to-right,
   and RTL's negative/inverted scrollLeft is normalised, so this keeps working
   when the Arabic build lands.
   ========================================================================== */
(function () {
  function isRTL(el) {
    return getComputedStyle(el).direction === "rtl";
  }

  // Browsers disagree on what scrollLeft means in RTL (negative, or counting
  // down from max). Normalise to "distance scrolled from the start edge".
  function startOffset(viewport) {
    if (!isRTL(viewport)) return viewport.scrollLeft;
    const max = viewport.scrollWidth - viewport.clientWidth;
    const raw = viewport.scrollLeft;
    return raw <= 0 ? -raw : max - raw;
  }

  function scrollToOffset(viewport, offset, smooth) {
    let target = offset;
    if (isRTL(viewport)) {
      const max = viewport.scrollWidth - viewport.clientWidth;
      // Mirror back into whichever convention this browser uses.
      target = viewport.scrollLeft <= 0 ? -offset : max - offset;
    }
    viewport.scrollTo({
      left: target,
      behavior: smooth ? "smooth" : "auto",
    });
  }

  function initCarousel(root) {
    const viewport = root.querySelector("[data-carousel-viewport]");
    const nav = root.querySelector("[data-carousel-nav]");
    const slides = viewport
      ? Array.prototype.slice.call(viewport.querySelectorAll(".carousel__slide"))
      : [];
    if (!viewport || !nav || slides.length < 2) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* --- build the nav row ------------------------------------------------ */
    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "carousel__arrow carousel__arrow--prev";
    prev.setAttribute("aria-label", "Previous testimonial");
    prev.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';

    const next = document.createElement("button");
    next.type = "button";
    next.className = "carousel__arrow carousel__arrow--next";
    next.setAttribute("aria-label", "Next testimonial");
    next.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

    const dots = document.createElement("div");
    dots.className = "carousel__dots";

    const dotButtons = slides.map(function (slide, index) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel__dot";
      dot.setAttribute("aria-label", "Go to testimonial " + (index + 1));
      dot.addEventListener("click", function () {
        goTo(index);
      });
      dots.appendChild(dot);
      return dot;
    });

    nav.appendChild(prev);
    nav.appendChild(dots);
    nav.appendChild(next);
    root.classList.add("is-enhanced");

    /* --- geometry --------------------------------------------------------- */

    // Slide pitch straight off the DOM, so it stays right through every
    // breakpoint (1 card on a phone, 3 on desktop) with no hard-coded widths.
    function pitch() {
      if (slides.length < 2) return slides[0] ? slides[0].offsetWidth : 1;
      return Math.abs(slides[1].offsetLeft - slides[0].offsetLeft) || slides[0].offsetWidth;
    }

    function currentIndex() {
      const raw = startOffset(viewport) / pitch();
      return Math.max(0, Math.min(slides.length - 1, Math.round(raw)));
    }

    function goTo(index) {
      const clamped = Math.max(0, Math.min(slides.length - 1, index));
      scrollToOffset(viewport, clamped * pitch(), !reduceMotion.matches);
    }

    prev.addEventListener("click", function () {
      goTo(currentIndex() - 1);
    });
    next.addEventListener("click", function () {
      goTo(currentIndex() + 1);
    });

    // Arrow keys while the strip has focus. Logical, not physical: in RTL,
    // "next" is still the key pointing along the reading direction.
    viewport.addEventListener("keydown", function (event) {
      const rtl = isRTL(viewport);
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(currentIndex() + (rtl ? -1 : 1));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(currentIndex() + (rtl ? 1 : -1));
      }
    });

    /* --- reflect state --------------------------------------------------- */
    function paint() {
      const index = currentIndex();
      dotButtons.forEach(function (dot, i) {
        const active = i === index;
        dot.classList.toggle("is-active", active);
        // aria-current, not aria-selected: these are links into a list, not
        // tabs controlling panels.
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });

      // Disable rather than hide, so the row never reflows mid-interaction.
      const atStart = startOffset(viewport) < 4;
      const atEnd =
        startOffset(viewport) >= viewport.scrollWidth - viewport.clientWidth - 4;
      prev.disabled = atStart;
      next.disabled = atEnd;
    }

    let paintTimer = 0;
    viewport.addEventListener(
      "scroll",
      function () {
        window.clearTimeout(paintTimer);
        paintTimer = window.setTimeout(paint, 80);
      },
      { passive: true }
    );
    window.addEventListener("resize", paint, { passive: true });
    paint();
  }

  window.ZH.initCarousels = function () {
    const roots = document.querySelectorAll("[data-carousel]");
    if (!roots.length) return;
    Array.prototype.forEach.call(roots, initCarousel);
  };
})();
