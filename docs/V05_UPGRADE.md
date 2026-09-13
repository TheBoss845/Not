# NOTFLIX v0.5

v0.5 turns several previously static pieces into real streaming-service behavior.

## Personalized home screen

- `Top Picks for <profile>` scores the catalog from likes, My List, recent history, watch progress, match score, featured status, and new releases.
- `Because You Watched <title>` automatically follows the latest meaningful watch instead of always pretending everyone watched the same film.
- `Watch It Again` appears when a profile has substantially completed titles.
- Continue Watching ignores episode-level progress keys so the movie row stays clean.

## TV interface soundscape

The Interface Sounds setting now controls generated Web Audio feedback for focus movement, activation, and back navigation. No copyrighted or external audio files are bundled.

## HQ system health

NOTFLIX HQ now has a System Health page showing catalog size, controller-link state, series/custom-title counts, poster/backdrop/trailer/full-film coverage, and the major platform systems currently online.

## Validation

Recommendation behavior is covered with Node tests in `tests/recommendations.test.mjs`; the regular CI pipeline also runs the production Vite build.
