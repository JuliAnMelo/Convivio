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
  },
  {
    id: 'game-room',
    month: 'Septiembre',
    tag: 'Para: Ti (APTO. 303)',
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
  return isAdminBlocked(areaName, year, monthIndex, day)
    || hasReservationOnDate(areaName, year, monthIndex, day);
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
    (r) => reservationKey(r.areaName, r.year, r.monthIndex, r.day, r.timeSlot) === key,
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
  };

  reservations.push(reservation);

  const announcement = {
    id: reservation.id,
    month: monthName,
    tag: 'Para: Ti (APTO. 303)',
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
  notify();
  return reservation;
}
