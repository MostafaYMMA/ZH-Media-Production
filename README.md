# ZH Personal Branding — Website

The marketing and portfolio website for **ZH Personal Branding**, a content-creation and media-production studio.

**🔗 Live site:** [mostafaymma.github.io/ZH-Media-Production](https://mostafaymma.github.io/ZH-Media-Production/)
*(if the link above isn't live yet, GitHub Pages may still be deploying — give it a minute after enabling it in the repo's Settings → Pages)*

> **Note for reviewers:** this is a work-in-progress build. Portfolio images/videos are currently placeholder stock photos, not real client work — they'll be swapped for actual footage before launch.

---

## What's on the site

It's a **single page** — the nav links jump between sections that scroll into each other —
and it ships in **two languages**: Arabic at [`/`](https://mostafaymma.github.io/ZH-Media-Production/)
(the default) and English at [`/en/`](https://mostafaymma.github.io/ZH-Media-Production/en/).
The pill in the top corner of the navbar switches between them.

| Section | What it shows |
|---|---|
| **#home** | Hero, "why us", real Before/After account transformations, workflow |
| **#work** | Wall of real reels (screenshots with view counts) — a deliberate mix of styles |
| **#clients** | Roster of client accounts as profile cards (avatar + name + @handle) |
| **#services** | The pipeline, the 12 / 24 Reels packages, and an FAQ (no prices — "Book a call") |
| **#about** | Studio story, founder block, and why coaches trust us |
| **#contact** | Booking form that hands off to WhatsApp, plus contact info |

The old `work.html` / `services.html` / `about.html` / `contact.html` URLs still work — they
redirect to the matching section on `index.html`, and `/en/` has the same four stubs.

## Design highlights

- Smooth scroll-reveal animations as you scroll down each page
- A sliding highlight that follows your cursor across the top navigation
- Hover-interactive icons and project cards throughout
- Fully responsive — works on desktop, tablet, and mobile (verified 320px → 1440px)
- Lighthouse mobile: **100 accessibility / 100 best practices / 100 SEO**

---

## For developers

<details>
<summary>Click to expand build/setup notes</summary>

Static site — plain HTML/CSS/JS, no build step, no backend required to run.

### Running locally

Open `index.html` (Arabic) or `en/index.html` (English) directly in a browser
(double-click it). No dev server needed — every path is relative.

### Structure

```
index.html                       the whole site, in Arabic — all sections on one page
en/index.html                    the same document in English
work/services/about/contact.html redirect stubs → index.html#<section>
en/…                             the same four stubs for the English build
assets/
  css/
    base/        design tokens, reset, typography, rtl.css (the Arabic/RTL layer)
    components/  navbar, footer, buttons, project-card, icon, testimonials,
                 transformations, clients (roster cards),
                 section-scroll (one-page section offsets + skip link)
    pages/       home/work/services/about/contact layout — index.html loads all five
    main.css     imports base + components; index.html links all pages/<name>.css
  js/
    main.js          entry point, feature-detects what's on the page and boots the right modules
    modules/         navbar.js, navIndicator.js, sectionNav.js (one-page smooth-scroll nav +
                     active-link state), scrollReveal.js, counter.js, projectGrid.js,
                     pointer.js, contactForm.js
    i18n.js          UI strings for text the JS builds (player labels, form errors, alt
                     text); picks its dictionary from <html lang>, so it loads first
    data/
      projects.js    the Work grid's ordered list of reels (deliberate style mix)
  images/
    results/       Before/After coach profile screenshots (home "Account transformations")
    clients/       client-01..18.webp — round avatars for the #clients roster (cropped from profile screenshots)
    reels/         reel-01..20.webp — the Work grid (real reels, view count baked in)
```

Every local CSS/JS reference carries a `?v=N` query (in the HTML tags and in `main.css`'s
`@import`s). **Bump every `?v=` together whenever you change CSS or JS** — in *both* HTML
documents — GitHub Pages and mobile browsers cache assets aggressively, so without a version
bump a redeploy won't reach visitors.

### The two language builds

Both documents share every stylesheet and every script; they differ only in their copy and
in `<html lang dir>`. **Change one's structure and you must change the other's** — they are
meant to stay line-for-line parallel. The RTL mirroring is done by the browser, because the
CSS uses logical properties (`inset-inline-start`, `text-align: start`, …); `assets/css/base/rtl.css`
only carries what `dir` can't do by itself — Arabic type (Cairo), killing `letter-spacing`
(tracking breaks Arabic letter joining), and the few physical transforms and backgrounds that
`direction` never mirrors. See `CLAUDE.md` for the full rules before touching either build.

### Changing the Work-page reels

`assets/js/data/projects.js` is an explicit ordered array (one `views` string per reel, mapped
to `reel-01.webp`, `reel-02.webp`, …). The order is intentional — a visible mix of
shot-in-the-gym and cut-out/graphic reels, no two cut-out reels adjacent — so re-export the
webp files in the new order and edit the array. Cards are framed stills only; no playback.

### Placeholder content still to replace

- The **home hero image** points at a random `picsum.photos` image — swap for a real coach still.
- The **founder** photo/name/story on `about.html` is a placeholder monogram (`Ziad Hazem`).
- The **"The receipts"** testimonials on Home (names / handles / quotes / numbers) are placeholders.
- The **#clients roster** has 18 real cards. Two display names are guessed from the handle (`@itskaty___`, `@sakr_procoaching`) — confirm those.
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
- **One-page section nav**: `sectionNav.js` smooth-scrolls to `#section` on nav click, moves focus into the section, and highlights the current link (`aria-current="page"`) with an IntersectionObserver as you scroll. Keeps `--header-height` matched to the fixed navbar so jumps land below it. No CSS scroll-snap (sections are multi-viewport; it fought the jump landing).
- Work-grid cards: a framed reel screenshot that zooms slightly on hover. No playback.
- Respects `prefers-reduced-motion`.

</details>
