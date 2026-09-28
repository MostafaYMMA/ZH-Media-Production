# CONTENT-INVENTORY.md

Snapshot of **every** section on `index.html` as it exists on `main` at commit
`caca8c6`, taken **before** the `landing-v2` changes (per CHANGES.md § 0).

After the rework, check the new page against this list and confirm every item
still exists. Nothing here may be deleted — only moved or re-laid-out.

---

## Global chrome

| # | Item | Content |
|---|------|---------|
| G1 | `.skip-link` | "Skip to content" → `#home` |
| G2 | `.navbar__logo` | "ZH Personal Branding" → `#home` |
| G3 | `.navbar__links` | Home `#home` · Work `#work` · Clients `#clients` · Services `#services` · About `#about` · Contact `#contact` (btn--outline) + `.navbar__indicator` |
| G4 | `.navbar__toggle` | Hamburger, `aria-label="Toggle menu"`, 3 spans |

---

## 1. `#home` — HOME

### 1.1 Hero (`.hero`, `data-spotlight`)
- `.hero__spotlight` (decorative)
- **Images:** `assets/images/hero-gym-1.png` (449×298, left frame), `assets/images/hero-gym-2.png` (332×371, right frame) — both `alt=""`, `aria-hidden` parents
- Eyebrow: "You built the coach. We build the brand."
- `<h1 class="hero__title">`: "Personal branding for **fitness coaches.**" (accent span on line 2)
- `.hero__subtitle`: "Scripts, filming, and short-form editing — reels, shorts, the whole feed — handled end to end. Run by people who came up in the gym, so your content actually sounds like a coach, not an agency."
- `.hero__actions`: **Book a call** (btn--primary → `#contact`), **See the work** (btn--outline → `#work`)
- `.hero__stats` — 3 stats, each `data-count-to` / `data-count-suffix`, text starts at `0`:
  1. `5+` — "Years in the fitness world"
  2. `20+` — "Coaches we've filmed"
  3. `100%` — "Done-for-you"

### 1.2 Service ticker (`.ticker`, `aria-hidden`)
- `.ticker__track` with the 5-item cycle duplicated once (10 spans + volt dots):
  Script Writing · Video Recording · Reels & Shorts · Editing · Personal Branding

### 1.3 "Why you'd want us" (`.why`)
- Eyebrow: "Why you'd want us"
- `<h2>`: "You didn't get into coaching / to sit in the edit bay."
- `.why__lead`: "Between programming, check-ins, and actually training clients, marketing is the thing that quietly slips — so the reels never post and coaches with worse advice keep out-posting you. That's the whole job we take off your plate: you coach on camera, we handle the script, the shoot, and the edit."
- 3 × `.why__item` (`data-glow`), numbered 01/02/03:
  1. **Your time back** — "No scripting at midnight, no fighting the editing timeline. You just show up and coach."
  2. **A coach's voice** — "We came up in the gym, so nothing we write for you sounds like a generic ad."
  3. **Real consistency** — "A steady feed the algorithm rewards — instead of one burst every few months."

### 1.4 Account transformations (`.transformations`)
- Eyebrow: "Account transformations" · `<h2>`: "Same coach. One to two months apart."
- `.section__head-actions`: **Start yours** (→ `#contact`), **See the work** (→ `#work`) — both btn--outline
- `.transformations__lead`: "We script, film, and edit the whole feed. These are the follower counts before we started and after — nothing boosted, nothing bought."
- HTML comment noting screenshots/counts are real and the "one to two months" window is approximate
- 4 × `.transformation` cards, each = Before shot + After shot (`transformation-N-before/after.webp`, 1200×540, `loading="lazy"`, descriptive alt), `Before`/`After` tags, delta, range, name, handle:

