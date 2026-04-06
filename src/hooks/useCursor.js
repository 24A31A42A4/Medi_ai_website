import { useEffect, useRef, useCallback } from 'react';

/**
 * Tracks global mouse / touch / gyro position — normalized -1..1.
 *
 * Returns a STABLE REF object { current: { x, y } } instead of React state.
 * This avoids triggering 60fps re-renders across the entire component tree.
 * Bot components read from propsRef which already uses refs internally,
 * so they get smooth tracking without re-renders.
 */
export function useCursor() {
  const rawRef    = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const outputRef = useRef({ x: 0, y: 0 });
  const rafRef    = useRef(null);

  useEffect(() => {
    const LERP = 0.08;

    const handleMove = (e) => {
      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      rawRef.current.x = (clientX / window.innerWidth)  * 2 - 1;
      rawRef.current.y = (clientY / window.innerHeight) * 2 - 1;
    };

    const handleOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return;
      rawRef.current.x = Math.max(-1, Math.min(1, e.gamma / 45));
      rawRef.current.y = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
    };

    const tick = () => {
      const s = smoothRef.current;
      const r = rawRef.current;

      s.x += (r.x - s.x) * LERP;
      s.y += (r.y - s.y) * LERP;

      // Mutate the output ref directly — no setState, no re-renders
      outputRef.current.x = s.x;
      outputRef.current.y = s.y;

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return outputRef; // { current: { x, y } }  — stable ref, never triggers re-render
}
