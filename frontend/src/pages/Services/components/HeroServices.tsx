import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HeroOrbitEcosystem } from './HeroOrbitEcosystem';
import type { ModuleData } from '../data/servicesPageData';

interface HeroServicesProps {
  onSelectModule: (module: ModuleData) => void;
}

export const HeroServices: React.FC<HeroServicesProps> = ({ onSelectModule }) => {
  const scrollToCoreModules = () => {
    const el = document.getElementById('core-modules');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section-wrapper section-hero">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '48px' }}>
          
          {/* LEFT CONTENT (~50% width) */}
          <div style={{ flex: '1 1 500px', maxWidth: '620px' }}>
            <div className="section-label">
              <span className="num">01</span>
              <span>OUR SERVICES</span>
            </div>

            <h1 className="hero-headline">
              One Platform. <br />
              Every Business <br />
              <span className="text-gradient">Move.</span>
            </h1>

            <p className="hero-description">
              MoovOn brings billing, finance, customers, inventory, sales and business operations together in one connected platform.
            </p>

            <div className="hero-subtext-divider" />

            <button
              onClick={scrollToCoreModules}
              className="btn-gradient"
              style={{ marginTop: '16px', fontSize: '15px', height: '48px', padding: '0 28px' }}
            >
              <span>Explore All Modules</span>
              <ArrowRight className="arrow-icon" size={18} />
            </button>
          </div>

          {/* RIGHT CONTENT (~50% width) — 3D Orbital Ecosystem */}
          <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
            <HeroOrbitEcosystem onSelectModule={onSelectModule} />
          </div>

        </div>
      </div>
    </section>
  );
};
