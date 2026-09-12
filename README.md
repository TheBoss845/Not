# NOTFLIX

A TV-first parody streaming platform for original comedy trailers, fake catalog entries, generated short films, and interactive prank moments on devices you are allowed to use.

## Platform status

NOTFLIX v0.4 includes a cinematic boot experience; full profile management with profile-specific My List, viewing progress, history and ratings; maturity-filtered profiles; Home / Movies / TV / New & Popular / My List surfaces; search and notifications; Continue Watching, Top 10 and recommendation rows; genre filtering; title details; seasons and episodes; autoplay previews; real-media and simulated playback; captions; playback speed; skip-intro support; autoplay-next; keyboard/TV navigation; offline shell; crash recovery; local backup export/restore; and persistent settings.

NOTFLIX HQ includes live playback telemetry, transport controls, instant prank triggers, catalog injection, an event log, a per-title Prank Rule Editor, and a Catalog Studio. Local tabs use BroadcastChannel; the optional token-protected WebSocket relay supports a phone/iPad controller and TV viewer on the same permitted setup.

## Content and media pipeline

The built-in catalog is data-driven. Every title can provide `media.source`, `media.trailer`, `media.poster`, `media.backdrop`, WebVTT subtitle tracks, and an intro endpoint. Catalog Studio can attach or replace those assets for any built-in or custom title without touching source code. It also reports how many titles currently have finished posters, backdrops, trailers and full films.

The Series / Episode Builder can add or replace episodes and entire new seasons on shows, including an episode video, subtitle track and intro timing. This is the system used for surprise/fake-episode style prank content.

If media is missing, NOTFLIX deliberately falls back to procedural original artwork and cinematic simulated playback so the catalog stays usable while films are being produced. Add original, generated, licensed, or otherwise permitted media only.

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

GitHub Actions also validates the relay server and Raspberry Pi shell scripts, runs the Node tests, and performs a production Vite build.

## Raspberry Pi / TV

See `docs/PI_KIOSK.md`. The supplied kiosk starter launches Chromium fullscreen. A built-in HDMI-CEC bridge maps common TV-remote arrows, Select, Return, Play/Pause, Rewind, Fast-forward and Stop actions into the TV interface when `cec-client` and `xdotool` are available.

## Hidden control surface

Open HQ with `?mode=hq` or press `Shift + P`. The normal viewer navigation does not expose HQ unless the URL explicitly includes `?admin=1`. Keep HQ on a device you control. The prank system is intended for harmless jokes, not secret access to somebody else’s hardware or accounts.
