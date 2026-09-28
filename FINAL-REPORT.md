# Final report — `landing-v2`

The CHANGES.md § 9 report. Everything in § 1–§ 8 is built and tested.
Delete this file and `PROGRESS.md` before merging.

---

## Safety — read this first

**Nothing has touched the live site.**

- `main` is still at `caca8c6`, exactly where it was. No commit, no merge, no
  rebase, no pull request.
- **Nothing has been pushed.** No `origin/landing-v2` exists yet.
- `vercel.json`, deployment settings, domains and environment config were not
  opened.
- All work is on the local branch `landing-v2`, 18 commits, branched from
  `main`.

Push only when you say so. The exact command, to run **only** on your word:

```
git push -u origin landing-v2
```

That publishes the branch and nothing else. It does not touch `main` and does
not deploy — open the Vercel preview for the branch to look at it, test it, and
merge it yourself when you are happy.

---

## What changed, section by section

### § 2 — page order

The page now reads: **home → services → work → feedback → clients → about →
faq → investment → contact**, and within `#home`: hero → Before/After →
"who is this for" → why you'd want us → what we do.

Nothing was cut to do it; whole `<section>` blocks moved. Verified by sorting
every non-blank line of `index.html` before and after: **zero removals**.

### § 3.1 — hero

New hook (`Your coaching deserves a bigger audience.`), the supporting
paragraph, a 9:16 sales-video slot beside the copy, and a fourth stat. The four
stats carry their real figures **in the HTML**, so they are correct with JS off;
`counter.js` zeroes them only on the path that is definitely about to count
them back up.

### § 3.2 — Before/After durations

Every transformation card now shows how long the jump took, on a labelled bar
between the two screenshots. **All four durations are placeholders** — see the
TODO list.

### § 3.3 — "Who is this investment for?"

Six "this is you" cards, then three "not for you if…" cards in the same shape
with a red ✕ instead of the volt check.

### § 3.4 — how we work together

The old three-stage pipeline became **nine steps**, each with who carries it
(you / we / together), on a line that lights up as you scroll, plus a
what-you-do / what-we-do / what-you-get summary.

Readability is not conditional: with JS off, or under reduced motion, every
step renders fully lit. That is measured, not assumed.

### § 3.5 — client feedback

A new `#feedback` section: five WhatsApp-style voice notes and a five-card
carousel of vertical video testimonials.

### § 3.6 — FAQ

The cost question is reworded around "investment" with no figure, and a new
"Do you post the reels for me?" question was added.

### § 3.7 — investment

"Packages" → "Investment", "Pick your monthly output" → "Choose your monthly
investment". Still 12 and 24 reels, still no prices, still "Book a call".

### § 3.8 — sticky mobile CTA

A "Book a call" bar that slides in once you are past the hero and hides again
at the contact form. Mobile only, never on desktop, hidden entirely with JS off.

### § 4 — the reusable player

One module, `assets/js/modules/mediaPlayer.js`, drives every video and voice
note on the page. Custom controls in the brand's colours, one item playing at a
time page-wide, and a tidy "coming soon" plate wherever the file does not exist
yet. Native `<video controls>` is the no-JS fallback.

### § 5 — media config

Every media URL lives in `assets/js/media-config.js` and nowhere else.
`assets/media/README.md` lists the expected files, formats and ffmpeg recipes.
Each entry carries `ready: false` until the real file lands, which is what keeps
the console clean while the shoot is pending — flip it to `true` when you drop
the file in.

### § 6 — small fixes

The handle mismatches are flagged in place, the two placeholder Instagram links
are marked, and the footer year has a correct fallback for JS off.

### § 7 — Arabic/RTL future-proofing

All new CSS uses logical properties (`inline-size`, `inset-inline-start`,
`padding-inline`, `margin-block-end`), and everything directional in JS — the
carousel paging, the waveform scrub, the waveform arrow keys — reads the
direction off the document instead of assuming left-to-right. The Arabic build
itself is not in this branch.

---

## Owner review round (after the first pass)

**Removed, on your instruction** — this is the one place the "don't delete
content" rule in § 0 was set aside, because you asked for it directly:

- the home "What we do" block, *From first idea to posted reel*, and its three
  cards (Script Writing / Video Recording / Reels & Editing);
- the services hero, *You coach. We make the content.*, and its lead.

`#services` now opens on "How we work together", which has its own heading and
top padding. Their substance is not gone: the three cards' copy is in journey
steps 04, 05 and 06, and the pipeline is written out in full in the "What we
do" summary column, which is why that column was enlarged.

**Fixed:** the connecting line through the nine steps broke next to every
left-hand card — see the defects list below.

