import React from 'react';
import { useLiveSite } from '../../contexts/LiveSiteContext';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className = '',
  disabled = false,
}) => {
  const { designSettings } = useLiveSite();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: designSettings.primaryColor,
          color: '#ffffff',
          border: `2px solid ${designSettings.primaryColor}`,
        };
      case 'secondary':
        return {
          backgroundColor: designSettings.secondaryColor,
          color: '#ffffff',
          border: `2px solid ${designSettings.secondaryColor}`,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: designSettings.primaryColor,
          border: `2px solid ${designSettings.primaryColor}`,
        };
      default:
        return {
          backgroundColor: designSettings.primaryColor,
          color: '#ffffff',
          border: `2px solid ${designSettings.primaryColor}`,
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'md':
        return 'px-6 py-3 text-base';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold rounded-full
    transition-all duration-200
    hover:opacity-90 hover:transform hover:scale-105
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${getSizeClasses()}
    ${className}
  `;

  const buttonStyle = {
    ...getVariantStyles(),
    fontFamily: designSettings.fontFamily,
  };

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        style={buttonStyle}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={baseClasses}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
