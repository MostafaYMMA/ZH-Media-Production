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
    components/  navbar, footer, buttons, project-card, icon, testimonials, transformations
    pages/       one file per page for page-specific layout
    main.css     imports base + components; every page also links its own pages/<name>.css
  js/
    main.js          entry point, feature-detects what's on the page and boots the right modules
    modules/         navbar.js, navIndicator.js, scrollReveal.js, counter.js, projectGrid.js, pointer.js, contactForm.js
    data/
      projects.js    the Work grid's list of reel screenshots
  images/
    results/       Before/After coach profile screenshots (home "Account transformations")
    reels/         reel-01..27.webp — the Work grid (real reels, view count baked in)
```

Every local CSS/JS reference carries a `?v=N` query (in the HTML tags and in `main.css`'s
`@import`s). **Bump every `?v=` together whenever you change CSS or JS** — GitHub Pages and
mobile browsers cache assets aggressively, so without a version bump a redeploy won't reach
visitors.

### Adding / removing reels on the Work page

Drop a `reel-NN.webp` into `assets/images/reels/` and update the loop count in
`assets/js/data/projects.js`. Cards are framed stills only — the site does not host or play the
reels.

### Placeholder content still to replace

- The **home hero image** points at a random `picsum.photos` image — swap for a real coach still.
- The **founder** photo/name/story on `about.html` is a placeholder monogram (`Ziad Hazem`).
- The **"The receipts"** testimonials on Home (names / handles / quotes / numbers) are placeholders.
- Email (`hello@zhmediaproduction.com`), address, and the footer Instagram link (`#` href) are placeholders.

### Contact form

`contact.html`'s form has no server backend. On a valid submit, `contactForm.js` opens a
WhatsApp (`wa.me`) link with the details pre-filled (studio number in `WHATSAPP_NUMBER` at the
top of that module). To move to a real endpoint later, POST the module's normalised `data`
object and drop the `data-unwired` attribute.

### Motion / interaction notes

- **Icon hover**: `.icon-interactive` (see `assets/css/components/icon.css`) scales/rotates slightly on hover/focus.
- **Scroll-reveal**: add `data-reveal` (and optionally `data-reveal-delay="150"`) to fade/slide an element in on scroll (`scrollReveal.js`, via IntersectionObserver). Wrap a grid/list in `data-reveal-group` to auto-stagger its children.
- **Sliding nav indicator**: `navIndicator.js` moves a shared pill between nav links on hover/focus using `getBoundingClientRect()` + CSS transitions.
- Work-grid cards: a framed reel screenshot that zooms slightly on hover. No playback.
- Respects `prefers-reduced-motion`.

</details>
