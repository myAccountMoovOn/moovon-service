import React from 'react';
import { MoovonLogo } from '../../../assets/MoovonLogo';

export const HeroOrb: React.FC = () => {
  return (
    <div className="glass-orb-container" style={{ width: '100%', height: '360px', marginTop: '20px' }}>
      {/* SVG Flowing Orbital Ring Overlay */}
      <svg
        className="orbital-svg-layer"
        width="460"
        height="320"
        viewBox="0 0 460 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heroOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.85" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbit Path 1 */}
        <path
          d="M 20 220 Q 140 300 240 200 T 440 60"
          stroke="url(#heroOrbitGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Orbit Path 2 */}
        <path
          d="M 40 180 Q 200 40 400 160"
          stroke="rgba(124, 58, 237, 0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Glowing Orbit Energy Nodes */}
        <circle cx="90" cy="250" r="5" fill="#3B82F6" filter="url(#glow)" />
        <circle cx="210" cy="210" r="6" fill="#7C3AED" filter="url(#glow)" />
        <circle cx="370" cy="100" r="4.5" fill="#2563EB" filter="url(#glow)" />
      </svg>

      {/* Layered Glass Sphere */}
      <div className="glass-orb-sphere">
        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MoovonLogo width={170} variant="color" />
        </div>
      </div>

      {/* Ambient Shadow */}
      <div className="orb-shadow" />
    </div>
  );
};
