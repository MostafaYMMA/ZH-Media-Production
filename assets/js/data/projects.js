// Single source of truth for portfolio projects.
// thumbnail: poster image shown by default. These currently point at random
//   placeholder photos from picsum.photos (needs internet) so the grid can be
//   visualized during this build phase — swap for real stills in assets/images/projects/.
// teaserSrc: short muted looping local clip played on hover (assets/video/previews/)
// vimeoId: full video shown in the modal on click (placeholder IDs — swap for real uploads)
window.ZH = window.ZH || {};

window.ZH.projects = [
  {
    id: "aurora-launch",
    title: "Aurora Skincare — Launch Film",
    category: "Brand Film",
    thumbnail: "https://picsum.photos/seed/aurora-launch/800/500",
    teaserSrc: "assets/video/previews/aurora-launch.mp4",
    vimeoId: "76979871",
    featured: true,
  },
  {
    id: "northline-docuseries",
    title: "Northline — Docuseries Ep. 1",
    category: "Documentary",
    thumbnail: "https://picsum.photos/seed/northline-docuseries/800/500",
    teaserSrc: "assets/video/previews/northline-docuseries.mp4",
    vimeoId: "76979871",
    featured: true,
  },
  {
    id: "pulse-social",
    title: "Pulse — Social Campaign",
    category: "Social / Short-form",
    thumbnail: "https://picsum.photos/seed/pulse-social/800/500",
    teaserSrc: "assets/video/previews/pulse-social.mp4",
    vimeoId: "76979871",
    featured: true,
  },
  {
    id: "horizon-corporate",
    title: "Horizon Group — Corporate Reel",
    category: "Corporate",
    thumbnail: "https://picsum.photos/seed/horizon-corporate/800/500",
    teaserSrc: "assets/video/previews/horizon-corporate.mp4",
    vimeoId: "76979871",
    featured: false,
  },
  {
    id: "wildside-podcast",
    title: "Wildside — Podcast Visuals",
    category: "Podcast",
    thumbnail: "https://picsum.photos/seed/wildside-podcast/800/500",
    teaserSrc: "assets/video/previews/wildside-podcast.mp4",
    vimeoId: "76979871",
    featured: false,
  },
  {
    id: "form-fitness",
    title: "Form — Fitness App Trailer",
    category: "Product",
    thumbnail: "https://picsum.photos/seed/form-fitness/800/500",
    teaserSrc: "assets/video/previews/form-fitness.mp4",
    vimeoId: "76979871",
    featured: false,
  },
];

window.ZH.getFeaturedProjects = function () {
  return window.ZH.projects.filter(function (p) {
    return p.featured;
  });
};
