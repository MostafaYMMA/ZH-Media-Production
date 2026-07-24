# CLAUDE.md

Context for working on this repository. Read this first before making changes.

## What this is

**ZH Media Production** — the marketing site for a digital-marketing studio that does
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

Just open `index.html` in a browser, or serve the folder statically (e.g.
`python -m http.server`). There is nothing to compile. Fonts load from Google Fonts and
placeholder images from `picsum.photos`, so a preview needs internet until real assets
are dropped in.

## File layout

```
index.html          Home / landing page (the main marketing page)
about.html          Studio story
services.html       Service breakdown
work.html           Portfolio grid
contact.html        Contact form (front-end only — no backend wired up)
assets/
  css/
    main.css              Entry stylesheet — @imports everything below
    base/
      variables.css       DESIGN TOKENS — colors, fonts, spacing, motion. Start here.
      reset.css           Box-sizing reset + reduced-motion global
      typography.css      Heading/body/eyebrow type rules
    components/           navbar, footer, buttons, project-card, modal, icon, testimonials
    pages/                home, about, services, work, contact (one file per page)
  js/
    main.js               Entry point — runs init fns on DOMContentLoaded
    modules/              navbar, navIndicator, scrollReveal, counter, videoModal,
                          videoPreview, pointer, contactForm
    data/projects.js      Portfolio data (window.ZH.projects) — single source of truth
  images/ , video/        Real assets go here (mostly empty placeholders for now)
```

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
  `<head>` so content stays visible if JS fails.
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
- **Accessibility floor:** keep visible focus (a branded `:focus-visible` volt ring is wired in
  `reset.css`), honor `prefers-reduced-motion` (`reset.css` + animation modules), and keep
  decorative elements `aria-hidden`.

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
- **"The receipts" testimonials** — result-first proof cards (a growth number → quote →
  initials-monogram attribution). Component in `components/testimonials.css`.

The **footer holds the single closing CTA** on every page. The old standalone `.cta-band`
was removed from Home/Work/About to kill the duplicate CTA; its CSS still lives in `main.css`
but is currently unused.

If you change the accent or fonts, update the token table above so this file stays true.

## Page status

All five pages are on the fitness-coach brand and share the depth-driven cards, cursor-reactive
glow, and tightened spacing. Inner pages (Work/Services/About/Contact) use the shared
`.page-hero` two-column hero; every page's footer carries the one closing CTA.
- **index.html** — split hero (duotone photo / mesh+grid / spotlight; the stat band's top rule
  shrinks to the width of the stats via `align-self: flex-start`), ticker, "Why you'd want us",
  featured reels (3 vertical 9:16 cards, `justify-content: start` so they align to the section
  heading), workflow, and the "The receipts" testimonials.
- **services.html** — balanced hero, a **sticky two-column pipeline** (heading left, Script →
  Shoot → Edit steps right — `.services-section__grid`), centered **12 / 24 Reels** package cards
  (`.packages`), and a "How it actually works" **FAQ** covering timeline / travel / revisions /
  contract / cost (no price figures — see house rules).
- **about.html** — balanced hero, stat band (5+ / 20+ / 100%), a **founder block** (`.founder` —
  placeholder monogram portrait + first-person story + signature), three "why coaches trust us"
  value cards. (The old fictional team section was removed.)
- **work.html** — reels wall data-driven from `projects.js`, framed **vertical 9:16** so it reads
  as short-form (the grid is `auto-fill, minmax(200px, 1fr)` — fits all reels edge-to-edge).
- **contact.html** — balanced hero, booking form (**package `<select>`** 12 / 24 / not sure, with
  the custom CSS arrow in `contact.css`) with **client-side validation + input hardening**
  (`contactForm.js`, inline `.form-error` / `.form-status`), and a "What happens next" info card
  in the right column.

## Known TODOs / placeholders

- **Portfolio data** (`assets/js/data/projects.js`) now uses fitness-coach reel entries,
  but they're still **placeholders** (fictional coach names, portrait `picsum.photos`
  thumbnails at `720/1280`, a shared placeholder `vimeoId`, and `teaserSrc` clips that don't
  exist yet in `assets/video/previews/`). Cards are framed **9:16**, so real phone-shot stills
  drop straight in — put them in `assets/images/projects/`.
- Hero and card images point at `picsum.photos` placeholders — replace with real coach
  photography. The hero photo is force-desaturated (`filter: grayscale(...)` in `home.css`);
  relax that once real, colour-graded stills are in.
- **Placeholder copy to swap** (each flagged with an HTML comment): the "The receipts"
  testimonials on Home (names / handles / quotes / growth numbers) and the founder name
  (`Ziad Hazem`) + story + monogram on About.
- Contact form has **no backend** yet. `contactForm.js` validates + sanitises the fields
  (name / email / handle / package / message) and, on success, shows a confirmation pointing the
  user to email — it does not send anywhere. When wiring a backend: send the module's normalised
  `data` object (never the raw inputs), use **parameterized queries** (SQL) and output-encoding
  (stored XSS), and re-validate server-side — the client checks are UX + first-pass only.
- Package **prices** are deliberately absent — keep it "Book a call" until told otherwise.

## House rules

- Keep it dependency-free and buildless unless there's a real reason to change that.
  `node_modules/`, `package.json`, `package-lock.json` are git-ignored — they only appear from
  local MCP/dev tooling, never from the site itself.
- Match the existing code's comment density and vanilla-JS / token-driven-CSS style.
- `LEARNING-NOTES.md` is git-ignored personal study notes — don't rely on or edit it.
