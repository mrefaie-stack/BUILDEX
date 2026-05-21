'use client';

import { useEffect } from 'react';
import { unlockSound } from '@/lib/sound';

/**
 * Browsers block AudioContext until the user interacts. This component
 * mounts a one-shot listener that unlocks audio on the first pointer/key
 * event and then removes itself.
 */
export function SoundProvider() {
  useEffect(() => {
    let done = false;
    const unlock = () => {
      if (done) return;
      done = true;
      unlockSound();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);
  return null;
}
