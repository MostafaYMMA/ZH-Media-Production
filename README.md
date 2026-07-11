# ZH Media Production — Website

Static marketing/portfolio site for a content-creation/media-production studio. Pure HTML/CSS/JS — no build step, no backend required to run.

## Running locally

Just open `index.html` in a browser (double-click it, or right-click → Open With). No dev server needed — the navbar/footer are plain duplicated HTML per page, not fetched, so it works straight off disk.

## Structure

```
index.html / work.html / services.html / about.html / contact.html
assets/
  css/
    base/        design tokens, reset, typography
    components/  navbar, footer, buttons, project-card, modal, icon — reusable across pages
    pages/       one file per page for page-specific layout
    main.css     imports base + components; every page also links its own pages/<name>.css
  js/
    main.js          entry point, feature-detects what's on the page and boots the right modules
    modules/         navbar.js, navIndicator.js, scrollReveal.js, videoPreview.js, videoModal.js
    data/
      projects.js    single source of truth for portfolio projects (Home "featured" + full Work grid)
  images/        logo/, projects/ (poster stills), icons/
  video/previews/ short local muted looping teaser clips
```

## Adding a portfolio project

Edit `assets/js/data/projects.js` — add an object with `title`, `category`, `thumbnail`, `teaserSrc`, `vimeoId`, and `featured` (true if it should also show on the Home page). Both the Home and Work grids render from this file automatically.

## Placeholder content to replace

- `assets/images/projects/*.jpg` and `assets/video/previews/*.mp4` referenced in `projects.js` don't exist yet — add real poster stills and short (2-5s, muted, compressed) teaser clips with matching filenames.
- Every project currently points at the same placeholder Vimeo ID (`76979871`) — swap in real Vimeo video IDs once footage is uploaded.
- Team photos on `about.html` are empty placeholder blocks (`.team-member__photo`) — add real `<img>` sources.
- Email (`hello@zhmediaproduction.com`), address, and social links (`#` hrefs in the footer) are placeholders — search-and-replace across the HTML files once real accounts exist.
- Hero stats on Home (`20+ Clients`, `1 Year in business`) and the About page intro reflect where the studio is today — update as those numbers change.

## Contact form

`contact.html`'s form is UI-only (marked `data-unwired` in the HTML) — it doesn't send anywhere yet. When ready to wire it up, either point its `action` at a form service (e.g. Formspree) or a serverless function, and remove the `data-unwired` attribute (and its associated guard in `main.js`) once real submit logic is in place.

## Motion / interaction notes

- **Icon hover**: any icon wrapped in `.icon-interactive` (see `assets/css/components/icon.css`) scales/rotates slightly on hover/focus — currently used on the Home workflow icons and the footer social icons.
- **Scroll-reveal**: add `data-reveal` (and optionally `data-reveal-delay="150"`) to any element to fade/slide it in on scroll — handled by `assets/js/modules/scrollReveal.js` via IntersectionObserver. Wrap a grid/list container in `data-reveal-group` (see `.project-grid`, `.workflow-grid`, `.about-values`, `.team-grid`, `.pricing-grid`, `.services-list`) to auto-stagger its direct `[data-reveal]` children instead of hand-setting delays.
- **Sliding nav indicator**: `assets/js/modules/navIndicator.js` moves a single shared pill (`.navbar__indicator`) between nav links on hover/focus using `getBoundingClientRect()` + a CSS transition — works on both the desktop and mobile nav since it's driven by real element positions, not a fixed axis.
- Project cards: hover plays the local teaser clip; clicking opens a modal with the full Vimeo embed (`videoPreview.js` + `videoModal.js`).
- Respects `prefers-reduced-motion` (see `reset.css`).
