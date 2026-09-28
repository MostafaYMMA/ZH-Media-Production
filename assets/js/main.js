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

  // "How we work together": lights each step, and its segment of the line,
  // as it reaches the middle of the screen.
  if (window.ZH.initJourney) window.ZH.initJourney();

  if (window.ZH.initPointerFX) window.ZH.initPointerFX();

  // Sales video, testimonial videos, and voice notes. Resolves each player's
  // data-media-key against window.ZH.media (assets/js/media-config.js), then
  // replaces the native controls with the custom UI.
  if (window.ZH.initMediaPlayers) window.ZH.initMediaPlayers();

  // Video-testimonial strip: adds the arrows and dots over the CSS scroll-snap.
  if (window.ZH.initCarousels) window.ZH.initCarousels();

  // Fixed "Book a call" bar on phones, between the hero and the contact form.
  if (window.ZH.initStickyCta) window.ZH.initStickyCta();

  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form: client-side validation + input hardening (no backend yet).
  if (window.ZH.initContactForm) window.ZH.initContactForm();
});
