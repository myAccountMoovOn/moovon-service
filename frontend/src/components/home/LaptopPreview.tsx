import React from 'react';
import DashboardPreview from './DashboardPreview';

export const LaptopPreview: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', margin: '28px 0 32px 0' }}>
      {/* Laptop Frame Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          backgroundColor: '#0F172A',
          borderRadius: '14px 14px 0 0',
          padding: '10px 10px 0 10px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          border: '1px solid #334155',
        }}
      >
        {/* Webcam dot */}
        <div
          style={{
            position: 'absolute',
            top: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: '#475569',
          }}
        />

        {/* Dashboard Preview Screen */}
        <div style={{ borderRadius: '8px 8px 0 0', overflow: 'hidden' }}>
          <DashboardPreview />
        </div>
      </div>

      {/* Laptop Base */}
      <div
        style={{
          height: '14px',
          backgroundColor: '#CBD5E1',
          borderRadius: '0 0 12px 12px',
          width: '108%',
          marginLeft: '-4%',
          position: 'relative',
          boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '4px',
            backgroundColor: '#94A3B8',
            borderRadius: '0 0 4px 4px',
          }}
        />
      </div>

      {/* Ceramic Coffee Mug Annotation "Grow Smarter Together" */}
      <div
        style={{
          position: 'absolute',
          right: '-90px',
          bottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        className="hidden-tablet-mobile"
      >
        {/* White Ceramic Mug Graphic */}
        <div
          style={{
            width: '74px',
            height: '84px',
            backgroundColor: '#FFFFFF',
            borderRadius: '4px 4px 16px 16px',
            border: '2px solid #E2E8F0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
          }}
        >
          {/* Mug Handle */}
          <div
            style={{
              position: 'absolute',
              right: '-16px',
              top: '18px',
              width: '18px',
              height: '38px',
              border: '3px solid #E2E8F0',
              borderRadius: '0 12px 12px 0',
              backgroundColor: 'transparent',
            }}
          />

          {/* Cursive Text inside Mug */}
          <div
            style={{
              fontFamily: "'Comic Sans MS', 'Caveat', 'Brush Script MT', cursive",
              fontSize: '13px',
              fontWeight: 700,
              color: '#1E66F5',
              lineHeight: 1.1,
              textAlign: 'center',
            }}
          >
            Grow<br />Smarter<br />Together
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopPreview;
