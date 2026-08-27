// The Work grid's reels — our 12 best-performing, ordered by view count
// (highest first). Each screenshot in assets/images/reels/ already shows its
// view count; `views` here is just the sort key / documentation. No video
// playback — we don't host the reels themselves.
// To re-rank or swap: re-export the webp files in this order and edit the list.
window.ZH = window.ZH || {};

window.ZH.projects = [
  { views: "2.4M" },
  { views: "2.4M" },
  { views: "2.2M" },
  { views: "1.9M" },
  { views: "1.3M" },
  { views: "1.3M" },
  { views: "1M" },
  { views: "1M" },
  { views: "987K" },
  { views: "924K" },
  { views: "770K" },
  { views: "618K" },
].map(function (reel, i) {
  var n = i + 1 < 10 ? "0" + (i + 1) : String(i + 1);
  return {
    id: "reel-" + n,
    thumbnail: "assets/images/reels/reel-" + n + ".webp",
    views: reel.views,
    alt: "A reel we scripted, shot, and edited for a fitness coach — " + reel.views + " views",
  };
});
