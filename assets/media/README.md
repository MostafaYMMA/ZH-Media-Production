# assets/media/

Real video and audio for the landing page. **Every file here is referenced from
one place only:** `assets/js/media-config.js`. Drop a file in with the exact
name below and the matching player on the page starts working — no HTML edits.

A player whose file is missing shows a tidy "Video coming soon" state instead of
a broken control bar, so it is safe to deploy before all the media has landed.

> The site must not go live with placeholder testimonials. See CHANGES.md § 9.

## Expected files

| File | What it is | Spec |
|------|-----------|------|
| `sales-video.mp4` | Hero sales video ("Hear it from Ziad") | 1080×1920 (**9:16 vertical**), H.264 + AAC, `.mp4`, compressed — ideally **under 20 MB** |
| `testimonial-1.mp4` … `testimonial-5.mp4` | The five video testimonials | same as above |
| `voice-note-1.m4a` … `voice-note-5.m4a` | The five voice-note testimonials | `.m4a` (AAC) or `.mp3`, mono is fine, ~96–128 kbps |
| `posters/sales-video.webp` | Poster (first frame) for the hero video | `.webp`, 1080×1920, quality ~80 |
| `posters/testimonial-1.webp` … `-5.webp` | Posters for the testimonial videos | same as above |

## Why these specs

- **9:16 vertical** — every player on the page is locked to a 9:16 frame. A
  landscape file will letterbox inside it.
- **Posters matter.** Videos use `preload="metadata"` and never autoplay, so the
  poster *is* what visitors see. Without one the frame renders black.
- **Keep the files small.** Nothing here is lazy-loaded behind a click gate on
  mobile data other than the poster, so a 60 MB hero video is the whole page's
  performance budget spent in one go. Compress hard (e.g. HandBrake "Vimeo
  YouTube 1080p60" preset, or `ffmpeg -crf 24 -preset slow`).

Example re-encode:

```sh
# vertical, compressed, web-friendly
ffmpeg -i raw.mov -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
  -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart \
  -c:a aac -b:a 128k sales-video.mp4

# poster from one second in
ffmpeg -i sales-video.mp4 -ss 00:00:01 -frames:v 1 -q:v 80 posters/sales-video.webp
```

## Moving to a video host later

Edit `assets/js/media-config.js` only — swap each `src` for the hosted URL and
keep the `poster` local (or point it at the host's thumbnail). The markup
references keys (`data-media-key="testimonialVideo1"`), never paths.
