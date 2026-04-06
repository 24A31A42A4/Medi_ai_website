import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    title: 'AI Diagnostics',
    body: 'Microscopic precision detection before issues ever hurt.',
    glow: '#00F0FF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12Z" />
        <path d="M12 8A4 4 0 1 0 12 16A4 4 0 1 0 12 8Z" />
        <path d="M12 12L12 12.01" />
      </svg>
    )
  },
  {
    title: 'Smart Pacing Guide',
    body: 'Perfect quadrant pacing. The AI dances with your movements.',
    glow: '#A78BFA',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  },
  {
    title: 'Health Streaks',
    body: 'Watch your daily dental health score grow with consistency.',
    glow: '#22C55E',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    )
  },
  {
    title: 'Food Impact Scanner',
    body: 'Snap a photo. Know instantly if your meal helps or hurts.',
    glow: '#F59E0B',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
      </svg>
    )
  },
  {
    title: 'Global Leaderboards',
    body: 'Compete safely with family and friends on dental health.',
    glow: '#F43F5E',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    )
  },
  {
    title: '24/7 DENTY AI',
    body: 'Your dedicated dental AI answers detailed questions instantly.',
    glow: '#3B82F6',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    )
  },
];

export default function FeaturesGrid() {
  const sectionRef = useRef(null);
  const btnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Use CSS class to select cards instead of a ref array.
      // Ref arrays can hold stale DOM nodes in React 18 strict mode, causing GSAP to animate orphaned elements.
      gsap.from('.feature-card', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      // Buy Button animation
      gsap.from(btnRef.current, {
        y: 20, opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pb-[100px] md:pb-[150px] px-5 overflow-hidden w-full flex flex-col items-center justify-center"
      style={{ background: '#ffffff', paddingTop: '80px' }}
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center">

        {/* ULTRA-PREMIUM TYPOGRAPHY (Centered & Clean) */}
        <div className="text-center flex flex-col items-center justify-center mb-16 md:mb-24 w-full max-w-[900px]">
          <p className="font-black tracking-[0.4em] uppercase mb-6 text-[#00E0FF]" style={{ fontSize: '20px' }}>
            Feature Architecture
          </p>
          <h2 className="text-center text-[40px] md:text-[72px] font-black tracking-[-0.04em] leading-[1.05] text-[#111] mb-8 w-full">
            Everything your<br />
            {/* px-4 ensures the italic 's' curve doesn't clip, and uniform padding keeps it 100% mathematically centered */}
            <span className="text-transparent bg-clip-text italic px-4" style={{ backgroundImage: 'linear-gradient(90deg, #000 0%, #444 100%)' }}>smile needs </span>
          </h2>
          <p className="text-center text-[16px] md:text-[20px] text-[#555] font-medium leading-relaxed max-w-2xl mx-auto tracking-wide">
            A harmonious ecosystem of hardware and software, designed to elevate your daily routine into a state-of-the-art ritual.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {CARDS.map((c, i) => (
            <div
              key={i}
              className="feature-card group relative p-6 md:p-8 overflow-hidden cursor-crosshair transition-all duration-500 hover:-translate-y-1"
              style={{
                background: 'rgba(0,0,0,0.02)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '8px',
              }}
            >
              {/* Subtle accent glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(400px circle at top right, ${c.glow}, transparent)` }}
              />

              {/* Icon Container */}
              <div
                className="w-12 h-12 rounded-[6px] flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-105 shadow-sm"
                style={{ background: '#ffffff', color: c.glow, border: '1px solid rgba(0,0,0,0.06)' }}
              >
                {c.icon}
              </div>

              <div>
                <h3 className="text-[18px] md:text-[20px] font-bold text-[#111] mb-2 tracking-tight">
                  {c.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-[#555] font-medium">
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* PREMIUM CTA */}
        <div className="relative flex justify-center w-full z-20" style={{ marginTop: '-170px', paddingBottom: '100px' }} ref={btnRef}>
          <button
            onClick={() => navigate('/product/luna')}
            className="group relative flex items-center justify-center gap-3 transition-transform duration-300 active:scale-[0.98] overflow-hidden"
            style={{
              padding: '16px 36px',
              background: '#111',
              color: '#fff',
              borderRadius: '8px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
            }}
          >
            <span className="font-black text-[11px] md:text-[13px] tracking-[0.15em] uppercase z-10">Upgrade Your Smile</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 z-10 group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}
