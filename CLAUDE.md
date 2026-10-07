# CLAUDE.md

Context for working on this repository. Read this first before making changes.

## What this is

**ZH Personal Branding** — the marketing site for a digital-marketing studio that does
**personal branding for fitness coaches**. The studio handles the whole content pipeline
for a coach: **script writing → video recording → video editing (reels & short-form)**.
The founder has 5+ years in the fitness world, so the positioning is "content run by
people who came up in the gym, not a generic agency."

Core landing-page message: **you're a coach, not an editor — you don't have time to market
your own brand, so we do it for you (done-for-you).**

**Packages** (currently two, sold by monthly reel output — both fully done-for-you,
scripting + shooting + editing all included):
- **12 Reels / month** (Starter) — steady, ~3 reels a week.
- **24 Reels / month** (Scale, featured) — double the output for coaches going all-in.

Prices are intentionally not shown on the site yet — the CTA everywhere is **"Book a call."**
Don't invent price figures.

This is a **static, hand-built site** — plain HTML + CSS + vanilla JS. No framework, no
build step, no `package.json`. It's meant to be opened directly (`file://`) or served as
static files. Live site link is in `README.md`.

## Running / previewing

Just open `index.html` (Arabic) or `en/index.html` (English) in a browser, or serve the
folder statically (e.g. `python -m http.server`). There is nothing to compile. Fonts load
from Google Fonts and placeholder images from `picsum.photos`, so a preview needs internet
until real assets are dropped in.

## File layout

```
index.html          THE WHOLE SITE, IN ARABIC — one page, sections #home / #work
                    / #services / #about / #contact scroll into each other (see
                    "Single-page architecture" below). Arabic is the default build.
en/index.html       The same document in English (see "Two languages" below)
about.html          Redirect stub → index.html#about (kept for old links/bookmarks)
services.html       Redirect stub → index.html#services
work.html           Redirect stub → index.html#work
contact.html        Redirect stub → index.html#contact
en/about|services|work|contact.html
                    The same four stubs for the English build → en/index.html#…
assets/
  css/
    main.css              Entry stylesheet — @imports everything below
    base/
      variables.css       DESIGN TOKENS — colors, fonts, spacing, motion. Start here.
      reset.css           Box-sizing reset + reduced-motion global
      typography.css      Heading/body/eyebrow type rules
      rtl.css             Arabic/RTL layer — everything `dir` can't do by itself
    components/           navbar, footer, buttons, project-card, icon, testimonials,
                          transformations, clients (roster profile cards),
                          section-scroll (one-page section offsets)
    pages/                home, about, services, work, contact — ALL loaded together
                          by index.html now; each stays scoped to its own classes
  js/
    main.js               Entry point — runs init fns on DOMContentLoaded
    modules/              navbar, navIndicator, sectionNav (one-page nav: smooth
                          scroll + active-link state), scrollReveal, counter,
                          projectGrid, pointer, contactForm
    data/projects.js      Work-grid data (window.ZH.projects) — single source of truth
    i18n.js               UI strings for text the JS BUILDS (player labels, form errors,
                          generated alt text). Keyed off <html lang>. Loaded first.
  images/
    results/              Before/After coach profile screenshots (webp) — home "Account transformations"
    clients/              client-01..18.webp — round avatars for the "#clients" roster, cropped
                          from the profile screenshots in _originals/clients/
    reels/                reel-01..20.webp — the Work grid, in a deliberate style-mix order (see below)
    _originals/           Raw HEIC/oversized source screenshots — GIT-IGNORED, local only
  video/                  Real assets go here (mostly empty placeholders for now)
```

## Single-page architecture

The site is **one document**. `index.html` holds every section — `#home`, `#work`,
`#clients`, `#services`, `#about`, `#contact` (nav order) — each wrapped in
`<section id="…" class="snap-section">` inside `<main>`, followed by the one shared `<footer>`. `about.html` / `services.html` /
`work.html` / `contact.html` are now **redirect stubs** (`<meta http-equiv="refresh">` +
`location.replace()` + `<link rel="canonical">`) that bounce to the matching `#hash` — keep
them so old inbound links and bookmarks still land right.

- `index.html` loads **all five** `pages/*.css` files and every JS module (projects +
  projectGrid for `#work`, contactForm for `#contact`, counter for the hero stats).
