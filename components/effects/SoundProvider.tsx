'use client';

import { useEffect } from 'react';
import {
  bindAmbientLifecycle,
  isSoundEnabled,
  startAmbient,
  unlockSound
} from '@/lib/sound';

/**
 * Browsers block AudioContext until the user interacts. This component
 * mounts a one-shot listener that unlocks audio on the first pointer/key
 * event, kicks off the ambient music pad, and wires the page-visibility
 * lifecycle so the music pauses when the tab is hidden.
 */
export function SoundProvider() {
  useEffect(() => {
    bindAmbientLifecycle();
    let done = false;
    const unlock = () => {
      if (done) return;
      done = true;
      unlockSound();
      if (isSoundEnabled()) startAmbient();
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
