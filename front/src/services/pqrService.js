import { api } from './api';
import { MONTH_NAMES } from './pqrConstants';

// ── Cache local ──────────────────────────────────────────────────────────────
let tickets = [];
let _loaded = false;
let conjuntoId = null;
let listeners = [];

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

// ── Inicialización (llamada por PqrContext al montar) ─────────────────────────
export async function load(cid = conjuntoId) {
  if (_loaded && cid === conjuntoId) return;
  conjuntoId = cid;
  _loaded = true;

  if (!cid) {
    tickets = [];
    notify();
    return;
  }

  try {
    const data = await api.get(`/pqr/?conjuntoId=${encodeURIComponent(cid)}`);
    tickets = data;
    notify();
  } catch (e) {
    // keep empty cache on network error
  }
}

export async function reload(cid = conjuntoId) {
  _loaded = false;
  await load(cid);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(date) {
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function ticketToAnnouncement(ticket) {
  const d = new Date(ticket.createdAt);
  const isWaiting = ticket.status === 'esperando';
  return {
    id: `ann-pqr-${ticket.id}`,
    ticketId: ticket.id,
    month: MONTH_NAMES[d.getMonth()],
    title: ticket.subject,
    subtitle: isWaiting ? 'Esperando respuesta' : 'Respondido por administración',
    time: formatTime(d),
    day: d.getDate(),
    icon: 'pqr',
    type: 'pqr',
    pqrStatus: ticket.status,
    createdAt: ticket.createdAt,
  };
}

// ── Lecturas síncronas (desde cache) ──────────────────────────────────────────
export function getAnnouncementsForHome() {
  return tickets.map(ticketToAnnouncement);
}

export function getTickets() {
  return [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getTicketById(id) {
  return tickets.find((t) => t.id === id) || null;
}

export function hasUnansweredTickets() {
  return tickets.some((t) => t.status === 'esperando');
}

export function getChatMessages(ticket) {
  if (!ticket) return [];
  const messages = [
    {
      id: `${ticket.id}-resident`,
      sender: 'resident',
      name: 'Jhon Garcia',
      text: ticket.description,
      subject: ticket.subject,
      at: ticket.createdAt,
    },
  ];
  if (ticket.adminResponse) {
    messages.push({
      id: `${ticket.id}-admin`,
      sender: 'admin',
      name: 'Administración',
      text: ticket.adminResponse,
      at: ticket.respondedAt || ticket.createdAt,
    });
  }
  return messages;
}

// ── Escrituras async ──────────────────────────────────────────────────────────
export async function createTicket({ type, subject, description }) {
  const ticket = await api.post('/pqr/', { conjuntoId, type, subject, description });
  tickets = [ticket, ...tickets];
  notify();
  return ticket;
}

export async function respondToTicket(ticketId, response) {
  const updated = await api.post(`/pqr/${ticketId}/respond`, { response });
  tickets = tickets.map(t => t.id === ticketId ? { ...t, ...updated } : t);
  notify();
  return true;
}
