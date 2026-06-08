// Per-area admin-configurable settings
let areaSettings = {};

const subscribers = new Set();
function notify() { subscribers.forEach(fn => fn()); }

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

const DEFAULT = {
  disabled: false,
  disabledUntil: null,     // ISO string or null (null = indefinitely)
  disabledMessage: '',
  requiresApproval: false,
  photoUri: null,
};

export function getAreaSettings(areaName) {
  return { ...DEFAULT, ...areaSettings[areaName] };
}

export function setAreaSettings(areaName, updates) {
  areaSettings[areaName] = { ...getAreaSettings(areaName), ...updates };
  notify();
}

export function isAreaDisabled(areaName) {
  const s = getAreaSettings(areaName);
  if (!s.disabled) return false;
  if (s.disabledUntil) {
    return new Date() < new Date(s.disabledUntil);
  }
  return true;  // indefinitely disabled
}

export function areaRequiresApproval(areaName) {
  return getAreaSettings(areaName).requiresApproval;
}

export function getAreaImage(areaName) {
  return getAreaSettings(areaName).photoUri || null;
}

export function setAreaImage(areaName, uri) {
  setAreaSettings(areaName, { photoUri: uri });
}

// Disable helpers
export function disableArea(areaName, { message = '', durationMs = null } = {}) {
  setAreaSettings(areaName, {
    disabled: true,
    disabledUntil: durationMs ? new Date(Date.now() + durationMs).toISOString() : null,
    disabledMessage: message,
  });
}

export function enableArea(areaName) {
  setAreaSettings(areaName, { disabled: false, disabledUntil: null, disabledMessage: '' });
}
