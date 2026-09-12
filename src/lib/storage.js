const PREFIX = 'notflix:v2:';

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Kiosk mode should keep running even if storage is unavailable.
  }
}

export function removeStored(key) {
  try { localStorage.removeItem(PREFIX + key); } catch {}
}

export function exportState() {
  const state = {};
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX)) state[key.slice(PREFIX.length)] = loadJSON(key.slice(PREFIX.length), null);
  }
  return state;
}

export function importState(state) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) throw new Error('Invalid NOTFLIX backup');
  const entries = Object.entries(state).filter(([key]) => typeof key === 'string' && key.length <= 120);
  if (!entries.length) throw new Error('Backup contains no NOTFLIX data');
  for (const [key, value] of entries) saveJSON(key, value);
  return entries.length;
}
