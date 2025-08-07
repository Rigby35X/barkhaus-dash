import React from 'react';
import { useLiveSite } from '../../contexts/LiveSiteContext';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  alignment = 'center',
  size = 'lg',
  className = '',
}) => {
  const { designSettings } = useLiveSite();

  const getAlignment = () => {
    switch (alignment) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      default:
        return 'text-center';
    }
  };

  const getTitleSize = () => {
    switch (size) {
      case 'sm':
        return 'text-2xl md:text-3xl';
      case 'md':
        return 'text-3xl md:text-4xl';
      case 'lg':
        return 'text-3xl md:text-4xl lg:text-5xl';
      case 'xl':
        return 'text-4xl md:text-5xl lg:text-6xl';
      default:
        return 'text-3xl md:text-4xl lg:text-5xl';
    }
  };

  const titleStyle = {
    fontFamily: designSettings.headingFont,
    color: designSettings.textColor,
  };

  return (
    <div className={`${getAlignment()} ${className}`}>
      <h2
        className={`${getTitleSize()} font-bold mb-4 md:mb-6`}
        style={titleStyle}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
