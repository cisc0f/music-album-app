import React, { useMemo } from 'react';

interface AlbumAvatarProps {
  size?: number;
  className?: string;
}

export const AlbumAvatar: React.FC<AlbumAvatarProps> = ({ 
  size = 40, 
  className = '',
}) => {
  // Generate random colors for gradient
  const colors = useMemo(() => {
    const generateRandomColor = () => {
      const hue = Math.floor(Math.random() * 360);
      const saturation = 70 + Math.floor(Math.random() * 30);
      const lightness = 40 + Math.floor(Math.random() * 30);
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };
    
    return {
      color1: generateRandomColor(),
      color2: generateRandomColor(),
      color3: generateRandomColor(),
      color4: generateRandomColor(),
    };
  }, []);

  const gradientId = useMemo(() => `mesh-gradient-${Math.random().toString(36).substring(2, 11)}`, []);

  return (
    <div 
      className={`relative rounded-full overflow-hidden ${className}`}
      style={{ 
        width: size, 
        height: size,
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`${gradientId}-1`} cx="0%" cy="0%" r="100%">
            <stop offset="0%" stopColor={colors.color1} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id={`${gradientId}-2`} cx="100%" cy="0%" r="100%">
            <stop offset="0%" stopColor={colors.color2} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id={`${gradientId}-3`} cx="100%" cy="100%" r="100%">
            <stop offset="0%" stopColor={colors.color3} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id={`${gradientId}-4`} cx="0%" cy="100%" r="100%">
            <stop offset="0%" stopColor={colors.color4} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId}-1)`} />
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId}-2)`} />
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId}-3)`} />
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId}-4)`} />
      </svg>
    </div>
  );
};

export default AlbumAvatar;
