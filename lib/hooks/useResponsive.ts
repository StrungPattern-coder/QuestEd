"use client";

import { useState, useEffect } from 'react';

type BreakPoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

interface UseResponsive {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  breakpoint: BreakPoint;
  width: number;
}

export function useResponsive(): UseResponsive {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const width = windowSize.width;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024 && width < 1536;
  const isWide = width >= 1536;

  let breakpoint: BreakPoint = 'desktop';
  if (isMobile) breakpoint = 'mobile';
  else if (isTablet) breakpoint = 'tablet';
  else if (isWide) breakpoint = 'wide';

  return {
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    breakpoint,
    width,
  };
}
