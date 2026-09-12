# NOTFLIX

A TV-first parody streaming platform for original comedy trailers, fake catalog entries, generated short films, and interactive prank moments on devices you are allowed to use.

## Platform status

The app now includes a cinematic boot experience, multi-profile picker, Home / Movies / TV / New & Popular / My List surfaces, search, notifications, persistent watch history and progress, genre filtering, title detail pages, seasons and episodes, autoplay previews, actual-video and simulated playback, captions, playback speed, skip-intro support, autoplay-next, keyboard/TV navigation, offline shell, and persistent settings.

NOTFLIX HQ includes live playback telemetry, transport controls, instant prank triggers, catalog injection, a catalog studio for adding generated movies without editing code, per-title prank rule editing, and an event log. Local tabs use BroadcastChannel; the optional relay server supports a phone/iPad controller and TV viewer on the same permitted setup.

## Media pipeline

Each title can provide `media.source`, `media.trailer`, `media.poster`, `media.backdrop`, subtitle tracks, and an intro endpoint. If media is missing, NOTFLIX deliberately falls back to polished simulated artwork/playback so the catalog is still usable while films are being produced. Add original, licensed, or otherwise permitted media only.

## Run

```bash
npm install
npm run dev
```

## Validate

```bash
npm run check
```

## Raspberry Pi / TV

See `docs/PI_KIOSK.md`. The supplied kiosk starter launches Chromium fullscreen; arrow keys, Enter, Escape/Backspace, and compatible remote-key translation drive the TV interface.

## Hidden control surface

Open with `?mode=hq` or press `Shift + P`. Keep HQ on a device you control. The prank system is intended for harmless jokes, not secret access to somebody else’s hardware or accounts.
