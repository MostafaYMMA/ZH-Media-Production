window.ZH = window.ZH || {};

window.ZH.initNavbar = function () {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const toggle = navbar.querySelector(".navbar__toggle");
  const links = navbar.querySelectorAll(".navbar__link");

  // Backdrop for the mobile drawer — injected so the markup stays clean and
  // every page gets it. Styled only inside navbar.css's mobile media query.
  let backdrop = null;
  if (toggle) {
    backdrop = document.createElement("div");
    backdrop.className = "navbar__backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    navbar.appendChild(backdrop);
  }

  const setOpen = function (open) {
    navbar.classList.toggle("is-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  if (toggle) {
    toggle.addEventListener("click", function () {
      setOpen(!navbar.classList.contains("is-open"));
    });
    backdrop.addEventListener("click", function () {
      setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
    // If the viewport grows back to desktop while the drawer is open, drop the
    // open state so the body scroll lock doesn't stick.
    window.addEventListener("resize", function () {
      // Must match navbar.css's drawer breakpoint (see the note there).
      if (window.innerWidth > 980 && navbar.classList.contains("is-open")) {
        setOpen(false);
      }
    });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  const onScroll = function () {
    navbar.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
};
