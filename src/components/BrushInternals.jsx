import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BrushInternals({ onEnter }) {
  const containerRef = useRef(null);

  // Stabilize onEnter via ref — prevents GSAP context teardown on re-render
  const onEnterRef = useRef(onEnter);
  useEffect(() => { onEnterRef.current = onEnter; }, [onEnter]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ctx = gsap.context(() => {
      if (onEnterRef.current) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          onEnter: () => onEnterRef.current?.(),
          onEnterBack: () => onEnterRef.current?.(),
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=250%',
          scrub: 0.4,
          pin: true,
          anticipatePin: 1,
        }
      });

      // Title
      tl.to('.internals-title', { opacity: 1, y: 0, duration: 0.5 }, 0);
      tl.to('.internals-sub', { opacity: 1, y: 0, duration: 0.5 }, 0.1);

      // Progress bar
      tl.to('.progress-fill', { scaleY: 1, duration: 10, ease: 'none' }, 0);

      const layers = [
        { start: 0, duration: 1.8 },
        { start: 1.8, duration: 1.8 },
        { start: 3.6, duration: 1.5 },
        { start: 5.1, duration: 1.6 },
        { start: 6.7, duration: 1.6 },
        { start: 8.3, duration: 1.7 },
      ];

      const animateLayer = (idx) => {
        const p = layers[idx];
        const s = p.start;
        const d = p.duration;

        tl.to(`.layer-${idx + 1}`, { autoAlpha: 1, duration: d * 0.4 }, s);
        tl.to(`.line-${idx + 1}`, { strokeDashoffset: 0, autoAlpha: 1, duration: d * 0.45, ease: 'none' }, s + 0.1);
        tl.fromTo(`.label-${idx + 1}`,
          { autoAlpha: 0, x: -24 },
          { autoAlpha: 1, x: 0, duration: d * 0.45 },
          s + d * 0.25
        );
      };

      for (let i = 0; i < 6; i++) animateLayer(i);

    }, el);

    return () => ctx.revert();
  }, []);

  /* ── Layer data ─────────────────────────────────────────────── */
  const LAYERS = [
    { y: 52, color: '#60A5FA', label: 'High-Density Bristles', sub: 'Contoured multi-level nylon layers', icon: '◈' },
    { y: 168, color: '#00F0FF', label: 'Machined Steel Motor', sub: 'Precision 40,000 VPM copper-wound', icon: '⚙' },
    { y: 232, color: '#E2E8F0', label: 'IPX7 Silicone Gasket', sub: 'Airtight translucent waterproof seal', icon: '◉' },
    { y: 285, color: '#00F0FF', label: '8-Core Neural Engine', sub: 'Gold-plated fiber PCB tracking logic', icon: '◈' },
    { y: 378, color: '#22C55E', label: 'Lithium-Ion Power Cell', sub: 'Heavy duty 800mAh high-drain battery', icon: '▣' },
    { y: 455, color: '#F59353', label: 'Magnetic Induction Base', sub: 'High-efficiency pure copper coils', icon: '◎' },
  ];

  /* ── Bristle grid helpers ───────────────────────────────────── */
  const bristleRows = [];
  const rowYStart = 14;
  const rowSpacing = 8;
  for (let r = 0; r < 7; r++) {
    const isOffset = r % 2 === 1;
    const startX = isOffset ? 57 : 55;
    const count = isOffset ? 6 : 7;
    const cols = [];
    for (let c = 0; c < count; c++) {
      cols.push(startX + c * 4.8);
    }
    bristleRows.push({ y: rowYStart + r * rowSpacing, cols, offset: isOffset });
  }

  return (
    <section ref={containerRef} id="brush-internals" className="relative w-full h-screen overflow-hidden" style={{ background: '#040404' }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,240,255,0.04) 0%, transparent 70%)'
      }} />

      <div className="relative w-full h-full flex flex-col items-center justify-center">

        {/* Progress bar — left edge */}
        <div className="absolute left-[8vw] md:left-[8vw] lg:left-20 top-[22%] bottom-[6%] w-[3px] rounded-full z-20"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="progress-fill w-full h-full rounded-full origin-top scale-y-0"
            style={{ background: 'linear-gradient(to bottom, #00F0FF, #22C55E, #F59353)', boxShadow: '0 0 18px rgba(0,240,255,0.7)' }} />
        </div>

        {/* Title block */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 text-center z-30 w-full px-4">
          <h2 className="internals-title text-[28px] sm:text-[40px] md:text-[52px] text-white tracking-tight opacity-0 translate-y-4"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: '-0.03em', transform: 'translateY(16px)' }}>
            Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#0070FF]">Engineering</span>
          </h2>
          <p className="internals-sub text-sm md:text-base text-zinc-500 mt-2 tracking-widest uppercase opacity-0 translate-y-4"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: '0.15em', transform: 'translateY(16px)' }}>
            What's inside every DENTY brush
          </p>
        </div>

        {/* ═══════════ Main stage ═══════════ */}
        <div className="relative z-10 flex items-center justify-center w-full px-4" style={{ marginTop: '150px' }}>
          <div className="relative internals-stage-container" style={{ width: 'min(560px, 92vw)', height: 500 }}>

            {/* ── SVG Brush ────────────────────────────────────── */}
            <svg
              width="140" height="500"
              viewBox="0 0 140 500"
              className="absolute brush-svg"
              style={{ left: 'calc(50% - 70px)', top: 0, overflow: 'visible', filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.9))' }}
              fill="none"
            >
              <defs>
                {/* ── GRADIENTS ───────────────────────────────── */}

                {/* Matte black body — subtle studio lighting */}
                <linearGradient id="bi-body" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#080808" />
                  <stop offset="6%" stopColor="#181818" />
                  <stop offset="13%" stopColor="#333" />
                  <stop offset="18%" stopColor="#222" />
                  <stop offset="28%" stopColor="#181818" />
                  <stop offset="50%" stopColor="#141414" />
                  <stop offset="72%" stopColor="#1a1a1a" />
                  <stop offset="84%" stopColor="#2a2a2a" />
                  <stop offset="92%" stopColor="#181818" />
                  <stop offset="100%" stopColor="#0a0a0a" />
                </linearGradient>

                {/* Left-edge specular highlight */}
                <linearGradient id="bi-spec" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                  <stop offset="6%" stopColor="rgba(255,255,255,0.10)" />
                  <stop offset="16%" stopColor="rgba(255,255,255,0.02)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </linearGradient>

                {/* Gold accent ring — polished brass */}
                <linearGradient id="bi-gold-ring" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3a2800" />
                  <stop offset="8%" stopColor="#B8901E" />
                  <stop offset="18%" stopColor="#FFE88A" />
                  <stop offset="30%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#8B6914" />
                  <stop offset="68%" stopColor="#D4AF37" />
                  <stop offset="80%" stopColor="#FFE88A" />
                  <stop offset="92%" stopColor="#A07C20" />
                  <stop offset="100%" stopColor="#3a2800" />
                </linearGradient>

                {/* Brush head dark plastic */}
                <linearGradient id="bi-head" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0a0a0a" />
                  <stop offset="10%" stopColor="#252525" />
                  <stop offset="22%" stopColor="#1a1a1a" />
                  <stop offset="50%" stopColor="#202020" />
                  <stop offset="78%" stopColor="#1a1a1a" />
                  <stop offset="90%" stopColor="#252525" />
                  <stop offset="100%" stopColor="#080808" />
                </linearGradient>

                {/* Brushed steel motor */}
                <linearGradient id="bi-motor" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#08080f" />
                  <stop offset="12%" stopColor="#707580" />
                  <stop offset="20%" stopColor="#b0b5c0" />
                  <stop offset="35%" stopColor="#353a45" />
                  <stop offset="60%" stopColor="#12141c" />
                  <stop offset="80%" stopColor="#9095a0" />
                  <stop offset="94%" stopColor="#20222a" />
                  <stop offset="100%" stopColor="#454a55" />
                </linearGradient>
                <pattern id="bi-brushed" width="18" height="1.5" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="18" y2="0" stroke="#000" strokeWidth="0.6" strokeOpacity="0.5" />
                  <line x1="0" y1="0.8" x2="18" y2="0.8" stroke="#fff" strokeWidth="0.35" strokeOpacity="0.10" />
                </pattern>

                {/* Copper coil */}
                <linearGradient id="bi-copper" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#200800" />
                  <stop offset="12%" stopColor="#d87040" />
                  <stop offset="25%" stopColor="#ffd8a8" />
                  <stop offset="45%" stopColor="#803820" />
                  <stop offset="70%" stopColor="#250c00" />
                  <stop offset="88%" stopColor="#b85820" />
                  <stop offset="96%" stopColor="#351200" />
                  <stop offset="100%" stopColor="#602200" />
                </linearGradient>
                <pattern id="bi-copper-wire" width="12" height="3" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="2.8" x2="12" y2="2.8" stroke="#1c0700" strokeWidth="1" />
                  <line x1="0" y1="0.5" x2="12" y2="0.5" stroke="#fff" strokeWidth="0.35" strokeOpacity="0.45" />
                </pattern>

                {/* Battery cylinder */}
                <linearGradient id="bi-battery" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#000" />
                  <stop offset="10%" stopColor="#082810" />
                  <stop offset="20%" stopColor="#28a045" />
                  <stop offset="32%" stopColor="#0e4a1c" />
                  <stop offset="65%" stopColor="#020e04" />
                  <stop offset="85%" stopColor="#1c7a30" />
                  <stop offset="95%" stopColor="#051808" />
                  <stop offset="100%" stopColor="#092a0e" />
                </linearGradient>

                {/* PCB fiberglass */}
                <linearGradient id="bi-pcb" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#001600" />
                  <stop offset="25%" stopColor="#083808" />
                  <stop offset="45%" stopColor="#186018" />
                  <stop offset="65%" stopColor="#041c04" />
                  <stop offset="100%" stopColor="#000800" />
                </linearGradient>
                <linearGradient id="bi-gold-trace" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4a3500" />
                  <stop offset="25%" stopColor="#ffdf4d" />
                  <stop offset="35%" stopColor="#fff" />
                  <stop offset="60%" stopColor="#c48a00" />
                  <stop offset="85%" stopColor="#ffcc00" />
                  <stop offset="100%" stopColor="#3b2800" />
                </linearGradient>
                <pattern id="bi-pcb-traces" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M0 4 L8 4 M4 0 L4 8" stroke="#2a8a2a" strokeWidth="0.6" opacity="0.65" />
                  <circle cx="4" cy="4" r="1.2" fill="#ffd700" fillOpacity="0.25" />
                </pattern>

                {/* Silicone seal — translucent wet look */}
                <linearGradient id="bi-seal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.88)" />
                  <stop offset="15%" stopColor="rgba(200,220,240,0.65)" />
                  <stop offset="50%" stopColor="rgba(80,140,200,0.18)" />
                  <stop offset="85%" stopColor="rgba(200,220,255,0.45)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
                </linearGradient>

                {/* Filters */}
                <filter id="bi-led-glow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="bi-amber-glow" x="-120%" y="-120%" width="340%" height="340%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>


              {/* ═══════════════════════════════════════════════════
                   EXTERIOR SHELL — ZER+ front-facing silhouette
                  ═══════════════════════════════════════════════════ */}

              {/* ── Bristle head platform ── */}
              <rect x="52" y="6" width="36" height="72" rx="13" fill="url(#bi-head)" />
              <rect x="53" y="8" width="4" height="68" rx="2" fill="#fff" opacity="0.05" />

              {/* ── Neck ── */}
              <path d="M 58 78 L 58 126 C 58 128 60 130 64 131 L 76 131 C 80 130 82 128 82 126 L 82 78"
                fill="url(#bi-head)" />
              <rect x="59" y="78" width="2.5" height="48" fill="#fff" opacity="0.035" />

              {/* ── Gold ring ── */}
              <rect x="44" y="129" width="52" height="7" rx="3.5" fill="url(#bi-gold-ring)" />
              <rect x="46" y="130" width="48" height="1.8" rx="1" fill="#FFE88A" opacity="0.45" />
              <rect x="46" y="134.5" width="48" height="0.8" rx="1" fill="#3a2800" opacity="0.55" />

              {/* ── Main body ── */}
              <path d="M 44 136 L 44 462 C 44 478 52 486 70 486 C 88 486 96 478 96 462 L 96 136 Z"
                fill="url(#bi-body)" />
              {/* Left edge highlight */}
              <path d="M 44 136 L 44 462 C 44 478 52 486 70 486"
                fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.2" />
              {/* Right edge shadow */}
              <path d="M 96 136 L 96 462 C 96 478 88 486 70 486"
                fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.8" />
              {/* Specular overlay */}
              <path d="M 46 138 L 46 460 C 46 476 53 484 70 484 C 87 484 94 476 94 460 L 94 138 Z"
                fill="url(#bi-spec)" />


              {/* ═══════════════════════════════════════════════════
                   EXTERIOR SURFACE DETAILS — matching ZER+ image
                  ═══════════════════════════════════════════════════ */}

              {/* ── Power button ring ── */}
              <circle cx="70" cy="165" r="8.5" fill="none" stroke="#444" strokeWidth="1" />
              <path d="M 70 157.5 L 70 162" stroke="#555" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="70" cy="165" r="6.5" fill="none" stroke="#333" strokeWidth="0.5" />

              {/* ── ZER+ text ── */}
              <text x="70" y="188" fill="#777" fontSize="9.5" fontFamily="'Arial', sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="2.5">ZER+</text>

              {/* ── Indicator panel (LED status, NOT OLED) ── */}
              <rect x="57" y="198" width="26" height="22" rx="2.5" fill="#080808" stroke="#D4AF37" strokeWidth="0.7" />
              {/* Amber cat-face indicator LEDs */}
              <g filter="url(#bi-amber-glow)">
                {/* Left eye — angry V shape */}
                <path d="M 63 207 L 65 205 L 67 207" stroke="#FFB000" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {/* Right eye — angry V shape */}
                <path d="M 73 207 L 75 205 L 77 207" stroke="#FFB000" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {/* Mouth */}
                <path d="M 66 212 C 68 214 72 214 74 212" stroke="#FFB000" strokeWidth="0.9" strokeLinecap="round" fill="none" />
              </g>

              {/* ── Physical button ── */}
              <circle cx="70" cy="235" r="5" fill="#151515" stroke="#333" strokeWidth="0.8" />
              <circle cx="70" cy="235" r="3.2" fill="#111" />
              <circle cx="68.5" cy="233.5" r="1" fill="#fff" opacity="0.06" />

              {/* ── Mode selection icons ── */}
              {/* Gentle / Moon */}
              <path d="M 68 258 C 64.5 258 62.5 261.5 62.5 264.5 C 62.5 267.5 64.5 271 68 271 C 65.5 270 64 268 64 264.5 C 64 261 65.5 259 68 258" fill="#555" opacity="0.65" />
              {/* Clean — single wave */}
              <path d="M 63 280 C 65.5 277.5 68 277.5 70 280 C 72 282.5 74.5 282.5 77 280" stroke="#555" strokeWidth="1" fill="none" opacity="0.55" />
              {/* Deep Clean — double wave */}
              <path d="M 63 294 C 65.5 291.5 68 291.5 70 294 C 72 296.5 74.5 296.5 77 294" stroke="#555" strokeWidth="1" fill="none" opacity="0.45" />
              <path d="M 63 299 C 65.5 296.5 68 296.5 70 299 C 72 301.5 74.5 301.5 77 299" stroke="#555" strokeWidth="1" fill="none" opacity="0.45" />
              {/* Max — triple wave */}
              <path d="M 63 312 C 65.5 309.5 68 309.5 70 312 C 72 314.5 74.5 314.5 77 312" stroke="#555" strokeWidth="1" fill="none" opacity="0.35" />
              <path d="M 63 317 C 65.5 314.5 68 314.5 70 317 C 72 319.5 74.5 319.5 77 317" stroke="#555" strokeWidth="1" fill="none" opacity="0.35" />
              <path d="M 63 322 C 65.5 319.5 68 319.5 70 322 C 72 324.5 74.5 324.5 77 322" stroke="#555" strokeWidth="1" fill="none" opacity="0.35" />


              {/* ═══════════════════════════════════════════════════
                   INTERNAL LAYERS — revealed on scroll
                  ═══════════════════════════════════════════════════ */}

              {/* ── Layer 1: Bristle Head Detail ─────────────── */}
              <g className="layer-1" style={{ opacity: 0, visibility: 'hidden' }}>
                {bristleRows.map((row, ri) =>
                  row.cols.map((cx, ci) => {
                    // Checkerboard-ish pattern: alternate white and black
                    const isWhite = (ri + ci) % 2 === 0;
                    const baseColor = isWhite ? '#e8e8e8' : '#2a2a2a';
                    const highlightColor = isWhite ? '#ffffff' : '#4a4a4a';
                    return (
                      <g key={`br-${ri}-${ci}`}>
                        {/* Bristle tuft base */}
                        <circle cx={cx} cy={row.y} r="1.8" fill={baseColor} />
                        {/* Top specular highlight */}
                        <circle cx={cx - 0.3} cy={row.y - 0.4} r="0.8" fill={highlightColor} opacity="0.55" />
                        {/* Shadow ring */}
                        <circle cx={cx} cy={row.y} r="1.8" fill="none" stroke="#000" strokeWidth="0.3" opacity="0.25" />
                      </g>
                    );
                  })
                )}
                {/* Bristle base plate */}
                <rect x="52" y="72" width="36" height="3" rx="1" fill="#111" />
                <rect x="53" y="72" width="34" height="1" rx="0.5" fill="#fff" opacity="0.06" />
              </g>

              {/* ── Layer 2: Sonic Motor Assembly ────────────── */}
              <g className="layer-2" style={{ opacity: 0, visibility: 'hidden' }}>
                {/* Motor shaft */}
                <rect x="66" y="98" width="8" height="30" rx="1.5" fill="url(#bi-motor)" />
                <rect x="66" y="98" width="8" height="30" rx="1.5" fill="url(#bi-brushed)" />
                <rect x="67" y="98" width="2" height="30" fill="#fff" opacity="0.35" />
                {/* Eccentric weight */}
                <ellipse cx="74" cy="106" rx="4" ry="3" fill="url(#bi-motor)" stroke="#444" strokeWidth="0.4" />

                {/* Motor housing */}
                <rect x="50" y="142" width="40" height="52" rx="3" fill="url(#bi-motor)" />
                <rect x="50" y="142" width="40" height="52" rx="3" fill="url(#bi-brushed)" />
                {/* Specular left edge */}
                <rect x="51" y="143" width="3" height="50" fill="#fff" opacity="0.28" />
                {/* Lamination lines */}
                {[150, 158, 166, 174, 182].map(y => (
                  <rect key={y} x="50" y={y} width="40" height="2.2" fill="#080810" opacity="0.78" />
                ))}
                {/* Copper windings */}
                {[153, 163, 175].map(y => (
                  <g key={y}>
                    <rect x="56" y={y} width="28" height="8" fill="url(#bi-copper)" />
                    <rect x="56" y={y} width="28" height="8" fill="url(#bi-copper-wire)" />
                  </g>
                ))}
                {/* Rotor magnets (center) */}
                <rect x="65" y="144" width="10" height="48" rx="1.5" fill="#1a1a22" stroke="#333" strokeWidth="0.4" />
                <text x="70" y="172" fill="#556" fontSize="3.8" fontFamily="monospace" textAnchor="middle" letterSpacing="1">N S</text>
              </g>

              {/* ── Layer 3: IPX7 Waterproof Seal ────────────── */}
              <g className="layer-3" style={{ opacity: 0, visibility: 'hidden' }}>
                {/* Housing ring */}
                <rect x="48" y="226" width="44" height="10" rx="2" fill="url(#bi-head)" />
                {/* Silicone gasket */}
                <rect x="46" y="228" width="48" height="6" rx="3" fill="url(#bi-seal)" />
                <rect x="46" y="228" width="48" height="6" rx="3" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.6" />
                {/* Wet highlight */}
                <rect x="48" y="229" width="44" height="1.5" rx="1" fill="#fff" opacity="0.7" />
                {/* Bottom shadow */}
                <rect x="50" y="233" width="40" height="0.6" fill="#000" opacity="0.25" />
              </g>

              {/* ── Layer 4: Smart Control PCB ───────────────── */}
              <g className="layer-4" style={{ opacity: 0, visibility: 'hidden' }}>
                {/* PCB board */}
                <rect x="50" y="248" width="40" height="56" rx="2" fill="url(#bi-pcb)" stroke="#061a06" strokeWidth="1.2" />
                <rect x="50" y="248" width="40" height="56" fill="url(#bi-pcb-traces)" opacity="0.38" />

                {/* Gold edge contacts */}
                {[252, 260, 268, 276, 284, 292].map(y => (
                  <g key={y}>
                    <rect x="88" y={y} width="3.2" height="3.8" fill="url(#bi-gold-trace)" />
                    <rect x="49" y={y} width="3.2" height="3.8" fill="url(#bi-gold-trace)" />
                  </g>
                ))}

                {/* Main MCU chip */}
                <rect x="56" y="258" width="28" height="20" rx="1.5" fill="#060606" stroke="#2a2a2a" strokeWidth="0.6" />
                <rect x="58" y="260" width="24" height="16" fill="#0d0d0d" />
                {/* Pin-1 dot */}
                <circle cx="59" cy="261" r="1" fill="#444" />
                <text x="70" y="271" fill="#555" fontSize="4.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">ARM-M4</text>

                {/* Bluetooth chip */}
                <rect x="58" y="282" width="14" height="10" rx="1" fill="#111" stroke="#333" strokeWidth="0.6" />
                <text x="65" y="289.5" fill="#444" fontSize="3.5" fontFamily="monospace" textAnchor="middle">BLE</text>

                {/* Ceramic capacitor */}
                <rect x="78" y="284" width="6" height="12" rx="1" fill="#1a1a1a" stroke="#444" strokeWidth="0.35" />

                {/* Status LED */}
                <circle cx="54" cy="252" r="2" fill="#FFB000" filter="url(#bi-led-glow)" />
                <circle cx="54" cy="252" r="0.8" fill="#FFF" />
              </g>

              {/* ── Layer 5: Li-Ion Battery Cell ─────────────── */}
              <g className="layer-5" style={{ opacity: 0, visibility: 'hidden' }}>
                {/* Positive terminal cap */}
                <path d="M 50 316 C 50 312 56 310 70 310 C 84 310 90 312 90 316 L 90 322 L 50 322 Z" fill="url(#bi-motor)" />
                <rect x="66" y="307" width="8" height="5" rx="1.5" fill="url(#bi-motor)" />

                {/* Cell body */}
                <rect x="50" y="322" width="40" height="102" fill="url(#bi-battery)" />
                {/* Left highlight */}
                <rect x="51" y="322" width="3" height="102" fill="#fff" opacity="0.45" />
                {/* Right shadow */}
                <rect x="86" y="322" width="3.5" height="102" fill="#000" opacity="0.65" />

                {/* Wrap label */}
                <g transform="rotate(-90 70 373)">
                  <text x="70" y="369" fill="#000" fontSize="14" fontFamily="sans-serif" fontWeight="900" textAnchor="middle" opacity="0.32" letterSpacing="3">DENTY ION</text>
                  <text x="70" y="379" fill="#fff" fontSize="7" fontFamily="monospace" fontWeight="600" textAnchor="middle" opacity="0.88">800mAh 3.7V</text>
                  <text x="70" y="387" fill="#fff" fontSize="4.5" fontFamily="sans-serif" textAnchor="middle" opacity="0.48" letterSpacing="1">DO NOT PUNCTURE</text>
                  <rect x="18" y="360" width="104" height="30" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.3" rx="2" />
                </g>

                {/* Negative terminal bottom */}
                <path d="M 50 424 L 90 424 L 90 428 C 90 432 84 434 70 434 C 56 434 50 432 50 428 Z" fill="url(#bi-motor)" />
              </g>

              {/* ── Layer 6: Qi Induction Charging Coil ──────── */}
              <g className="layer-6" style={{ opacity: 0, visibility: 'hidden' }}>
                {/* Housing */}
                <rect x="48" y="440" width="44" height="34" rx="3" fill="#111" stroke="#282828" strokeWidth="0.8" />
                <rect x="48" y="440" width="3" height="34" fill="#fff" opacity="0.08" />
                <rect x="52" y="440" width="36" height="34" fill="#050505" />

                {/* Outer copper coil */}
                <rect x="50" y="444" width="40" height="22" fill="url(#bi-copper)" />
                <rect x="50" y="444" width="40" height="22" fill="url(#bi-copper-wire)" />
                {/* Inner copper coil */}
                <rect x="54" y="447" width="32" height="16" fill="url(#bi-copper)" />
                <rect x="54" y="447" width="32" height="16" fill="url(#bi-copper-wire)" opacity="0.7" />

                {/* Ferrite core */}
                <rect x="62" y="449" width="16" height="12" rx="2" fill="#1a1a1a" stroke="#333" strokeWidth="0.45" />
                <text x="70" y="458" fill="#555" fontSize="4" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Qi</text>

                {/* Rounded bottom tip */}
                <path d="M 52 474 L 88 474 L 92 480 C 92 484 84 488 70 488 C 56 488 48 484 48 480 Z" fill="url(#bi-motor)" />
                <rect x="58" y="484" width="24" height="1.5" fill="#fff" opacity="0.18" />
              </g>


              {/* ═══════════════════════════════════════════════
                   CONNECTOR DOTS — removed per request
                  ═══════════════════════════════════════════════ */}

              {/* ═══════════════════════════════════════════════
                   CONNECTOR LINES — dots → labels
                  ═══════════════════════════════════════════════ */}
              {LAYERS.map((l, i) => (
                <path
                  key={i}
                  className={`line-${i + 1} z-10`}
                  d={`M 101 ${l.y} C 122 ${l.y} 136 ${l.y} 148 ${l.y}`}
                  stroke={l.color}
                  strokeWidth="1.5"
                  strokeDasharray="60"
                  strokeDashoffset="60"
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 3px ${l.color})`, opacity: 0, visibility: 'hidden' }}
                />
              ))}
            </svg>


            {/* ═══════════════════════════════════════════════════
                 LABELS — right side of the brush
                ═══════════════════════════════════════════════════ */}
            {LAYERS.map((l, i) => (
              <div
                key={i}
                className={`label-${i + 1} absolute brush-label z-10`}
                style={{
                  left: 'calc(50% + 90px)',
                  top: `${l.y - 18}px`,
                  width: 220,
                  opacity: 0,
                  visibility: 'hidden',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}>
                  {/* Colored accent bar */}
                  <div style={{
                    width: 3,
                    height: 36,
                    borderRadius: 2,
                    background: l.color,
                    boxShadow: `0 0 8px ${l.color}80`,
                    flexShrink: 0,
                    marginTop: 2,
                  }} />
                  <div>
                    <div style={{
                      fontSize: 13,
                      color: l.color,
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 900,
                      letterSpacing: '0.06em',
                      textShadow: `0 0 12px ${l.color}60`,
                      lineHeight: 1.2,
                    }}>
                      {l.label}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: 'rgba(160,160,170,0.8)',
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 500,
                      marginTop: 3,
                      lineHeight: 1.4,
                    }}>
                      {l.sub}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
