window.ZH = window.ZH || {};

(function () {
  /* Strings come from assets/js/i18n.js, which picks its dictionary off
     <html lang>. Guarded so this module still works if that file is absent. */
  function tr() {
    return window.ZH.t ? window.ZH.t.apply(null, arguments) : arguments[0];
  }

  function createProjectCard(project) {
    const card = document.createElement("article");
    card.className = "project-card";
    card.setAttribute("data-reveal", "");
    card.innerHTML = `
      <div class="project-card__media">
        <img
          class="project-card__poster"
          src="${project.thumbnail}"
          alt="${project.alt || tr("work.reelAlt")}"
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
