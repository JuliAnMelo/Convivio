import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import * as bookingService from '../services/bookingService';
import { AuthContext } from './AuthContext';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [tick, setTick] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const { user } = useContext(AuthContext);
  const hasConjunto = !!user?.conjuntoId;

  useEffect(() => {
    const unsub = bookingService.subscribe(() => setTick((t) => t + 1));
    bookingService.load().finally(() => setLoadingData(false));
    return unsub;
  }, []);

  const value = useMemo(
    () => ({
      tick,
      loadingData,
      getCalendarMonths: bookingService.getCalendarMonths,
      isDateUnavailable: bookingService.isDateUnavailable,
      getUnavailableDaysForMonth: bookingService.getUnavailableDaysForMonth,
      getSlotsForDate: bookingService.getSlotsForDate,
      getAnnouncements: () => (hasConjunto ? bookingService.getAnnouncements() : []),
      submitReservation: bookingService.submitReservation,
      getReservationsForArea: bookingService.getReservationsForArea,
      getPendingReservations: bookingService.getPendingReservations,
      approveReservation: bookingService.approveReservation,
      cancelReservation: bookingService.cancelReservation,
    }),
    [tick, loadingData, hasConjunto],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking debe usarse dentro de BookingProvider');
  return ctx;
}
