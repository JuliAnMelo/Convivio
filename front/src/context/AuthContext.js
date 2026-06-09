import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { load as loadConjuntos, reload as reloadConjuntos } from '../services/conjuntoService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConjuntos().finally(() => setLoading(false));
  }, []);

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

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, login, register, updateUser,
      addConjunto, selectConjunto, logout, loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
