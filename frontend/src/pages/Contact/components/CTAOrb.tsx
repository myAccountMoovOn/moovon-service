import React from 'react';
import { MoovonLogo } from '../../../assets/MoovonLogo';

export const CTAOrb: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Floating Glass Tile 1 */}
      <div
        className="floating-glass-tile"
        style={{
          width: '90px',
          height: '90px',
          top: '-10px',
          left: '40px',
          transform: 'rotate(-12deg)',
        }}
      />

      {/* Floating Glass Tile 2 */}
      <div
        className="floating-glass-tile"
        style={{
          width: '110px',
          height: '110px',
          bottom: '20px',
          right: '30px',
          transform: 'rotate(15deg)',
          animationDelay: '1.5s',
        }}
      />

      {/* Bright SVG Orbital Energy Rings */}
      <svg
        width="520"
        height="380"
        viewBox="0 0 520 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', pointerEvents: 'none', zIndex: 4 }}
      >
        <defs>
          <linearGradient id="ctaOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="60%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <filter id="brightGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbit Ellipse Ring */}
        <ellipse
          cx="260"
          cy="190"
          rx="240"
          ry="85"
          stroke="url(#ctaOrbitGrad)"
          strokeWidth="4"
          filter="url(#brightGlow)"
          transform="rotate(-18 260 190)"
        />

        {/* Glowing Node */}
        <circle cx="90" cy="220" r="7" fill="#60A5FA" filter="url(#brightGlow)" />
        <circle cx="430" cy="150" r="6" fill="#A855F7" filter="url(#brightGlow)" />
      </svg>

      {/* Atmospheric Glass Orb */}
      <div className="cta-dark-orb">
        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MoovonLogo width={200} variant="white" />
        </div>
      </div>
    </div>
  );
};