| Card | Images | Delta | Range | Name | Handle |
|---|---|---|---|---|---|
| 1 | `transformation-1-before/after.webp` | +14.3K | 54.1K → 68.4K followers | Mustafa Ashraf | @mustafa_ashraf_26 |
| 2 | `transformation-2-before/after.webp` | +20.2K | 43.6K → 63.8K followers | Galal Mohamed | @galalmohamed99 |
| 3 | `transformation-3-before/after.webp` | +14.2K | 2,948 → 17.1K followers | Mohamed Abd El-Shafy | @moh.abdelshafy |
| 4 | `transformation-4-before/after.webp` | +23.2K | 9,194 → 32.4K followers | Mohamed Badr | @coach.butcher |

### 1.5 "What we do" (`.workflow-grid`)
- Eyebrow: "What we do" · `<h2>`: "From first idea to posted reel"
- **See all services** (btn--outline → `#services`)
- 3 × `.workflow-item` (`data-glow`), numbered 01/02/03, each with an inline SVG icon:
  1. **Script Writing** (pencil icon) — "Hooks and scripts built around your coaching, so every video has a point before the camera rolls."
  2. **Video Recording** (video-camera icon) — "Sessions filmed in the gym with the gear and direction to make you look like the expert you are."
  3. **Reels & Editing** (film-strip icon) — "Short-form edits cut for the feed — captions, pacing, and sound tuned for reels and shorts."

---

## 2. `#work` — OUR WORK
- `.work-hero page-hero`: eyebrow "Our work" · `<h2>` "Coaches we've put on the feed." · lead "Vertical reels and shorts we scripted, shot, and cut for coaches — each one's view count is right there on the thumbnail."
- `.project-grid[data-project-grid="all"]` — rendered by `projectGrid.js` from `window.ZH.projects` (20 reels, `assets/images/reels/reel-01..20.webp`, view count per card, hand-ordered style mix)

---

## 3. `#clients` — OUR CLIENTS
- Eyebrow "Our clients" · `<h2>` "Accounts we run day to day." · **Become one** (btn--outline → `#contact`)
- `.clients__lead`: "The coaching accounts whose content — scripts, shoots, and edits — runs through us every week. Scroll for the full roster."
- `.clients-scroller > .clients-grid` — **18** `.client-card` (`data-glow`), each avatar 256×256 `loading="lazy"`:

| # | Avatar | Name | Handle |
|---|---|---|---|
| 1 | client-04.webp | Mustafa Ashraf | @mustafa_ashraf_26 |
| 2 | — | Mira | @mirareda |
| 3 | — | Mohamed Badr | @coach.butcher |
| 4 | — | Galal Mohamed | @galalmohamed95 |
| 5 | — | Muhammed Saad | @__memmes |
| 6 | — | Mohanad Hesham | @mohanad_elmaghraby |
| 7 | — | Amr Moharram | @coach_amrmoharram |
| 8 | — | Mohamed Abd El-Shafy | @moh.abdelshafy |
| 9 | — | Kareem Mahmoud | @kariiim.mahmoud |
| 10 | — | Gehad Fahmy | @gehadd_fahmy |
| 11 | — | Katy | @itskaty___ |
| 12 | — | Noura Alaa | @nouraalaa10 |
| 13 | — | Sakr Pro Coaching | @sakr_procoaching |
| 14 | — | Omar Nasr | @omarnasrbaker |
| 15 | — | Karim Maghraby | @karimmaghraby |
| 16 | — | Dr. Ziad Tharwat | @dr_ziadtharwat |
| 17 | — | Rohaim Moustafa | @rohaim_moustafa |
| 18 | client-12.webp | Mostafa Sharaf | @c.mostafa_sharaf |

(Avatars are `client-01..18.webp`, not in roster order — the `src` on each card is authoritative.)

---

## 4. `#services` — SERVICES

### 4.1 Services hero (`.services-hero page-hero`)
- Eyebrow "What we do" · `<h2>` "You coach. We make the content." · lead "One team handling the whole pipeline — scripting, filming, and editing — so your reels get made and posted without eating your week."

