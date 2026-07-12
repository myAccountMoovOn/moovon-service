import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../api/supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: 'admin' | 'customer' | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  isLoading: true,
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
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        updateState(session);
        setIsLoading(false);
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
    setUser(currentSession?.user ?? null);
    
    if (currentSession?.user) {
      // user_metadata is always an object {}, so || won't fall back — check both explicitly
      const rawRole =
        currentSession.user.user_metadata?.role ||
        currentSession.user.app_metadata?.role ||
        'customer';
      // Map provider & super_admin to 'admin' for web routing
      const mappedRole = (rawRole === 'provider' || rawRole === 'super_admin' || rawRole === 'admin')
        ? 'admin'
        : 'customer';
      setRole(mappedRole);
    } else {
      setRole(null);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Our custom nestjs endpoint could also be called, but supabase client handles token clearing
  };

  return (
    <AuthContext.Provider value={{ session, user, role, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