- **`#clients`** is a plain HTML section (`components/clients.css`) — a 2-row band of profile
  cards (avatar + name + `@handle`, no full screenshots) that scrolls horizontally when the
  roster outgrows the width (`.clients-scroller` > `.clients-grid`, `grid-auto-flow: column`).
  18 real client cards; round avatars in `assets/images/clients/` were cropped from the profile
  screenshots (a Python crop script lived in the session scratchpad, not committed).
- **Nav links are hash links** (`href="#services"`). `sectionNav.js` (`window.ZH.initSectionNav`)
  smooth-scrolls on click (respects `prefers-reduced-motion`), moves focus into the target
  section, drives the active-link state via `aria-current="page"` with an `IntersectionObserver`
  (`rootMargin: -45% 0 -45%` so it works for multi-viewport sections), keeps the URL hash in
  sync with `replaceState`, and keeps `--header-height` matched to the live navbar height so
  `scroll-margin-top` (in `components/section-scroll.css`) lands sections below the fixed bar.
- **No CSS scroll-snap.** Every section is 2–4 viewports tall; snap (even `proximity`) hijacks
  the landing point of a nav jump. The "one page" feel is just smooth scroll + header offset.
  See the note at the top of `section-scroll.css`.
- **Deep links must survive image load.** `sectionNav.js` re-asserts the target on `load` and
  again 250ms later, because lazy images *above* the target grow the page after the initial jump
  and would otherwise strand the visitor a section early — this broke `/#services` and every
  redirect stub. For the same reason **every `<img>` needs `width`/`height` (or a CSS
  `aspect-ratio` box, as `.project-card__media` has)** so its space is reserved before it loads.
- Inner-section heroes use `<h2>` (not `<h1>`) since they share the document with the home
  `<h1>`; `main.css` keeps `.page-hero__head h2` at `--fs-h1` scale.
- There's a `.skip-link` (top of `<body>`) styled in `section-scroll.css`.

## Two languages (Arabic default, English at /en/)

The site ships as **two documents built from the same markup, the same stylesheets and the
same scripts**. Arabic is the default at `/`; English lives at `/en/`. They differ only in
their copy and in the `<html lang dir>` line:

| | Arabic | English |
|---|---|---|
| URL | `/` (`index.html`) | `/en/` (`en/index.html`) |
| root element | `<html lang="ar" dir="rtl">` | `<html lang="en" dir="ltr">` |
| asset paths | `assets/…` | `../assets/…` |
| font | Cairo (400/600/700/900) | Anton + Barlow + Barlow Semi Condensed |

**If you change one document's structure, change the other's.** They are meant to stay
line-for-line parallel; only the text nodes differ. (`en/index.html` was the source the
Arabic one was generated from, which is why they match exactly.)

- **Asset paths.** Everything is relative, so the site still opens over `file://`. The
  English build sits one directory down, so its `<head>` sets `window.ZH.base = "../"` and
  the two data files (`data/projects.js`, `media-config.js`) prefix their root-relative
  paths with it. The Arabic build leaves `base` unset. **Never introduce a root-relative
  (`/assets/…`) path** — GitHub Pages serves this repo from a subdirectory.
- **Language switcher** is `.navbar__lang`, styled at the bottom of `base/rtl.css`. It sits
  in the navbar's **third grid column, next to the hamburger — deliberately NOT inside
  `.navbar__links`**, because that centred link row is what the 980px breakpoint was
  measured against (see the navbar note below); a seventh link would break it.
- **`hreflang`** — each document declares `ar`, `en` and `x-default` (Arabic). If the live
  URL ever changes, update all six tags.
- **Redirect stubs** exist in both places: the root four bounce to the Arabic sections,
  `en/`'s four to the English ones.

### How the RTL build actually mirrors

Almost nothing is mirrored by hand. The components use **logical properties**
(`inset-inline-start`, `padding-inline-end`, `text-align: start`…) so the browser flips
them from `dir` alone — **keep using logical properties in new CSS** and the Arabic build
stays correct for free. `base/rtl.css` only carries what `dir` cannot do:

1. **Type.** The three font tokens re-point at **Cairo**; headings go to `font-weight: 900`
   (Cairo's poster weight, since Anton's single 400 has no Arabic) and `line-height: 1.25`,
   and the display size scale steps down because Cairo is not condensed.
