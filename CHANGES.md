# CHANGES.md — ZH Personal Branding landing page update

Read this whole file before writing any code. Follow it exactly. When something is unclear or seems to conflict with the existing code, **stop and ask** instead of guessing.

---

## 0. SAFETY RULES — READ FIRST (non-negotiable)

The `main` branch is the **live production site** (deployed on Vercel). Nothing in this task may affect it until the owner has tested everything and merges it himself.

1. **Before touching anything**, run `git status`. If there are uncommitted changes, stop and ask what to do with them.
2. Create a new branch from `main` and do **all** work there:
   ```bash
   git checkout main
   git pull
   git checkout -b landing-v2
   ```
3. **Never** commit to `main`, merge into `main`, push to `main`, force-push, rebase `main`, or open/merge a pull request.
4. **Do not push anything** unless the owner explicitly says so. When he does, push only the `landing-v2` branch (`git push -u origin landing-v2`). Vercel will build a separate preview URL for it; production stays untouched.
5. Do not change `vercel.json`, deployment settings, domains, or environment config.
6. **Do not delete any content, section, file, image, or link.** This update only adds sections and changes layout. If a section moves, move it; don't rewrite or remove it.
7. Commit in small steps, one commit per section in section 3 below, with clear messages (e.g. `feat: add sales video to hero`). This makes any single change easy to revert.
8. Keep all existing element IDs and anchors (`#home`, `#work`, `#clients`, `#services`, `#about`, `#contact`) working, because the nav depends on them.

### Content inventory (do this before and after)
- **Before** changing anything, write `CONTENT-INVENTORY.md` listing every existing section in order, with its heading and a short note of its text, images, and links.
- **After** finishing, check the new page against that list and confirm that every item still exists. Report anything missing.

---

## 1. Project context

- Plain HTML / CSS / JavaScript. No frameworks, no build step, no new dependencies unless unavoidable (ask first).
- Single-page site. New sections go **on the page**, not as new pages or tabs.
- **Keep the existing theme exactly**: colors, fonts, spacing, radii, shadows, button styles, section heading pattern (small eyebrow label + big heading). Read the existing CSS first and reuse its variables and classes. Don't introduce new colors or fonts.
- Do not add the new sections to the top nav. The nav stays as it is.

---

## 2. Final page order

Rearrange to this order. Items marked (existing) keep their current content.

1. **Hero**: new hook + sales video, then the existing headline, text, buttons, stats, and scrolling strip (section 3.1)
2. **Before / After** (existing), with duration added (3.2)
3. **Who is this investment for?** (NEW, 3.3)
4. **Why you'd want us** (existing: "You didn't get into coaching to sit in the edit bay.")
5. **What we do** (existing: "From first idea to posted reel", 3 cards)
6. **How we work together**: existing "You coach. We make the content." intro + existing pipeline, expanded into the new service breakdown (3.4) + CTA
7. **Our work** (existing reels)
8. **Hear it from our coaches**: client feedback (NEW, 3.5) + CTA
9. **Our clients** (existing roster)
10. **About us**, **The founder**, **Why coaches trust us** (existing, same order as now)
11. **FAQ** (existing + edits, 3.6)
12. **Investment plans**: existing packages, reworded (3.7)
13. **Contact / Book a call** (existing) + footer

Plus: sticky mobile "Book a call" bar (3.8).

---

## 3. Changes, section by section

### 3.1 Hero: hook + sales video

**Hook**
- New main headline, which becomes the page's `<h1>`: **"Your coaching deserves a bigger audience."**
- The existing headline "Personal branding for fitness coaches." stays, but becomes the supporting line under the hook (not an `<h1>`; there must be only one `<h1>`). Keep its styling similar but smaller.
- Keep the existing eyebrow ("You built the coach. We build the brand."), paragraph, and both buttons.

**Layout**
- Desktop (≥ 1024px): two columns. Left: eyebrow, hook, supporting line, paragraph, buttons. Right: the sales video.
- Tablet and mobile: stacked in this order: eyebrow, hook, supporting line, video, paragraph, buttons.
- Keep the existing hero background images and how they're used.
- Title above the video (small, theme eyebrow style): **"Hear it from Ziad"**.

**Stats row** (existing, keep)
- The stat numbers currently show `0` until JS runs. Put the real final numbers in the HTML so they're correct without JS, and let the count-up animation start from 0 only when JS is running.
- Add one more stat showing the fastest result from the before/after data, e.g. **"+14.2K in 40 days"**. Take the numbers from section 3.2 so they always match.

