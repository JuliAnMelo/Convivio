const DEMO_CONJUNTO = {
  id: 'C001',
  name: 'Conjunto Residencial El Prado',
  code: 'CONV01',
  address: 'Calle 45 # 23-67',
  city: 'Bogotá, Colombia',
  phone: '(601) 234-5678',
  email: 'admin@elprado.com.co',
  hours: 'Lun - Vie: 8:00 am - 5:00 pm',
  imageKey: 'home',
};

const DEMO_CONJUNTO_2 = {
  id: 'C002',
  name: 'Torres del Parque',
  code: 'TPARK1',
  address: 'Carrera 7 # 32-16',
  city: 'Bogotá, Colombia',
  phone: '(601) 345-6789',
  email: 'admin@torresdelparque.com.co',
  hours: 'Lun - Sáb: 7:00 am - 6:00 pm',
  imageKey: 'salon',
};

let conjuntos = [DEMO_CONJUNTO, DEMO_CONJUNTO_2];

// Pre-seeded demo pending requests so badges show counts on first load
let pendingRequests = [
  {
    requestId: 'demo-req-1',
    userData: { name: 'María García', email: 'maria@example.com', phone: '3001234567', dob: '05/03/1990' },
    role: 'residente',
    conjuntoId: 'C001',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    requestId: 'demo-req-2',
    userData: { name: 'Pedro López', email: 'pedro@example.com', phone: '3107654321', dob: '12/08/1985' },
    role: 'residente',
    conjuntoId: 'C001',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    requestId: 'demo-req-3',
    userData: { name: 'Andrés Ruiz', email: 'andres@example.com', phone: '3156789012', dob: '20/11/1992' },
    role: 'guarda',
    conjuntoId: 'C001',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    requestId: 'demo-req-4',
    userData: { name: 'Sofía Morales', email: 'sofia@example.com', phone: '3209876543', dob: '15/06/1995' },
    role: 'residente',
    conjuntoId: 'C002',
    status: 'pending',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

const subscribers = new Set();

function notify() {
  subscribers.forEach(fn => fn());
}

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function createConjunto(name, options = {}) {
  const code = generateCode();
  const conjunto = {
    id: `C${Date.now()}`,
    name: name.trim(),
    code,
    address: options.address?.trim() || '',
    city: 'Colombia',
    phone: '',
    email: '',
    hours: '',
    imageKey: 'home',       // default fallback
    photoUri: options.photoUri || null,
  };
  conjuntos.push(conjunto);
  return conjunto;
}

export function findConjuntoByCode(code) {
  return conjuntos.find(c => c.code.toUpperCase() === code.trim().toUpperCase()) || null;
}

export function getConjuntoById(id) {
  return conjuntos.find(c => c.id === id) || null;
}

export function updateConjunto(id, updates) {
  const conjunto = conjuntos.find(c => c.id === id);
  if (conjunto) {
    Object.assign(conjunto, updates);
    notify();
  }
  return conjunto || null;
}

export function getConjuntosByIds(ids = []) {
  return ids.map(id => getConjuntoById(id)).filter(Boolean);
}

export function requestJoin({ userData, role, conjuntoId }) {
  const requestId = `req-${Date.now()}`;
  pendingRequests.push({
    requestId,
    userData,
    role,
    conjuntoId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });

  notify();
  return requestId;
}

export function getPendingRequests(conjuntoId) {
  return pendingRequests.filter(r => r.conjuntoId === conjuntoId && r.status === 'pending');
}

export function getAllRequests(conjuntoId) {
  return pendingRequests.filter(r => r.conjuntoId === conjuntoId);
}

export function approveRequest(requestId) {
  const req = pendingRequests.find(r => r.requestId === requestId);
  if (req) { req.status = 'approved'; notify(); }
}

export function rejectRequest(requestId) {
  const req = pendingRequests.find(r => r.requestId === requestId);
  if (req) { req.status = 'rejected'; notify(); }
}

export function checkRequestStatus(requestId) {
  const req = pendingRequests.find(r => r.requestId === requestId);
  if (!req) return null;
  return { status: req.status, conjuntoId: req.conjuntoId };
}

export function getNotificationCount(conjuntoId) {
  return getPendingRequests(conjuntoId).length;
}
