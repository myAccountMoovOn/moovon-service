import React from 'react';
import { ArrowRight, TrendingUp, Users, FileText, Wallet, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BusinessIntelligence: React.FC = () => {
  return (
    <section className="section-wrapper" style={{ paddingTop: '60px', paddingBottom: '90px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', marginBottom: '40px' }}>
          <div style={{ maxWidth: '600px' }}>
            <div className="section-label">
              <span className="num">04</span>
              <span>BUSINESS INTELLIGENCE</span>
            </div>
            <h2 className="hero-headline" style={{ fontSize: 'clamp(36px, 4vw, 54px)', marginBottom: '12px' }}>
              Insights That Help <br />
              You Grow
            </h2>
            <p className="hero-description" style={{ marginBottom: 0 }}>
              Visual dashboards and detailed reports help you make smarter decisions every day.
            </p>
          </div>

          <Link to="/contact" className="btn-gradient" style={{ height: '46px', padding: '0 24px', fontSize: '14px' }}>
            <span>View Dashboard MoovOn</span>
            <ArrowRight className="arrow-icon" size={16} />
          </Link>
        </div>

        {/* Glass Dashboard Mockup Container */}
        <div className="dashboard-mockup-container">
          
          {/* KPI Cards Grid */}
          <div className="dashboard-stats-grid">
            
            {/* Revenue Card */}
            <div className="dashboard-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--moovon-text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
                <span>Revenue Overview</span>
                <span style={{ color: '#10B981', fontWeight: 600 }}>+18.6%</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--moovon-navy)', marginBottom: '12px' }}>
                ₹12,45,000
              </div>
              {/* SVG Area Trend Chart */}
              <svg width="100%" height="45" viewBox="0 0 200 45" fill="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 35 Q 40 10, 80 25 T 160 8 T 200 5 L 200 45 L 0 45 Z" fill="url(#areaGrad)" />
                <path d="M 0 35 Q 40 10, 80 25 T 160 8 T 200 5" stroke="#7C3AED" strokeWidth="2.5" fill="none" />
              </svg>
            </div>

            {/* Outstanding Invoices */}
            <div className="dashboard-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--moovon-text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
                <span>Outstanding Invoices</span>
                <FileText size={18} color="var(--moovon-blue)" />
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--moovon-navy)', marginBottom: '4px' }}>
                ₹2,15,000
              </div>
              <div style={{ fontSize: '13px', color: 'var(--moovon-text-secondary)' }}>12 Invoices</div>
            </div>

            {/* Total Customers */}
            <div className="dashboard-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--moovon-text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
                <span>Total Customers</span>
                <Users size={18} color="var(--moovon-blue)" />
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--moovon-navy)', marginBottom: '4px' }}>
                1,248
              </div>
              <div style={{ fontSize: '13px', color: '#10B981', fontWeight: 600 }}>+32 New</div>
            </div>

            {/* Total Profit */}
            <div className="dashboard-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--moovon-text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
                <span>Total Profit</span>
                <TrendingUp size={18} color="#10B981" />
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--moovon-navy)', marginBottom: '4px' }}>
                ₹6,78,000
              </div>
              <div style={{ fontSize: '13px', color: '#10B981', fontWeight: 600 }}>+14.2%</div>
            </div>

          </div>

          {/* Bottom Layout Row: Stock Value & Top Expenses Donut Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            
            {/* Stock Value Card */}
            <div className="dashboard-stat-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--moovon-text-secondary)', marginBottom: '6px' }}>Stock Value</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--moovon-navy)', marginBottom: '4px' }}>₹3,45,000</div>
                <div style={{ fontSize: '12px', color: 'var(--moovon-text-secondary)' }}>128 Items</div>
              </div>
              <div className="card-icon-wrapper" style={{ marginBottom: 0 }}>
                <Package size={24} />
              </div>
            </div>

            {/* Top Expenses SVG Donut Chart Card */}
            <div className="dashboard-stat-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--moovon-text-secondary)', marginBottom: '4px' }}>Top Expenses</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--moovon-navy)' }}>₹6,45,000</div>
                <div style={{ fontSize: '11px', color: 'var(--moovon-text-secondary)', marginTop: '8px' }}>
                  <span style={{ color: '#174CFF', fontWeight: 700 }}>● Purchase 45%</span> | <span style={{ color: '#7C3AED', fontWeight: 700 }}>● Payroll 25%</span>
                </div>
              </div>
              {/* SVG Donut Chart */}
              <svg width="80" height="80" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#E2E8F0" strokeWidth="6" />
                <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#174CFF" strokeWidth="6" strokeDasharray="45 55" strokeDashoffset="25" />
                <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#7C3AED" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="80" />
              </svg>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
