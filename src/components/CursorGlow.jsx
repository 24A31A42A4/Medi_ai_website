import React, { useEffect, useRef, useState } from 'react';

export default function CursorGlow() {
  const cursorRef = useRef(null);
  const [visible, setVisible] = useState(false);
  
  const targetX = useRef(window.innerWidth / 2);
  const targetY = useRef(window.innerHeight / 2);
  const currentX = useRef(window.innerWidth / 2);
  const currentY = useRef(window.innerHeight / 2);

  useEffect(() => {
    // Only render on desktop
    if (window.innerWidth <= 768) return;
    
    // Initial display
    setTimeout(() => setVisible(true), 500);

    const onMouseMove = (e) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      if (!visible) setVisible(true);
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    const onMouseEnter = () => {
      setVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    let animationFrame;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const updateCursor = () => {
      currentX.current = lerp(currentX.current, targetX.current, 0.15);
      currentY.current = lerp(currentY.current, targetY.current, 0.15);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(calc(${currentX.current}px - 50%), calc(${currentY.current}px - 50%))`;
      }

      animationFrame = requestAnimationFrame(updateCursor);
    };

    animationFrame = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrame);
    };
  }, [visible]);

  if (window.innerWidth <= 768) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '20px',
        height: '20px',
        background: 'var(--accent)',
        opacity: visible ? 0.5 : 0,
        filter: 'blur(10px)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'opacity 0.3s ease',
        willChange: 'transform'
      }}
    />
  );
}
