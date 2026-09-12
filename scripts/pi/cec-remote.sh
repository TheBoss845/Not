#!/usr/bin/env bash
set -euo pipefail

if ! command -v cec-client >/dev/null 2>&1 || ! command -v xdotool >/dev/null 2>&1; then
  echo "NOTFLIX CEC bridge needs cec-client and xdotool; continuing without it." >&2
  exit 0
fi

# Translate common HDMI-CEC user-control presses into the same keyboard events
# the NOTFLIX TV UI understands. Run this only on a TV/setup you control.
cec-client -d 8 -t r 2>/dev/null | while IFS= read -r line; do
  case "$line" in
    *"key pressed: up"*) xdotool key Up ;;
    *"key pressed: down"*) xdotool key Down ;;
    *"key pressed: left"*) xdotool key Left ;;
    *"key pressed: right"*) xdotool key Right ;;
    *"key pressed: select"*|*"key pressed: enter"*) xdotool key Return ;;
    *"key pressed: exit"*|*"key pressed: previous channel"*|*"key pressed: return"*) xdotool key BackSpace ;;
    *"key pressed: play"*) xdotool key space ;;
    *"key pressed: pause"*) xdotool key space ;;
    *"key pressed: rewind"*) xdotool key Left ;;
    *"key pressed: fast forward"*) xdotool key Right ;;
    *"key pressed: stop"*) xdotool key Escape ;;
  esac
done
