import React, { ReactNode } from 'react';
import { useLiveSite } from '../../contexts/LiveSiteContext';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  backgroundColor?: 'primary' | 'secondary' | 'white' | 'gray' | 'custom';
  customBackgroundColor?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  className = '',
  backgroundColor = 'white',
  customBackgroundColor,
  padding = 'lg',
  id,
}) => {
  const { designSettings } = useLiveSite();

  const getBackgroundColor = () => {
    if (customBackgroundColor) return customBackgroundColor;
    
    switch (backgroundColor) {
      case 'primary':
        return designSettings.primaryColor;
      case 'secondary':
        return designSettings.secondaryColor;
      case 'white':
        return '#ffffff';
      case 'gray':
        return '#f9fafb';
      default:
        return designSettings.backgroundColor;
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'sm':
        return 'py-8 md:py-12';
      case 'md':
        return 'py-12 md:py-16';
      case 'lg':
        return 'py-16 md:py-20';
      case 'xl':
        return 'py-20 md:py-32';
      default:
        return 'py-16 md:py-20';
    }
  };

  const sectionStyle = {
    backgroundColor: getBackgroundColor(),
    color: backgroundColor === 'primary' || backgroundColor === 'secondary' ? '#ffffff' : designSettings.textColor,
    fontFamily: designSettings.fontFamily,
  };

  return (
    <section
      id={id}
      className={`${getPadding()} ${className}`}
      style={sectionStyle}
    >
      {children}
    </section>
  );
};

export default SectionWrapper;