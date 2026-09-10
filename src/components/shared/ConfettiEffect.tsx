'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useStore } from '@/store/useStore';

export function ConfettiEffect() {
  const confettiTrigger = useStore((state) => state.confettiTrigger);

  useEffect(() => {
    if (confettiTrigger > 0) {
      // Fire celebratory burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'],
      });

      // Subtle side cannons
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    }
  }, [confettiTrigger]);

  return null;
}
