import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * BrushSection – one of three sections (buddy | luna | batman).
 * Animates in on scroll via GSAP. Theme switch handled by parent via useScrollTrigger.
 *
 * Props:
 *   id        – section id (string)
 *   theme     – 'buddy' | 'luna' | 'batman'
 *   headline  – main heading text
 *   body      – paragraph body text
 *   features  – string[]
 *   Bot       – React component for the bot illustration
 *   reverse   – boolean, flips layout
 */
export default function BrushSection({ id, theme, headline, body, features = [], Bot, reverse = false, cursorX = 0, cursorY = 0 }) {
  const sectionRef  = useRef(null);
  const contentRef  = useRef(null);
  const botRef      = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Container slides & fades
      gsap.from(contentRef.current, {
        x: reverse ? 40 : -40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top 65%',
          toggleActions: 'restart none none none',
        },
      });

      // Bot floats in with scale
      gsap.from(botRef.current, {
        x: reverse ? -40 : 40,
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        delay: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top 65%',
          toggleActions: 'restart none none none',
        },
      });

      // Stagger features
      if (contentRef.current) {
        const listItems = contentRef.current.querySelectorAll('li');
        if (listItems.length) {
          gsap.from(listItems, {
            x: -20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            delay: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              toggleActions: 'restart none none none',
            },
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reverse]);

  const accentColors = {
    buddy:  '#00E5FF',
    luna:   '#FF69B4',
    batman: '#FFD700',
  };
  const accent = accentColors[theme] ?? '#00E5FF';

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 60% at ${reverse ? '30%' : '70%'} 50%, var(--accent-glow) 0%, transparent 70%)`,
        }}
      />

      <div
        className={`relative z-10 w-full max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${reverse ? 'md:[&>:first-child]:order-2' : ''}`}
      >
        {/* Copy */}
        <div ref={contentRef} className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <div className="mb-6">
            <span
              className="inline-block px-5 py-1.5 rounded-full text-xs font-800 tracking-[0.2em] uppercase"
              style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}33` }}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)} Edition
            </span>
          </div>

          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-900 leading-[1.05] tracking-tight mb-8"
            style={{ color: 'var(--text)' }}
          >
            {headline}
          </h2>

          <p
            className="text-base md:text-lg lg:text-xl font-400 leading-relaxed mb-10 max-w-lg"
            style={{ color: 'var(--text)', opacity: 0.65 }}
          >
            {body}
          </p>

          {features.length > 0 && (
            <ul className="space-y-4 inline-flex flex-col items-start text-left w-auto">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-4 font-700 text-base" style={{ color: 'var(--text)' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${accent}15`, border: `1px solid ${accent}33` }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
                    />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bot Presentation Area */}
        <div ref={botRef} className="flex justify-center relative w-full aspect-square max-w-md mx-auto">
          {/* Accent bloom under the bot */}
          <div
            className="absolute inset-0 rounded-full blur-[80px]"
            style={{ background: `color-mix(in srgb, ${accent} 25%, transparent)`, transform: 'scale(1.1)' }}
          />
          
          {/* Canvas container */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {Bot && <Bot size={340} cursorX={cursorX} cursorY={cursorY} />}
          </div>
        </div>
      </div>
    </section>
  );
}
