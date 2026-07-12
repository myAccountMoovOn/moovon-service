import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from './AuthContext';

interface Branding {
  id: string;
  name: string;
  logo: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  fontFamily: string | null;
  favicon: string | null;
  appName: string | null;
  tagline: string | null;
  appIconUrl: string | null;
  privacyPolicyUrl: string | null;
  termsUrl: string | null;
  footerText: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
}

interface BrandingContextType {
  branding: Branding | null;
  isLoadingBranding: boolean;
  refreshBranding: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextType>({
  branding: null,
  isLoadingBranding: true,
  refreshBranding: async () => {},
});

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [isLoadingBranding, setIsLoadingBranding] = useState(true);
  const { user } = useAuth();

  const fetchBranding = async () => {
    setIsLoadingBranding(true);
    try {
      // First try to load via user's company if logged in
      if (user) {
        const res = await axiosInstance.get('/companies/me');
        // Backend wraps all responses in { success, data, message } envelope
        const company = res.data?.data ?? res.data;
        console.log('[BrandingContext] Resolved company:', company?.id, '| logo:', company?.logo, '| appName:', company?.appName);
        if (company) {
          setBranding(company);
          applyBranding(company);
          return;
        }
      }
      
      // If not logged in or no company, we could check the custom domain
      setBranding(null);
    } catch (e) {
      console.error('[BrandingContext] Failed to fetch branding', e);
      setBranding(null);
    } finally {
      setIsLoadingBranding(false);
    }
  };

  const applyBranding = (data: Branding) => {
    // NOTE: Color theme is fixed to the default blue. Do NOT apply primaryColor here.
    // Always remove any previously set color override so the default CSS always wins.
    document.documentElement.style.removeProperty('--color-primary');
    
    if (data.appName) {
      document.title = data.appName;
    } else {
      document.title = 'Moovon';
    }

    if (data.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = data.favicon;
    }
  };

  useEffect(() => {
    fetchBranding();
  }, [user]);

  return (
    <BrandingContext.Provider value={{ branding, isLoadingBranding, refreshBranding: fetchBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);
