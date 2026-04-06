import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ZeroLogo from './ZeroLogo';

gsap.registerPlugin(ScrollTrigger);

/* Inject keyframes once */
if (typeof document !== 'undefined' && !document.getElementById('sku-style')) {
  const s = document.createElement('style');
  s.id = 'sku-style';
  s.textContent = `
    @keyframes skuFloat {
      0%,100% { transform: translate3d(0, 0px, 0) rotate(0deg); }
      33%     { transform: translate3d(-4px, -14px, 0) rotate(-1deg); }
      66%     { transform: translate3d(3px, -8px, 0) rotate(0.7deg); }
    }
    @keyframes skuGlow {
      0%,100% { opacity: 0.25; }
      50%      { opacity: 0.55; }
    }
    @keyframes orderRingPulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.75; }
      50%       { transform: translate(-50%, -50%) scale(1.14); opacity: 0.2; }
    }
    @keyframes orderRingPulse2 {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
      50%       { transform: translate(-50%, -50%) scale(1.28); opacity: 0.1; }
    }
    @keyframes orderRingPulse3 {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
      50%       { transform: translate(-50%, -50%) scale(1.45); opacity: 0.05; }
    }
    @keyframes orderBtnShimmer {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes specPulse {
      0%, 100% { box-shadow: 0 0 0 0 var(--spec-glow); }
      50% { box-shadow: 0 0 16px 4px var(--spec-glow); }
    }
  `;
  document.head.appendChild(s);
}

