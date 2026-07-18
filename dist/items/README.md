Drop your real files in here, named exactly:

- photo-1.png          (your polaroid headshot, used in the hero)
- hero-background.MOV  (the moving-train footage, used as the hero window background)

They're referenced in code as /items/photo-1.png and /items/hero-background.MOV —
anything in `public/` is served from the site root by Vite, so the paths don't change.

Note on the .MOV file: MOV containers generally play fine in Chrome/Safari, but can
be inconsistent in Firefox depending on the codec (especially HEVC footage straight
off an iPhone). If you run into playback issues, re-export it as .mp4 (H.264) and
update the `src` in src/components/Hero.jsx accordingly — everything else stays the same.
