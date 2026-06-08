import { getUpcomingMonths, parseTimeRange } from '../utils/calendar';

const SLOT_TEMPLATES = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
  '20:00 - 22:00',
];

/** Bloqueos administrativos por área: { "YYYY-M": [días] } */
const ADMIN_BLOCKED_DATES = {};

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'water-cut',
    month: 'Octubre',
    tag: 'Para: Todos',
    title: 'Anuncio Corte De Agua',
    time: '18:45',
    day: 15,
    icon: 'water',
    type: 'general',
    createdAt: '2025-10-15T18:45:00.000Z',
    image: require('../../assets/Images/cortes de agua.jpg'),
  },
  {
    id: 'game-room',
    month: 'Septiembre',
    tag: '',
    title: 'Arriendo Sala Juegos',
    time: '21:45',
    day: 30,
    icon: 'teddy',
    type: 'general',
    createdAt: '2025-09-30T21:45:00.000Z',
  },
];

let reservations = [];
let announcements = [...INITIAL_ANNOUNCEMENTS];
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

export function getCalendarMonths() {
  return getUpcomingMonths(3);
}

function dateKey(year, monthIndex) {
  return `${year}-${monthIndex}`;
}

function reservationKey(areaName, year, monthIndex, day, timeSlot) {
  return `${areaName}|${year}|${monthIndex}|${day}|${timeSlot}`;
}

function isAdminBlocked(areaName, year, monthIndex, day) {
  const map = ADMIN_BLOCKED_DATES[areaName] || ADMIN_BLOCKED_DATES.default || {};
  const blocked = map[dateKey(year, monthIndex)] || [];
  return blocked.includes(day);
}

export function hasReservationOnDate(areaName, year, monthIndex, day) {
  return reservations.some(
    (r) =>
      r.areaName === areaName &&
      r.year === year &&
      r.monthIndex === monthIndex &&
      r.day === day,
  );
}

export function isDateUnavailable(areaName, year, monthIndex, day) {
  if (isAdminBlocked(areaName, year, monthIndex, day)) return true;
  // Only mark unavailable when ALL time slots are taken
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

export function isSlotReserved(areaName, year, monthIndex, day, timeSlot) {
  const key = reservationKey(areaName, year, monthIndex, day, timeSlot);
  return reservations.some(
    (r) =>
      reservationKey(r.areaName, r.year, r.monthIndex, r.day, r.timeSlot) === key &&
      (r.status === 'confirmed' || r.status === 'pending_approval'),
  );
}

export function getSlotsForDate(areaName, year, monthIndex, day) {
  return SLOT_TEMPLATES.map((time, index) => ({
    id: `${year}-${monthIndex}-${day}-${index}`,
    time,
    status: isSlotReserved(areaName, year, monthIndex, day, time) ? 'Reservado' : 'Disponible',
  }));
}

export function getAnnouncements() {
  return [...announcements];
}

const MONTH_NAMES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export function createAnnouncement({ title, description, tag, category, attachment = null, icon = 'megaphone' }) {
  const now = new Date();
  const announcement = {
    id: `ann-admin-${Date.now()}`,
    month: MONTH_NAMES_ES[now.getMonth()],
    tag: tag || 'Para: Todos',
    // Saved so the announcement lands in the same category section residents browse by
    category: category || null,
    title: title.trim(),
    subtitle: description?.trim() || '',
    time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    day: now.getDate(),
    icon,
    type: 'general',
    createdAt: now.toISOString(),
    attachment,
    // Map image attachment to the `image` field used by AnnouncementsScreen
    image: attachment?.type === 'image' ? { uri: attachment.uri } : undefined,
  };
  announcements = [announcement, ...announcements];
  notify();
  return announcement;
}

export function submitReservation({
  areaName,
  year,
  monthIndex,
  monthName,
  day,
  timeSlot,
  eventTitle,
  people,
  description,
  requiresApproval = false,
  userName = '',
  userPhotoUri = null,
}) {
  const { start } = parseTimeRange(timeSlot);
  const now = new Date();

  const reservation = {
    id: `res-${Date.now()}`,
    areaName,
    year,
    monthIndex,
    monthName,
    day,
    timeSlot,
    eventTitle: eventTitle.trim(),
    people: Number(people) || 0,
    description: description?.trim() || '',
    createdAt: now,
    userName,
    userPhotoUri,
    status: requiresApproval ? 'pending_approval' : 'confirmed',
    cancelledMessage: null,
    cancelledAt: null,
  };

  reservations.push(reservation);

  if (!requiresApproval) {
    const announcement = {
      id: reservation.id,
      month: monthName,
      tag: '',
      title: reservation.eventTitle,
      subtitle: `Solicitud De Reserva ${areaName}`,
      time: start,
      day,
      icon: 'key',
      type: 'reservation',
      createdAt: now.toISOString(),
      reservation,
    };
    announcements = [announcement, ...announcements];
  }

  notify();
  return reservation;
}

export function getReservationsForArea(areaName) {
  return reservations
    .filter(r => r.areaName === areaName)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getPendingReservations() {
  return reservations.filter(r => r.status === 'pending_approval');
}

export function approveReservation(id) {
  const res = reservations.find(r => r.id === id);
  if (!res) return;
  res.status = 'confirmed';
  notify();
}

export function cancelReservation(id, message = '') {
  const res = reservations.find(r => r.id === id);
  if (!res) return;
  res.status = 'cancelled';
  res.cancelledMessage = message;
  res.cancelledAt = new Date().toISOString();

  // Add a notification announcement for the resident
  const now = new Date();
  announcements = [
    {
      id: `notif-cancel-${id}`,
      month: MONTH_NAMES_ES[now.getMonth()],
      tag: 'Administración',
      title: `Reserva cancelada: ${res.eventTitle}`,
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

export function isSlotActive(areaName, year, monthIndex, day, timeSlot) {
  const key = `${areaName}|${year}|${monthIndex}|${day}|${timeSlot}`;
  return reservations.some(r =>
    `${r.areaName}|${r.year}|${r.monthIndex}|${r.day}|${r.timeSlot}` === key &&
    (r.status === 'confirmed' || r.status === 'pending_approval')
  );
}
