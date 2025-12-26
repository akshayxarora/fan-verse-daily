'use client';

import { useEffect, useRef } from 'react';
import { analyticsApi } from '@/lib/api/client';

interface ViewTrackerProps {
  postId: string;
}

export default function ViewTracker({ postId }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per component mount in the client
    if (tracked.current) return;
    
    // Support finding by ID or slug - the API handles UUID
    const incrementView = async () => {
      try {
        // Use fetch directly to avoid dependency issues if needed, 
        // but analyticsApi.incrementView is better if added
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId }),
        });
        tracked.current = true;
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    };

    // Delay slightly to ensure it's a real view
    const timer = setTimeout(incrementView, 2000);
    return () => clearTimeout(timer);
  }, [postId]);

  return null;
}

