# NOTFLIX v1.0

NOTFLIX v1 closes the last major platform gap: every catalog title now has a complete visual and playback experience even without external media files.

## New in v1

- Generated inline-SVG artwork for every missing poster and backdrop.
- NOTFLIX Motion, a deterministic cinematic storyboard renderer for trailers, movies and episodes.
- Full catalog runtime support for generated playback, so progress, Continue Watching, telemetry and autoplay behave like a real streaming service.
- Generated autoplay previews on cards and hero banners.
- Preview buttons for every title, whether or not a custom trailer exists.
- HQ System Health now reports custom-versus-generated media coverage and 100% playable catalog coverage.
- Updated offline shell and automated tests for generated artwork, storyboards and runtime parsing.

## Media priority

Custom media always wins. If a title has an uploaded poster, backdrop, trailer or feature video, NOTFLIX uses that asset. The generated layer only fills gaps.

This means a creator can replace generated material one title at a time without breaking the rest of the catalog.
