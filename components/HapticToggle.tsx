'use client';

import { useState, useEffect } from 'react';
import { Smartphone, SmartphoneNfc } from 'lucide-react';
import { haptics, isHapticsSupported } from '@/lib/haptics';

interface HapticToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function HapticToggle({ 
  size = 'md', 
  showLabel = false,
  className = '' 
}: HapticToggleProps) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSupported, setIsSupported] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsSupported(isHapticsSupported());
    if (isHapticsSupported()) {
      setIsEnabled(haptics.isEnabled());
    }
  }, []);

  const handleToggle = () => {
    const newState = haptics.toggle();
    setIsEnabled(newState);
    
    // Give haptic feedback when enabling
    if (newState) {
      haptics.buttonTap();
    }
  };

  // Don't render on server or if not supported
  if (!mounted || !isSupported) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleToggle}
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          rounded-full
          ${
            isEnabled
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300'
          }
          transition-all duration-200
          shadow-lg hover:shadow-xl
          group
          relative
        `}
        aria-label={isEnabled ? 'Disable haptics' : 'Enable haptics'}
        title={isEnabled ? 'Disable haptics' : 'Enable haptics'}
      >
        {isEnabled ? (
          <Smartphone size={iconSizes[size]} className="animate-pulse" />
        ) : (
          <SmartphoneNfc size={iconSizes[size]} className="opacity-50" />
        )}
        
        {/* Tooltip */}
        <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          {isEnabled ? 'Haptics On' : 'Haptics Off'}
        </span>
      </button>

      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Haptics {isEnabled ? 'On' : 'Off'}
        </span>
      )}
    </div>
  );
}
