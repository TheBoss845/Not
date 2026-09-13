# NOTFLIX

A TV-first parody streaming platform for original comedy titles, generated cinematic media, custom films, interactive prank moments, and a remote HQ controller on devices you are allowed to use.

## Platform status

NOTFLIX v1.0 is feature-complete as a streaming experience. It includes a cinematic boot experience; profile-specific My List, viewing progress, history and ratings; maturity-filtered profiles; Home / Movies / TV / New & Popular / My List surfaces; search and notifications; Continue Watching, Top 10, Watch It Again and personalized recommendation rows; genre filtering; title details; seasons and episodes; autoplay previews; captions; playback speed; skip-intro support; autoplay-next; keyboard/TV navigation; offline shell; crash recovery; local backup export/restore; persistent settings; and generated interface audio.

NOTFLIX HQ includes live playback telemetry, transport controls, instant prank triggers, catalog injection, an event log, a per-title Prank Rule Editor, Catalog Studio, Series Studio, and a System Health dashboard. Local tabs use BroadcastChannel; the optional token-protected WebSocket relay supports a phone/iPad controller and TV viewer on the same permitted setup.

## Complete media pipeline

Every title now has a complete media experience even before a custom asset is uploaded. NOTFLIX v1 generates original inline-SVG poster/backdrop artwork from title metadata and uses the NOTFLIX Motion engine to create deterministic trailer and full-runtime storyboards for every movie and episode. Expanded cards can autoplay generated previews, title pages always have a preview, and playback uses the catalog's real listed runtime so Continue Watching and remote telemetry behave like a real service.

Custom media still takes priority. Any title can provide `media.source`, `media.trailer`, `media.poster`, `media.backdrop`, WebVTT subtitle tracks, and an intro endpoint. Catalog Studio can attach or replace those assets without touching source code. Series Studio can add or replace episodes and seasons with their own videos, subtitles and intro timing.

The generated media layer is deliberately original and does not bundle copyrighted movie footage, music, posters, or dialogue. Add only original, generated, licensed, or otherwise permitted custom media.

## Prank system

Pranks are event-driven rather than hard-coded into screens. Built-in effects include Premium Pause, Premium Rewind, fake buffering, service errors, subtitle notices, fake HD upsells and the final NOTFLIX reveal. HQ can trigger them manually, while the Prank Rule Editor can attach them to pause, rewind or percentage-of-playback events per title.

## Run

```bash
npm install
npm run dev
```

## Validate

```bash
npm run check
```

GitHub Actions validates the relay server and Raspberry Pi shell scripts, runs the Node test suite, and performs a production Vite build.

## Raspberry Pi / TV

See `docs/PI_KIOSK.md`. The supplied kiosk starter launches Chromium fullscreen. A built-in HDMI-CEC bridge maps common TV-remote arrows, Select, Return, Play/Pause, Rewind, Fast-forward and Stop actions into the TV interface when `cec-client` and `xdotool` are available.

## Hidden control surface

Open HQ with `?mode=hq` or press `Shift + P`. Keep HQ on a device you control. The prank system is intended for harmless jokes, not secret access to somebody else’s hardware or accounts.
