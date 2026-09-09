import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../api/supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: 'admin' | 'customer' | null;
  isLoading: boolean;
  setFallbackUser: (user: any, role: 'admin' | 'customer', userSession?: any) => void;
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
  const [role, setRole] = useState<'admin' | 'customer' | null>(null);
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
      const rawRole =
        currentSession.user.user_metadata?.role ||
        currentSession.user.app_metadata?.role ||
        'customer';
      const mappedRole = (rawRole === 'provider' || rawRole === 'super_admin' || rawRole === 'admin' || rawRole === 'reseller')
        ? 'admin'
        : 'customer';
      setRole(mappedRole);
      localStorage.setItem('moovon_user', JSON.stringify(currentSession.user));
      localStorage.setItem('moovon_role', mappedRole);
    } else {
      // Check fallback storage for local development environments
      const storedUser = localStorage.getItem('moovon_user');
      const storedRole = localStorage.getItem('moovon_role') as 'admin' | 'customer' | null;
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

  const setFallbackUser = (userData: any, userRole: 'admin' | 'customer', userSession?: any) => {
    const storedUserStr = localStorage.getItem('moovon_user');
    let mergedUser = userData;
    if (storedUserStr) {
      try {
        const existing = JSON.parse(storedUserStr);
        mergedUser = { ...existing, ...userData };
      } catch (e) {}
    }

    setUser(mergedUser);
    setRole(userRole);
    localStorage.setItem('moovon_user', JSON.stringify(mergedUser));
    localStorage.setItem('moovon_role', userRole);
    if (userSession) {
      localStorage.setItem('moovon_session', JSON.stringify(userSession));
    }
  };

  const signOut = async () => {
    localStorage.removeItem('moovon_user');
    localStorage.removeItem('moovon_role');
    localStorage.removeItem('moovon_session');
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
