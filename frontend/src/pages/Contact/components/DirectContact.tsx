import React from 'react';
import { DIRECT_CONTACT_CARDS, SOCIAL_LINKS } from '../data/contactData';
import { ContactCard } from './ContactCard';
import { FlowingLine } from './FlowingLine';

export const DirectContact: React.FC = () => {
  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'linkedin':
        return (
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        );
      case 'facebook':
        return (
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.6 13.78 5.6c1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 3h-2.34v6.8c4.56-.93 8-4.96 8-9.8z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="section-wrapper" style={{ paddingTop: '60px', paddingBottom: '40px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Eyebrow & Headline */}
        <div className="section-label">
          <span className="num">03</span>
          <span>LET'S CONNECT</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', marginBottom: '32px' }}>
          <div>
            <h2 className="hero-headline" style={{ fontSize: 'clamp(36px, 4vw, 54px)', marginBottom: 0 }}>
              Prefer a Direct <br />
              Conversation?
            </h2>
          </div>

          {/* Follow Us Row */}
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px',
                color: 'var(--text-secondary)',
                marginBottom: '10px',
              }}
            >
              FOLLOW US
            </div>
            <div className="social-buttons-row">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="social-circle-btn"
                  aria-label={item.name}
                >
                  {getSocialIcon(item.icon)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Contact Cards */}
        <div className="contact-cards-grid">
          {DIRECT_CONTACT_CARDS.map((card) => (
            <ContactCard key={card.id} card={card} />
          ))}
        </div>

        {/* Flowing SVG Line */}
        <FlowingLine />

      </div>
    </section>
  );
};
