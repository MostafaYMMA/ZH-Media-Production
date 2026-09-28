window.ZH = window.ZH || {};

/* ==========================================================================
   STICKY MOBILE CTA — a fixed "Book a call" bar under 768px.

   Shown only in the middle of the page: hidden while the hero is on screen
   (the hero has its own buttons) and hidden again once the contact section
   arrives (the form itself is right there). Two IntersectionObservers, no
   scroll handler.

   It observes `.hero`, not `#home`: the #home section runs for several
   viewports past the hero, and the brief asks for the bar as soon as the HERO
   has gone.

   The bar is hidden by default in CSS, so a page without JS simply never
   shows it — nothing dead, nothing covering anything.
   ========================================================================== */
window.ZH.initStickyCta = function () {
  const bar = document.querySelector("[data-sticky-cta]");
  if (!bar) return;

  const hero = document.querySelector(".hero");
  const contact = document.getElementById("contact");

  // Without IntersectionObserver there is no safe moment to show it, so don't.
  if (!("IntersectionObserver" in window) || (!hero && !contact)) return;

  let heroVisible = !!hero;
  let contactVisible = false;

  // Publish the real height so the page's reserved bottom padding always
  // matches the bar, whatever the button and the safe-area inset add up to.
  const syncHeight = function () {
    const h = Math.round(bar.getBoundingClientRect().height);
    if (h) document.documentElement.style.setProperty("--sticky-cta-height", h + "px");
  };

  const update = function () {
    bar.classList.toggle("is-visible", !heroVisible && !contactVisible);
  };

  if (hero) {
    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          heroVisible = entry.isIntersecting;
        });
        update();
      },
      { threshold: 0 }
    ).observe(hero);
  }

  if (contact) {
    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          contactVisible = entry.isIntersecting;
        });
        update();
      },
      { threshold: 0 }
    ).observe(contact);
  }

  syncHeight();
  window.addEventListener("resize", syncHeight, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(syncHeight).observe(bar);

  update();
};