**Sales video**: build it with the reusable video player component in section 4.

### 3.2 Before / After: add duration

- Keep the cards exactly as they are (images, names, handles, follower numbers).
- Add a **timeline bar between the "Before" and "After" images** on every card:
  `Before ●━━━━━ 40 days ━━━━━● After`
  - Styled in the theme's accent color, with the duration as a clear label on the bar (bold, larger than body text, not plain inline text).
  - On narrow screens, if before/after stack vertically, the bar turns vertical between them.
- Also add the duration to the growth line, e.g. `+14.3K in 30 days`.
- **Placeholder durations** (mark each with an HTML comment `<!-- TODO: confirm real duration -->`):
  - Mustafa Ashraf: 30 days
  - Galal Mohamed: 60 days
  - Mohamed Abd El-Shafy: 40 days
  - Mohamed Badr: 60 days
- Build the bar so the owner can later change it to a different style without touching the card markup (e.g. its own component class).

### 3.3 NEW: "Who is this investment for?"

Place directly after Before / After.

- Eyebrow: **For you?**
- Heading: **Who is this investment for?**
- Six statement cards, each with a check icon in the accent color, in a grid (3 columns desktop, 2 tablet, 1 mobile):
  1. You want your DMs full of people asking for coaching — not you chasing them.
  2. You'd rather perfect a client's program than a caption.
  3. You're done watching less-qualified coaches outgrow you.
  4. You want your content bringing in clients while you're on the gym floor.
  5. You want to raise your prices — and have the audience that makes it make sense.
  6. You want to be the coach people think of first in your niche, not another account that posts once a month.
- Below the cards, a smaller, visually quieter block:
  - Heading: **Not for you if…**
  - Items with an ✕ icon (muted color, not red alarm styling):
    - You want overnight results without showing up consistently.
    - You're not willing to get in front of the camera.
    - You want bought followers or fake numbers.
- Cards get a subtle entrance animation on scroll (fade/slide up, staggered). Respect `prefers-reduced-motion`.

### 3.4 Service breakdown: "How we work together" (MOST IMPORTANT SECTION)

This expands and replaces the **layout** of the existing "The pipeline" section. **Do not delete its text:** the existing intro ("You coach. We make the content." + its paragraph) stays as the section intro, and the three existing pipeline stages (Scripting & Ideas, Filming & Shooting, Editing — Reels & Shorts) have their text folded into steps 4, 5 and 6 below. Keep the section's existing ID/anchor.

**Priority: clarity first, animation second.** A coach must understand exactly what he gets and what he has to do.

**Text size rules for this section**
- Step titles: at least 20px mobile, 24px desktop.
- Step descriptions: at least 16px, good line height, good contrast. No small grey text.

