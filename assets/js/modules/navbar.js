window.ZH = window.ZH || {};

window.ZH.initNavbar = function () {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const toggle = navbar.querySelector(".navbar__toggle");
  const links = navbar.querySelectorAll(".navbar__link");

  if (toggle) {
    toggle.addEventListener("click", function () {
      const isOpen = navbar.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      navbar.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });

  const onScroll = function () {
    navbar.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
};
