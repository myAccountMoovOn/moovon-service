import React from 'react';

interface BillJiLogoProps {
  variant?: 'light' | 'dark'; // 'light' for white background, 'dark' for dark navy footer
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const BillJiLogo: React.FC<BillJiLogoProps> = ({
  variant = 'light',
  size = 'medium',
  showTagline = true,
  className = '',
  style = {},
}) => {
  // Height scaling
  const emblemHeight = size === 'small' ? 32 : size === 'large' ? 48 : 40;
  const emblemWidth = emblemHeight * 0.95;

  const titleColor = variant === 'dark' ? '#FFFFFF' : '#0B1B3A';
  const taglineColor = variant === 'dark' ? '#94A3B8' : '#64748B';

  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', ...style }}
    >
      {/* 8K Vector BillJi Blue 'B' Emblem */}
      <svg
        width={emblemWidth}
        height={emblemHeight}
        viewBox="0 0 100 105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="billji-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E66F5" />
            <stop offset="100%" stopColor="#004EEB" />
          </linearGradient>
        </defs>
        
        {/* Outer B Shape with rounded loops */}
        {/* Main Vertical Spine & Upper Loop */}
        <path
          d="M 22 10 
             H 62 
             C 78 10, 88 20, 88 34 
             C 88 47, 77 54, 62 54 
             H 48 
             V 54 
             H 66 
             C 82 54, 94 65, 94 80 
             C 94 95, 82 105, 64 105 
             H 22 
             C 15 105, 10 100, 10 93 
             V 22 
             C 10 15, 15 10, 22 10 Z"
          fill="url(#billji-blue-grad)"
        />
        {/* Cutouts for inner loops to match exact stylized B geometry */}
        <path
          d="M 32 24 
             H 58 
             C 67 24, 74 28, 74 34 
             C 74 40, 67 44, 58 44 
             H 32 Z"
          fill={variant === 'dark' ? '#061B33' : '#FFFFFF'}
        />
        <path
          d="M 32 64 
             H 62 
             C 72 64, 80 69, 80 78 
             C 80 87, 72 91, 62 91 
             H 32 Z"
          fill={variant === 'dark' ? '#061B33' : '#FFFFFF'}
        />
      </svg>

      {/* Typography */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.1 }}>
        <span
          style={{
            fontSize: size === 'small' ? '20px' : size === 'large' ? '30px' : '25px',
            fontWeight: 800,
            color: titleColor,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            letterSpacing: '-0.4px',
          }}
        >
          Bill<span style={{ color: titleColor }}>Ji</span>
        </span>

        {showTagline && (
          <span
            style={{
              fontSize: size === 'small' ? '9px' : size === 'large' ? '12px' : '10px',
              fontWeight: 600,
              color: taglineColor,
              letterSpacing: '0.2px',
              marginTop: '1px',
            }}
          >
            Business. Simplified.
          </span>
        )}
      </div>
    </div>
  );
};

export default BillJiLogo;
