import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingUp, Headphones } from 'lucide-react';
import { MoovonLogo } from '../../../assets/MoovonLogo';
import { BENEFITS_DATA } from '../data/servicesPageData';

export const ServicesCTA: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'shield-check': return <ShieldCheck size={22} color="#60A5FA" />;
      case 'trending-up': return <TrendingUp size={22} color="#A855F7" />;
      case 'headphones': return <Headphones size={22} color="#34D399" />;
      default: return <ShieldCheck size={22} color="#60A5FA" />;
    }
  };

  return (
    <section className="section-dark-cta">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '48px' }}>
          
          {/* LEFT CONTENT (~45%) */}
          <div style={{ flex: '1 1 480px', maxWidth: '560px' }}>
            <div className="section-label">
              <span className="num">05</span>
              <span>READY TO TRANSFORM</span>
            </div>

            <h2 className="hero-headline" style={{ fontSize: 'clamp(40px, 4.5vw, 60px)' }}>
              One Platform. <br />
              Infinite <br />
              <span
                style={{
                  background: 'linear-gradient(100deg, #60A5FA 0%, #A855F7 100%)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Possibilities.
              </span>
            </h2>

            <p className="hero-description" style={{ fontSize: '17px', marginBottom: '32px' }}>
              Join businesses that trust MoovOn to manage their operations, automate billing and accelerate growth.
            </p>

            <Link
              to="/contact"
              className="btn-gradient"
              style={{
                height: '50px',
                padding: '0 32px',
                fontSize: '16px',
                background: 'linear-gradient(100deg, #315BFF 0%, #7C3AED 100%)',
              }}
            >
              <span>Get Started with MoovOn</span>
              <ArrowRight className="arrow-icon" size={20} />
            </Link>
          </div>

          {/* CENTER: Illuminated 3D Glass Orb */}
          <div style={{ flex: '1 1 320px', display: 'flex', justifyContent: 'center' }}>
            <div className="cta-dark-orb" style={{ width: '280px', height: '280px' }}>
              <MoovonLogo width={180} variant="white" />
            </div>
          </div>

          {/* RIGHT: 3 Benefit Cards */}
          <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {BENEFITS_DATA.map((benefit) => (
              <div
                key={benefit.id}
                style={{
                  padding: '18px 22px',
                  borderRadius: '18px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}
              >
                <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.1)' }}>
                  {getIcon(benefit.icon)}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--moovon-white)', marginBottom: '4px' }}>
                    {benefit.title}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.4 }}>
                    {benefit.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
