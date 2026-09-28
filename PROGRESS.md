# PROGRESS.md — landing-v2 (CHANGES.md implementation)

**Stopped at the owner's request, second time.** Resume marker. Delete before merge.

- **Branch:** `landing-v2` (from `main` @ `caca8c6`). **`main` is untouched, nothing pushed,
  no remote branch exists.**
- **Working tree clean**, except the pre-existing untracked `scroll-snap-navigation-guide.md`
  (already untracked on `main`; not mine).
- Cache-bust is at **`?v=19`** across `index.html` + `main.css` (41 refs, in lockstep).

---

## 🔴 OPEN BUG — found, confirmed, NOT fixed

**With JavaScript off, the nine "How we work together" steps render DIM instead of lit.**

CHANGES.md § 3.4 is explicit: *"Everything must be fully readable with no JS and with
`prefers-reduced-motion`: in those cases show all steps in their 'lit' state."*
Reduced motion is fine (verified: all 9 light immediately). **No-JS is not.**

- **Measured:** on a scriptless copy of the page, `journey-step__num` computed
  `background-color` was the dim default on all 9 steps; 0 of 9 rendered accent.
- **Cause:** `assets/css/components/journey.css`. The file's own header comment claims
  "the LIT state is the DEFAULT", but the CSS does the opposite — the base
  `.journey-step__num` / `__icon` / `__marker::after` / `__who` / `__card` rules carry the
  **dim** values, and the accent values sit behind `.journey-step.is-lit`, a class only
  `journey.js` ever adds. No JS ⇒ no `is-lit` ⇒ everything stays dim.
- **Fix (decided, not yet applied):** invert it. Move the accent values onto the base
  rules, and keep only the existing `.js .journey-step:not(.is-lit) { …dim… }` block to
  dim what hasn't been reached yet on a JS page. The `.is-lit` rules then become
  redundant and can be deleted — when `journey.js` adds `is-lit`, the `:not(.is-lit)`
  dim rule simply stops matching and the lit base shows through. Transitions already
  live on the base selectors, so the animation is unaffected.
- **Scope:** `journey.css` only. No HTML or JS change. Bump `?v=19` → `?v=20` after.
- **Re-test with:** strip every `<script>` from a copy of `index.html`, load it, and
  confirm all 9 numbers compute to `rgb(198, 255, 58)`.

Everything else on the no-JS path already passes (see the checklist below).

---

## Commits on this branch

| Commit | What |
|---|---|
| `25f6a40` | docs: CHANGES.md + pre-change `CONTENT-INVENTORY.md` |
| `559c49c` | feat: media config + `assets/media/README.md` |
| `7994bfc` | docs: first PROGRESS.md marker |
| `9b20538` | feat: §4 player, §3.1 hero, §3.2 durations, §3.3 investment-for, §3.4 journey, §3.5 feedback |
| `c7c071b` | feat: §3.6 FAQ rewording + new question |
| `ce6f400` | feat: §3.7 packages → "Investment" |
| `136ebd3` | feat: §3.8 sticky mobile CTA |
| `9b1a88e` | fix: §6 handle/Instagram TODOs + fallback year |
| `f60140e` | refactor: §2 page reorder |
| `c1af417` | chore: cache-bust bump |
| `0625d84` | fix: clean console + 3 layout fixes found in-browser |

## Done — every CHANGES.md section is implemented

§0 safety · §0 inventory · §2 reorder · §3.1–§3.8 · §4 player · §5 media config · §6 small
fixes · §7 (logical properties + direction read from the document in all new CSS/JS).

## §8 checklist — results so far

Passing, verified in a real browser (Chromium, served over `python -m http.server`):

- [x] **No horizontal overflow** at 360, 390, 430, 768, 1024, 1280, 1440. (The only
      elements extending past the edge are the closed off-canvas nav drawer and the
      clipped ticker marquee — both by design, both pre-existing.)
- [x] **Page order matches § 2** — `home, services, work, feedback, clients, about, faq,
      investment, contact`, and within `#home`: hero → Before/After → investment-for →
      why → what-we-do.
- [x] **All six nav anchors still resolve.**
- [x] **Nothing lost** — sorting every non-blank line of `index.html` before and after the
      reorder gives **zero** removals.
- [x] **One `<h1>`**, all images have `alt`.
- [x] **Zero console errors/warnings** (only the pre-existing `favicon.ico` 404, which is
      on `main` too).
