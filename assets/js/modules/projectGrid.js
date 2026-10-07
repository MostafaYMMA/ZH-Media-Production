window.ZH = window.ZH || {};

(function () {
  /* Strings come from assets/js/i18n.js, which picks its dictionary off
     <html lang>. Guarded so this module still works if that file is absent. */
  function tr() {
    return window.ZH.t ? window.ZH.t.apply(null, arguments) : arguments[0];
  }

  /* One Before / After pair. The figures row reuses the account-transformation
     classes (transformations.css) so views read exactly like the follower
     jumps above: dim "before" → volt "after". Their RTL handling (rtl.css)
     comes along for free. */
  function createProjectCard(project) {
    const card = document.createElement("article");
    card.className = "project-card";
    card.setAttribute("data-glow", "");

    const beforeMedia = project.before
      ? `<img class="project-card__poster" src="${project.before}" alt="${project.beforeAlt}" loading="lazy" width="536" height="838" />`
      : `<div class="project-card__placeholder"><span>${tr("work.beforeSoon")}</span></div>`;

    card.innerHTML = `
      <div class="project-card__pair">
        <div class="project-card__media">
          <span class="transformation__tag">${tr("work.before")}</span>
          ${beforeMedia}
        </div>
        <div class="project-card__media">
          <span class="transformation__tag transformation__tag--after">${tr("work.after")}</span>
          <img
            class="project-card__poster"
            src="${project.thumbnail}"
            alt="${project.alt || tr("work.reelAlt")}"
            loading="lazy"
            width="536"
            height="838"
          />
        </div>
      </div>
      <div class="project-card__meta">
        <span class="transformation__range">
          <span class="transformation__from">${project.beforeViews || "—"}</span>
          ${project.beforeViews ? "" : `<span class="sr-only">${tr("work.beforeViewsSoon")}</span>`}
          <span class="transformation__arrow" aria-hidden="true">${tr("work.arrow")}</span>
          <span class="sr-only">${tr("work.reached")}</span>
          <span class="transformation__to">${project.views}</span>
          <span class="transformation__unit">${tr("work.views")}</span>
        </span>
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
