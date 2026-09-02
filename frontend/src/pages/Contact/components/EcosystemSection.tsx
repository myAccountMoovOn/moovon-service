import React from 'react';
import { EcosystemOrb } from './EcosystemOrb';
import { EcosystemNode } from './EcosystemNode';
import { SERVICE_OPTIONS } from '../data/contactData';

export const EcosystemSection: React.FC = () => {
  const billingService = SERVICE_OPTIONS.find((s) => s.id === 'billing')!;
  const itService = SERVICE_OPTIONS.find((s) => s.id === 'it_software')!;
  const marketingService = SERVICE_OPTIONS.find((s) => s.id === 'digital_marketing')!;
  const designService = SERVICE_OPTIONS.find((s) => s.id === 'graphic_design')!;

  return (
    <section className="section-wrapper" style={{ paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ maxWidth: '600px', marginBottom: '40px' }}>
          <div className="section-label">
            <span className="num">02</span>
            <span>HOW CAN WE HELP?</span>
          </div>
          <h2 className="hero-headline" style={{ fontSize: 'clamp(36px, 4vw, 54px)' }}>
            Tell Us Where You <br />
            Want to Go.
          </h2>
          <p className="hero-description" style={{ marginBottom: 0 }}>
            Choose a direction and see how MoovOn can help you move forward.
          </p>
        </div>

        {/* Circular Ecosystem Diagram */}
        <div className="ecosystem-container">
          
          {/* SVG Elliptical Orbit Gradient Path */}
          <svg
            width="580"
            height="380"
            viewBox="0 0 580 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', pointerEvents: 'none', zIndex: 3 }}
          >
            <defs>
              <linearGradient id="orbitCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>

            {/* Elliptical Path */}
            <ellipse
              cx="290"
              cy="190"
              rx="230"
              ry="140"
              stroke="url(#orbitCircleGrad)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              opacity="0.8"
            />

            {/* Orbit Energy Nodes */}
            <circle cx="290" cy="50" r="5" fill="#3B82F6" />
            <circle cx="290" cy="330" r="5" fill="#7C3AED" />
            <circle cx="60" cy="190" r="5" fill="#2563EB" />
            <circle cx="520" cy="190" r="5" fill="#A855F7" />
          </svg>

          {/* Center Orb */}
          <EcosystemOrb />

          {/* 4 Positioned Nodes */}
          <EcosystemNode service={billingService} positionClass="node-top" />
          <EcosystemNode service={itService} positionClass="node-left" />
          <EcosystemNode service={marketingService} positionClass="node-right" />
          <EcosystemNode service={designService} positionClass="node-bottom" />

        </div>

      </div>
    </section>
  );
};
