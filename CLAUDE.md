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
    components/           navbar, footer, buttons, project-card, modal, icon
    pages/                home, about, services, work, contact (one file per page)
  js/
    main.js               Entry point — runs init fns on DOMContentLoaded
    modules/              navbar, navIndicator, scrollReveal, counter, videoModal, videoPreview
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
- **Accessibility floor:** keep visible focus, honor `prefers-reduced-motion` (already
  wired in `reset.css` and animation modules), and keep decorative elements `aria-hidden`.

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

**Typography** (loaded from Google Fonts in each page's `<head>`):
- `--font-display`: **Anton** — heavy condensed poster face. All headings, uppercase,
  weight 400 (Anton is a single weight — never synthetic-bold it).
- `--font-body`: **Barlow** — athletic sans for body copy.
- `--font-data`: **Barlow Semi Condensed** — eyebrows, stat labels, buttons (uppercase,
  wide tracking).

**Signature elements on the home page:**
- **Split hero** — copy on the left half, a full-height image locked to the **right half**
  of the screen (`50vw`, absolutely positioned) with a diagonal mask fading it into the
  navy and a volt radial glow. Collapses to a dimmed full-width backdrop under 900px.
- **Service ticker** — a scoreboard-style marquee scrolling `Script Writing · Video
  Recording · Reels & Shorts · Editing · Personal Branding` in Anton. The track is
  duplicated and loops at `translateX(-50%)`; pauses under reduced-motion.
- **"Why you'd want us"** section — the core pitch (coaches don't have time to market
  themselves) as a centered headline + intro, followed by three prominent numbered
  benefit cards (01/02/03) with a volt top-bar that fills in on hover.
- **Numbered workflow cards** (01/02/03) with oversized bled-in step numbers.

If you change the accent or fonts, update the token table above so this file stays true.

## Page status

All five pages are now on the fitness-coach brand:
- **index.html** — landing page (split hero, ticker, "Why you'd want us", workflow, CTA).
- **services.html** — 3-step pipeline (Script → Shoot → Edit) + the **12 / 24 Reels**
  package cards (big Anton reel count, volt hover bar, featured 24-reel card).
- **about.html** — founder's 5+ yrs in fitness angle, a stat band, three "why coaches
  trust us" value cards. (The old fictional team section was removed.)
- **work.html** — reels grid, data-driven from `projects.js`.
- **contact.html** — booking form; note the **package `<select>`** (12 / 24 / not sure)
  and the custom CSS arrow for it in `contact.css`.

## Known TODOs / placeholders

- **Portfolio data** (`assets/js/data/projects.js`) now uses fitness-coach reel entries,
  but they're still **placeholders** (fictional coach names, `picsum.photos` thumbnails,
  a shared placeholder `vimeoId`, and `teaserSrc` clips that don't exist yet in
  `assets/video/previews/`). Swap for real coach content + stills in
  `assets/images/projects/`.
- Hero and card images point at `picsum.photos` placeholders — replace with real coach
  photography.
- Contact form has **no backend** — it only prevents the default submit (see `main.js`).
  When wiring it up, the fields are name / email / handle / package / message.
- Package **prices** are deliberately absent — keep it "Book a call" until told otherwise.

## House rules

- Keep it dependency-free and buildless unless there's a real reason to change that.
- Match the existing code's comment density and vanilla-JS / token-driven-CSS style.
- `LEARNING-NOTES.md` is git-ignored personal study notes — don't rely on or edit it.
