window.ZH = window.ZH || {};

window.ZH.initNavIndicator = function () {
  const nav = document.querySelector(".navbar__links");
  const indicator = nav ? nav.querySelector(".navbar__indicator") : null;
  const links = nav ? nav.querySelectorAll(".navbar__link") : null;
  if (!nav || !indicator || !links || !links.length) return;

  const moveIndicatorTo = function (link) {
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.height = `${linkRect.height}px`;
    indicator.style.transform = `translate(${linkRect.left - navRect.left}px, ${
      linkRect.top - navRect.top
    }px)`;
    indicator.classList.add("is-active");
  };

  const hideIndicator = function () {
    indicator.classList.remove("is-active");
  };

  links.forEach(function (link) {
    link.addEventListener("mouseenter", function () {
      moveIndicatorTo(link);
    });
    link.addEventListener("focus", function () {
      moveIndicatorTo(link);
    });
  });

  nav.addEventListener("mouseleave", hideIndicator);
  nav.addEventListener("focusout", function (e) {
    if (!nav.contains(e.relatedTarget)) hideIndicator();
  });

  // A resize can invalidate the last computed rect while the indicator is
  // showing; simplest safe fix is to hide it rather than track it live.
  window.addEventListener("resize", hideIndicator);
};
