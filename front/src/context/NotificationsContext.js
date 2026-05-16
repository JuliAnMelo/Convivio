import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import * as notificationsService from '../services/notificationsService';
import { useBooking } from './BookingContext';
import { usePqr } from './PqrContext';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { tick: bookingTick } = useBooking();
  const { tick: pqrTick } = usePqr();
  const [readTick, setReadTick] = useState(0);

  useEffect(
    () => notificationsService.subscribe(() => setReadTick((t) => t + 1)),
    [],
  );

  const value = useMemo(
    () => ({
      notifications: notificationsService.getAllNotifications(),
      unreadCount: notificationsService.getUnreadCount(),
      markAsRead: notificationsService.markAsRead,
      isUnread: notificationsService.isUnread,
    }),
    [bookingTick, pqrTick, readTick],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error('useNotifications debe usarse dentro de NotificationsProvider');
  }
  return ctx;
}
