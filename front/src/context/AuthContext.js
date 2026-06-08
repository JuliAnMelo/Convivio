import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email.toLowerCase() === 'prueba' && password === '1234') {
      setUser({
        email,
        name: 'Jhon Garcia',
        phone: '+123 456 7890',
        dob: '01/01/1990',
        apt: '303',
        role: 'residente',
        conjuntoId: 'C001',
        conjuntoIds: ['C001'],
        conjuntoCode: 'CONV01',
        conjuntoName: 'Conjunto Residencial El Prado',
      });
      return true;
    }
    if (email.toLowerCase() === 'admin' && password === '1234') {
      setUser({
        email,
        name: 'Carlos Gómez',
        phone: '+123 456 0001',
        dob: '15/03/1980',
        apt: 'Administración',
        role: 'administrador',
        conjuntoId: 'C001',
        conjuntoIds: ['C001', 'C002'],
        conjuntoCode: 'CONV01',
        conjuntoName: 'Conjunto Residencial El Prado',
      });
      return true;
    }
    if (email.toLowerCase() === 'guarda' && password === '1234') {
      setUser({
        email,
        name: 'Luis Pérez',
        phone: '+123 456 0002',
        dob: '20/07/1985',
        apt: 'Portería',
        role: 'guarda',
        conjuntoId: 'C001',
        conjuntoIds: ['C001'],
        conjuntoCode: 'CONV01',
        conjuntoName: 'Conjunto Residencial El Prado',
      });
      return true;
    }
    return false;
  };

  const register = (userData) => {
    const ids = userData.conjuntoIds || (userData.conjuntoId ? [userData.conjuntoId] : []);
    setUser({ apt: 'Por asignar', ...userData, conjuntoIds: ids });
    return true;
  };

  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  // Add a new conjunto to an already-logged-in admin
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

  // Switch the "active" conjunto (updates code/name for sub-screens)
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
