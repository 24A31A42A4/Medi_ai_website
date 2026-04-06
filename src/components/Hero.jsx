import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

// ─── Three.js Particle Background ─────────────────────────────────────────────
function ParticleCanvas() {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const COUNT = 650; // High density dust
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      velocities[i * 3]     = (Math.random() - 0.5) * 0.03;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.03;
      velocities[i * 3 + 2] = 0;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
      mouseRef.current.x =  ((clientX - rect.left) / rect.width  - 0.5) * 2;
      mouseRef.current.y = -((clientY - rect.top)  / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onMouseMove, { passive: true });

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let rafId;
    const REPEL_RADIUS = window.innerWidth < 768 ? 0.9 : 2.0;
    const REPEL_STRENGTH = window.innerWidth < 768 ? 0.005 : 0.02;

    const forcesX = new Float32Array(COUNT);
    const forcesY = new Float32Array(COUNT);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const pos = geometry.attributes.position.array;

      forcesX.fill(0);
      forcesY.fill(0);

      for (let i = 0; i < COUNT; i++) {
        let ix = i * 3;
        let px = pos[ix];
        let py = pos[ix+1];
        let pz = pos[ix+2];

        // 1. Mouse Repulsion / Anti-Gravity displacement
        const mx = mouseRef.current.x * 7;
        const my = mouseRef.current.y * 5;
        const mdx = px - mx;
        const mdy = py - my;
        const mDistSq = mdx*mdx + mdy*mdy;
        if (mDistSq < REPEL_RADIUS * REPEL_RADIUS) {
          const mDist = Math.sqrt(mDistSq);
          const force = (1 - mDist / REPEL_RADIUS) * REPEL_STRENGTH;
          forcesX[i] += (mdx / mDist) * force;
          forcesY[i] += (mdy / mDist) * force;
        }

        // 2. Inter-particle flocking & lines drawing
        for (let j = i + 1; j < COUNT; j++) {
          let jx = j * 3;
          let dx = pos[jx] - px;
          let dy = pos[jx+1] - py;
          let distSq = dx*dx + dy*dy;
          
          if (distSq < 1.2) { 
            let dist = Math.sqrt(distSq);
            let force = 0;
            
            // Physics: collide if too close, gently attract to form web blobs
            if (dist < 0.15) {
              force = -0.0008 * (0.15 - dist); // bounce
            } else if (dist < 0.8) {
              force = 0.00004; // gravitate to form shapes
            }
            
            let fx = (dx / dist) * force;
            let fy = (dy / dist) * force;
            forcesX[i] += fx; forcesY[i] += fy;
            forcesX[j] -= fx; forcesY[j] -= fy;
          }
        }
      }

      for (let i = 0; i < COUNT; i++) {
        let ix = i * 3;
        
        // Anti-Gravity swirling motion (wobbly orbit)
        const angle = Math.atan2(pos[ix+1], pos[ix]);
        forcesX[i] += Math.cos(angle + Math.PI/2) * 0.0002;
        forcesY[i] += Math.sin(angle + Math.PI/2) * 0.0002;

        velocities[ix] += forcesX[i] + (Math.random() - 0.5) * 0.0008;
        velocities[ix+1] += forcesY[i] + (Math.random() - 0.5) * 0.0008;
        
        velocities[ix] *= 0.95;
        velocities[ix+1] *= 0.95;
        
        pos[ix] += velocities[ix];
        pos[ix+1] += velocities[ix+1];

        if (pos[ix] > 9) pos[ix] = -9;
        else if (pos[ix] < -9) pos[ix] = 9;
        
        if (pos[ix+1] > 6.5) pos[ix+1] = -6.5;
        else if (pos[ix+1] < -6.5) pos[ix+1] = 6.5;
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" style={{ mixBlendMode: 'difference' }} />;
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
export default function Hero() {
  const { currentTheme, themeData, setTheme } = useTheme();
  const navigate = useNavigate();
  const titleRef   = useRef(null);
  const subRef     = useRef(null);
  const tagRef     = useRef(null);
  const btnsRef    = useRef(null);
  const chevronRef = useRef(null);
  const glowRingRef = useRef(null);

  // Inject hero glow keyframes once
  useEffect(() => {
    if (!document.getElementById('hero-glow-style')) {
      const s = document.createElement('style');
      s.id = 'hero-glow-style';
      s.textContent = `
        @keyframes heroRingPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50%       { transform: translate(-50%, -50%) scale(1.12); opacity: 0.2; }
        }
        @keyframes heroRingPulse2 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50%       { transform: translate(-50%, -50%) scale(1.25); opacity: 0.1; }
        }
        @keyframes heroRingPulse3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50%       { transform: translate(-50%, -50%) scale(1.4); opacity: 0.05; }
        }
        @keyframes heroBtnShimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes heroConicSpin {
          from { --hero-conic-angle: 0deg; }
          to   { --hero-conic-angle: 360deg; }
        }
        @property --hero-conic-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes heroGlowOrbit {
          0%   { transform: rotate(0deg)   translateX(0px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(0px) rotate(-360deg); }
        }
      `;
      document.head.appendChild(s);
    }
  }, []);

  // Entrance animations
  useEffect(() => {
    gsap.fromTo(tagRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'power2.out' },
    );

    const letters = titleRef.current?.querySelectorAll('.denty-letter');
    if (letters) {
      gsap.fromTo(letters,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.9, delay: 0.7, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      );
    }

    const afterDenty = 0.7 + 'DENTY'.length * 0.08 + 0.9;
    gsap.fromTo(subRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, delay: afterDenty, ease: 'power2.out' },
    );
    gsap.fromTo(btnsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: afterDenty + 0.15, ease: 'power2.out' },
    );

    gsap.to(chevronRef.current, {
      opacity: 0.2,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }, []);

  const springDown = (e) => gsap.to(e.currentTarget, { scale: 0.95, duration: 0.12, ease: 'power2.out' });
  const springUp   = (e) => gsap.to(e.currentTarget, { scale: 1.00, duration: 0.4,  ease: 'elastic.out(1.2, 0.4)' });

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', minHeight: 600, background: 'var(--bg)' }}
    >
      <ParticleCanvas />

      {/* Accent glow behind DENTY text */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 850px at 50% 45%, ${themeData.accent}18 0%, ${themeData.accent}08 40%, transparent 80%)`,
        }}
      />

      {/* Center overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-4 select-none">

        {/* "ZERO presents" */}
        <p
          ref={tagRef}
          className="text-[10px] sm:text-[12px] md:text-[14px]"
          style={{
            color: 'var(--text)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            opacity: 0,
            marginBottom: -4,
          }}
        >
          ZERO presents
        </p>

        {/* DENTY letter animation */}
        <div ref={titleRef} className="flex" aria-label="DENTY">
          {'DENTY'.split('').map((ch, i) => (
            <span
              key={i}
              className="denty-letter"
              style={{
                fontSize: 'clamp(80px, 15vw, 140px)',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                lineHeight: 1,
                display: 'inline-block',
                opacity: 0,
                color: 'transparent',
                backgroundImage: `linear-gradient(180deg, var(--text) 30%, transparent 180%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                filter: `drop-shadow(0 12px 32px var(--accent-glow))`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="text-lg md:text-2xl px-6"
          style={{
            color: 'var(--text)',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 400,
            letterSpacing: '0.02em',
            opacity: 0,
            textAlign: 'center',
          }}
        >
          Your AI Dental Companion
        </p>

        {/* Buttons */}
        <div ref={btnsRef} className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-5 w-full px-6 sm:px-0 opacity-0 relative z-20">

          <button
            onClick={() => document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseDown={springDown}
            onMouseUp={springUp}
            onMouseLeave={springUp}
            className="w-full sm:w-auto overflow-hidden relative group"
            style={{
              padding: '18px 48px',
              borderRadius: 40,
              fontSize: 16,
              letterSpacing: '0.5px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              background: `var(--text)`,
              color: 'var(--bg)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: `0 8px 24px color-mix(in srgb, var(--text) 20%, transparent)`,
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = `0 12px 32px color-mix(in srgb, var(--text) 35%, transparent)`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = `0 8px 24px color-mix(in srgb, var(--text) 20%, transparent)`;
            }}
          >
            <span className="relative z-10">Explore Collection</span>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent, var(--bg), transparent)` }}
            />
          </button>

          <button
            onClick={() => window.open('https://apps.apple.com', '_blank')}
            onMouseDown={springDown}
            onMouseUp={springUp}
            onMouseLeave={springUp}
            className="w-full sm:w-auto"
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '18px 48px',
              borderRadius: 40,
              fontSize: 16,
              letterSpacing: '0.5px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              background: 'transparent',
              color: 'var(--text)',
              border: '1.5px solid color-mix(in srgb, var(--text) 25%, transparent)',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'color-mix(in srgb, var(--text) 8%, transparent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--text) 40%, transparent)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--text) 25%, transparent)';
            }}
          >
            Download App
          </button>
        </div>
      </div>

      {/* Scroll chevron */}
      <div
        ref={chevronRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        style={{ opacity: 0.6 }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M6 10 L14 18 L22 10" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
