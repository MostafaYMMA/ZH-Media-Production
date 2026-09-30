// The Work grid's reels. Order is deliberate: a mix of styles so a first-time
// visitor immediately sees the studio does more than one kind of video —
// roughly 60% shot-in-the-gym pieces and 40% cut-out / graphic-overlay pieces,
// and no two cut-out reels sit next to each other.
// Each screenshot in assets/images/reels/ already shows its view count;
// `views` here is documentation only. No video playback — we don't host the reels.
window.ZH = window.ZH || {};

/* Thumbnail paths are written relative to the site root. The English build at
   /en/ sets window.ZH.base = "../" in its <head>, so one data file serves both
   documents — see the note in index.html. This file has no IIFE, so the prefix
   is read inline rather than parked in a global. */
window.ZH.projects = [
  "2.4M", "2.4M", "1.3M", "987K", "2.2M",
  "618K", "1.9M", "507K", "393K", "1.3M",
  "364K", "1M", "363K", "312K", "1M",
  "214K", "924K", "192K", "121K", "770K",
].map(function (views, i) {
  var n = i + 1 < 10 ? "0" + (i + 1) : String(i + 1);
  return {
    id: "reel-" + n,
    thumbnail: (window.ZH.base || "") + "assets/images/reels/reel-" + n + ".webp",
    views: views,
    // Alt text is generated, so it comes from the string table rather than the
    // markup (assets/js/i18n.js, keyed off <html lang>).
    alt: window.ZH.t
      ? window.ZH.t("work.reelAltViews", views)
      : "A reel we scripted, shot, and edited for a fitness coach — " + views + " views",
  };
});