2. **`letter-spacing: normal` on everything.** Arabic is a *joining* script — tracking pulls
   the letters of a word apart and breaks the joins. This is the one non-negotiable rule:
   **any new tracked class is automatically covered** by the `html[dir="rtl"] *` rule, so
   don't fight it with higher specificity.
3. **Physical transforms.** `translateX` is never mirrored by `direction`, so the nav drawer
   and the ticker read their shift from a custom property (`--drawer-hidden-x`,
   `--ticker-shift`) whose sign `rtl.css` flips. Same reason `.navbar__indicator` keeps a
   **physical `left: 0`** — `navIndicator.js` feeds it a physical delta.
4. **Backgrounds.** The contact `select` caret is two clipped gradients; a background is not
   mirrored by `direction`, so `rtl.css` reflects both the pin and the gradient angles.
5. **Latin islands.** Handles, emails, `ZH`, and the brand name are marked `dir="ltr"` in the
   Arabic HTML and get the Latin stack back. **Client names and `@handles` were left in Latin
   on purpose** — they are real people's profile names and guessing an Arabic spelling would
   put a wrong name on a real client. Supply them if you want them transliterated.

**Gotcha worth knowing:** a *logical* margin resolves against the **element's own**
`direction`, not its parent's. `.navbar__lang` carries its own `dir` (it is labelled in the
language it switches *to*), so its mobile push-to-the-edge uses **physical** `margin-left` /
`margin-right` per document direction. `justify-self` on the desktop grid has no such
problem — that one resolves against the container.

### Strings the JS builds

Copy that lives in the markup is translated in the markup. The handful of labels the
modules *create* — player buttons, Before/After labels, form validation, the WhatsApp booking
message, generated reel alt text — come from **`assets/js/i18n.js`**, which picks its
dictionary off `<html lang>` and must be **loaded before every other script**. Call it as
`window.ZH.t("player.play")`, with `{0}` / `{1}` slots; each module wraps it in a guarded
`tr()` so the page still works if the file is missing, and anything absent from a dictionary
falls back to English. **Adding a runtime string means adding it to both dictionaries.**

## Architecture conventions (follow these)

- **CSS is variable-driven.** Every color, font, space, radius, and duration comes from a
  custom property in `base/variables.css`. Do **not** hardcode hex colors in component or
  page CSS — add or reuse a token. Translucent accent tints use
  `rgba(var(--color-accent-rgb), <alpha>)`.
- **JS uses a shared global namespace, not modules.** Each file in `js/modules/` attaches
  an init function to `window.ZH` (e.g. `window.ZH.initCounters`). `main.js` calls them on
  `DOMContentLoaded`. Scripts are plain `<script>` tags (no `type="module"`) so the site
  works from `file://`. Module `<script>`s must be included **before** `main.js`.
- **Scroll reveals** are opt-in via `data-reveal` (and `data-reveal-group` for staggered
  children), handled by `scrollReveal.js`. Gated behind a `.js` class added inline in
  `<head>` so content stays visible if JS fails. A `sweep()` safety net reveals anything already
  scrolled into view — once 2.5s after load **and again 250ms after every scroll stops** — because
  on a page this long a fast flick-scroll can outrun the observer (it coalesces an enter+leave
  between frames) and would otherwise leave a block permanently invisible.
- **Count-up stats** use `data-count-to="20" data-count-suffix="+"` on an element with a
  starting text of `0`; `counter.js` animates them when scrolled into view and respects
  reduced motion.
- **Cursor-reactive lighting** (`pointer.js` → `window.ZH.initPointerFX`): elements marked
  `data-spotlight` (the hero) or `data-glow` (cards) get a volt glow that follows the pointer
  via `--mx`/`--my` custom properties. Skipped on touch and under reduced motion; everything
  has a static fallback. The `[data-glow]` card-highlight rule itself lives in `main.css`.
- **Balanced inner-page heroes** use the shared `.page-hero` / `.page-hero__grid` utility in
  `main.css` (headline left, supporting lead right; single column under 860px). Home keeps its
  own bespoke split hero.
