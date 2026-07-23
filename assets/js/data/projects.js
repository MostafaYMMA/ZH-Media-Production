// Single source of truth for portfolio projects.
// thumbnail: poster image shown by default. These currently point at random
//   placeholder photos from picsum.photos (needs internet) so the grid can be
//   visualized during this build phase — swap for real stills in assets/images/projects/.
// teaserSrc: short muted looping local clip played on hover (assets/video/previews/)
// vimeoId: full video shown in the modal on click (placeholder IDs — swap for real uploads)
window.ZH = window.ZH || {};

window.ZH.projects = [
  {
    id: "coach-adam-strength",
    title: "Coach Adam — Strength Series",
    category: "Reels / Strength",
    thumbnail: "https://picsum.photos/seed/coach-adam-strength/800/500",
    teaserSrc: "assets/video/previews/coach-adam-strength.mp4",
    vimeoId: "76979871",
    featured: true,
  },
  {
    id: "coach-mona-transformation",
    title: "Coach Mona — Client Transformation",
    category: "Reels / Transformation",
    thumbnail: "https://picsum.photos/seed/coach-mona-transformation/800/500",
    teaserSrc: "assets/video/previews/coach-mona-transformation.mp4",
    vimeoId: "76979871",
    featured: true,
  },
  {
    id: "coach-yassin-form-tips",
    title: "Coach Yassin — Form Tips",
    category: "Reels / Education",
    thumbnail: "https://picsum.photos/seed/coach-yassin-form-tips/800/500",
    teaserSrc: "assets/video/previews/coach-yassin-form-tips.mp4",
    vimeoId: "76979871",
    featured: true,
  },
  {
    id: "coach-lina-mobility",
    title: "Coach Lina — Mobility Shorts",
    category: "Shorts / Mobility",
    thumbnail: "https://picsum.photos/seed/coach-lina-mobility/800/500",
    teaserSrc: "assets/video/previews/coach-lina-mobility.mp4",
    vimeoId: "76979871",
    featured: false,
  },
  {
    id: "coach-karim-nutrition",
    title: "Coach Karim — Nutrition Myths",
    category: "Reels / Nutrition",
    thumbnail: "https://picsum.photos/seed/coach-karim-nutrition/800/500",
    teaserSrc: "assets/video/previews/coach-karim-nutrition.mp4",
    vimeoId: "76979871",
    featured: false,
  },
  {
    id: "coach-salma-hiit",
    title: "Coach Salma — HIIT Sessions",
    category: "Reels / Conditioning",
    thumbnail: "https://picsum.photos/seed/coach-salma-hiit/800/500",
    teaserSrc: "assets/video/previews/coach-salma-hiit.mp4",
    vimeoId: "76979871",
    featured: false,
  },
];

window.ZH.getFeaturedProjects = function () {
  return window.ZH.projects.filter(function (p) {
    return p.featured;
  });
};
