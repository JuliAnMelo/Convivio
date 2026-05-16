import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import * as bookingService from '../services/bookingService';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [tick, setTick] = useState(0);

  useEffect(() => bookingService.subscribe(() => setTick((t) => t + 1)), []);

  const value = useMemo(
    () => ({
      tick,
      getCalendarMonths: bookingService.getCalendarMonths,
      isDateUnavailable: bookingService.isDateUnavailable,
      getUnavailableDaysForMonth: bookingService.getUnavailableDaysForMonth,
      getSlotsForDate: bookingService.getSlotsForDate,
      getAnnouncements: bookingService.getAnnouncements,
      submitReservation: bookingService.submitReservation,
    }),
    [tick],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error('useBooking debe usarse dentro de BookingProvider');
  }
  return ctx;
}
