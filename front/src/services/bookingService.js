import { api } from './api';
import { getUpcomingMonths, parseTimeRange } from '../utils/calendar';

// ── Constantes ────────────────────────────────────────────────────────────────
const SLOT_TEMPLATES = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
  '20:00 - 22:00',
];

const MONTH_NAMES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// ── Cache local ───────────────────────────────────────────────────────────────
let reservations = [];
let announcements = [];
let _loaded = false;
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

// ── Inicialización ────────────────────────────────────────────────────────────
export async function load() {
  if (_loaded) return;
  _loaded = true;
  try {
    const [resData, annData] = await Promise.all([
      api.get('/bookings/'),
      api.get('/bookings/announcements'),
    ]);
    reservations = resData;
    announcements = annData;
    notify();
  } catch (e) {
    // keep empty cache on network error
  }
}

// ── Calendario ────────────────────────────────────────────────────────────────
export function getCalendarMonths() {
  return getUpcomingMonths(3);
}

function dateKey(year, monthIndex) {
  return `${year}-${monthIndex}`;
}

function reservationKey(areaName, year, monthIndex, day, timeSlot) {
  return `${areaName}|${year}|${monthIndex}|${day}|${timeSlot}`;
}

// ── Disponibilidad (lectura síncrona desde cache) ─────────────────────────────
export function hasReservationOnDate(areaName, year, monthIndex, day) {
  return reservations.some(
    (r) => r.areaName === areaName && r.year === year &&
           r.monthIndex === monthIndex && r.day === day,
  );
}

export function isSlotReserved(areaName, year, monthIndex, day, timeSlot) {
  const key = reservationKey(areaName, year, monthIndex, day, timeSlot);
  return reservations.some(
    (r) =>
      reservationKey(r.areaName, r.year, r.monthIndex, r.day, r.timeSlot) === key &&
      (r.status === 'confirmed' || r.status === 'pending_approval'),
  );
}

export function isDateUnavailable(areaName, year, monthIndex, day) {
  return SLOT_TEMPLATES.every(slot => isSlotReserved(areaName, year, monthIndex, day, slot));
}

export function getUnavailableDaysForMonth(areaName, year, monthIndex) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const unavailable = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    if (isDateUnavailable(areaName, year, monthIndex, day)) {
      unavailable.push(day);
    }
  }
  return unavailable;
}

export function getSlotsForDate(areaName, year, monthIndex, day) {
  return SLOT_TEMPLATES.map((time, index) => ({
    id: `${year}-${monthIndex}-${day}-${index}`,
    time,
    status: isSlotReserved(areaName, year, monthIndex, day, time) ? 'Reservado' : 'Disponible',
  }));
}

export function isSlotActive(areaName, year, monthIndex, day, timeSlot) {
  const key = `${areaName}|${year}|${monthIndex}|${day}|${timeSlot}`;
  return reservations.some(r =>
    `${r.areaName}|${r.year}|${r.monthIndex}|${r.day}|${r.timeSlot}` === key &&
    (r.status === 'confirmed' || r.status === 'pending_approval')
  );
}

// ── Anuncios (lectura síncrona) ───────────────────────────────────────────────
export function getAnnouncements() {
  return [...announcements];
}

// ── Reservas (lectura síncrona) ───────────────────────────────────────────────
export function getReservationsForArea(areaName) {
  return reservations
    .filter(r => r.areaName === areaName)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getPendingReservations() {
  return reservations.filter(r => r.status === 'pending_approval');
}

// ── Escrituras async ──────────────────────────────────────────────────────────
export async function submitReservation({
  areaName, year, monthIndex, monthName, day, timeSlot,
  eventTitle, people, description, requiresApproval = false,
  userName = '', userPhotoUri = null,
}) {
  const reservation = await api.post('/bookings/', {
    areaName, year, monthIndex, day, timeSlot,
    eventTitle: eventTitle.trim(),
    people: Number(people) || 0,
    description: description?.trim() || '',
    requiresApproval,
    userName,
  });

  const local = {
    ...reservation,
    monthName: monthName || MONTH_NAMES_ES[monthIndex] || '',
    userPhotoUri,
    cancelledMessage: reservation.cancelledMessage || null,
    cancelledAt: null,
  };

  reservations = [local, ...reservations];

  if (!requiresApproval) {
    const { start } = parseTimeRange(timeSlot);
    const now = new Date();
    announcements = [
      {
        id: reservation.id,
        month: monthName || MONTH_NAMES_ES[monthIndex],
        tag: '',
        title: reservation.eventTitle,
        subtitle: `Solicitud De Reserva ${areaName}`,
        time: start,
        day,
        icon: 'key',
        type: 'reservation',
        createdAt: now.toISOString(),
        reservation: local,
      },
      ...announcements,
    ];
  }

  notify();
  return local;
}

export async function approveReservation(id) {
  const updated = await api.post(`/bookings/${id}/approve`, {});
  reservations = reservations.map(r => r.id === id ? { ...r, ...updated } : r);
  notify();
}

export async function cancelReservation(id, message = '') {
  const updated = await api.post(`/bookings/${id}/cancel`, { message });
  reservations = reservations.map(r => r.id === id ? { ...r, ...updated } : r);

  const now = new Date();
  const cancelled = reservations.find(r => r.id === id);
  announcements = [
    {
      id: `notif-cancel-${id}`,
      month: MONTH_NAMES_ES[now.getMonth()],
      tag: 'Administración',
      title: `Reserva cancelada: ${cancelled?.eventTitle || ''}`,
      subtitle: message || 'El administrador canceló tu reserva.',
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      day: now.getDate(),
      icon: 'cancel',
      type: 'cancellation',
      createdAt: now.toISOString(),
    },
    ...announcements,
  ];

  notify();
}

export async function createAnnouncement({ title, description, tag, category, attachment = null, icon = 'megaphone' }) {
  const ann = await api.post('/bookings/announcements', {
    title, description, tag, category, icon,
  });

  const local = {
    ...ann,
    attachment,
    image: attachment?.type === 'image' ? { uri: attachment.uri } : undefined,
  };

  announcements = [local, ...announcements];
  notify();
  return local;
}
