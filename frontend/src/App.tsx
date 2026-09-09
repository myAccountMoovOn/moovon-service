import React, { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BrandingProvider } from './context/BrandingContext';
import { router, resellerRouter, companyRouter } from './router';

const App: React.FC = () => {
  const currentRouter = useMemo(() => {
    const hostname = window.location.hostname;
    if (hostname.startsWith('reseller.')) {
      return resellerRouter;
    } else if (hostname.startsWith('company.')) {
      return companyRouter;
    }
    return router; // Default
  }, []);

  return (
    <AuthProvider>
      <BrandingProvider>
        <RouterProvider router={currentRouter} />
      </BrandingProvider>
    </AuthProvider>
  );
};

export default App;
