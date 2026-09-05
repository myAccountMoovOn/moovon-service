import React from 'react';
import { MODULES_DATA } from '../data/servicesPageData';
import type { ModuleData } from '../data/servicesPageData';
import { BarChart3, Package, Users, ShoppingCart, FileText, Wallet, ArrowRight } from 'lucide-react';

interface CoreModulesProps {
  onSelectModule: (module: ModuleData) => void;
}

export const CoreModules: React.FC<CoreModulesProps> = ({ onSelectModule }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'bar-chart': return <BarChart3 size={24} />;
      case 'package': return <Package size={24} />;
      case 'users': return <Users size={24} />;
      case 'shopping-cart': return <ShoppingCart size={24} />;
      case 'file-text': return <FileText size={24} />;
      case 'wallet': return <Wallet size={24} />;
      default: return <FileText size={24} />;
    }
  };

  return (
    <section id="core-modules" className="section-wrapper" style={{ paddingTop: '80px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Eyebrow & Headline */}
        <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
          <div className="section-label">
            <span className="num">02</span>
            <span>CORE MODULES</span>
          </div>
          <h2 className="hero-headline" style={{ fontSize: 'clamp(36px, 4vw, 54px)' }}>
            Everything You Need <br />
            to Run Your Business
          </h2>
          <p className="hero-description" style={{ marginBottom: 0 }}>
            Powerful modules built to handle every aspect of your business operations.
          </p>
        </div>

        {/* 6 Module Glass Cards Grid */}
        <div className="modules-grid">
          {MODULES_DATA.map((mod) => (
            <div
              key={mod.id}
              className="glass-panel module-card-item"
              onClick={() => onSelectModule(mod)}
            >
              <div>
                <div className="card-header-row">
                  <div className="card-icon-wrapper" style={{ marginBottom: 0 }}>
                    {getIcon(mod.icon)}
                  </div>
                  <span className="card-code-badge">{mod.code}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--moovon-navy)', marginBottom: '8px' }}>
                  {mod.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--moovon-text-secondary)', lineHeight: 1.5 }}>
                  {mod.shortDescription}
                </p>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--moovon-blue)', fontWeight: 600, fontSize: '14px' }}>
                <span>Explore Capabilities</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
