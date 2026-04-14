import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, App as AntApp } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "'Roboto', sans-serif",
            colorPrimary: '#0057e7',
            colorSuccess: '#008744',
            colorError: '#d62d20',
            colorWarning: '#ffa700',
            colorBgBase: '#ffffff',
            borderRadius: 6,
            colorBorder: '#e0e0e0',
          },
          components: {
            Layout: {
              bodyBg: '#f5f5f5',
              headerBg: '#ffffff',
              siderBg: '#f5f5f5',
            },
          },
        }}
      >
        <AntApp>
          <App />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
