window.ZH = window.ZH || {};

(function () {
  let modalEl = null;

  function buildModal() {
    const modal = document.createElement("div");
    modal.className = "video-modal";
    modal.innerHTML = `
      <div class="video-modal__backdrop" data-close></div>
      <div class="video-modal__dialog" role="dialog" aria-modal="true" aria-label="Project video">
        <button class="video-modal__close" type="button" aria-label="Close video" data-close>&times;</button>
        <div class="video-modal__frame"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", function (e) {
      if (e.target.dataset.close !== undefined) window.ZH.closeVideoModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        window.ZH.closeVideoModal();
      }
    });

    return modal;
  }

  window.ZH.initVideoModal = function () {
    if (!modalEl) modalEl = buildModal();
  };

  window.ZH.openVideoModal = function (vimeoId, title) {
    title = title || "";
    if (!modalEl) modalEl = buildModal();

    const frame = modalEl.querySelector(".video-modal__frame");
    frame.innerHTML = `
      <iframe
        src="https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}?autoplay=1&title=0&byline=0&portrait=0"
        title="${title}"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;

    modalEl.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  window.ZH.closeVideoModal = function () {
    if (!modalEl) return;
    modalEl.classList.remove("is-open");
    document.body.style.overflow = "";
    // Clear the iframe so playback actually stops
    modalEl.querySelector(".video-modal__frame").innerHTML = "";
  };
})();
