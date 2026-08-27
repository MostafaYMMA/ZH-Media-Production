// Single source of truth for the Work grid.
// Each entry is one real reel we produced for a fitness coach — the screenshot
// (in assets/images/reels/) already shows the reel's view count, so the card is
// just the framed still. No video playback: we don't host the reels themselves.
window.ZH = window.ZH || {};

window.ZH.projects = (function () {
  var list = [];
  for (var i = 1; i <= 27; i++) {
    var n = i < 10 ? "0" + i : String(i);
    list.push({
      id: "reel-" + n,
      thumbnail: "assets/images/reels/reel-" + n + ".webp",
      alt: "A reel we scripted, shot, and edited for a fitness coach",
    });
  }
  return list;
})();
