import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import * as pqrService from '../services/pqrService';

const PqrContext = createContext(null);

export function PqrProvider({ children }) {
  const [tick, setTick] = useState(0);

  useEffect(() => pqrService.subscribe(() => setTick((t) => t + 1)), []);

  const value = useMemo(
    () => ({
      tick,
      getTickets: pqrService.getTickets,
      getTicketById: pqrService.getTicketById,
      getChatMessages: pqrService.getChatMessages,
      getAnnouncementsForHome: pqrService.getAnnouncementsForHome,
      createTicket: pqrService.createTicket,
    }),
    [tick],
  );

  return <PqrContext.Provider value={value}>{children}</PqrContext.Provider>;
}

export function usePqr() {
  const ctx = useContext(PqrContext);
  if (!ctx) throw new Error('usePqr debe usarse dentro de PqrProvider');
  return ctx;
}
