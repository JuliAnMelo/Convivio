import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import * as notificationsService from '../services/notificationsService';
import { useBooking } from './BookingContext';
import { usePqr } from './PqrContext';
import { AuthContext } from './AuthContext';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { tick: bookingTick } = useBooking();
  const { tick: pqrTick } = usePqr();
  const { user } = useContext(AuthContext);
  const hasConjunto = !!user?.conjuntoId;
  const [readTick, setReadTick] = useState(0);

  useEffect(
    () => notificationsService.subscribe(() => setReadTick((t) => t + 1)),
    [],
  );

  const value = useMemo(
    () => ({
      // No conjunto yet — there's nothing to notify the user about
      notifications: hasConjunto ? notificationsService.getAllNotifications() : [],
      unreadCount: hasConjunto ? notificationsService.getUnreadCount() : 0,
      markAsRead: notificationsService.markAsRead,
      isUnread: notificationsService.isUnread,
    }),
    [bookingTick, pqrTick, readTick, hasConjunto],
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
