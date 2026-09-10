import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../api/supabaseClient';

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
  session: Session | null;
  user: User | null;
  role: UserAppRole;
  isLoading: boolean;
  setFallbackUser: (user: any, role: UserAppRole, userSession?: any) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  isLoading: true,
  setFallbackUser: () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserAppRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          updateState(session);
        }
      } catch (e) {
        if (mounted) {
          updateState(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        updateState(currentSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const updateState = (currentSession: Session | null) => {
    setSession(currentSession);

    if (currentSession?.user) {
      setUser(currentSession.user);

      const rawRole = (
        currentSession.user.user_metadata?.role ||
        currentSession.user.app_metadata?.role ||
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

      localStorage.setItem(getStorageKey('user'), JSON.stringify(currentSession.user));
      localStorage.setItem(getStorageKey('role'), mappedRole ?? 'customer');
    } else {
      const storedUser = localStorage.getItem(getStorageKey('user'));
      const storedRole = localStorage.getItem(getStorageKey('role')) as UserAppRole;
      if (storedUser && storedRole) {
        try {
          setUser(JSON.parse(storedUser));
          setRole(storedRole);
        } catch {
          setUser(null);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
    }
  };

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
    localStorage.removeItem(getStorageKey('user'));
    localStorage.removeItem(getStorageKey('role'));
    localStorage.removeItem(getStorageKey('session'));
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout warning:', e);
    }
    setSession(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, role, isLoading, setFallbackUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
