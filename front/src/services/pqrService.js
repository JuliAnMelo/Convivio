import { MONTH_NAMES } from './pqrConstants';

let tickets = [
  {
    id: 'pqr-demo-1',
    code: 'PQR-001',
    type: 'peticion',
    subject: 'Certificado de paz y salvo',
    description: 'Necesito el certificado para trámite bancario del apartamento 303.',
    status: 'esperando',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    adminResponse: null,
    respondedAt: null,
  },
  {
    id: 'pqr-demo-2',
    code: 'PQR-002',
    type: 'queja',
    subject: 'Ruido en horario nocturno',
    description: 'Se presentan reuniones después de las 10 pm en el apartamento 502.',
    status: 'respondido',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    adminResponse:
      'Se envió comunicado al residente del 502 y vigilancia hará seguimiento los fines de semana.',
    respondedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

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
    tag: 'Para: Ti (APTO. 303)',
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

export function getAnnouncementsForHome() {
  return tickets.map(ticketToAnnouncement);
}

export function getTickets() {
  return [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getTicketById(id) {
  return tickets.find((t) => t.id === id) || null;
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

export function createTicket({ type, subject, description }) {
  const now = new Date();
  const ticket = {
    id: `pqr-${Date.now()}`,
    code: `PQR-${String(tickets.length + 1).padStart(3, '0')}`,
    type,
    subject: subject.trim(),
    description: description.trim(),
    status: 'esperando',
    createdAt: now.toISOString(),
    adminResponse: null,
    respondedAt: null,
  };

  tickets = [ticket, ...tickets];
  notify();
  return ticket;
}
