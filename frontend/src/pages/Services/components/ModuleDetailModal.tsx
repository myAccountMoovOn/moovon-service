import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import type { ModuleData } from '../data/servicesPageData';

interface ModuleDetailModalProps {
  module: ModuleData | null;
  onClose: () => void;
}

export const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({ module, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (module) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [module, onClose]);

  if (!module) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-glass-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(238, 245, 255, 0.8)',
            border: '1px solid rgba(255,255,255,0.9)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--moovon-navy)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Header Badge */}
        <div style={{ display: 'inline-block', marginBottom: '12px' }}>
          <span className="card-code-badge" style={{ fontSize: '12px', padding: '6px 12px' }}>
            {module.code} MODULE
          </span>
        </div>

        <h3 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--moovon-navy)', marginBottom: '12px' }}>
          {module.title}
        </h3>

        <p style={{ fontSize: '15px', color: 'var(--moovon-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
          {module.overview}
        </p>

        {/* Capabilities Checklist */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--moovon-navy)', marginBottom: '14px' }}>
            Key Capabilities
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '10px' }}>
            {module.capabilities.map((cap, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--moovon-navy)' }}>
                <CheckCircle2 size={18} color="var(--moovon-blue)" />
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal CTA */}
        <Link
          to="/contact"
          onClick={onClose}
          className="btn-gradient"
          style={{ width: '100%', height: '46px', fontSize: '15px' }}
        >
          <span>Talk to Our Team</span>
          <ArrowRight className="arrow-icon" size={18} />
        </Link>

      </div>
    </div>
  );
};
