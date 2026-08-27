# ZH Personal Branding — Website

The marketing and portfolio website for **ZH Personal Branding**, a content-creation and media-production studio.

**🔗 Live site:** [mostafaymma.github.io/ZH-Media-Production](https://mostafaymma.github.io/ZH-Media-Production/)
*(if the link above isn't live yet, GitHub Pages may still be deploying — give it a minute after enabling it in the repo's Settings → Pages)*

> **Note for reviewers:** this is a work-in-progress build. Portfolio images/videos are currently placeholder stock photos, not real client work — they'll be swapped for actual footage before launch.

---

## What's on the site

| Page | What it shows |
|---|---|
| **Home** | Hero, "why us", real Before/After account transformations, workflow, testimonials |
| **Work** | Wall of real reels (screenshots with view counts) — a deliberate mix of styles |
| **Services** | The pipeline, the 12 / 24 Reels packages, and an FAQ (no prices — "Book a call") |
| **About** | Studio story, founder block, and why coaches trust us |
| **Contact** | Booking form that hands off to WhatsApp, plus contact info |

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
      projects.js    the Work grid's ordered list of reels (deliberate style mix)
  images/
    results/       Before/After coach profile screenshots (home "Account transformations")
    reels/         reel-01..20.webp — the Work grid (real reels, view count baked in)
```

Every local CSS/JS reference carries a `?v=N` query (in the HTML tags and in `main.css`'s
`@import`s). **Bump every `?v=` together whenever you change CSS or JS** — GitHub Pages and
mobile browsers cache assets aggressively, so without a version bump a redeploy won't reach
visitors.

### Changing the Work-page reels

`assets/js/data/projects.js` is an explicit ordered array (one `views` string per reel, mapped
to `reel-01.webp`, `reel-02.webp`, …). The order is intentional — a visible mix of
shot-in-the-gym and cut-out/graphic reels, no two cut-out reels adjacent — so re-export the
webp files in the new order and edit the array. Cards are framed stills only; no playback.

### Placeholder content still to replace

- The **home hero image** points at a random `picsum.photos` image — swap for a real coach still.
- The **founder** photo/name/story on `about.html` is a placeholder monogram (`Ziad Hazem`).
- The **"The receipts"** testimonials on Home (names / handles / quotes / numbers) are placeholders.
- Email (`hello@zhpersonalbranding.com`), address, and the footer Instagram link (`#` href) are placeholders.

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