- **Contact form hardening** lives in `contactForm.js` (`window.ZH.initContactForm`). It runs
  client-side validation + input sanitisation (trim, length caps, control/zero-width stripping,
  strict format checks, rejects `<`/`>`), shows inline `.form-error` messages, and on success
  posts a `.form-status` note. **It is NOT a security boundary** — read the header comment: when
  a backend is added, the server must re-validate, use **parameterized queries** for SQL (a `--`
  is only dangerous with string-concatenated SQL, never with parameters — so don't strip it), and
  HTML-escape on output. See also the "Contact form" note under Known TODOs.
- **Mobile navigation** (`navbar.js` + `navbar.css` `@media (max-width: 980px)`): the hamburger
  moves to the **top-left** (via `order: -1`) and the nav becomes a **left slide-in drawer**
  (`.navbar__links`, `position: fixed`, `translateX(-100%)` when closed) over a `.navbar__backdrop`
  that `navbar.js` injects. Closed by the X, the backdrop, `Escape`, a link click, or a resize
  back to desktop. Desktop (the 3-column grid, centered links, sliding pill indicator) is
  unchanged. The drawer uses an explicit `height: 100dvh` (not `top/bottom: 0`) because
  `.navbar.is-scrolled`'s `backdrop-filter` makes `.navbar` the containing block for its
  `position: fixed` children — with `top/bottom:0` the drawer would collapse to the ~60px bar
  (this was the "menu broken on inner pages" bug); `.navbar.is-open.is-scrolled` also drops the
  blur as a second guard. The breakpoint is **980px, not 720px**: the centered desktop links plus
  the logo either side need ~980px, and below that the CONTACT button ran off the right edge.
  **navbar.css's media query and navbar.js's resize guard must stay in step** — re-measure both
  if a nav item is ever added or removed.
- **Cache-busting:** every local CSS/JS ref carries `?v=N` — the `<link>`/`<script>` tags in each
  HTML `<head>`/footer **and** the `@import`s in `main.css`. GitHub Pages caches assets ~10 min
  and mobile browsers hold them much longer, so **bump every `?v=` in lockstep whenever you touch
  CSS or JS** or a redeploy won't reach people — and **both** HTML documents, not just
  the one you were looking at. Currently `v=33`.
- **Accessibility floor:** keep visible focus (a branded `:focus-visible` volt ring is wired in
  `reset.css`), honor `prefers-reduced-motion` (`reset.css` + animation modules), and keep
  decorative elements `aria-hidden`. **Don't skip heading levels** — the aside/footer labels are
  `<h3>` (sized down in CSS), not `<h4>`, because the nearest section heading is an `<h2>`.
  Lighthouse mobile currently scores **100 / 100 / 100** (a11y, best practices, SEO) — keep it there.
- **Form controls must be ≥16px.** `reset.css` gives `button, input, textarea, select` `font: inherit`;
  `select` is in that list deliberately — under 16px iOS Safari zooms the page in on tap and never
  zooms back out.

## Design system (current — fitness/athletic direction)

Deliberately athletic, high-energy: deep navy canvas with an electric volt-lime accent and
condensed poster typography.

**Palette** (`base/variables.css`):
| Token | Value | Use |
|-------|-------|-----|
| `--color-bg` | `#0C1E38` | Page background (all pages) |
| `--color-bg-alt` | `#0A1A30` | Deeper bands (ticker, scrolled navbar) |
| `--color-surface` | `#122B4C` | Raised cards |
| `--color-text` | `#EAF2FF` | Primary text |
| `--color-text-muted` | `#90A6C6` | Secondary text |
| `--color-accent` | `#C6FF3A` | Volt-lime — CTAs, highlights, accents |
| `--color-accent-hover` | `#D8FF6E` | Accent hover |
| `--color-accent-ink` | `#0A1A30` | Text/icons sitting ON the accent |
| `--color-accent-rgb` | `198, 255, 58` | For `rgba()` accent tints |
| `--color-border` | `#1E3859` | Hairline borders |
| `--color-bg-deep` | `#081527` | Deepest layer — hero base, behind everything |
| `--color-surface-2` | `#16345A` | Raised nested / featured layer (e.g. featured pricing card) |
| `--color-text-dim` | `#5E769A` | Tertiary text — meta, index numerals |
| `--color-border-strong` | `#2A4A73` | Border on hover / active edges |
| `--color-danger` | `#FF6B6B` | Form validation errors (soft red, reads on navy) |

**Depth is token-driven too** — don't hand-roll shadows or flat card fills:
- `--shadow-sm / --shadow-md / --shadow-lg` — soft navy elevation; `--shadow-accent` — volt glow.
- `--gradient-surface` — top-lit card sheen; `--gradient-accent`; `--grid-line` — faint blueprint grid.
- Cards use `background: var(--gradient-surface), var(--color-surface)` **plus** a shadow (see
  `.why__item`, `.workflow-item`, `.about-value`, `.pricing-card`, `.testimonial`).
- Radii: `--radius-sm / --radius-md / --radius-lg` (lg = 22px, the card radius).

**Layout:** `--max-width: 1440px`, `--gutter: clamp(1.1rem, 2.2vw, 1.9rem)`. The canvas was
widened and the gutter cap trimmed to reduce oversized side margins, and the vertical `--space-*`
rhythm was deliberately tightened so pages read dense and confident, not sparse — together these
are the fix for the "margins feel too big" note. If margins ever feel off, adjust these tokens
rather than per-page.

**Typography** (loaded from Google Fonts in each page's `<head>`):
- `--font-display`: **Anton** — heavy condensed poster face. All headings, uppercase,
  weight 400 (Anton is a single weight — never synthetic-bold it).
- `--font-body`: **Barlow** — athletic sans for body copy.
- `--font-data`: **Barlow Semi Condensed** — eyebrows, stat labels, buttons (uppercase,
  wide tracking).

**Signature elements on the home page:**
- **Split hero** — copy on the left half, a full-height image locked to the **right half**
  (`50vw`, absolutely positioned). The photo is desaturated into a **navy duotone** so any
  image (or the current placeholder) belongs to the brand, and it sits over an ambient volt
  **mesh + faint blueprint grid** with a **cursor-tracked spotlight** (`data-spotlight`).
  Collapses to a dimmed full-width backdrop under 900px.
- **Service ticker** — a scoreboard-style marquee scrolling `Script Writing · Video
  Recording · Reels & Shorts · Editing · Personal Branding` in Anton. The track is
  duplicated and loops at `translateX(-50%)`; pauses under reduced-motion.
- **"Why you'd want us"** section — centered headline + intro, then three numbered benefit
  cards (01/02/03) with a volt top-bar that fills on hover, plus elevation and pointer glow
  (`data-glow`).
- **Numbered workflow cards** (01/02/03) with oversized bled-in step numbers.
- **Account transformations** — replaces the old "Coaches we've filmed" featured-reels grid.
  Four real coach profiles as stacked Before/After Instagram screenshots + the follower jump
  (`+delta`, `before → after`). Component in `components/transformations.css`; images (web-ready
  webp) in `assets/images/results/`. Follower counts are real; the "one to three months"
  timeframe is an approximate claim flagged in an HTML comment.
- **"The receipts" testimonials** — result-first proof cards (a growth number → quote →
  initials-monogram attribution). Component in `components/testimonials.css`.

The **footer holds the single closing CTA** at the end of the page. The old standalone
`.cta-band` was removed to kill the duplicate CTA; its CSS still lives in `main.css` but is
currently unused.

If you change the accent or fonts, update the token table above so this file stays true.

## Page status

Everything is one page (`index.html`) — see "Single-page architecture" above. All sections are
on the fitness-coach brand and share the depth-driven cards, cursor-reactive glow, and tightened
spacing. `#work` / `#services` / `#about` / `#contact` use the shared `.page-hero` two-column
hero (headline now `<h2>`); the footer carries the one closing CTA.
- **`#home`** — split hero (duotone photo / mesh+grid / spotlight; the stat band's top rule
  shrinks to the width of the stats via `align-self: flex-start`), ticker, "Why you'd want us",
  **Account transformations** (4 Before/After coach profiles), workflow, and the "The receipts"
  testimonials.
- **`#services`** — balanced hero, a **sticky two-column pipeline** (heading left, Script →
  Shoot → Edit steps right — `.services-section__grid`), centered **12 / 24 Reels** package cards
  (`.packages`), and a "How it actually works" **FAQ** covering timeline / travel / revisions /
  contract / cost (no price figures — see house rules).
- **`#about`** — balanced hero, stat band (5+ / 20+ / 100%), a **founder block** (`.founder` —
  placeholder monogram portrait + first-person story + signature), three "why coaches trust us"
  value cards. (The old fictional team section was removed.)
- **`#work`** — **Before / After by views** ("Same coach. Different numbers."). 10 pair cards
  built by `projectGrid.js` from `projects.js`: "after" = our 10 highest-viewed reels (best first),
  "before" = **placeholder frames** until the real stills arrive (`before: null` in the data; set
  `before` + `beforeViews` to fill one). Figures row reuses the `.transformation__*` classes, with
  the after count in volt. Layout is a **2-row horizontally scrolling band** (`.project-scroller` >
  `.project-grid`, `grid-auto-flow: column`), same pattern as `#clients`. **No video playback**.
- **`#clients`** — "Our clients" roster: a 2-row horizontally-scrolling band of profile cards
  (`.client-card` = circular avatar + name + `@handle`), `components/clients.css`. 18 real client
  cards (`client-01..18.webp`). To change: add/remove `<figure class="client-card">` blocks freely
  (the band just grows and scrolls), and drop a matching round avatar in `assets/images/clients/`.
- **`#contact`** — balanced hero, booking form (**package `<select>`** 12 / 24 / not sure, with
  the custom CSS arrow in `contact.css`) with **client-side validation + input hardening**
  (`contactForm.js`, inline `.form-error` / `.form-status`), and a "What happens next" info card
  in the right column.

## Known TODOs / placeholders

- **Work grid** (`assets/js/data/projects.js` → `projectGrid.js`): 20 real reels, **hand-ordered
  for a visible style mix** (see work.html note above — ~40% cut-out reels, never adjacent).
  Stills with the view count baked in — **no video hosting / playback** (removed: `videoModal.js`,
  `components/modal.css`, `<video>` teaser, `vimeoId`/`teaserSrc`). `projects.js` is an array of
  `views` strings mapped to `{ id, thumbnail, views, alt }` → `reel-01.webp`…`reel-20.webp`. To
  change: re-export the webp files in the new order and edit the array. Raw source screenshots for
  all 27 candidates are in `assets/images/_originals/` (git-ignored).
- The **home hero image** still points at a `picsum.photos` placeholder — replace with a real
  coach still. It's force-desaturated (`filter: grayscale(...)` in `home.css`); relax that once a
  real, colour-graded still is in.
- **Placeholder copy to swap** (each flagged with an HTML comment): the "The receipts"
  testimonials on Home (names / handles / quotes / growth numbers) and the founder name
  (`Ziad Hazem`) + story + monogram on About.
- **`#clients` roster** — 18 real cards. Two names are best-guesses from the handle
  (`@itskaty___` → "Katy", `@sakr_procoaching` → "Sakr Pro Coaching") since those screenshots
  had no Latin display name — confirm/replace. A few avatars are full-body or busy crops (the
  source screenshot's own profile pic) — re-crop from `_originals/clients/` if a tighter one is wanted.
- Contact form has **no backend** yet. `contactForm.js` validates + sanitises the fields
  (name / **phone** / handle / package / preferred time / preferred days / message) and, on
  success, opens WhatsApp with the details pre-filled — it does not POST anywhere. The field is a
  **phone number, not an email**: the booking is handed off over WhatsApp, so a number is what the
  studio can act on. Validation checks the digit COUNT (7–15, E.164's ceiling) rather than a shape,
  and folds Arabic-Indic digits to ASCII first, since `\d` does not match what an Arabic keyboard
  produces. When wiring a backend: send the module's normalised
  `data` object (never the raw inputs), use **parameterized queries** (SQL) and output-encoding
  (stored XSS), and re-validate server-side — the client checks are UX + first-pass only.
- Package **prices** are deliberately absent — keep it "Book a call" until told otherwise.

## House rules

- Keep it dependency-free and buildless unless there's a real reason to change that.
  `node_modules/`, `package.json`, `package-lock.json` are git-ignored — they only appear from
  local MCP/dev tooling, never from the site itself.
- Match the existing code's comment density and vanilla-JS / token-driven-CSS style.
- `LEARNING-NOTES.md` is git-ignored personal study notes — don't rely on or edit it.
