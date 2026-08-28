// Entry point. Loaded as a classic script (not an ES module) so the site works
// when opened directly from disk (file://) as well as over a web server.
// The module files each attach their init functions to the shared window.ZH
// namespace and must be included before this file.
window.ZH = window.ZH || {};

document.addEventListener("DOMContentLoaded", function () {
  window.ZH.initNavbar();
  window.ZH.initNavIndicator();
  if (window.ZH.initSectionNav) window.ZH.initSectionNav();

  const fullGrid = document.querySelector("[data-project-grid='all']");
  if (fullGrid && window.ZH.renderProjectGrid) {
    window.ZH.renderProjectGrid(fullGrid, window.ZH.projects);
  }

  // Reveal must run after any grid above has been rendered into the DOM
  window.ZH.initScrollReveal();

  if (window.ZH.initCounters) window.ZH.initCounters();

  if (window.ZH.initPointerFX) window.ZH.initPointerFX();

  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form: client-side validation + input hardening (no backend yet).
  if (window.ZH.initContactForm) window.ZH.initContactForm();
});
