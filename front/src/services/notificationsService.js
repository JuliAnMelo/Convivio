import * as bookingService from './bookingService';
import * as pqrService from './pqrService';
import { MONTH_NAMES } from './pqrConstants';

/** Anuncios antiguos ya vistos */
const readIds = new Set(['water-cut', 'game-room', 'ann-pqr-pqr-demo-2']);

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

function resolveDate(item) {
  if (item.createdAt) return new Date(item.createdAt);
  const monthIndex = MONTH_NAMES.indexOf(item.month);
  const year = new Date().getFullYear();
  return new Date(year, monthIndex >= 0 ? monthIndex : 0, item.day || 1, 12, 0, 0);
}

export function getAllNotifications() {
  const pqr = pqrService.getAnnouncementsForHome().map((n) => ({
    ...n,
    createdAt: n.createdAt,
  }));
  const booking = bookingService.getAnnouncements().map((n) => ({
    ...n,
    createdAt: n.createdAt,
  }));

  return [...pqr, ...booking].sort(
    (a, b) => resolveDate(b) - resolveDate(a),
  );
}

export function isUnread(item) {
  return !readIds.has(item.id);
}

export function getUnreadCount() {
  return getAllNotifications().filter(isUnread).length;
}

export function markAsRead(id) {
  if (!readIds.has(id)) {
    readIds.add(id);
    notify();
  }
}

export function markAllAsRead() {
  getAllNotifications().forEach((n) => readIds.add(n.id));
  notify();
}
