import React from 'react';
import { CONNECTED_FLOW_NODES } from '../data/servicesPageData';
import { UserPlus, ShoppingBag, Truck, FileSpreadsheet, CreditCard, Calculator, PieChart, Zap } from 'lucide-react';

export const ConnectedBusinessFlow: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'user-plus': return <UserPlus size={22} />;
      case 'shopping-bag': return <ShoppingBag size={22} />;
      case 'truck': return <Truck size={22} />;
      case 'file-spreadsheet': return <FileSpreadsheet size={22} />;
      case 'credit-card': return <CreditCard size={22} />;
      case 'calculator': return <Calculator size={22} />;
      case 'pie-chart': return <PieChart size={22} />;
      default: return <UserPlus size={22} />;
    }
  };

  return (
    <section className="section-wrapper" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
          <div className="section-label">
            <span className="num">03</span>
            <span>CONNECTED BUSINESS FLOW</span>
          </div>
          <h2 className="hero-headline" style={{ fontSize: 'clamp(36px, 4vw, 54px)' }}>
            A Seamless Flow That <br />
            Drives Your Business
          </h2>
          <p className="hero-description" style={{ marginBottom: 0 }}>
            All modules work together in real-time so you get complete visibility and better control.
          </p>
        </div>

        {/* Pipeline Container */}
        <div className="glass-panel" style={{ padding: '40px 32px' }}>
          
          <div className="flow-pipeline-row">
            {/* SVG Connecting Gradient Line Overlay */}
            <svg
              width="100%"
              height="4"
              style={{ position: 'absolute', top: '48px', left: '0', pointerEvents: 'none', zIndex: 1 }}
            >
              <defs>
                <linearGradient id="pipelineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#174CFF" />
                  <stop offset="50%" stopColor="#315BFF" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <line x1="5%" y1="2" x2="95%" y2="2" stroke="url(#pipelineGrad)" strokeWidth="3" strokeDasharray="8 6" />
            </svg>

            {/* 7 Flow Nodes */}
            {CONNECTED_FLOW_NODES.map((node) => (
              <div key={node.id} className="flow-node-item">
                <div className="flow-node-circle">{getIcon(node.icon)}</div>
                <div className="flow-node-title">{node.title}</div>
              </div>
            ))}
          </div>

          {/* Central Real-Time Synchronization Pill */}
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '30px',
                background: 'rgba(23, 76, 255, 0.08)',
                border: '1px solid rgba(23, 76, 255, 0.25)',
                color: 'var(--moovon-blue)',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              <Zap size={16} fill="var(--moovon-blue)" />
              <span>Real-time Synchronization</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
