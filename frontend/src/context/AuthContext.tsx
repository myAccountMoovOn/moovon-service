import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export type UserAppRole = 'admin' | 'company' | 'customer' | 'reseller' | 'provider' | null;

export function getPortalPrefix(): string {
  const hostname = window.location.hostname;
  if (hostname.startsWith('reseller.')) return 'reseller';
  if (hostname.startsWith('company.'))  return 'company';
  return 'main';
}

export function getStorageKey(name: string): string {
  return `moovon_${getPortalPrefix()}_${name}`;
}

interface AuthContextType {
  user: any | null;
  role: UserAppRole;
  isLoading: boolean;
  setFallbackUser: (user: any, role: UserAppRole, userSession?: any) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: true,
  setFallbackUser: () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<UserAppRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      // Fast load from localStorage cache (purely cosmetic, tokens are not here)
      const storedUser = localStorage.getItem(getStorageKey('user'));
      const storedRole = localStorage.getItem(getStorageKey('role')) as UserAppRole;
      if (storedUser && storedRole) {
        try {
          setUser(JSON.parse(storedUser));
          setRole(storedRole);
        } catch {}
      }

      // Authoritative check with backend using HttpOnly cookie
      try {
        const res = await axiosInstance.get('/auth/me');
        if (mounted && res.data) {
          const backendUser = res.data;
          setUser(backendUser);
          
          const rawRole = (
            backendUser.app_metadata?.role ||
            backendUser.user_metadata?.role ||
            backendUser.role ||
            'customer'
          ).toString().toLowerCase();

          let mappedRole: UserAppRole = 'customer';
          if (rawRole === 'super_admin' || rawRole === 'admin') {
            mappedRole = 'admin';
          } else if (rawRole === 'reseller') {
            mappedRole = 'reseller';
          } else if (rawRole === 'provider' || rawRole === 'company') {
            mappedRole = 'company';
          }

          setRole(mappedRole);
          localStorage.setItem(getStorageKey('user'), JSON.stringify(backendUser));
          localStorage.setItem(getStorageKey('role'), mappedRole ?? 'customer');
        }
      } catch (e) {
        if (mounted) {
          setUser(null);
          setRole(null);
          localStorage.removeItem(getStorageKey('user'));
          localStorage.removeItem(getStorageKey('role'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const setFallbackUser = (userData: any, userRole: UserAppRole, userSession?: any) => {
    const storedUserStr = localStorage.getItem(getStorageKey('user'));
    let mergedUser = userData;
    if (storedUserStr) {
      try {
        const existing = JSON.parse(storedUserStr);
        mergedUser = { ...existing, ...userData };
      } catch (e) {}
    }

    setUser(mergedUser);
    setRole(userRole);
    localStorage.setItem(getStorageKey('user'), JSON.stringify(mergedUser));
    localStorage.setItem(getStorageKey('role'), userRole ?? 'customer');
    if (userSession) {
      localStorage.setItem(getStorageKey('session'), JSON.stringify(userSession));
    }
  };

  const signOut = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (e) {
      console.warn('Logout request failed:', e);
    } finally {
      localStorage.removeItem(getStorageKey('user'));
      localStorage.removeItem(getStorageKey('role'));
      localStorage.removeItem(getStorageKey('session'));
      setUser(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, setFallbackUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
