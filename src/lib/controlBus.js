const CHANNEL = 'notflix-control-v2';

export class NotflixControlBus {
  constructor() {
    this.listeners = new Set();
    this.channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL) : null;
    this.channel?.addEventListener('message', (event) => this.emit(event.data));
    this.ws = null;
    const url = import.meta.env.VITE_NOTFLIX_CONTROL_WS;
    if (url) this.connectSocket(url);
  }

  connectSocket(url) {
    try {
      this.ws = new WebSocket(url);
      this.ws.addEventListener('message', (event) => {
        try { this.emit(JSON.parse(event.data)); } catch {}
      });
      this.ws.addEventListener('close', () => setTimeout(() => this.connectSocket(url), 2500));
    } catch {}
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(message) {
    for (const listener of this.listeners) listener(message);
  }

  send(type, payload = {}) {
    const message = { id: crypto.randomUUID?.() ?? String(Date.now()), type, payload, at: Date.now() };
    this.channel?.postMessage(message);
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(message));
    return message;
  }

  destroy() {
    this.channel?.close();
    this.ws?.close();
  }
}

export const controlBus = new NotflixControlBus();
