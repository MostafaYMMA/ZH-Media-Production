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
     ready  — false until the real file exists. See below.

   >>> WHEN A REAL FILE LANDS: drop it in assets/media/ (the README there has
   >>> the specs) and set that entry's `ready` to true. That is the only edit.

   `ready: false` means the player renders its tidy "coming soon" state and
   never requests the file, which is why the console stays clean while the
   media is still being shot. Without the flag the browser would fire a 404 for
   every one of these paths on each page load. The paths are written out in
   full regardless, so this file stays the single place any URL is defined.

   A key that is missing entirely, or whose file 404s despite `ready: true`,
   also falls back to "coming soon" rather than a broken player.
   ========================================================================== */
window.ZH.media = {
  /* Hero sales video — "Hear it from Ziad" */
  salesVideo: {
    src: "assets/media/sales-video.mp4",
    poster: "assets/media/posters/sales-video.webp",
    type: "video/mp4",
    ready: false,
  },

  /* Voice notes — WhatsApp-style audio testimonials */
  voiceNote1: { src: "assets/media/voice-note-1.m4a", type: "audio/mp4", ready: false },
  voiceNote2: { src: "assets/media/voice-note-2.m4a", type: "audio/mp4", ready: false },
  voiceNote3: { src: "assets/media/voice-note-3.m4a", type: "audio/mp4", ready: false },
  voiceNote4: { src: "assets/media/voice-note-4.m4a", type: "audio/mp4", ready: false },
};

/* Every path above is written relative to the SITE ROOT, so this stays the one
   readable place a URL is defined. The English build at /en/ is one directory
   down and sets window.ZH.base = "../" in its <head>; prefixing here means the
   entries above never have to know which document loaded them. */
(function () {
  var base = window.ZH.base;
  if (!base) return;
  Object.keys(window.ZH.media).forEach(function (key) {
    var entry = window.ZH.media[key];
    if (entry.src) entry.src = base + entry.src;
    if (entry.poster) entry.poster = base + entry.poster;
  });
})();
