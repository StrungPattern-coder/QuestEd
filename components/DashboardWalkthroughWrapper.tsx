'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import UserWalkthrough from './UserWalkthrough';

interface DashboardWalkthroughWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWalkthroughWrapper({ children }: DashboardWalkthroughWrapperProps) {
  const { user } = useAuthStore();
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkWalkthroughStatus = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }

      try {
        // Check localStorage first (faster)
        const walkthroughKey = `walkthrough_completed_${user.id}`;
        const localStorageValue = localStorage.getItem(walkthroughKey);
        
        if (localStorageValue === 'true') {
          setShowWalkthrough(false);
          setIsChecking(false);
          return;
        }

        // Fetch from API if not in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setIsChecking(false);
          return;
        }

        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const completed = data.user?.walkthroughCompleted || false;
          
          if (completed) {
            localStorage.setItem(walkthroughKey, 'true');
            setShowWalkthrough(false);
          } else {
            setShowWalkthrough(true);
          }
        }
      } catch (error) {
        console.error('Error checking walkthrough status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkWalkthroughStatus();
  }, [user]);

  const handleComplete = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Mark as completed in backend
      await fetch('/api/user/complete-walkthrough', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Mark as completed in localStorage
      const walkthroughKey = `walkthrough_completed_${user.id}`;
      localStorage.setItem(walkthroughKey, 'true');
    } catch (error) {
      console.error('Error completing walkthrough:', error);
    }

    setShowWalkthrough(false);
  };

  const handleSkip = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Mark as completed in backend (skip also marks as completed)
      await fetch('/api/user/complete-walkthrough', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Mark as completed in localStorage
      const walkthroughKey = `walkthrough_completed_${user.id}`;
      localStorage.setItem(walkthroughKey, 'true');
    } catch (error) {
      console.error('Error skipping walkthrough:', error);
    }

    setShowWalkthrough(false);
  };

  // Don't render anything while checking
  if (isChecking) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {showWalkthrough && user && (
        <UserWalkthrough
          role={user.role as 'student' | 'teacher'}
          onComplete={handleComplete}
          onSkip={handleSkip}
        />
      )}
    </>
  );
}
