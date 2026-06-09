import { api } from './api';

// ── Cache local ───────────────────────────────────────────────────────────────
let areaSettings = {};
const subscribers = new Set();

function notify() { subscribers.forEach(fn => fn()); }

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

const DEFAULT = {
  disabled: false,
  disabledUntil: null,
  disabledMessage: '',
  requiresApproval: false,
  photoUri: null,
};

// ── Lecturas síncronas ────────────────────────────────────────────────────────
export function getAreaSettings(areaName) {
  return { ...DEFAULT, ...areaSettings[areaName] };
}

export function isAreaDisabled(areaName) {
  const s = getAreaSettings(areaName);
  if (!s.disabled) return false;
  if (s.disabledUntil) return new Date() < new Date(s.disabledUntil);
  return true;
}

export function areaRequiresApproval(areaName) {
  return getAreaSettings(areaName).requiresApproval;
}

export function getAreaImage(areaName) {
  return getAreaSettings(areaName).photoUri || null;
}

// ── Carga remota de settings de un área ───────────────────────────────────────
export async function loadAreaSettings(areaName) {
  try {
    const data = await api.get(`/areas/${encodeURIComponent(areaName)}`);
    areaSettings[areaName] = data;
    notify();
  } catch (e) {
    // keep default on error
  }
}

// ── Escrituras async ──────────────────────────────────────────────────────────
export async function setAreaSettings(areaName, updates) {
  areaSettings[areaName] = { ...getAreaSettings(areaName), ...updates };
  notify();
  try {
    const data = await api.put(`/areas/${encodeURIComponent(areaName)}`, updates);
    areaSettings[areaName] = data;
    notify();
  } catch (e) {
    // already updated locally; server sync failed silently
  }
}

export async function setAreaImage(areaName, uri) {
  return setAreaSettings(areaName, { photoUri: uri });
}

export async function disableArea(areaName, { message = '', durationMs = null } = {}) {
  return setAreaSettings(areaName, {
    disabled: true,
    disabledUntil: durationMs ? new Date(Date.now() + durationMs).toISOString() : null,
    disabledMessage: message,
  });
}

export async function enableArea(areaName) {
  return setAreaSettings(areaName, { disabled: false, disabledUntil: null, disabledMessage: '' });
}
