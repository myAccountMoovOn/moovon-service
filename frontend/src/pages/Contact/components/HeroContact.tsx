import React from 'react';
import { HeroOrb } from './HeroOrb';
import { ContactForm } from './ContactForm';

export const HeroContact: React.FC = () => {
  return (
    <section className="section-wrapper section-hero">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '48px' }}>
          
          {/* LEFT CONTENT (~55% width) */}
          <div style={{ flex: '1 1 520px', maxWidth: '640px' }}>
            {/* Section Eyebrow */}
            <div className="section-label">
              <span className="num">01</span>
              <span>CONTACT MOOVON</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-headline">
              Let's Start <br />
              <span className="text-gradient">Something.</span>
            </h1>

            {/* Description */}
            <p className="hero-description">
              Have an idea, a challenge or a project in mind? Let's talk.
            </p>

            {/* Divider + Subtext */}
            <div className="hero-subtext-divider" />
            <div className="hero-subtext">We'd love to hear from you.</div>

            {/* 3D Glass Orb Signature Visual */}
            <HeroOrb />
          </div>

          {/* RIGHT CONTENT (~45% width) — Glass Form */}
          <div style={{ flex: '1 1 420px', display: 'flex', justifyContent: 'flex-end' }}>
            <ContactForm />
          </div>

        </div>
      </div>
    </section>
  );
};
