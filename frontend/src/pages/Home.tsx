import React from 'react';
import BillJiNavbar from '../components/layout/BillJiNavbar';
import HeroHome from '../components/home/HeroHome';
import TrustedBusinesses from '../components/home/TrustedBusinesses';
import HomeFeatureCards from '../components/home/HomeFeatureCards';
import StatsSection from '../components/home/StatsSection';
import BillJiFooter from '../components/layout/BillJiFooter';

export const Home: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Existing Locked Navbar */}
      <BillJiNavbar />

      {/* Homepage Content Sections */}
      <main style={{ flex: 1 }}>
        <HeroHome />
        <TrustedBusinesses />
        <HomeFeatureCards />
        <StatsSection />
      </main>

      {/* Existing Locked Footer */}
      <BillJiFooter />
    </div>
  );
};

export default Home;
