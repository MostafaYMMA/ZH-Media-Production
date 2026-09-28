window.ZH = window.ZH || {};

/* ==========================================================================
   MEDIA CONFIG — the one place every video / audio URL lives.

   HTML never hard-codes a media URL. A player element carries
   `data-media-key="salesVideo"` and mediaPlayer.js looks the key up here to
   fill in `src` + `poster`. Moving to a video host (Cloudflare Stream, Bunny,
   Mux, a plain CDN…) later means editing this file only — nothing in the
   markup changes.

   Each entry:
     src    — path or absolute URL to the media file
     poster — still frame shown before playback (video only)
     type   — optional MIME hint, e.g. "video/mp4"

   A key whose `src` is empty (or whose file is missing) renders as the
   "coming soon" state instead of a broken player — see mediaPlayer.js. Drop
   the real files into assets/media/ (see the README there for specs) and the
   players light up with no other change.
   ========================================================================== */
window.ZH.media = {
  /* Hero sales video — "Hear it from Ziad" */
  salesVideo: {
    src: "assets/media/sales-video.mp4",
    poster: "assets/media/posters/sales-video.webp",
    type: "video/mp4",
  },

  /* Video testimonials — "Hear it from our coaches" carousel */
  testimonialVideo1: {
    src: "assets/media/testimonial-1.mp4",
    poster: "assets/media/posters/testimonial-1.webp",
    type: "video/mp4",
  },
  testimonialVideo2: {
    src: "assets/media/testimonial-2.mp4",
    poster: "assets/media/posters/testimonial-2.webp",
    type: "video/mp4",
  },
  testimonialVideo3: {
    src: "assets/media/testimonial-3.mp4",
    poster: "assets/media/posters/testimonial-3.webp",
    type: "video/mp4",
  },
  testimonialVideo4: {
    src: "assets/media/testimonial-4.mp4",
    poster: "assets/media/posters/testimonial-4.webp",
    type: "video/mp4",
  },
  testimonialVideo5: {
    src: "assets/media/testimonial-5.mp4",
    poster: "assets/media/posters/testimonial-5.webp",
    type: "video/mp4",
  },

  /* Voice notes — WhatsApp-style audio testimonials */
  voiceNote1: { src: "assets/media/voice-note-1.m4a", type: "audio/mp4" },
  voiceNote2: { src: "assets/media/voice-note-2.m4a", type: "audio/mp4" },
  voiceNote3: { src: "assets/media/voice-note-3.m4a", type: "audio/mp4" },
  voiceNote4: { src: "assets/media/voice-note-4.m4a", type: "audio/mp4" },
  voiceNote5: { src: "assets/media/voice-note-5.m4a", type: "audio/mp4" },
};