**Scope of the service** (don't promise anything beyond this): script writing, video shooting, and video editing for fitness coaches, with revisions on request. The coach posts the finished reels himself. **Do not mention** posting, account management, hashtags, analytics, reports, or stories.

**Steps.** Each step has a number, a simple inline SVG icon, a title, a 1–2 sentence description, and a small **"who" tag** (You / Together / We / You approve).

1. **You reach out** — *You*
   Message us on WhatsApp or through the form. We reply within one business day.
2. **Discovery call** — *Together*
   A short call about your coaching, your audience, and your goals. We pick the package that fits: 12 or 24 reels a month.
3. **We learn your brand** — *We*
   How you coach, who you train, and what you want to be known for, so every reel sounds like you.
4. **Ideas & scripts** — *We write, you approve*
   We turn your coaching into hooks and scripts built to stop the scroll. You approve them or ask for changes before anything is filmed.
5. **Shoot day** — *You show up, we direct*
   We film at your gym with the gear and direction to make you look like the expert you are. One session covers weeks of content. Outside our area? We direct a remote shoot over a call.
6. **Editing** — *We*
   Every reel is cut, captioned, and paced for the feed, with sound tuned for Reels, TikTok, and Shorts.
7. **Your review** — *You review, we revise*
   Want something changed? The cut, captions, or pacing: we revise until you're happy to put your name on it.
8. **Ready to post** — *You*
   Your finished reels are delivered ready to post on Instagram, TikTok, and YouTube Shorts.
9. **Next month** — *Together*
   New ideas, new shoot, and the feed keeps moving. Month to month, no long contract.

Put `<!-- TODO: owner to confirm step wording with client -->` above the steps.

**Summary box** under the steps, side by side on desktop, stacked on mobile:
- **What you do:** show up and coach on camera · approve scripts · post your reels.
- **What we do:** scripts · filming · editing · captions · revisions.
- **What you get:** 12 or 24 finished reels every month, ready to post.

Then a centered **"Book a call"** button linking to `#contact`.

**Visual / animation: scroll-animated path**
- A vertical line connects all steps. As the user scrolls, the line fills with the accent color, and each step "lights up" (icon and number go from muted to accent, card gets a subtle glow) when it reaches the middle of the screen. Use `IntersectionObserver`, not scroll event handlers.
- Desktop: steps alternate left/right of a centered line (zigzag). Mobile: line on the left, all steps on the right.
- **Everything must be fully readable with no JS and with `prefers-reduced-motion`**: in those cases show all steps in their "lit" state, with no animation.

### 3.5 NEW: Client feedback — "Hear it from our coaches"

Place after "Our work".

- Eyebrow: **Client feedback** · Heading: **Hear it from our coaches.**

**Voice notes (5)**: styled like WhatsApp voice messages, stacked vertically like a chat:
- Bubble with: client photo (round avatar), play/pause button, waveform bars (decorative bars generated in HTML/CSS; the played part fills with the accent color as audio plays), and duration/time elapsed.
- Under each bubble: name, @handle, and a one-line quote.
- Use the theme colors, not WhatsApp green.
- Use the native `<audio>` element underneath, with custom UI on top.

**Video testimonials (5)**: a swipeable carousel:
- Each card uses the **same video player component** as the sales video (section 4): same border, play button, hover, and controls.
- Under each video: photo, name, @handle, one-line quote.
- Mobile: swipe with CSS scroll-snap, one card mostly visible with the next one peeking in. Desktop: 3 visible, with prev/next arrow buttons. Dots under it on all sizes.
- Keyboard accessible (arrows focusable, labelled).

**Placeholders**
- Until real files arrive, use existing client photos from `/assets/images/clients/` and placeholder text, each marked `<!-- TODO: real testimonial -->`.
- Placeholder quote text must be obviously fake (e.g. "Testimonial coming soon") so fake quotes can never accidentally go live as real ones.

Then a centered **"Book a call"** button linking to `#contact`.

### 3.6 FAQ (existing): edits only

- Keep all existing questions and answers.
- Change the question "What does it cost?" to **"How much is the investment?"**. Keep its answer but word it as investment: "Your investment depends on your package and shoot logistics, so we quote it on the call once we know what you need. Book a call and we'll walk you through it."
- Add one new question at the end:
  **"Do you post the reels for me?"**
  "We handle the script, the shoot, and the edit, and deliver every reel ready to post. You post them to your own accounts, so your page stays fully yours."

### 3.7 Investment plans (existing packages): reword only

- Section eyebrow "Packages" → **"Investment"**.
- Heading "Pick your monthly output" → **"Choose your monthly investment"**.
- Keep both plans, all bullet points, the "Best for growth" badge, and the "Book a call" buttons unchanged.
- Prices stay "quoted on the call". Do not add prices.
- Buttons across the site stay **"Book a call"**.

### 3.8 NEW: Sticky mobile "Book a call" bar

- Only below 768px width.
- A fixed bar at the bottom with one full-width "Book a call" button (theme primary button style) linking to `#contact`.
- Hidden while the hero is on screen. Appears after scrolling past the hero, and hides again when the contact section is on screen.
- Respect the iPhone safe area (`env(safe-area-inset-bottom)`), and make sure it never covers content (add matching bottom padding to the page when visible).

---

## 4. Reusable video player component

One component used for the sales video and all 5 testimonial videos.

**Media**
- Native `<video>` with `preload="metadata"`, `playsinline`, a `poster` image. **Never autoplay.**
- Aspect ratio **9:16 (vertical)**. Sales video: max width about 400px on desktop, full content width on mobile (capped so it never exceeds the screen height).
- If JS fails, the video must still work with native controls. Add the `controls` attribute in HTML and remove it with JS when the custom controls load.

**Frame**
- A border around the video using the theme accent color and the site's existing border radius. Clip the video to the radius.

**Play button**
- A simple centered circle (semi-transparent dark background, white play triangle, about 64–72px). Visible when paused, hidden while playing. Clicking the button or anywhere on the video toggles play/pause.

**Controls bar, INSIDE the frame** (like Instagram Reels)
- Sits at the bottom *inside* the border, with inner padding so it never touches the border.
- Thin seek bar in the accent color (draggable, clickable), play/pause, current time / duration, mute, fullscreen.
- Subtle dark gradient behind the controls for readability.
- While playing, hide the controls after about 2.5s of no mouse movement/touch; show them again on hover, move, or tap.

**Hover / touch**
- Desktop only (`@media (hover: hover)`): a small zoom on hover (`scale(1.02)`) with a smooth transition.
- Touch devices: no hover zoom; tapping shows the controls.
- No zoom with `prefers-reduced-motion`.

**Behavior**
- Only **one** media item plays at a time across the page: starting any video or voice note pauses all others.
- Accessibility: all buttons are real `<button>`s with `aria-label`s, focus styles visible, Space/Enter toggles play.
- If a video source is missing, show the poster with a small "Video coming soon" label and no broken player.

---

## 5. Media config: one place for all links

- Create `assets/js/media-config.js` with one object mapping keys to file URLs and posters, e.g. `salesVideo`, `testimonialVideo1–5`, `voiceNote1–5`.
- In the HTML, media elements reference a key (e.g. `data-media-key="testimonialVideo1"`), and a small script fills in the `src`.
- All paths start as local files (e.g. `assets/media/sales-video.mp4`). Moving to a video host later must only require editing this one file.
- Create `assets/media/` with a `README.md` explaining the expected files: sales video 1080×1920 mp4 (H.264, compressed, ideally under 20 MB), testimonial videos the same, voice notes as `.mp3` or `.m4a`, posters as `.webp`.

---

## 6. Small fixes (optional — owner can delete this section)

- **Galal Mohamed's handle** is `@galalmohamed99` in Before/After but `@galalmohamed95` in the client roster. **Don't guess which one is correct.** Leave both as they are, add `<!-- TODO: confirm correct handle -->`, and list it in the final report.
- **Instagram links** in the contact section and footer point to `#`. Add `<!-- TODO: add real Instagram URL -->` and list it in the report. Don't invent a URL.
- **Footer copyright** is missing the year. Add the current year with a tiny script, with a static year in the HTML as fallback.

---

## 7. Future-proofing for Arabic (no Arabic work now)

An Arabic (right-to-left) version is planned later. Build all **new** code so it will flip cleanly:
- Use logical CSS properties (`margin-inline-start`, `padding-inline`, `inset-inline-start`, `text-align: start`) instead of left/right in new CSS.
- No hard-coded left/right in JS animations or the carousel. Read the direction from the document instead.
- Keep all text as real HTML text, never inside images.
- Do not change existing code just for this.

---

## 8. Testing: everything must pass before reporting done

Serve locally (e.g. `python3 -m http.server 8000` or `npx serve`) and check:

**Layout**
- [ ] Widths 360, 390, 430, 768, 1024, 1280, 1440: nothing overflows, no horizontal scroll anywhere.
- [ ] Chrome, Firefox and Safari (or WebKit), plus mobile emulation.
- [ ] Page order matches section 2.

**Nothing lost**
- [ ] Every item in `CONTENT-INVENTORY.md` is still on the page.
- [ ] All nav links scroll to the right sections.
- [ ] The contact form still opens WhatsApp with all the same fields filled in, and the email fallback still works.

**Media**
- [ ] No video autoplays.
- [ ] Play button, seek bar, time, mute, and fullscreen work. Controls stay inside the frame.
- [ ] Starting one video or voice note pauses every other one.
- [ ] Missing media shows the "coming soon" state, not errors.
- [ ] With JS disabled, videos still play with native controls and all text is readable.

**Animation & accessibility**
- [ ] With `prefers-reduced-motion`, there's no zoom and no scroll animation, and all steps show fully.
- [ ] Keyboard only: every button, the carousel, and the players are reachable and usable, with focus visible.
- [ ] One `<h1>` only. Images have alt text.

**Quality**
- [ ] Zero console errors or warnings.
- [ ] Lighthouse (mobile): performance, accessibility and best practices not worse than before. Report the before/after scores.
- [ ] The sticky mobile bar appears and hides correctly, and never covers content.

---

## 9. Final report

When done, **don't push**. Report to the owner with:
1. A summary of what changed, per section.
2. A list of every `TODO` placeholder that must be replaced before going live (durations, testimonials, media files, handle, Instagram link, step wording).
3. The test checklist results and Lighthouse scores.
4. Anything you were unsure about or chose differently from this file, and why.
5. The exact commands to push the branch for a Vercel preview, **only to run when the owner approves**.

> ⚠️ The site must not go live with placeholder testimonials or placeholder durations. The owner merges to `main` himself after reviewing the Vercel preview.
