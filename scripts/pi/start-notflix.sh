#!/usr/bin/env bash
set -euo pipefail
URL="${NOTFLIX_URL:-http://localhost:4173/?skipBoot=0}"
command -v unclutter >/dev/null 2>&1 && unclutter -idle 0.3 -root &
command -v xset >/dev/null 2>&1 && xset s off || true
command -v xset >/dev/null 2>&1 && xset -dpms || true
BROWSER="$(command -v chromium-browser || command -v chromium || true)"
if [[ -z "$BROWSER" ]]; then echo "Chromium is required for NOTFLIX kiosk mode." >&2; exit 1; fi
exec "$BROWSER" --kiosk --no-first-run --disable-session-crashed-bubble --disable-infobars --autoplay-policy=no-user-gesture-required "$URL"
