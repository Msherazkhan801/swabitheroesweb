'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAdmin: boolean;
  adminName: string;
  login: (passcode: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const VALID_PASSCODES = ['swabiadmin', 'swabiheroes2026', 'admin123', '786swabi'];

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminName, setAdminName] = useState<string>('Master Admin');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('swabi_heroes_admin_session');
      if (stored === 'authenticated') {
        setIsAdmin(true);
      }
    }
  }, []);

  const login = (passcode: string): boolean => {
    const clean = passcode.trim().toLowerCase();
    if (VALID_PASSCODES.includes(clean) || clean === 'swabiheroes') {
      setIsAdmin(true);
      setAdminName('Super Admin (Swabi Heroes)');
      if (typeof window !== 'undefined') {
        localStorage.setItem('swabi_heroes_admin_session', 'authenticated');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('swabi_heroes_admin_session');
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, adminName, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
