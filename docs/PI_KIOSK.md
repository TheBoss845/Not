# Raspberry Pi kiosk

Use a television and hardware you own or have permission to connect.

## Kiosk startup

Build or deploy NOTFLIX, install Chromium on the Pi, set `NOTFLIX_URL`, and launch `scripts/pi/start-notflix.sh` at login. The launcher disables display sleep, hides the pointer when possible, opens Chromium in kiosk mode, and enables autoplay for the TV experience.

## TV remote / HDMI-CEC

The React app understands Arrow keys, Enter, Escape/Backspace, Space, and media-style player commands. `scripts/pi/cec-remote.sh` now bridges common HDMI-CEC remote presses into those keyboard events when both `cec-client` and `xdotool` are installed. The kiosk launcher starts that bridge automatically when the tools are present.

Typical mappings are:

- remote arrows → NOTFLIX spatial navigation / seek while playing
- Select/Enter → activate focused control
- Return/Exit → Back
- Play/Pause → player toggle
- Rewind/Fast-forward → 10-second seek
- Stop → close the player

CEC behavior differs by television manufacturer, so unsupported remotes can still use any adapter that emits the same keyboard events. No React changes are required.

## Control device

NOTFLIX HQ can run in a second browser at `?mode=hq`. Same-browser-origin tabs communicate through BroadcastChannel. For a phone or iPad on the same permitted setup, run the optional WebSocket relay and configure `VITE_NOTFLIX_CONTROL_WS`. Set `NOTFLIX_CONTROL_TOKEN` on the relay and include the same token in the WebSocket URL query string when the relay is reachable by other devices.
