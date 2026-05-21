'use client';

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  type ReactElement,
  type ReactNode
} from 'react';

interface Props {
  children: ReactNode;
  strength?: number; // 0..1, default 0.35
  radius?: number; // px, default 90
}

/**
 * Magnetic hover wrapper. The single child element subtly follows the
 * cursor when it's within `radius` of the element. Best on primary CTAs.
 *
 * Implementation detail: we don't add an extra div so layout/RTL stays
 * untouched — we clone the child and inject our own ref + style.
 */
export function Magnetic({ children, strength = 0.35, radius = 90 }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let active = false;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - (rect.left + rect.width / 2);
      const my = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(mx, my);
      if (dist < radius + Math.max(rect.width, rect.height) / 2) {
        active = true;
        tx = mx * strength;
        ty = my * strength;
      } else if (active) {
        tx = 0;
        ty = 0;
      }
    };
    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [strength, radius]);

  const child = Children.only(children);
  if (!isValidElement(child)) return <>{children}</>;
  return cloneElement(child as ReactElement, {
    ref: (node: HTMLElement) => {
      ref.current = node;
      const r = (child as any).ref;
      if (typeof r === 'function') r(node);
      else if (r && 'current' in r) r.current = node;
    },
    style: { willChange: 'transform', ...(child.props.style || {}) }
  });
}
