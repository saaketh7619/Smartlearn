'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export function ThemeInitializer() {
  const setTheme = useStore((state) => state.setTheme);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('smartlearn_theme') as 'light' | 'dark' | null;
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    } catch {
      // Fallback to current
    }
  }, [setTheme]);

  return null;
}
