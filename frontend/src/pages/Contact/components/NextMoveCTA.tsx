import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CTAOrb } from './CTAOrb';

export const NextMoveCTA: React.FC = () => {
  return (
    <section className="section-dark-cta">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '48px' }}>
          
          {/* LEFT CONTENT (~45%) */}
          <div style={{ flex: '1 1 480px', maxWidth: '580px' }}>
            <div className="section-label">
              <span className="num">04</span>
              <span>THE NEXT MOVE</span>
            </div>

            <h2 className="hero-headline" style={{ fontSize: 'clamp(40px, 4.5vw, 62px)' }}>
              Your Next Move <br />
              Starts With a <br />
              <span
                style={{
                  background: 'linear-gradient(100deg, #60A5FA 0%, #A855F7 100%)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Conversation.
              </span>
            </h2>

            <p className="hero-description" style={{ fontSize: '18px', marginBottom: '36px' }}>
              Let's build what's next.
            </p>

            <a
              href="#top"
              className="btn-gradient"
              style={{
                height: '50px',
                padding: '0 32px',
                fontSize: '16px',
                background: 'linear-gradient(100deg, #2563EB 0%, #7C3AED 100%)',
              }}
            >
              <span>Let's Talk</span>
              <ArrowRight className="arrow-icon" size={20} />
            </a>
          </div>

          {/* RIGHT CONTENT (~55%) — Giant Glass Orb */}
          <div style={{ flex: '1 1 480px', display: 'flex', justifyContent: 'center' }}>
            <CTAOrb />
          </div>

        </div>
      </div>
    </section>
  );
};
