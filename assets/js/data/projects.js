// The Work section: Before / After pairs, by views.
// "After" is one of our reels — the ten highest-viewed ones, best first. Each
// screenshot in assets/images/reels/ already shows its view count; `views`
// here is what the card prints under it, in the volt "after" figure.
// "Before" is the same coach's reel from before they worked with us. Those
// are not in yet: while `before` is null the card draws a "coming soon" frame
// and the before figure reads as a dash. To fill one in, drop the still into
// assets/images/reels/ and set `before` to its file name and `beforeViews` to
// its count (same "123K" style as `views`). No video playback — stills only.
window.ZH = window.ZH || {};

/* Thumbnail paths are written relative to the site root. The English build at
   /en/ sets window.ZH.base = "../" in its <head>, so one data file serves both
   documents — see the note in index.html. This file has no IIFE, so the prefix
   is read inline rather than parked in a global. */
window.ZH.projects = [
  { after: "reel-01", views: "2.4M", before: null, beforeViews: null },
  { after: "reel-02", views: "2.4M", before: null, beforeViews: null },
  { after: "reel-05", views: "2.2M", before: null, beforeViews: null },
  { after: "reel-07", views: "1.9M", before: null, beforeViews: null },
  { after: "reel-03", views: "1.3M", before: null, beforeViews: null },
  { after: "reel-10", views: "1.3M", before: null, beforeViews: null },
  { after: "reel-12", views: "1M", before: null, beforeViews: null },
  { after: "reel-15", views: "1M", before: null, beforeViews: null },
  { after: "reel-04", views: "987K", before: null, beforeViews: null },
  { after: "reel-17", views: "924K", before: null, beforeViews: null },
].map(function (pair) {
  var dir = (window.ZH.base || "") + "assets/images/reels/";
  return {
    id: pair.after,
    thumbnail: dir + pair.after + ".webp",
    views: pair.views,
    before: pair.before ? dir + pair.before + ".webp" : null,
    beforeViews: pair.beforeViews,
    // Alt text is generated, so it comes from the string table rather than the
    // markup (assets/js/i18n.js, keyed off <html lang>).
    alt: window.ZH.t
      ? window.ZH.t("work.reelAltViews", pair.views)
      : "A reel we scripted, shot, and edited for a fitness coach — " + pair.views + " views",
    beforeAlt:
      window.ZH.t && pair.beforeViews
        ? window.ZH.t("work.beforeAlt", pair.beforeViews)
        : "",
  };
});