**Reworked:** the "not for you" list now uses the same cards as the list above
it; "Why you'd want us" is rewritten around growing the business rather than
listing services; "What we do" is the lead column of the journey summary;
every "Book a call" is paired with *Start investing in your business*; the
voice notes are journey-style cards filling the full width; and the video
carousel fills the width instead of stopping at 1040px.

**Body type raised.** The statements were good but 16px. `--fs-body` is now
1.125rem, with two new tokens (`--fs-lead`, `--fs-statement`) replacing a
dozen hardcoded sizes. Body copy 16 → 18px, card statements 16.8 → 18.4px,
section leads → 20.2px. `--fs-small` was deliberately left alone: it is the UI
label scale, and the navbar's 980px breakpoint is measured against it.

---

## What still needs you — the TODO list

Every one of these is flagged with a comment in the HTML.

**Must be filled before this goes live:**

1. **The four Before/After durations** (`index.html` lines ~115, 165, 196, 230,
   261). Currently 30 / 60 / 40 / 60 days — placeholders. The hero's fourth stat
   ("+14.3K followers in 30 days") is drawn from the first of these, so it moves
   with it.
2. **Eleven testimonials** — five voice notes and five videos all read
   "Testimonial coming soon", plus the sales video. The brief is explicit that
   the site must not go live with placeholder testimonials.
3. **The media files themselves** — six videos and five voice notes. Formats,
   sizes and the ffmpeg commands are in `assets/media/README.md`. Drop each file
   in, flip its `ready` to `true` in `media-config.js`, done.

**Should be confirmed:**

4. **Galal's handle** — the Before/After card says `@galalmohamed99`, the client
   roster and the voice note say `@galalmohamed95`. One is wrong. Flagged in
   three places (lines ~217, 747, 915).
5. **The two Instagram links** still point at `#` (lines ~1273, 1298).
6. **The nine step titles and descriptions** (line ~491) — written from the
   brief; worth reading once in your own voice before it ships.

---

## § 8 checklist — all results

Chromium, Firefox and WebKit, served over `python -m http.server`.

| Check | Result |
|---|---|
| No horizontal overflow at 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 | ✅ all three browsers |
| Page order matches § 2 | ✅ |
| All six nav anchors resolve | ✅ |
| Nothing lost in the reorder | ✅ zero line removals |
| Visible copy vs `main` | ✅ 14 deliberate rewordings, 1 dropped line restored |
| Exactly one `<h1>`, every `<img>` has `alt` | ✅ |
| Every referenced local asset exists | ✅ 49 / 49 |
| Console errors | ✅ 0 in all three browsers |
| No autoplay | ✅ nothing playing on load |
| Missing media | ✅ "coming soon", no broken player, no network request |
| Player: build, play, pause, seek, mute, fullscreen | ✅ seek asks for exactly 4.5s at 75% of a 6s file |
| One item playing at a time | ✅ including playback started from native controls |
| Waveform scrub | ✅ midpoint click → 3.0s of 6s, 13 of 26 bars lit |
| Carousel | ✅ 3 across desktop, 1-plus-peek on phone, dots track, arrows disable at both ends |
| Reduced motion | ✅ all 9 steps lit at once, transitions ~0, counters jump to final |
| **No JS** | ✅ reveals visible, native controls kept, sticky bar hidden, real stats, footer year, **all 9 steps lit** |
| Sticky bar, real phone scroll (390×844) | ✅ hidden over hero, visible through the body, hidden at `#contact`; 86px reserved so it never covers anything |
| Keyboard only | ✅ every control reachable and labelled; Space toggles play without scrolling the page |
| Contact form → WhatsApp | ✅ name, email, handle, package, preferred time, preferred days and message all arrive |
| The four redirect stubs | ✅ all land on the right section, below the fixed header |
| **Lighthouse mobile** | ✅ **100 accessibility / 100 best practices / 100 SEO** — 56 passed, 0 failed |

### Three real defects found and fixed during testing

1. **No-JS journey steps rendered dim** — the exact opposite of what § 3.4
   requires. The CSS did the opposite of what its own comment claimed: the base
   rules carried the dim values and every accent value sat behind a class only
   JS adds. Measured at 0 of 9 lit on a scriptless page. Inverted, now 9 of 9.
2. **The voice-note waveform was mouse-only** — it scrubbed on click but had no
   tab stop, the one piece of functionality on the page a keyboard user could
   not reach. It is now a real slider with arrow / page / home / end keys.
3. **Two contrast failures** — the unlit step numerals and the "not for you if…"
   list were 3.6:1, under the 4.5:1 floor for text. That is what took
   accessibility to 97; both moved to the muted token (6.7:1) and it is back at
   100.

