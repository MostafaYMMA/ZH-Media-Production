window.ZH = window.ZH || {};

/* ==========================================================================
   Section navigation for the one-page site.

   The whole site now lives on index.html as #home / #work / #services /
   #about / #contact sections (see .snap-section in section-scroll.css). This
   module:
     - smooth-scrolls to a section on nav-link click (respects reduced motion)
     - moves keyboard focus to the target section after the jump
     - highlights the nav link for whichever section is crossing the viewport
       middle, via aria-current="page" (styled in navbar.css)
     - keeps the URL hash in sync with replaceState (no history spam)
     - keeps --header-height in sync with the real fixed navbar so anchors
       land below it, not behind it
   ========================================================================== */
window.ZH.initSectionNav = function () {
  const navbar = document.querySelector(".navbar");
  const links = Array.prototype.slice.call(
    document.querySelectorAll('.navbar__link[href^="#"]')
  );
  if (!links.length) return;

  const sections = links
    .map(function (link) {
      return document.getElementById(link.getAttribute("href").slice(1));
    })
    .filter(Boolean);
  if (!sections.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  // Keep --header-height matched to the actual navbar height (it shrinks on
  // scroll and reflows on resize), so scroll-margin-top stays accurate.
  const syncHeaderHeight = function () {
    if (!navbar) return;
    const h = Math.round(navbar.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--header-height", h + "px");
  };
  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight, { passive: true });
  window.addEventListener("scroll", syncHeaderHeight, { passive: true });
  if ("ResizeObserver" in window && navbar) {
    new ResizeObserver(syncHeaderHeight).observe(navbar);
  }

  const setActive = function (id) {
    links.forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  // While a click-triggered smooth scroll is in flight, freeze the observer so
  // the active state doesn't flicker through every section it passes over.
  let clickScrolling = false;
  let clickTimer = 0;

  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      clickScrolling = true;
      window.clearTimeout(clickTimer);
      clickTimer = window.setTimeout(function () {
        clickScrolling = false;
      }, 800);

      setActive(id);
      target.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start",
      });
      history.replaceState(null, "", "#" + id);

      // Land keyboard / screen-reader focus inside the section, not stranded
      // back at the nav. tabindex -1 makes the section programmatically
      // focusable without adding it to the tab order.
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  // Highlight whichever section is crossing the vertical middle of the
  // viewport. A thin band (via rootMargin) + threshold 0 works even though
  // every section is taller than one screen.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        if (clickScrolling) return;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            history.replaceState(null, "", "#" + entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  // Deep link (a shared /#services link, or one of the old .html URLs that
  // redirects to a hash). The browser's own jump fires before --header-height
  // is measured, and — more importantly — before the images above the target
  // have loaded, so the page grows underneath the landing point and the visitor
  // ends up in the wrong section. Re-assert the target on the next frame, again
  // on window load, and once more after a short settle.
  if (window.location.hash) {
    const initial = document.getElementById(window.location.hash.slice(1));
    if (initial) {
      const land = function () {
        initial.scrollIntoView({ behavior: "auto", block: "start" });
      };
      window.requestAnimationFrame(land);
      window.addEventListener("load", function () {
        land();
        window.setTimeout(land, 250);
      });
    }
  }
};