### 4.2 The pipeline (`.services-section`)
- Sticky left head: eyebrow "The pipeline" · `<h2>` "Every reel, start to finish" · `.services-section__lead` "Three stages, one team. You're only ever asked to show up and coach — we carry the rest, from blank page to posted reel."
- 3 × `.service-row` (index + inline SVG icon):
  1. **Scripting & Ideas** — "We turn your coaching into hooks and scripts built to stop the scroll — you approve, we roll. No more staring at a blank notes app."
  2. **Filming & Shooting** — "Sessions filmed in the gym with the gear and direction to make you look like the expert you already are — batched so one shoot fuels weeks of content."
  3. **Editing — Reels & Shorts** — "Cut, captioned, and paced for the feed. Every reel comes back ready to post to Instagram, TikTok, and YouTube Shorts."

### 4.3 Packages (`.packages`)
- Eyebrow "Packages" · `<h2>` "Pick your monthly output"
- `.packages-note`: "Both packages are fully done-for-you — scripting, shooting, and editing all included. The only question is how much you want to post."
- **Starter / 12 reels** — "A steady, consistent presence — three reels a week to build momentum and stay on the feed." Features: 12 done-for-you reels / month · Scripting for every reel · Filming session included · Editing, captions & ready to post. CTA **Book a call** (btn--outline)
- **Scale / 24 reels** (`--featured`, badge "Best for growth") — "Double the output for coaches going all-in — enough volume to actually move the algorithm." Features: 24 done-for-you reels / month · Scripting for every reel · Priority filming sessions · Editing, captions & ready to post · Faster turnaround. CTA **Book a call** (btn--primary)

### 4.4 FAQ (`.faq`)
- Eyebrow "Before you ask" · `<h2>` "How it actually works"
- 6 × `.faq__item`:
  1. **What happens after I book a call?** — "We hop on a short call to learn your coaching, your audience, and your goals. If it's a fit, we plan your first month of content and book your shoot — usually within the same week."
  2. **Do I have to travel to film?** — "No. We film on-location at your gym. If you're outside our area we run remote shoots and direct you over the call — many coaches capture a full month in one session."
  3. **How many reels, and how fast?** — "12 or 24 finished reels a month, depending on your package. First edits usually land within a few days of the shoot — captioned and ready to post."
  4. **What if I want changes to an edit?** — "Every reel includes revisions. We tweak the cut, captions, or pacing until it's something you're happy to put your name on."
  5. **Am I locked into a long contract?** — "We work month to month. The plan is that the results keep you around — not the paperwork."
  6. **What does it cost?** — "Pricing depends on your package and shoot logistics, so we quote it on the call once we know what you need. Book a call and we'll walk you through it."

---

## 5. `#about` — ABOUT

### 5.1 About hero (`.about-hero page-hero`)
- Eyebrow "About us" · `<h2>` "We came up in the gym, not an ad agency." · lead "ZH Personal Branding exists for one kind of client: fitness coaches. We spent years in the fitness world before picking up a camera, so we don't need progressive overload explained — we already speak your language, and it shows in every reel we script, shoot, and cut."

### 5.2 Stat band (`.about-stats`)
- `5+` "Years in the fitness world" · `20+` "Coaches we've filmed" · `100%` "Done-for-you, start to post"

### 5.3 The founder (`.founder`)
- HTML comment flagging the portrait/name/copy as placeholders
- `.founder__portrait` → `.founder__monogram` "ZH"
- Eyebrow "The founder" · `<h2>` "Years under the bar, then behind the camera."
- Para 1: "Before this studio, I spent years in the fitness world — training, competing, and living the exact grind our clients are in now. I saw the same thing over and over: the coaches who win online aren't the best trainers, they're the ones who show up consistently. And almost none of them have time to script, shoot, and edit on top of a full client roster."
- Para 2: "So I built the studio I wished existed — a team that already speaks fitness, takes the whole content pipeline off your plate, and makes you look like the expert you already are."
- `.founder__sign`: "— Ziad Hazem, Founder"

