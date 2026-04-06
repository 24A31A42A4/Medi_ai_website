import { useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger once (safe to call multiple times)
gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollTrigger
 *
 * Returns `registerSection(ref, onEnter, onLeave, options)`.
 *
 * When 40 % of the section enters the viewport, `onEnter` fires.
 * When it leaves, `onLeave` fires.
 */
export function useScrollTrigger() {
  // Refresh ScrollTrigger on window resize (debounced by GSAP internally)
  useEffect(() => {
    ScrollTrigger.refresh();
    return () => {
      // Kill all triggers on unmount to prevent memory leaks
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const registerSection = useCallback(
    (ref, onEnter, onLeave, options = {}) => {
      if (!ref?.current) return;

      const trigger = ScrollTrigger.create({
        trigger: ref.current,
        start:   options.start   ?? 'top 60%',   // section top hits 60 % viewport = 40 % in
        end:     options.end     ?? 'bottom 40%',
        onEnter:      onEnter ?? (() => {}),
        onEnterBack:  onEnter ?? (() => {}),
        onLeaveBack:  onLeave ?? (() => {}),
        onLeave:      () => {}, // Fixed fast-scroll bug: do not fire onLeave forward
        ...options,
      });

      return () => trigger.kill();
    },
    []
  );

  return { registerSection };
}
