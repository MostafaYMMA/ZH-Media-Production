window.ZH = window.ZH || {};

(function () {
  function createProjectCard(project) {
    const card = document.createElement("article");
    card.className = "project-card";
    card.setAttribute("data-reveal", "");
    card.innerHTML = `
      <button class="project-card__media" type="button" aria-label="Play ${project.title}">
        <img class="project-card__poster" src="${project.thumbnail}" alt="${project.title}" loading="lazy" />
        <video class="project-card__teaser" src="${project.teaserSrc}" muted loop playsinline preload="none"></video>
        <span class="project-card__play" aria-hidden="true"></span>
      </button>
      <div class="project-card__info">
        <span class="project-card__category">${project.category}</span>
        <h3 class="project-card__title">${project.title}</h3>
      </div>
    `;

    const mediaBtn = card.querySelector(".project-card__media");
    const video = card.querySelector(".project-card__teaser");

    mediaBtn.addEventListener("mouseenter", function () {
      video.currentTime = 0;
      video.play().catch(function () {});
    });

    mediaBtn.addEventListener("mouseleave", function () {
      video.pause();
    });

    mediaBtn.addEventListener("click", function () {
      window.ZH.openVideoModal(project.vimeoId, project.title);
    });

    return card;
  }

  window.ZH.renderProjectGrid = function (container, projectList) {
    if (!container) return;
    const fragment = document.createDocumentFragment();
    projectList.forEach(function (project) {
      fragment.appendChild(createProjectCard(project));
    });
    container.appendChild(fragment);
  };
})();
