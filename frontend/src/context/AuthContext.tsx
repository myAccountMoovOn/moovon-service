import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../api/supabaseClient';

export type UserAppRole = 'admin' | 'company' | 'customer' | null;
// ─────────────────────────────────────────────────────────────
// FIX 1: Portal-specific localStorage key prefix
// Each portal (admin/main, reseller, company) gets its own
// isolated storage so tokens never bleed across portals.
// ─────────────────────────────────────────────────────────────
export function getPortalPrefix(): string {
  const hostname = window.location.hostname;
  if (hostname.startsWith('reseller.')) return 'reseller';
  if (hostname.startsWith('company.'))  return 'company';
  return 'main'; // default: admin + customer domain
}

export function getStorageKey(name: string): string {
  return `moovon_${getPortalPrefix()}_${name}`;
  // Examples:
  // main portal    → moovon_main_user,     moovon_main_role,     moovon_main_session
  // reseller portal → moovon_reseller_user, moovon_reseller_role, moovon_reseller_session
  // company portal  → moovon_company_user,  moovon_company_role,  moovon_company_session
}

// ─────────────────────────────────────────────────────────────
// FIX 2: Role type now includes 'reseller' as its own role
// ─────────────────────────────────────────────────────────────
export type AppRole = 'admin' | 'customer' | 'reseller' | 'provider' | null;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: UserAppRole;
  isLoading: boolean;
  setFallbackUser: (user: any, role: UserAppRole, userSession?: any) => void;
  role: AppRole;
  isLoading: boolean;
  setFallbackUser: (user: any, role: AppRole, userSession?: any) => void;
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
  const [role, setRole] = useState<AppRole>(null);
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
      if (rawRole === 'super_admin') {
        mappedRole = 'admin';
      } else if (rawRole === 'provider' || rawRole === 'company' || rawRole === 'reseller' || rawRole === 'admin') {
        mappedRole = 'company';
      }


      // ─────────────────────────────────────────────────────
      // FIX 2: Preserve the real role — do NOT collapse
      // 'reseller' or 'provider' into 'admin' anymore.
      // Each role is now stored and used as-is.
      // ─────────────────────────────────────────────────────
      const rawRole: string =
        currentSession.user.user_metadata?.role ||
        currentSession.user.app_metadata?.role ||
        'customer';

      const mappedRole = mapRole(rawRole);
      setRole(mappedRole);

      // FIX 1: Write to portal-specific keys
      localStorage.setItem(getStorageKey('user'), JSON.stringify(currentSession.user));
      localStorage.setItem(getStorageKey('role'), mappedRole ?? 'customer');
    } else {
      // Check fallback storage for local development environments
      const storedUser = localStorage.getItem('moovon_user');
      const storedRole = localStorage.getItem('moovon_role') as UserAppRole;
      // FIX 1: Read from portal-specific keys only
      const storedUser = localStorage.getItem(getStorageKey('user'));
      const storedRole = localStorage.getItem(getStorageKey('role')) as AppRole;
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
    const storedUserStr = localStorage.getItem('moovon_user');
  const setFallbackUser = (userData: any, userRole: AppRole, userSession?: any) => {
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
    localStorage.setItem('moovon_user', JSON.stringify(mergedUser));
    localStorage.setItem('moovon_role', userRole || 'customer');
    // FIX 1: Write to portal-specific keys
    localStorage.setItem(getStorageKey('user'), JSON.stringify(mergedUser));
    localStorage.setItem(getStorageKey('role'), userRole ?? 'customer');
    if (userSession) {
      localStorage.setItem(getStorageKey('session'), JSON.stringify(userSession));
    }
  };

  const signOut = async () => {
    // FIX 1: Remove portal-specific keys only — other portals stay logged in
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

// ─────────────────────────────────────────────────────────────
// Helper: maps raw Supabase role string to our AppRole
// ─────────────────────────────────────────────────────────────
function mapRole(raw: string): AppRole {
  switch (raw) {
    case 'super_admin':
    case 'admin':
      return 'admin';
    case 'reseller':
      return 'reseller';   // FIX 2: reseller stays reseller
    case 'provider':
      return 'provider';   // FIX 2: provider stays provider
    case 'customer':
      return 'customer';
    default:
      return 'customer';
  }
}

export const useAuth = () => useContext(AuthContext);
