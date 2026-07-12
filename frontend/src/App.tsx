import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BrandingProvider } from './context/BrandingContext';
import { router } from './router';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrandingProvider>
        <RouterProvider router={router} />
      </BrandingProvider>
    </AuthProvider>
  );
};

export default App;