### 5.4 Why coaches trust us (`.about-values`)
- Eyebrow "How we work" · `<h2>` "Why coaches trust us"
- 3 × `.about-value` (`data-glow`):
  1. **We speak fitness** — "Your content sounds like a coach who knows their stuff — not a generic ad written by someone who's never trained a client."
  2. **Done-for-you** — "Script, shoot, edit — the whole thing is off your plate. You show up, coach on camera, and get reels back ready to post."
  3. **Built for the feed** — "Every reel is made to perform — hooks that stop the scroll and pacing tuned for how people actually watch short-form."

---

## 6. `#contact` — CONTACT

### 6.1 Contact hero (`.contact-hero page-hero`)
- Eyebrow "Book a call" · `<h2>` "Let's get your content handled." · lead "Tell us about your coaching and where you want to take it — we typically reply within one business day."

### 6.2 Form (`.contact-form`, `data-unwired`, `novalidate`)
- HTML comment explaining the WhatsApp (`wa.me`) handoff and how to move to a real endpoint
- Fields: **Name** (`#name`, required) · **Email** (`#email`, required) · **Instagram / TikTok handle** (`#handle`) · **Which package fits?** (`#package` select: I'm not sure yet / 12-reels / 24-reels) · **Preferred time of day for the call** (`#timeslot` select: Any time works / 9-12 / 12-15 / 15-18 / 18-21) · **Preferred days** fieldset (`.checkbox-grid`, 7 checkboxes Mon–Sun, hint "Pick any that work — we'll aim for one of them.") · **Tell us about your coaching** (`#message` textarea, required)
- Submit: **Book a call** (btn--primary)
- `.form-note`: "Pressing "Book a call" opens WhatsApp with your details ready to send. No WhatsApp? Email hello@zhpersonalbranding.com."

### 6.3 Info aside (`.contact-info`)
- **What happens next** — 1. "We reply within one business day." 2. "A quick call to map out your content and goals." 3. "We plan your first shoot — often the same week."
- **Email** — hello@zhpersonalbranding.com (mailto)
- **Studio** — "Cairo, Egypt — available for remote & on-location projects worldwide."
- **Follow** — Instagram link, `href="#"` (placeholder)

---

## 7. Footer (`.footer`)
- `.footer__cta`: `<h2>` "Let's build your coaching brand." + **Book a call** (btn--primary → `#contact`) — the page's single closing CTA
- `.footer__brand`: mark "ZH" · name "ZH Personal Branding" · tag "Personal Branding for Fitness Coaches"
- `.footer__column` **Contact**: hello@zhpersonalbranding.com (mailto) · "Cairo, Egypt — remote & on-location" · `.footer__socials` Instagram icon link, `href="#"` (placeholder)
- `.footer__bottom`: "© `<span data-current-year>` ZH Personal Branding. All rights reserved." (span filled by `main.js`, **empty without JS**) · "Made with care, one frame at a time."

---

## Scripts loaded (footer, all `?v=15`)
`data/projects.js` · `modules/projectGrid.js` · `modules/navbar.js` · `modules/navIndicator.js` · `modules/sectionNav.js` · `modules/scrollReveal.js` · `modules/counter.js` · `modules/pointer.js` · `modules/contactForm.js` · `main.js`

## Stylesheets loaded (`<head>`, all `?v=15`)
`main.css` (which `@import`s base + all components) · `pages/home.css` · `pages/services.css` · `pages/about.css` · `pages/work.css` · `pages/contact.css`

## Redirect stubs (must keep working)
`about.html` → `index.html#about` · `services.html` → `#services` · `work.html` → `#work` · `contact.html` → `#contact`
