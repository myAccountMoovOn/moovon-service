import React from 'react';

interface BillJiLogoProps {
  variant?: 'light' | 'dark'; // 'light' for white background, 'dark' for dark navy background
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const BillJiLogo: React.FC<BillJiLogoProps> = ({
  variant = 'light',
  size = 'medium',
  className = '',
  style = {},
}) => {
  const height = size === 'small' ? 34 : size === 'large' ? 54 : 42;

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', ...style }}
    >
      <img
        src="/billji-logo.png"
        alt="BillJi"
        style={{
          height: `${height}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          filter: variant === 'dark' ? 'brightness(0) invert(1)' : 'none',
        }}
      />
    </div>
  );
};

export default BillJiLogo;
