import React from 'react';
import { MoovonLogo } from '../../../assets/MoovonLogo';

export const HeroOrb: React.FC = () => {
  return (
    <div className="hero-orb-wrapper">
      {/* SVG Flowing Energy Ribbon & Sparkles Layer */}
      <svg
        className="orbital-svg-layer"
        width="620"
        height="380"
        viewBox="0 0 620 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="heroRibbonGrad1" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#38BDF8" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="heroRibbonGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#A855F7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#E879F9" stopOpacity="0.3" />
          </linearGradient>

          <filter id="ribbonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="sparkleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Glow Ribbons */}
        <path
          d="M -40 285 C 80 230, 160 300, 280 250 C 400 200, 480 220, 640 200"
          stroke="url(#heroRibbonGrad2)"
          strokeWidth="8"
          fill="none"
          filter="url(#ribbonGlow)"
        />

        {/* Primary Glowing Energy Ribbon Path */}
        <path
          d="M -40 285 C 80 230, 160 300, 280 250 C 400 200, 480 220, 640 200"
          stroke="url(#heroRibbonGrad1)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#ribbonGlow)"
        />

        {/* Secondary Looping Purple Ribbon Path */}
        <path
          d="M 140 195 C 240 130, 380 160, 490 195 C 560 215, 600 210, 650 220"
          stroke="url(#heroRibbonGrad1)"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          fill="none"
          opacity="0.85"
        />

        {/* Glowing Energy Beads / Nodes */}
        <circle cx="142" cy="254" r="5.5" fill="#38BDF8" filter="url(#ribbonGlow)" />
        <circle cx="142" cy="254" r="2.5" fill="#FFFFFF" />

        <circle cx="492" cy="195" r="5" fill="#C084FC" filter="url(#ribbonGlow)" />
        <circle cx="492" cy="195" r="2" fill="#FFFFFF" />

        {/* 4-Point Lens Flare Sparkle (x: 378, y: 180) */}
        <g transform="translate(378, 180)">
          <path
            d="M 0 -12 Q 0 0 -12 0 Q 0 0 0 12 Q 0 0 12 0 Q 0 0 0 -12 Z"
            fill="#E879F9"
            filter="url(#sparkleGlow)"
          />
          <path d="M 0 -8 Q 0 0 -8 0 Q 0 0 0 8 Q 0 0 8 0 Q 0 0 0 -8 Z" fill="#FFFFFF" />
        </g>

        {/* Additional Atmospheric Sparkles */}
        <g transform="translate(100, 160) scale(0.6)">
          <path d="M 0 -10 Q 0 0 -10 0 Q 0 0 0 10 Q 0 0 10 0 Q 0 0 0 -10 Z" fill="#38BDF8" opacity="0.8" />
        </g>

        <g transform="translate(530, 140) scale(0.7)">
          <path d="M 0 -10 Q 0 0 -10 0 Q 0 0 0 10 Q 0 0 10 0 Q 0 0 0 -10 Z" fill="#C084FC" opacity="0.9" />
        </g>
      </svg>

      {/* Hyper-Realistic 3D Layered Glass Sphere */}
      <div className="glass-orb-sphere">
        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MoovonLogo width={165} variant="color" />
        </div>
      </div>

      {/* Ambient Drop Shadow */}
      <div className="orb-shadow" />
    </div>
  );
};