export default function BrushShowcase({
  theme,
  brushSrc,
  tag,
  price,
  headline,
  body,
  pills = [],
  glowColor,
  Bot,
  reverse = false,
  onEnter,
  cursorRef,
}) {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const tagRef = useRef(null);
  const wordsRef = useRef([]);
  const bodyRef = useRef(null);
  const pillsRef = useRef([]);
  const botRef = useRef(null);
  // Store onEnter in a ref so the GSAP useEffect doesn't re-run
  // when the parent re-renders (which creates a new onEnter function reference).
  // Without this, every theme change → re-render → new onEnter → useEffect cleanup
  // destroys all GSAP animations (blink to opacity:0) then recreates them.
  const onEnterRef = useRef(onEnter);
  useEffect(() => { onEnterRef.current = onEnter; }, [onEnter]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        onEnter: () => onEnterRef.current?.(),
        onEnterBack: () => onEnterRef.current?.(),
      });

      const opts = {
        scrollTrigger: {
          trigger: section,
          start: 'top 62%',
          toggleActions: 'restart none none none',
        },
      };

      /* Card entrance */
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', ...opts },
      );

      /* Tag + price */
      gsap.fromTo(tagRef.current,
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', ...opts },
      );

      /* Headline words */
      gsap.fromTo(wordsRef.current.filter(Boolean),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, stagger: 0.07, delay: 0.1, duration: 0.45, ease: 'power2.out', ...opts },
      );

      /* Body text */
      gsap.fromTo(bodyRef.current,
        { opacity: 0, y: 8 },
        { opacity: 0.72, y: 0, delay: 0.3, duration: 0.5, ease: 'power2.out', ...opts },
      );

      /* Spec pills — clean slide-in from right with stagger */
      const pillOpts = {
        scrollTrigger: {
          trigger: section,
          start: 'top 45%',
          toggleActions: 'restart none none none',
        },
      };

      gsap.fromTo(pillsRef.current.filter(Boolean),
        { x: 80, opacity: 0, scale: 0.85 },
        {
          x: 0, opacity: 1, scale: 1,
          stagger: 0.15, delay: 0.3,
          duration: 0.7, ease: 'back.out(1.4)',
          ...pillOpts,
        }
      );

      /* Bot entrance */
      gsap.fromTo(botRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, delay: 0.2, duration: 0.7, ease: 'power2.out', ...opts },
      );
    }, section);

    return () => ctx.revert();
  }, [reverse]);

  const isBatman = theme === 'batman';
  const isLuna = theme === 'luna';
  const words = headline.split(' ');

  /* ── Premium product card ── */
  const ProductCard = (
    <div ref={cardRef} className="flex-none md:flex-1 flex items-center justify-center opacity-0 w-full max-w-[340px] md:max-w-none" style={{ flexShrink: 0 }}>
      <div
        className="relative flex flex-col"
        style={{
          width: '100%',
          maxWidth: 340,
          flexShrink: 0,
          height: 'min(580px, 75vh)',
          borderRadius: 32,
          background: isBatman
            ? 'linear-gradient(155deg, #1e1e1e 0%, #0c0c0c 50%, #1a1a1a 100%)'
            : isLuna
              ? 'linear-gradient(155deg, #fff8fb 0%, #fde8f0 50%, #fad0e2 100%)'
              : 'linear-gradient(155deg, #f8fcff 0%, #e4f6fa 50%, #d0eef5 100%)',
          boxShadow: isBatman
            ? `0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px #2a2a2a, inset 0 1px 0 rgba(255,255,255,0.05), 0 0 40px ${glowColor}18`
            : `0 20px 56px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.7), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 40px ${glowColor}18`,
          border: isBatman ? '1px solid #2a2a2a' : '1px solid rgba(255,255,255,0.65)',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        }}
      >
        {/* Gloss overlay */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 32, pointerEvents: 'none', zIndex: 5,
          background: isBatman
            ? 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 40%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 40%)',
        }} />

        {/* Subtle glow behind brush */}
        <div style={{
          position: 'absolute',
          width: 180, height: 300, borderRadius: '50%',
          background: `radial-gradient(ellipse at center, ${glowColor}40 0%, transparent 65%)`,
          top: '40%', left: '35%', transform: 'translate(-50%, -50%)',
          animation: 'skuGlow 4s ease-in-out infinite', pointerEvents: 'none',
        }} />

        {/* Theme badge circle */}
        <div style={{
          position: 'absolute', top: 22, right: 22,
          width: 36, height: 36, borderRadius: '50%',
          background: isBatman
            ? 'radial-gradient(circle at 35% 35%, #ffe066, #b8860b)'
            : isLuna
              ? 'radial-gradient(circle at 35% 35%, #ff69b4, #c2185b)'
              : 'radial-gradient(circle at 35% 35%, #00e5ff, #0087b8)',
          boxShadow: `0 0 14px ${glowColor}66`,
          zIndex: 10,
        }} />

        {/* ── Brush image area ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: '5%',
          paddingRight: 0,
          paddingTop: 16,
          paddingBottom: 0,
          position: 'relative',
          minHeight: 0,
        }}>
          <img
            ref={imgRef}
            src={brushSrc}
            alt={`${tag} Edition Brush`}
            draggable={false}
            style={{
              position: 'relative', zIndex: 2,
              maxHeight: '95%',
              maxWidth: '55%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              animation: 'skuFloat 8s ease-in-out infinite',
              filter: isBatman
                ? 'drop-shadow(0 8px 20px rgba(0,0,0,0.5)) drop-shadow(0 0 12px rgba(255,215,0,0.2))'
                : isLuna
                  ? 'drop-shadow(0 8px 20px rgba(255,105,180,0.25)) drop-shadow(0 0 8px rgba(255,105,180,0.1))'
                  : 'drop-shadow(0 8px 20px rgba(0,180,220,0.2)) drop-shadow(0 0 8px rgba(0,229,255,0.1))',
              userSelect: 'none',
            }}
          />
        </div>

        {/* ── ZER+ Logo at bottom ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px 0 20px 0',
          zIndex: 30,
          flexShrink: 0,
        }}>
          <ZeroLogo size={70} fill={isBatman ? '#FFF' : '#000'} />
        </div>

        {/* ── Spec pills — floating badges on right ── */}
        <div className="absolute z-20 pointer-events-none flex flex-col items-end justify-center gap-4" style={{
          top: 0,
          bottom: 0,
          right: 18,
        }}>
          {pills.map((p, i) => (
            <div
              key={i}
              ref={el => (pillsRef.current[i] = el)}
              className="relative opacity-0"
              style={{
                '--spec-glow': `${glowColor}40`,
                animation: `specPulse 3s ease-in-out infinite ${i * 0.5}s`,
                borderRadius: 9999,
              }}
            >
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 9999,
                border: 'none',
                background: isBatman
                  ? 'rgba(18,18,18,0.92)'
                  : 'rgba(255,255,255,0.92)',
                color: isBatman ? '#FFF' : '#1a1a1a',
                fontFamily: "'Inter', 'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: 12.5,
                whiteSpace: 'nowrap',
                letterSpacing: '0.02em',
                boxShadow: `0 0 8px ${glowColor}50, 0 0 20px ${glowColor}25, 0 0 40px ${glowColor}15, 0 2px 8px rgba(0,0,0,0.1)`,
                backdropFilter: 'blur(12px)',
                transition: 'all 0.3s ease',
              }}>
                <span style={{
                  fontSize: 15,
                  filter: `drop-shadow(0 0 4px ${glowColor})`,
                }}>{p.icon}</span>
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── Text column ── */
  const TextCol = (
    <div className="flex-none md:flex-1 w-full flex flex-col justify-center items-center md:items-start text-center md:text-left gap-5 py-10 md:py-0" style={{ minWidth: 0, flexShrink: 0 }}>

      <div ref={tagRef} className="flex flex-col gap-2 items-center md:items-start" style={{ opacity: 0 }}>
        <span style={{
          fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: glowColor, fontFamily: "'Inter', sans-serif"
        }}>
          {tag} Edition
        </span>
        <span style={{
          fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Inter', sans-serif",
          color: 'var(--text)', marginTop: -4, letterSpacing: '-0.02em',
        }}>
          {price}
        </span>
      </div>

      <h2 style={{
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 900,
        fontSize: 'clamp(2rem, 5vw, 3.6rem)',
        lineHeight: 1.08,
        color: 'var(--text)',
        margin: 0,
      }}>
        {words.map((w, i) => (
          <span key={i} ref={el => (wordsRef.current[i] = el)} style={{
            display: 'inline-block', marginRight: '0.25em', opacity: 0,
          }}>{w}</span>
        ))}
      </h2>

      <p ref={bodyRef} style={{
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 400, fontSize: 17, lineHeight: 1.7,
        color: 'var(--text)', opacity: 0, maxWidth: 380,
      }}>
        {body}
      </p>

      {/* Bot */}
      <div ref={botRef} className="relative mt-8 md:mt-12 flex justify-center w-full" style={{ opacity: 0 }}>
        <div className="absolute rounded-full blur-[80px]" style={{
          top: '10%', left: '20%', right: '20%', bottom: '10%',
          background: `color-mix(in srgb, ${glowColor} 25%, transparent)`,
          transform: 'scale(1.1)', pointerEvents: 'none'
        }} />
        <div className="relative z-10 w-full flex justify-center">
          {Bot && <Bot size={280} cursorRef={cursorRef} />}
        </div>
      </div>

      {/* ── ORDER NOW BUTTON ── */}
      <div
        className="mt-12 md:mt-16 flex justify-center w-full relative z-30"
        style={{ opacity: 0, animation: 'orderBtnShimmer 0s ease forwards 1s, none', animationFillMode: 'forwards', transition: 'opacity 0.6s ease 1s', willChange: 'opacity' }}
        ref={el => { if (el) setTimeout(() => { el.style.opacity = '1'; }, 1000); }}
      >
        <div className="flex justify-center mt-8 w-full px-6">
          <div className="relative group w-full md:w-[400px]">

            {/* Ring 1 */}
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              width: 'calc(100% + 20px)', height: 'calc(100% + 20px)',
              borderRadius: 999,
              border: `2px solid ${glowColor}`,
              boxShadow: `0 0 20px 4px ${glowColor}80`,
              animation: 'orderRingPulse 1.8s ease-in-out infinite',
              pointerEvents: 'none', zIndex: 0,
            }} />
            {/* Ring 2 */}
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              width: 'calc(100% + 44px)', height: 'calc(100% + 44px)',
              borderRadius: 999,
              border: `1.5px solid ${glowColor}60`,
              boxShadow: `0 0 40px 8px ${glowColor}50`,
              animation: 'orderRingPulse2 1.8s ease-in-out infinite 0.3s',
              pointerEvents: 'none', zIndex: 0,
            }} />
            {/* Ring 3 */}
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              width: 'calc(100% + 72px)', height: 'calc(100% + 72px)',
              borderRadius: 999,
              border: `1px solid ${glowColor}35`,
              boxShadow: `0 0 60px 12px ${glowColor}30`,
              animation: 'orderRingPulse3 1.8s ease-in-out infinite 0.6s',
              pointerEvents: 'none', zIndex: 0,
            }} />
            {/* Glow blob */}
            <div style={{
              position: 'absolute', inset: '-8px', borderRadius: 999,
              background: `radial-gradient(ellipse at center, ${glowColor}90 0%, ${glowColor}50 40%, transparent 75%)`,
              filter: 'blur(18px)', opacity: 0.85,
              pointerEvents: 'none', zIndex: 0,
              animation: 'orderRingPulse 2.4s ease-in-out infinite',
            }} />
            {/* Big spread */}
            <div style={{
              position: 'absolute', inset: '-24px', borderRadius: 999,
              background: `radial-gradient(ellipse at center, ${glowColor}40 0%, transparent 65%)`,
              filter: 'blur(32px)', opacity: 0.9,
              pointerEvents: 'none', zIndex: 0,
            }} />

            <button
              onClick={() => { window.scrollTo(0, 0); window.location.href = `/product/brush-${theme}`; }}
              className="relative w-full flex items-center justify-center gap-4 px-10 md:px-16 py-5 md:py-[22px] rounded-[28px] transition-all duration-500 hover:-translate-y-1 active:scale-[0.98]"
              style={{
                zIndex: 1,
                backgroundColor: isBatman ? '#FFD700' : isLuna ? '#FF2D75' : '#00CFFF',
                backgroundImage: isBatman
                  ? 'linear-gradient(135deg, #FFD700 0%, #B8860B 60%, #1a1a1a 100%)'
                  : isLuna
                    ? 'linear-gradient(135deg, #FF2D75 0%, #C2185B 100%)'
                    : 'linear-gradient(135deg, #00CFFF 0%, #007CF0 100%)',
                backgroundSize: '200% 200%',
                animation: 'orderBtnShimmer 3s ease infinite',
                border: 'none',
                color: '#ffffff',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                boxShadow: `
                  0 0 0 2px ${glowColor}80,
                  0 8px 32px ${glowColor}70,
                  0 24px 60px ${glowColor}50,
                  0 40px 100px ${glowColor}30,
                  inset 0 1px 0 rgba(255,255,255,0.2)
                `,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
                e.currentTarget.style.boxShadow = `0 0 0 3px ${glowColor}, 0 12px 40px ${glowColor}90, 0 28px 80px ${glowColor}70, 0 50px 120px ${glowColor}50, inset 0 2px 0 rgba(255,255,255,0.3)`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = `0 0 0 2px ${glowColor}80, 0 8px 32px ${glowColor}70, 0 24px 60px ${glowColor}50, 0 40px 100px ${glowColor}30, inset 0 1px 0 rgba(255,255,255,0.2)`;
              }}
            >
              <span className="font-[900] text-[20px] md:text-[24px] tracking-widest uppercase"
                    style={{ fontFamily: "'Nunito', sans-serif" }}>
                ORDER NOW
              </span>
              <span className="font-[900] text-[24px] md:text-[28px] leading-none transition-transform duration-500 group-hover:translate-x-3">
                →
              </span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative', width: '100%', minHeight: '100vh',
        background: 'var(--bg)', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
        transition: 'none',
      }}
    >
      {/* Ambient radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 50% 50% at ${reverse ? '72%' : '28%'} 50%, ${glowColor}12 0%, transparent 60%)`,
        transition: 'none',
      }} />
      {/* Top separator line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent 0%, ${glowColor}40 50%, transparent 100%)`,
      }} />
      {/* Content container */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: 1200,
        margin: '0 auto', padding: '40px 20px',
        display: 'flex', flexDirection: 'column',
        gap: 36, alignItems: 'center', justifyContent: 'space-between',
      }}
        className="md:flex-row"
      >
        {reverse
          ? <>{TextCol}{ProductCard}</>
          : <>{ProductCard}{TextCol}</>
        }
      </div>
    </section>
  );
}
