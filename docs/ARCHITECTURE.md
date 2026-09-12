# NOTFLIX architecture

The project is split into a TV client, a data-driven media catalog, an event-driven prank layer, and a control plane.

- `src/data/catalog.js` contains title manifests. Adding a title there makes it searchable and usable throughout the platform.
- `src/context/NotflixContext.jsx` owns persistent viewer state such as progress, My List, profiles, history, settings, notifications, and injected content.
- `src/components/Player.jsx` supports real media URLs and a simulated cinematic fallback for unfinished titles.
- `src/lib/prankEngine.js` defines reusable prank experiences triggered by player events or HQ.
- `src/lib/controlBus.js` uses BroadcastChannel locally and an optional WebSocket relay for second-device control.
- `src/hooks/useSpatialNavigation.js` implements arrow/Enter/Escape navigation for TV-style input.

Generated videos should live on media/object storage rather than inside Git. Title manifests can point at those URLs when they are ready.
