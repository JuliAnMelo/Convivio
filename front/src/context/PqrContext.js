import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import * as pqrService from '../services/pqrService';
import { AuthContext } from './AuthContext';

const PqrContext = createContext(null);

export function PqrProvider({ children }) {
  const [tick, setTick] = useState(0);
  const { user } = useContext(AuthContext);
  const hasConjunto = !!user?.conjuntoId;

  useEffect(() => pqrService.subscribe(() => setTick((t) => t + 1)), []);

  const value = useMemo(
    () => ({
      tick,
      // No conjunto yet — there are no PQRs to show
      getTickets: () => (hasConjunto ? pqrService.getTickets() : []),
      getTicketById: pqrService.getTicketById,
      hasUnansweredTickets: () => hasConjunto && pqrService.hasUnansweredTickets(),
      getChatMessages: pqrService.getChatMessages,
      getAnnouncementsForHome: () => (hasConjunto ? pqrService.getAnnouncementsForHome() : []),
      createTicket: pqrService.createTicket,
      respondToTicket: pqrService.respondToTicket,
    }),
    [tick, hasConjunto],
  );

  return <PqrContext.Provider value={value}>{children}</PqrContext.Provider>;
}

export function usePqr() {
  const ctx = useContext(PqrContext);
  if (!ctx) throw new Error('usePqr debe usarse dentro de PqrProvider');
  return ctx;
}
