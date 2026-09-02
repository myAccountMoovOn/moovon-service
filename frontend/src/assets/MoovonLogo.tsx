import React from 'react';
import logoColor from './moovon-logo.png';
import logoWhite from './moovon-logo-white.png';

interface MoovonLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  variant?: 'color' | 'white';
  showSubtitle?: boolean;
}

export const MoovonLogo: React.FC<MoovonLogoProps> = ({
  className = '',
  width = 160,
  height = 'auto',
  variant = 'color',
}) => {
  const logoSrc = variant === 'white' ? logoWhite : logoColor;

  return (
    <img
      src={logoSrc}
      alt="MoovOn.In"
      className={className}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        objectFit: 'contain',
        display: 'inline-block',
      }}
    />
  );
};
