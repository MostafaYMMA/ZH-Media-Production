window.ZH = window.ZH || {};

(function () {
  function createProjectCard(project) {
    const card = document.createElement("article");
    card.className = "project-card";
    card.setAttribute("data-reveal", "");
    card.innerHTML = `
      <div class="project-card__media">
        <img
          class="project-card__poster"
          src="${project.thumbnail}"
          alt="${project.alt || "Reel produced for a fitness coach"}"
          loading="lazy"
        />
      </div>
    `;
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