- [x] **No autoplay**; nothing playing on load.
- [x] **Missing media** → "Video coming soon" / "Voice note coming soon", no broken player,
      and now no network request at all.
- [x] **Player**: builds big-play + bar, strips native `controls`, reads duration,
      play/pause, mute (label flips), seek asks for exactly 4.5s at 75% of a 6s file.
- [x] **One at a time**: starting a voice note paused the playing video.
- [x] **Waveform scrub**: midpoint click → 3.0s of 6s, 13 of 26 bars lit.
- [x] **Carousel**: 3 across desktop, 1-plus-peek on phone, dots track position, arrows
      disable at both ends.
- [x] **Reduced motion**: all 9 steps lit immediately, transitions ~0, counters jump to
      final values.
- [x] **No JS**: reveals all visible, all 6 videos + 5 audios keep native `controls`,
      sticky bar stays hidden, footer year shows, stats show real figures, no overflow.
- [ ] 🔴 **No JS: journey steps lit** — FAILS, see the open bug above.

Not yet done:

- [ ] Firefox / WebKit (only Chromium so far).
- [ ] Contact form still opens WhatsApp with all fields — **not re-tested since the
      reorder.** The form markup was not touched, but confirm.
- [ ] Keyboard-only pass over the players, carousel and sticky bar.
- [ ] Lighthouse mobile before/after. CLAUDE.md says `main` scores 100/100/100 on
      a11y / best-practices / SEO — **no after-number measured yet.**
- [ ] Sticky bar appear/hide verified only by CSS state, not by scrolling a real phone
      viewport top-to-bottom.
- [ ] The four redirect stubs (`about.html` etc.) not re-checked since the reorder.

## Remaining work after the bug

1. Fix the no-JS journey bug, bump to `?v=20`, re-verify.
2. Finish the § 8 checklist items listed above.
3. Write the § 9 final report (summary per section, full TODO list, checklist results +
   Lighthouse numbers, deviations, and the push commands — **to run only on approval**).

## Deviations from CHANGES.md, for the § 9 report

1. **§ 0.1** — did not stop over uncommitted changes: the only ones were two *untracked*
   markdown docs (`CHANGES.md` itself and `scroll-snap-navigation-guide.md`), nothing
   tracked was dirty.
2. **§ 0.7 one commit per section** — § 4 and § 3.1–3.5 landed in a single commit
   (`9b20538`) because the shell was unavailable for that stretch. Each section still has
   its own CSS/JS file and its own commented HTML block, so one can still be backed out
   alone. Every later section got its own commit.
3. **§ 3.1 fourth stat** — the brief's example was "+14.2K in 40 days", but it also says to
   take the numbers from § 3.2 so they match. The fastest result there is **Mustafa
   Ashraf, +14.3K in 30 days** — both the shortest window and the highest per-day rate —
   so that is what the stat shows. Flagged in an HTML comment; the duration is still a
   placeholder.
4. **§ 3.2 vertical bar** — `.transformation__shots` is `flex-direction: column` at *every*
   width, so before/after are always stacked and the horizontal bar between them is right
   at all widths. There is no width at which the vertical variant would apply.
5. **§ 3.4 pipeline lead** — the old lead began "Three stages, one team." That is now
   false (nine steps), so only that clause was dropped; the rest of the sentence is
   verbatim. The heading "Every reel, start to finish" is kept.
6. **§ 3.8 reserved space** — the bar's matching bottom padding is reserved for the whole
   mobile breakpoint rather than added "when visible", because adding it as the bar slides
   in would shove the page up ~70px mid-scroll. Reserved, it can never cover content and
   the page never jumps.
7. **New section ids** — `#feedback`, `#faq`, `#investment`. `sectionNav.js` only observes
   sections that have a nav link, so these are ignored by the active-link logic and all six
   existing anchors keep working. Side effect: the active nav link goes briefly stale while
   scrolling through them.
8. **`ready` flag in media-config** — added so unshot media makes no network request. Not
   in the brief; it is what takes the console from 24 errors to 0. One-line switch per file.

## ⚠️ Needs the owner's decision

**The § 2 order fights the nav.** The page now scrolls **Services before Work**, but § 1
says the nav stays as it is — and the nav lists **Work before Services**. So the nav's
sliding indicator moves backwards as you scroll past those two. Options: swap those two
nav links, or accept it. Not changed either way, because § 1 was explicit.
