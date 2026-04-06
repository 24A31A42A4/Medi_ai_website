import React, { useEffect, useState } from 'react';

export default function PageTransition() {
  const [mounted, setMounted] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Check if played this session
    const hasPlayed = sessionStorage.getItem('denty_intro_played');
    
    if (hasPlayed) {
      setMounted(false);
      return;
    }

    // Play animation
    sessionStorage.setItem('denty_intro_played', 'true');
    
    // Start split animation after 100ms
    const timer1 = setTimeout(() => {
      setAnimating(true);
    }, 100);

    // Unmount after animation completes (800ms)
    const timer2 = setTimeout(() => {
      setMounted(false);
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none flex flex-col">
      {/* Top Half */}
      <div 
        className="w-full h-1/2"
        style={{ 
          background: 'var(--accent)',
          transform: animating ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)'
        }}
      />
      {/* Bottom Half */}
      <div 
        className="w-full h-1/2"
        style={{ 
          background: 'var(--accent)',
          transform: animating ? 'translateY(100%)' : 'translateY(0)',
          transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)'
        }}
      />
    </div>
  );
}
