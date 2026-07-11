# ZH Media Production — Website

The marketing and portfolio website for **ZH Media Production**, a content-creation and media-production studio.

**🔗 Live site:** [mostafaymma.github.io/ZH-Media-Production](https://mostafaymma.github.io/ZH-Media-Production/)
*(if the link above isn't live yet, GitHub Pages may still be deploying — give it a minute after enabling it in the repo's Settings → Pages)*

> **Note for reviewers:** this is a work-in-progress build. Portfolio images/videos are currently placeholder stock photos, not real client work — they'll be swapped for actual footage before launch.

---

## What's on the site

| Page | What it shows |
|---|---|
| **Home** | Hero intro, featured work, and the content → filming → editing workflow |
| **Work** | Full portfolio grid — hover a project to preview, click to watch |
| **Services** | What the studio offers, plus package/pricing tiers |
| **About** | Studio story, values, and team |
| **Contact** | Project inquiry form and direct contact info |

## Design highlights

- Smooth scroll-reveal animations as you scroll down each page
- A sliding highlight that follows your cursor across the top navigation
- Hover-interactive icons and project cards throughout
- Fully responsive — works on desktop, tablet, and mobile

---

## For developers

<details>
<summary>Click to expand build/setup notes</summary>

Static site — plain HTML/CSS/JS, no build step, no backend required to run.

### Running locally

Open `index.html` directly in a browser (double-click it). No dev server needed.

### Structure

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

### Adding a portfolio project

Edit `assets/js/data/projects.js` — add an object with `title`, `category`, `thumbnail`, `teaserSrc`, `vimeoId`, and `featured` (true if it should also show on the Home page). Both the Home and Work grids render from this file automatically.

### Placeholder content still to replace

- `projects.js` thumbnails currently point at random `picsum.photos` images — swap for real poster stills and short (2-5s, muted, compressed) teaser clips in `assets/video/previews/`.
- Every project currently points at the same placeholder Vimeo ID (`76979871`) — swap in real Vimeo video IDs once footage is uploaded.
- Team photos on `about.html` use placeholder portraits — swap for real photos.
- Email (`hello@zhmediaproduction.com`), address, and social links (`#` hrefs in the footer) are placeholders.
- Hero stats on Home (`20+ Clients`, `1 Year in business`) should be updated as those numbers change.

### Contact form

`contact.html`'s form is UI-only (marked `data-unwired`) — it doesn't send anywhere yet. Point its `action` at a form service (e.g. Formspree) or a serverless function, and remove the `data-unwired` attribute (and its guard in `main.js`) once real submit logic is in place.

### Motion / interaction notes

- **Icon hover**: `.icon-interactive` (see `assets/css/components/icon.css`) scales/rotates slightly on hover/focus.
- **Scroll-reveal**: add `data-reveal` (and optionally `data-reveal-delay="150"`) to fade/slide an element in on scroll (`scrollReveal.js`, via IntersectionObserver). Wrap a grid/list in `data-reveal-group` to auto-stagger its children.
- **Sliding nav indicator**: `navIndicator.js` moves a shared pill between nav links on hover/focus using `getBoundingClientRect()` + CSS transitions.
- Project cards: hover brightens the poster; clicking opens a modal with the full Vimeo embed.
- Respects `prefers-reduced-motion`.

</details>
