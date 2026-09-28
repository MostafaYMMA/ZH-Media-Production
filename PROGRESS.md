# PROGRESS.md — landing-v2 (CHANGES.md implementation)

**Stopped at the user's request.** This file is the resume marker. Delete it
before the branch is merged.

- **Branch:** `landing-v2` (created from `main` @ `caca8c6`)
- **`main` is untouched.** Nothing pushed. No remote branch exists yet.
- **Working tree is clean**, except the pre-existing untracked
  `scroll-snap-navigation-guide.md` (was already untracked on `main`, not mine).
- **Nothing on the live page has changed yet** — `index.html` and all existing
  CSS/JS are still byte-identical to `main`. Both commits so far only *add*
  files.

## Commits on this branch

| Commit | What |
|---|---|
| `25f6a40` | `docs:` CHANGES.md spec + pre-change `CONTENT-INVENTORY.md` |
| `559c49c` | `feat:` `assets/js/media-config.js` + `assets/media/README.md` + `assets/media/posters/` |

## Done

- **§0 safety** — branch created off `main`, level with `origin/main`. Verified
  no tracked file was dirty before starting.
- **§0 inventory** — `CONTENT-INVENTORY.md` written: every section, heading,
  body copy, image path, link and form field as it exists on `main`. This is the
  checklist to verify nothing was lost at the end.
- **Read pass** — `index.html` (all 818 lines), `variables.css`, `main.css`,
  `reset.css`, `typography.css`, `buttons.css`, `transformations.css`,
  `section-scroll.css`, `services.css`, `home.css`, `main.js`, `counter.js`,
  `scrollReveal.js`, `sectionNav.js`.
- **§5 media config** — `assets/js/media-config.js` with `salesVideo`,
  `testimonialVideo1–5`, `voiceNote1–5` (key → `{src, poster, type}`), plus
  `assets/media/README.md` documenting the expected files (1080×1920 H.264 mp4
  under 20 MB, `.m4a` voice notes, `.webp` posters) and the ffmpeg recipes.
  Not referenced from any HTML yet.

## Next step (exactly where I stopped)

Writing **`assets/js/modules/mediaPlayer.js`** — §4's reusable player. Nothing
of it exists on disk yet. Planned shape, already decided:

- `window.ZH.initMediaPlayers()` following the existing `window.ZH.*` +
  classic-`<script>` convention (no ES modules, must work from `file://`).
- For each `[data-vplayer]`: look `data-media-key` up in `window.ZH.media`, set
  `src`/`poster`, strip the HTML `controls` attribute (so a JS failure leaves
  native controls working), unhide the custom bar.
- Custom bar **inside** the accent frame: play/pause, `<input type="range">`
  seek (native drag + keyboard for free, accent fill via a `--seek` custom
  property), `current / duration`, mute, fullscreen
  (`frame.requestFullscreen()` → `video.webkitEnterFullscreen()` on iOS).
- Auto-hide the bar 2.5s after the last pointer move while playing.
- Missing/errored `src` → "Video coming soon" state, no broken player.
- **One-at-a-time** via a single capturing `play` listener on `document` (it
  fires for non-bubbling media events and so also covers native controls).
- Voice notes: bars are literal `<i style="--h:.55">` elements in the HTML
  (per §3.5 "generated in HTML/CSS"); JS toggles `is-played` on them as audio
  progresses. Decided against a CSS-only fill — heights vary per bar so no
  clip/mask trick works cleanly.

## Remaining, in the order I planned to commit

1. §4 `mediaPlayer.js` + `components/video-player.css` (in progress)
2. §3.1 hero — new `<h1>` "Your coaching deserves a bigger audience.", old
   headline demoted to a supporting line, 2-col desktop layout with the video,
   "Hear it from Ziad" eyebrow, real stat numbers in the HTML (so they are
   correct with no JS) + the 4th stat "+14.2K in 40 days"
3. §3.2 before/after duration timeline bar (own component class so the style can
   be swapped without touching card markup) + `in N days` on the growth line
4. §3.3 NEW "Who is this investment for?" (6 check cards + quieter "Not for you
   if…" block)
5. §3.4 NEW "How we work together" — 9 steps, zigzag scroll-lit path, summary
   box, CTA. Keeps `#services` and folds the 3 existing pipeline stages'
   text into steps 4/5/6 rather than deleting them
6. §3.5 NEW "Hear it from our coaches" — 5 voice notes + 5-video carousel
7. §3.6 FAQ rewording + the new "Do you post the reels for me?" question
8. §3.7 Packages → "Investment" rewording
9. §3.8 sticky mobile Book-a-call bar
10. §2 final section reorder
11. §6 small fixes (handle mismatch TODO, Instagram TODO, static fallback year)
12. Bump every `?v=15` → `?v=16` in lockstep (CLAUDE.md rule), then §8 testing
    and the §9 report

## Decisions made that deviate from CHANGES.md (for the final report)

1. **§0.1 "stop and ask about uncommitted changes"** — I did not stop. The only
   uncommitted things were two *untracked* markdown docs (`CHANGES.md` itself
   and `scroll-snap-navigation-guide.md`); no tracked file was modified, so
   there was nothing at risk. Flagging rather than blocking.
2. **§3.2 vertical bar on narrow screens** — `.transformation__shots` is
   `flex-direction: column` at *every* width, so before/after are always
   stacked. A horizontal bar sitting between the two stacked shots (matching
   the `Before ●━━ 40 days ━━● After` sketch) is therefore right at all widths;
   there is no width at which the vertical variant would apply.
3. **§2 reorder vs. the nav** — the new order puts "How we work together"
   (`#services`) *before* "Our work" (`#work`), while the nav still lists Work
   before Services (§1 says the nav stays as it is). The nav indicator will
   therefore appear to move backwards as you scroll. Worth the owner's call.
4. **New sections need ids** — planning `#feedback` (§3.5) and `#investment`
   (FAQ + plans, §3.6/3.7) as their own `<section class="snap-section">`.
   `sectionNav.js` only observes sections that have a nav link, so these are
   ignored by the active-link logic and all six existing anchors keep working;
   the only side effect is the active nav link going briefly stale while you
   scroll through them.
5. **§6 footer year** — `main.js` already fills `[data-current-year]`. The fix
   needed is only the static fallback text inside the span (it renders empty
   with JS off), not a new script.
