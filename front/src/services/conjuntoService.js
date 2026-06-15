import { api } from './api';

// ── Cache local ───────────────────────────────────────────────────────────────
let conjuntos = [];
let pendingRequests = [];
let _loaded = false;
const subscribers = new Set();

function notify() {
  subscribers.forEach(fn => fn());
}

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

// ── Inicialización ────────────────────────────────────────────────────────────
export async function load() {
  if (_loaded) return;
  _loaded = true;
  try {
    conjuntos = await api.get('/conjuntos/');
    notify();
  } catch (e) {
    // keep empty on error
  }
}

export async function reload() {
  _loaded = false;
  await load();
}

// ── Lecturas síncronas ────────────────────────────────────────────────────────
export function findConjuntoByCode(code) {
  return conjuntos.find(c => c.code.toUpperCase() === code.trim().toUpperCase()) || null;
}

export function getConjuntoById(id) {
  return conjuntos.find(c => c.id === id) || null;
}

export function getConjuntosByIds(ids = []) {
  return ids.map(id => getConjuntoById(id)).filter(Boolean);
}

export function getPendingRequests(conjuntoId) {
  return pendingRequests.filter(r => r.conjuntoId === conjuntoId && r.status === 'pending');
}

export function getAllRequests(conjuntoId) {
  return pendingRequests.filter(r => r.conjuntoId === conjuntoId);
}

export function checkRequestStatus(requestId) {
  const req = pendingRequests.find(r => r.requestId === requestId);
  if (!req) return null;
  return { status: req.status, conjuntoId: req.conjuntoId };
}

export function getNotificationCount(conjuntoId) {
  return getPendingRequests(conjuntoId).length;
}

export async function checkRequestStatusRemote(requestId) {
  try {
    const data = await api.get(`/conjuntos/requests/${requestId}`);
    const index = pendingRequests.findIndex(r => r.requestId === requestId);
    if (index !== -1) {
      pendingRequests[index] = data;
    } else {
      pendingRequests = [...pendingRequests, data];
    }
    notify();
    return data;
  } catch (e) {
    return null;
  }
}

// ── Carga de solicitudes para un conjunto (llamar desde pantalla admin) ────────
export async function loadRequests(conjuntoId) {
  try {
    const data = await api.get(`/conjuntos/${conjuntoId}/requests`);
    pendingRequests = [
      ...pendingRequests.filter(r => r.conjuntoId !== conjuntoId),
      ...data,
    ];
    notify();
  } catch (e) {
    // keep existing cache
  }
}

// ── Escrituras async ──────────────────────────────────────────────────────────
export async function createConjunto(name, options = {}) {
  const conjunto = await api.post('/conjuntos/', {
    name: name.trim(),
    address: options.address?.trim() || '',
    city: 'Colombia',
    imageKey: 'home',
    photoUri: options.photoUri || null,
  });
  conjuntos = [...conjuntos, conjunto];
  notify();
  return conjunto;
}

export async function updateConjunto(id, updates) {
  const conjunto = await api.put(`/conjuntos/${id}`, updates);
  conjuntos = conjuntos.map(c => c.id === id ? { ...c, ...conjunto } : c);
  notify();
  return conjunto;
}

export async function findConjuntoByCodeRemote(code) {
  try {
    const c = await api.get(`/conjuntos/${code.trim().toUpperCase()}`);
    if (!conjuntos.find(x => x.id === c.id)) {
      conjuntos = [...conjuntos, c];
    }
    return c;
  } catch (e) {
    return null;
  }
}

export async function requestJoin({ userData, role, conjuntoId }) {
  const req = await api.post('/conjuntos/requests', {
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    dob: userData.dob,
    apt: userData.apt,
    torre: userData.torre,
    role,
    conjuntoId,
  });
  pendingRequests = [...pendingRequests, req];
  notify();
  return req.requestId;
}

export async function approveRequest(requestId) {
  await api.put(`/conjuntos/requests/${requestId}`, { status: 'approved' });
  pendingRequests = pendingRequests.map(r =>
    r.requestId === requestId ? { ...r, status: 'approved' } : r
  );
  notify();
}

export async function setRequestApt(requestId, apt) {
  await api.put(`/conjuntos/requests/${requestId}`, { apt });
  pendingRequests = pendingRequests.map(r =>
    r.requestId === requestId
      ? { ...r, userData: { ...r.userData, apt } }
      : r
  );
  notify();
}

export async function rejectRequest(requestId) {
  await api.put(`/conjuntos/requests/${requestId}`, { status: 'rejected' });
  pendingRequests = pendingRequests.map(r =>
    r.requestId === requestId ? { ...r, status: 'rejected' } : r
  );
  notify();
}
