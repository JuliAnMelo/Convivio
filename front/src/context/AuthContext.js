import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { load as loadConjuntos, reload as reloadConjuntos, loadRequests, getConjuntoById } from '../services/conjuntoService';
import { reload as reloadBookings } from '../services/bookingService';
import { reload as reloadPqrs } from '../services/pqrService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConjuntos().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let interval;
    if (user) {
      interval = setInterval(() => {
        if (user.role === 'administrador' && user.conjuntoIds) {
          user.conjuntoIds.forEach(id => {
            loadRequests(id).catch(() => {});
          });
        }
        if (user.conjuntoId || user.conjuntoIds?.length > 0) {
          reloadBookings().catch(() => {});
          reloadPqrs().catch(() => {});
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [user]);

  const login = async (username, password) => {
    try {
      const data = await api.post('/auth/login', { username, password });
      setUser(data);
      await reloadConjuntos();
      return true;
    } catch (e) {
      return false;
    }
  };

  const register = (userData) => {
    const ids = userData.conjuntoIds || (userData.conjuntoId ? [userData.conjuntoId] : []);
    setUser({ apt: 'Por asignar', ...userData, conjuntoIds: ids });
    return true;
  };

  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  const addConjunto = ({ conjuntoId, conjuntoCode, conjuntoName }) => {
    setUser(prev => {
      const existing = prev.conjuntoIds || [];
      if (existing.includes(conjuntoId)) return prev;
      return {
        ...prev,
        conjuntoIds: [...existing, conjuntoId],
        conjuntoId,
        conjuntoCode,
        conjuntoName,
      };
    });
  };

  const selectConjunto = ({ conjuntoId, conjuntoCode, conjuntoName }) => {
    setUser(prev => ({ ...prev, conjuntoId, conjuntoCode, conjuntoName }));
  };

  const leaveConjunto = (conjuntoId) => {
    setUser(prev => {
      if (!prev) return prev;
      const remainingIds = (prev.conjuntoIds || []).filter(id => id !== conjuntoId);
      const next = { ...prev, conjuntoIds: remainingIds };
      // Si el conjunto del que sale era el activo, seleccionamos otro o lo dejamos vacío.
      if (prev.conjuntoId === conjuntoId) {
        const fallbackId = remainingIds[0] || null;
        const fallback = fallbackId ? getConjuntoById(fallbackId) : null;
        next.conjuntoId = fallbackId;
        next.conjuntoCode = fallback?.code || null;
        next.conjuntoName = fallback?.name || null;
      }
      return next;
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, login, register, updateUser,
      addConjunto, selectConjunto, leaveConjunto, logout, loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