4. **The journey line broke next to every left-hand card.** Measured at 1440px:
   on steps 1, 3, 5 and 7 the marker column was 82px tall inside a 375px step,
   so the line stopped ~290px short. The card sits in column 1 but comes after
   the marker in DOM order, and sparse grid auto-placement never moves
   backwards — so it was pushed into row 2 and the marker stretched across only
   the first. Both children are now pinned to row 1; every gap measures 0px.
5. **Seven more contrast failures**, six of which Lighthouse never saw because
   the reveal animation had those elements at `opacity: 0` during the audit.
   All were `--color-text-dim` used on text. A full-page sweep with every
   reveal forced open now reports **0 failures**.

Also fixed earlier in the pass: 24 console 404s for unshot media (now 0), a
voice-note quote that rode up onto short names, and three carousel cards
rendering 780px tall — taller than the viewport.

---

## Deviations from the brief

1. **§ 0.1** — did not stop over uncommitted changes. The only ones were two
   *untracked* markdown files (`CHANGES.md` itself and
   `scroll-snap-navigation-guide.md`); nothing tracked was dirty.
2. **§ 0.7, one commit per section** — § 4 and § 3.1–3.5 landed in a single
   commit (`9b20538`) because the shell was unavailable for that stretch. Each
   still has its own CSS/JS file and its own commented HTML block, so any one
   can be backed out alone. Every later section got its own commit.
3. **§ 3.1, the fourth stat** — the brief's example was "+14.2K in 40 days", but
   it also says to take the numbers from § 3.2 so they match. The fastest result
   there is **Mustafa Ashraf, +14.3K in 30 days** — both the shortest window and
   the highest daily rate — so that is what the stat shows.
4. **§ 3.2, the vertical bar** — `.transformation__shots` is a column at every
   width, so before/after are always stacked and the horizontal bar is right
   everywhere. There is no width at which the vertical variant would apply.
5. **§ 3.4, the pipeline lead** — the old lead opened "Three stages, one team."
   That is no longer true at nine steps, so only that clause was dropped. The
   heading "Every reel, start to finish" is kept.
6. **§ 3.8, reserved space** — the bar's matching bottom padding is reserved for
   the whole mobile breakpoint rather than added when the bar appears. Added on
   the way in, it would shove the page up ~70px mid-scroll. Reserved, it can
   never cover content and the page never jumps.
7. **New section ids** — `#feedback`, `#faq`, `#investment`. `sectionNav.js`
   only observes sections that have a nav link, so these are ignored by the
   active-link logic and all six existing anchors keep working. Side effect: the
   active nav link goes briefly stale while you scroll through them.
8. **A `ready` flag in `media-config.js`** — not in the brief. It is what takes
   the console from 24 errors to 0 while the media is unshot. One word to change
   per file when the real file lands.
9. **Content removed** — § 0 says not to delete content. Two blocks were
   deleted anyway, because you asked for them by name in review. Noted above.
10. **Contrast tokens** — two places where the brief's visual intent was "quieter
   than the rest" now use `--color-text-muted` instead of `--color-text-dim`,
   because the dim token fails the contrast floor for text on the page
   background. Still visibly quieter, just legible.

---

## ⚠️ One decision I could not make for you

**The § 2 order fights the nav.** The page now scrolls **Services before Work**,
but § 1 says the nav stays as it is — and the nav lists **Work before
Services**. So the nav's sliding indicator moves backwards as you scroll past
those two.

Two options: swap those two links in the nav, or accept it. I changed nothing,
because § 1 was explicit that the nav stays. Swapping them is a one-line change
whenever you want it.

---

## Commits on the branch

| Commit | What |
|---|---|
| `25f6a40` | CHANGES.md + pre-change `CONTENT-INVENTORY.md` |
| `559c49c` | § 5 media config + `assets/media/README.md` |
| `7994bfc` | PROGRESS.md marker |
| `9b20538` | § 4 player, § 3.1 hero, § 3.2 durations, § 3.3 investment-for, § 3.4 journey, § 3.5 feedback |
| `c7c071b` | § 3.6 FAQ rewording + new question |
| `ce6f400` | § 3.7 packages → Investment |
| `136ebd3` | § 3.8 sticky mobile CTA |
| `9b1a88e` | § 6 handle / Instagram TODOs + fallback year |
| `f60140e` | § 2 page reorder |
| `c1af417` | cache-bust bump |
| `0625d84` | clean console + 3 layout fixes found in-browser |
| `fdfc672` | PROGRESS.md update |
| `12ac637` | fix: lit journey state survives JS off |
| `bb64185` | fix: waveform keyboard-operable |
| `03296f5` | fix: contrast floor, back to 100 |
| `c0f7b44` | fix: restore the one dropped line of copy |

24 files changed, 3777 insertions, 232 deletions. Cache-bust at `?v=25`,
41 references in lockstep.
