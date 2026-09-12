# NOTFLIX

A TV-first parody streaming platform for original comedy trailers, fake catalog entries, custom episodes, and interactive prank moments.

## Implemented

- cinematic boot sequence and profile picker
- persistent profiles, My List, Continue Watching, watch progress, history, settings, and notifications
- Home, TV Shows, Movies, New & Popular, and My List views
- large parody catalog with movies and multi-season shows
- Top 10, New Releases, recommendations, genre rows, and injected titles
- delayed expanding cards and keyboard/TV focus navigation
- title detail experience with seasons, episodes, metadata, recommendations, and play controls
- fullscreen player with play/pause, seek, mute, subtitles, progress, fullscreen, and autoplay-next
- support for real media URLs plus cinematic simulated playback while media is still being produced
- search overlay
- Premium Pause, Premium Rewind, fake buffering, fake errors, subtitle jokes, and reveal pranks
- NOTFLIX HQ control room
- local BroadcastChannel control plus optional WebSocket relay for another device
- PWA shell and Raspberry Pi kiosk starter

## Run

```bash
npm install
npm run dev
```

Optional control relay:

```bash
NOTFLIX_CONTROL_TOKEN=choose-a-token npm run control
```

Open HQ with `/?mode=hq&skipBoot=1` or press `Shift + P`.

## Media rule

Use original, licensed, or otherwise permitted media. This project is for a parody streaming experience, not redistributing copyrighted movies.
