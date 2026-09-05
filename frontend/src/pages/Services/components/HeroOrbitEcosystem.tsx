import React from 'react';
import { MoovonLogo } from '../../../assets/MoovonLogo';
import { MODULES_DATA } from '../data/servicesPageData';
import type { ModuleData } from '../data/servicesPageData';
import { BarChart3, Package, Users, ShoppingCart, FileText, Wallet } from 'lucide-react';

interface HeroOrbitEcosystemProps {
  onSelectModule: (module: ModuleData) => void;
}

export const HeroOrbitEcosystem: React.FC<HeroOrbitEcosystemProps> = ({ onSelectModule }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'bar-chart': return <BarChart3 size={18} />;
      case 'package': return <Package size={18} />;
      case 'users': return <Users size={18} />;
      case 'shopping-cart': return <ShoppingCart size={18} />;
      case 'file-text': return <FileText size={18} />;
      case 'wallet': return <Wallet size={18} />;
      default: return <FileText size={18} />;
    }
  };

  return (
    <div className="hero-ecosystem-wrapper">
      {/* Background Floating 3D Glass Cubes */}
      <div
        className="floating-glass-tile"
        style={{ width: '48px', height: '48px', top: '10px', left: '20px', transform: 'rotate(18deg)' }}
      />
      <div
        className="floating-glass-tile"
        style={{ width: '54px', height: '54px', bottom: '40px', right: '15px', transform: 'rotate(-25deg)', animationDelay: '2s' }}
      />

      {/* SVG Elliptical Orbit Rings & Energy Nodes */}
      <svg
        width="540"
        height="480"
        viewBox="0 0 540 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', pointerEvents: 'none', zIndex: 3 }}
      >
        <defs>
          <linearGradient id="orbitRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#174CFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#315BFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Outer Orbit Path */}
        <ellipse
          cx="270"
          cy="240"
          rx="240"
          ry="200"
          stroke="url(#orbitRingGrad)"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          opacity="0.85"
        />

        {/* Inner Orbit Path */}
        <ellipse
          cx="270"
          cy="240"
          rx="170"
          ry="140"
          stroke="rgba(124, 58, 237, 0.35)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Glowing Energy Nodes */}
        <circle cx="270" cy="40" r="5" fill="#315BFF" />
        <circle cx="510" cy="240" r="5.5" fill="#A855F7" />
        <circle cx="30" cy="240" r="5" fill="#174CFF" />
        <circle cx="270" cy="440" r="6" fill="#C084FC" />
      </svg>

      {/* Pedestal Rings */}
      <div className="ecosystem-pedestal-ring ring-outer" style={{ bottom: '110px' }} />
      <div className="ecosystem-pedestal-ring ring-inner" style={{ bottom: '122px' }} />

      {/* Center 3D Glass Orb */}
      <div className="hero-center-orb">
        <div style={{ textAlign: 'center' }}>
          <MoovonLogo width={160} variant="color" />
        </div>
      </div>

      {/* 6 Orbiting Module Spheres */}
      {MODULES_DATA.map((mod) => (
        <div
          key={mod.id}
          className="orbit-module-node"
          style={{ top: mod.orbitPos?.top, left: mod.orbitPos?.left }}
          onClick={() => onSelectModule(mod)}
        >
          <div className="orbit-icon-circle">{getIcon(mod.icon)}</div>
          <div className="orbit-code-title">{mod.code}</div>
          <div className="orbit-sub-desc">{mod.title}</div>
        </div>
      ))}
    </div>
  );
};
