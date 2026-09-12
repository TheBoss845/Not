const CHANNEL = 'notflix-control-v2';

export class NotflixControlBus {
  constructor() {
    this.listeners = new Set();this.seen = new Map();this.ws = null;this.closed = false;this.retryMs = 1500;this.retryTimer = null;
    this.channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL) : null;
    this.channel?.addEventListener('message', (event) => this.emit(event.data));
    const url = import.meta.env.VITE_NOTFLIX_CONTROL_WS;
    if (url) this.connectSocket(url);
  }
  remember(id){if(!id)return false;if(this.seen.has(id))return true;this.seen.set(id,Date.now());if(this.seen.size>250){const oldest=[...this.seen.entries()].sort((a,b)=>a[1]-b[1]).slice(0,50);for(const[key]of oldest)this.seen.delete(key);}return false;}
  connectSocket(url) {
    if(this.closed||!url)return;clearTimeout(this.retryTimer);
    try {
      if(this.ws&&(this.ws.readyState===WebSocket.OPEN||this.ws.readyState===WebSocket.CONNECTING))return;
      this.ws = new WebSocket(url);
      this.ws.addEventListener('open',()=>{this.retryMs=1500;this.emit({type:'transport-status',payload:{socket:true},at:Date.now()});});
      this.ws.addEventListener('message', (event) => {try { this.emit(JSON.parse(event.data)); } catch {}});
      this.ws.addEventListener('close', () => {if(this.closed)return;this.emit({type:'transport-status',payload:{socket:false},at:Date.now()});this.retryTimer=setTimeout(()=>this.connectSocket(url),this.retryMs);this.retryMs=Math.min(this.retryMs*1.7,30000);});
    } catch {if(!this.closed)this.retryTimer=setTimeout(()=>this.connectSocket(url),this.retryMs);}
  }
  subscribe(listener) {this.listeners.add(listener);return () => this.listeners.delete(listener);}
  emit(message) {if(message?.id&&this.remember(message.id))return;for (const listener of this.listeners) listener(message);}
  send(type, payload = {}) {const message = { id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, type, payload, at: Date.now() };this.channel?.postMessage(message);if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(message));return message;}
  destroy() {this.closed=true;clearTimeout(this.retryTimer);this.channel?.close();this.ws?.close();this.listeners.clear();this.seen.clear();}
}
export const controlBus = new NotflixControlBus();
