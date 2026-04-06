import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import BotBuddy from './BotBuddy';
import BotLuna from './BotLuna';
import BotBatman from './BotBatman';
import ZeroLogo from './ZeroLogo';

gsap.registerPlugin(ScrollTrigger);

/* ─── Keyframes ─────────────────────────────────────── */
if (typeof document !== 'undefined' && !document.getElementById('app-section-style')) {
  const s = document.createElement('style');
  s.id = 'app-section-style';
  s.textContent = `
    @keyframes loadBar {
      0%   { width: 0%; }
      30%  { width: 38%; }
      65%  { width: 72%; }
      85%  { width: 90%; }
      100% { width: 100%; }
    }
    @keyframes appGlowOrb {
      0%, 100% { transform: translate(-50%,-50%) scale(1);   opacity: 0.5; }
      50%       { transform: translate(-50%,-50%) scale(1.2); opacity: 0.9; }
    }
    @keyframes bootBotFloat {
      0%,100% { transform: translateY(0px); }
      50%     { transform: translateY(-6px); }
    }
    @keyframes tabSlideIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(s);
}

/* ─── Mini Bot Face components (pure SVG — tiny & always crisp) ────────────── */
function MiniBuddy({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Cyan Halo */}
      <ellipse cx="50" cy="14" rx="24" ry="6" stroke="#00E5FF" strokeWidth="2.5" fill="none" opacity="0.8" />
      {/* Body — light cyan rounded square */}
      <rect x="14" y="20" width="72" height="64" rx="18" fill="#d0f4ff" stroke="#b0e8f8" strokeWidth="1.5" />
      {/* Inner face area — slightly lighter */}
      <rect x="22" y="28" width="56" height="48" rx="12" fill="#e4f9ff" opacity="0.6" />
      {/* Left eye — dark rounded square */}
      <rect x="26" y="36" width="20" height="18" rx="6" fill="#1a1a2e" />
      {/* Left eye highlight */}
      <circle cx="33" cy="42" r="3.5" fill="white" opacity="0.95" />
      {/* Right eye — dark rounded square */}
      <rect x="54" y="36" width="20" height="18" rx="6" fill="#1a1a2e" />
      {/* Right eye highlight */}
      <circle cx="61" cy="42" r="3.5" fill="white" opacity="0.95" />
      {/* Smile */}
      <path d="M 36 66 Q 50 76 64 66" stroke="#3a6a7a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function MiniLuna({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Pink Halo */}
      <ellipse cx="50" cy="14" rx="24" ry="6" stroke="#FF69B4" strokeWidth="2.5" fill="none" opacity="0.8" />
      {/* Body — light pink rounded square */}
      <rect x="14" y="20" width="72" height="64" rx="18" fill="#ffe4f0" stroke="#f8c0d8" strokeWidth="1.5" />
      {/* Cat ears */}
      <polygon points="22,26 10,6 36,22" fill="#ffd0e4" />
      <polygon points="78,26 90,6 64,22" fill="#ffd0e4" />
      {/* Inner face area */}
      <rect x="22" y="28" width="56" height="48" rx="12" fill="#fff0f6" opacity="0.6" />
      {/* Left eye */}
      <rect x="26" y="36" width="20" height="18" rx="6" fill="#1a1a2e" />
      <circle cx="33" cy="42" r="3.5" fill="white" opacity="0.95" />
      {/* Right eye */}
      <rect x="54" y="36" width="20" height="18" rx="6" fill="#1a1a2e" />
      <circle cx="61" cy="42" r="3.5" fill="white" opacity="0.95" />
      {/* Blush */}
      <ellipse cx="22" cy="60" rx="6" ry="3.5" fill="#FF69B4" opacity="0.4" />
      <ellipse cx="78" cy="60" rx="6" ry="3.5" fill="#FF69B4" opacity="0.4" />
      {/* Smile */}
      <path d="M 36 66 Q 50 76 64 66" stroke="#c04080" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function MiniBatman({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Orange Halo */}
      <ellipse cx="50" cy="14" rx="24" ry="6" stroke="#FF8C00" strokeWidth="2.5" fill="none" opacity="0.8" />
      {/* Body — dark gray rounded square */}
      <rect x="14" y="20" width="72" height="64" rx="18" fill="#2a2a2e" stroke="#444" strokeWidth="1.5" />
      {/* Bat ears */}
      <polygon points="24,24 14,4 38,20" fill="#3a3a3e" />
      <polygon points="76,24 86,4 62,20" fill="#3a3a3e" />
      {/* Inner face area */}
      <rect x="22" y="28" width="56" height="48" rx="12" fill="rgba(255,255,255,0.05)" />
      {/* Left eye — angry visor */}
      <rect x="24" y="36" width="22" height="14" rx="4" fill="#FFD700" />
      <rect x="30" y="39" width="10" height="8" rx="2" fill="#1a1a1a" />
      {/* Right eye */}
      <rect x="54" y="36" width="22" height="14" rx="4" fill="#FFD700" />
      <rect x="60" y="39" width="10" height="8" rx="2" fill="#1a1a1a" />
      {/* Stern frown */}
      <path d="M 36 68 Q 50 62 64 68" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  );
}

/* ─── App Screens ──────────────────────────────────────────────────────────── */

function HealthScreen({ botName, glowColor }) {
  const [score, setScore] = useState(0);
  useEffect(() => {
    let cur = 0;
    const iv = setInterval(() => {
      cur += 2;
      if (cur >= 92) { setScore(92); clearInterval(iv); } else setScore(Math.round(cur));
    }, 22);
    return () => clearInterval(iv);
  }, []);
  const offs = 264 - (264 * score / 100);
  const gc = glowColor || '#00E5FF';

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[#050505] text-white select-none relative z-0">

      {/* Ambient Background Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full blur-[80px] opacity-20 pointer-events-none z-[-1]"
        style={{ background: gc }}></div>

      {/* 1) Dynamic Pro Header */}
      <div className="flex-none flex items-center justify-between relative z-10" style={{ paddingTop: 68, paddingBottom: 16, paddingLeft: 18, paddingRight: 18 }}>
        <div className="text-[26px] font-black tracking-tighter text-white mt-1 drop-shadow-md leading-[1.1]">
          Hey Arjun! <br /> Ready?
        </div>
        <div className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mt-2.5">
          Today's Overview
        </div>
      </div>

      {/* Premium Score Ring */}
      <div className="flex-none flex justify-center mt-3 mb-6 relative z-10 w-full px-5">
        <div className="relative flex items-center justify-center w-full max-w-[150px] aspect-square rounded-full">
          <div className="absolute inset-0 rounded-full border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

          <svg viewBox="0 0 100 100" className="w-[124px] h-[124px] absolute z-20">
            {/* Background Track */}
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5.5" />
            {/* Animated Glow Track */}
            <circle cx="50" cy="50" r="42" fill="none" stroke={gc} strokeWidth="6.5"
              strokeDasharray="264" strokeDashoffset={offs} strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px', filter: `drop-shadow(0 0 8px ${gc}80)`, transition: 'stroke-dashoffset 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)' }} />
          </svg>

          {/* Center Data */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
            <span className="text-[44px] font-black text-white leading-none tracking-tighter" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{score}</span>
            <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.25em] mt-1">Health</span>
          </div>
        </div>
      </div>

      {/* Stats Glass Cards */}
      <div className="flex-none flex gap-2.5 relative z-10" style={{ paddingLeft: 18, paddingRight: 18, marginBottom: 28 }}>
        {[{ l: 'Gums', v: '94%', c: '#4ade80' }, { l: 'Plaque', v: '87%', c: gc }, { l: 'Cover', v: '91%', c: '#c084fc' }].map(d => (
          <div key={d.l} className="flex-1 rounded-[16px] p-2.5 bg-[#111111] border border-white/[0.04] text-center flex flex-col justify-center items-center shadow-[0_4px_15px_rgba(0,0,0,0.4)] relative overflow-hidden text-clip">
            <div className="absolute top-0 inset-x-0 h-[1.5px]" style={{ background: `linear-gradient(90deg, transparent, ${d.c}60, transparent)`, boxShadow: `0 0 8px ${d.c}` }}></div>
            <div className="text-[15px] font-black tracking-tight mt-1" style={{ color: d.c, textShadow: `0 0 10px ${d.c}40` }}>{d.v}</div>
            <div className="text-[7.5px] font-bold uppercase tracking-[0.15em] mt-1 text-white/40">{d.l}</div>
          </div>
        ))}
      </div>

      {/* Elegant Weekly Graph - Completely Redesigned to be Spacious and Premium */}
      <div className="flex-none relative z-10" style={{ paddingLeft: 18, paddingRight: 18, marginBottom: 32 }}>
        <div className="flex justify-between items-end mb-3 px-1">
          <div className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] drop-shadow-md">This Week</div>
          <div className="text-[7px] font-bold text-white/20 uppercase tracking-[0.1em]">Target: 90+</div>
        </div>

        {/* The Graph Container (No ugly borders, cleanly spaced) */}
        <div className="flex items-end justify-between h-[42px] px-2 relative">
          {/* Subtle background track lines for premium feel */}
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/[0.05]"></div>
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/[0.02] border-dashed"></div>

          {[55, 72, 85, 68, 92, 80, 92].map((v, i) => (
            <div key={i} className="relative flex flex-col items-center justify-end h-full z-10">
              <div className="w-[10px] rounded-full transition-all duration-1000 relative" style={{
                height: `${v}%`,
                background: i === 6 ? `linear-gradient(to top, ${gc}40, ${gc})` : 'rgba(255,255,255,0.08)',
                boxShadow: i === 6 ? `0 0 12px ${gc}50` : 'none',
              }}>
                {i === 6 && <div className="absolute inset-0 rounded-full border border-white/20"></div>}
              </div>
            </div>
          ))}
        </div>

        {/* Days of the week */}
        <div className="flex justify-between mt-2.5 px-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className={`text-center text-[8px] font-black w-[10px] ${i === 6 ? 'text-white/95 drop-shadow-md' : 'text-white/20'}`} style={{ color: i === 6 ? gc : undefined }}>{d}</div>
          ))}
        </div>
      </div>

      {/* Glowing Bot Tip - No emoji */}
      <div className="flex-none mx-5 mb-2 rounded-[18px] px-4 py-3.5 flex items-center justify-center relative overflow-hidden bg-[#111111] shadow-[0_8px_20px_rgba(0,0,0,0.5)] border border-white/[0.04]">
        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: gc, boxShadow: `0 0 12px ${gc}` }} />
        <div className="text-[9.5px] font-black leading-tight text-white/90 tracking-wide text-center drop-shadow-md">
          Spend <span style={{ color: gc }}>10s more</span> on your lower molars!
        </div>
      </div>
    </div>
  );
}

function TimerScreen({ glowColor }) {
  const [time, setTime] = useState(120);
  const [running, setRunning] = useState(false);
  const [quad, setQuad] = useState(0);
  const [vpm, setVpm] = useState(0);
  const gc = glowColor || '#00E5FF';
  const isDark = true;

  // Primary Timer Logic
  useEffect(() => {
    if (!running || time <= 0) return;
    const iv = setInterval(() => {
      setTime(t => {
        if (t <= 1) { clearInterval(iv); setRunning(false); return 0; }
        if ((120 - t + 1) % 30 === 0 && t < 120) setQuad(q => Math.min(q + 1, 3));
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [running, time]);

  // Live VPM Motor Simulation Logic
  useEffect(() => {
    if (!running) { setVpm(0); return; }
    const iv = setInterval(() => {
      // Simulate micro-fluctuations in the Sonic Motor (e.g. 39,800 to 40,300)
      setVpm(39800 + Math.floor(Math.random() * 500));
    }, 120);
    return () => clearInterval(iv);
  }, [running]);

  const mins = Math.floor(time / 60);
  const secs = (time % 60).toString().padStart(2, '0');
  const progress = (120 - time) / 120;
  const r = 38, circ = 2 * Math.PI * r;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[#050505] text-white select-none relative">

      {/* 1) Premium Spacious Top Header */}
      <div className="flex-none flex flex-col items-start justify-end relative z-10" style={{ paddingTop: 68, paddingLeft: 28, paddingRight: 28, paddingBottom: 16 }}>
        <div className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">Smart Brushing</div>
        <div className="text-[20px] font-black tracking-tight text-white mt-0.5 leading-none drop-shadow-md">
          {time === 0 ? 'Brushing Complete ✓' : `Activating Zone ${quad + 1}`}
        </div>
      </div>

      {/* 2) Flagship Circular Timer */}
      <div className="flex-none flex justify-center mt-2 mb-2 relative z-10 w-full" style={{ paddingLeft: 18, paddingRight: 18 }}>
        <div className="relative flex items-center justify-center w-[110px] h-[110px] rounded-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 rounded-full border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent shadow-[inset_0_0px_20px_rgba(0,0,0,0.6)]"></div>
          <svg viewBox="0 0 100 100" className="w-[120px] h-[120px] absolute z-20">
            <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
            <circle cx="50" cy="50" r="43" fill="none" stroke={gc} strokeWidth="6"
              strokeDasharray={270} strokeDashoffset={270 * (1 - progress)} strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px', filter: `drop-shadow(0 0 10px ${gc}aa)`, transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pt-1">
            <span className="text-[32px] font-black leading-none tracking-tighter" style={{ fontFamily: 'monospace', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{mins}:{secs}</span>
          </div>
        </div>
      </div>

      {/* 3) Advanced Animated Tooth Scanner Canvas */}
      <div className="flex-none relative z-10 w-full px-5 py-2 flex items-center justify-center" style={{ height: 210 }}>
        <style>
          {`
            @keyframes scanner { 0% { transform: translateY(-40px); } 50% { transform: translateY(40px); } 100% { transform: translateY(-40px); } }
            @keyframes sonic { 0% { transform: scale(0.6); opacity: 0.8; } 100% { transform: scale(2.2); opacity: 0; } }
            @keyframes brushStroke { 0% { transform: translateX(calc(var(--dir) * -20px)) translateY(-5px); opacity:0;} 50% { opacity:1; } 100% { transform: translateX(calc(var(--dir) * 20px)) translateY(5px); opacity:0;} }
          `}
        </style>

        {/* Radar Sonic Shockwaves */}
        {running && (
          <>
            <div className="absolute w-[80px] h-[80px] rounded-full border z-0" style={{ borderColor: gc, animation: 'sonic 2.5s infinite cubic-bezier(0.2, 0.8, 0.2, 1)' }} />
            <div className="absolute w-[80px] h-[80px] rounded-full border z-0" style={{ borderColor: gc, animation: 'sonic 2.5s infinite cubic-bezier(0.2, 0.8, 0.2, 1) 1.25s' }} />
          </>
        )}

        {/* Premium Realistic Anatomical Molar */}
        <svg viewBox="0 0 100 100" className="relative w-[110px] h-[110px] z-10 transition-all duration-700" style={{ filter: running ? `drop-shadow(0 0 25px ${gc}aa)` : 'drop-shadow(0 5px 15px rgba(0,0,0,0.9))' }}>
          <defs>
            <linearGradient id="toothGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={gc} stopOpacity="0.45" />
              <stop offset="100%" stopColor={gc} stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="idleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <path d="M 28 28
                   C 22 10, 44 8, 50 18
                   C 56 8, 78 10, 72 28
                   C 70 42, 62 48, 62 55
                   C 62 68, 70 82, 64 88
                   A 4 4 0 0 1 57 88
                   C 54 75, 52 62, 50 55
                   C 48 62, 46 75, 43 88
                   A 4 4 0 0 1 36 88
                   C 30 82, 38 68, 38 55
                   C 38 48, 30 42, 28 28 Z"
            fill={running ? `url(#toothGradient)` : 'url(#idleGradient)'}
            stroke={running ? 'white' : 'rgba(255,255,255,0.15)'}
            strokeWidth={running ? "1.5" : "1"} />
        </svg>

        {/* Floating Animated Brushing Bubbles focused on active quadrant */}
        {running && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            <div className="absolute w-[50px] h-[50px]" style={{
              top: quad < 2 ? '25%' : '55%',
              left: quad % 2 === 0 ? '25%' : 'auto', right: quad % 2 === 1 ? '25%' : 'auto',
              '--dir': quad % 2 === 0 ? 1 : -1
            }}>
              <div className="w-[5px] h-[5px] bg-white rounded-full absolute top-[10px] blur-[1px]" style={{ animation: 'brushStroke 0.8s infinite' }} />
              <div className="w-[3px] h-[3px] bg-white rounded-full absolute top-[25px] blur-[1px]" style={{ animation: 'brushStroke 0.8s infinite 0.2s' }} />
              <div className="w-[7px] h-[7px] opacity-70 rounded-full absolute top-[40px] blur-[2px]" style={{ background: gc, animation: 'brushStroke 1s infinite 0.4s' }} />
            </div>
          </div>
        )}

        {/* Holographic Laser Scanner Sweeping Plane */}
        {running && (
          <div className="absolute w-[180px] h-[2px] z-30" style={{ background: `linear-gradient(90deg, transparent, ${gc}, white, ${gc}, transparent)`, boxShadow: `0 0 20px 4px ${gc}80`, animation: 'scanner 3s infinite ease-in-out' }}>
            <div className="absolute left-1/2 -ml-[30px] -top-[15px] w-[60px] h-[30px] rounded-full opacity-50 blur-[12px]" style={{ background: gc }} />
          </div>
        )}

        {/* Dynamic Zone Trackers Floating Around Tooth */}
        <div className={`absolute top-[18%] left-[7%] flex flex-col items-center transition-all ${quad === 0 && running ? 'scale-110 opacity-100' : 'opacity-30'}`}>
          <div className="text-[7.5px] font-black uppercase tracking-[0.2em]" style={{ color: quad === 0 && running ? '#fff' : gc }}>Upper L</div>
          {quad === 0 && running && <div className="h-[2px] w-[24px] mt-1.5 rounded-full" style={{ background: gc, boxShadow: `0 0 10px ${gc}` }} />}
        </div>
        <div className={`absolute top-[18%] right-[7%] flex flex-col items-center transition-all ${quad === 1 && running ? 'scale-110 opacity-100' : 'opacity-30'}`}>
          <div className="text-[7.5px] font-black uppercase tracking-[0.2em]" style={{ color: quad === 1 && running ? '#fff' : gc }}>Upper R</div>
          {quad === 1 && running && <div className="h-[2px] w-[24px] mt-1.5 rounded-full" style={{ background: gc, boxShadow: `0 0 10px ${gc}` }} />}
        </div>
        <div className={`absolute bottom-[18%] left-[7%] flex flex-col items-center transition-all ${quad === 2 && running ? 'scale-110 opacity-100' : 'opacity-30'}`}>
          <div className="text-[7.5px] font-black uppercase tracking-[0.2em]" style={{ color: quad === 2 && running ? '#fff' : gc }}>Lower L</div>
          {quad === 2 && running && <div className="h-[2px] w-[24px] mt-1.5 rounded-full" style={{ background: gc, boxShadow: `0 0 10px ${gc}` }} />}
        </div>
        <div className={`absolute bottom-[18%] right-[7%] flex flex-col items-center transition-all ${quad === 3 && running ? 'scale-110 opacity-100' : 'opacity-30'}`}>
          <div className="text-[7.5px] font-black uppercase tracking-[0.2em]" style={{ color: quad === 3 && running ? '#fff' : gc }}>Lower R</div>
          {quad === 3 && running && <div className="h-[2px] w-[24px] mt-1.5 rounded-full" style={{ background: gc, boxShadow: `0 0 10px ${gc}` }} />}
        </div>
      </div>

      {/* 4) Pro Telemetry Bar (Live VPM) */}
      <div className="flex-none flex items-center justify-between px-10 mb-6 relative z-10 w-full">
        <div className="flex flex-col items-start w-[60px]">
          <div className="text-[6.5px] text-white/40 tracking-[0.25em] uppercase font-black drop-shadow-md">Motor State</div>
          <div className="text-[12px] font-black mt-0.5" style={{ color: running ? gc : '#444' }}>{running ? 'ENGAGED' : 'IDLE'}</div>
        </div>

        <div className="relative w-[40px] h-[40px] rounded-full flex items-center justify-center border bg-black/50 shadow-inner" style={{ borderColor: running ? gc : 'rgba(255,255,255,0.05)', boxShadow: running ? `0 0 15px ${gc}40, inset 0 0 10px ${gc}20` : 'none' }}>
          <div className={`w-[8px] h-[8px] rounded-full transition-all ${running ? 'animate-ping' : ''}`} style={{ background: running ? gc : '#333' }} />
          {running && <div className="absolute w-[4px] h-[4px] rounded-full bg-white blur-[1px]" />}
        </div>

        <div className="flex flex-col items-end w-[60px]">
          <div className="text-[6.5px] text-white/40 tracking-[0.25em] uppercase font-black drop-shadow-md">Live RPM</div>
          <div className="text-[18px] font-black tracking-tighter mt-0.5" style={{ color: running ? '#fff' : '#444', fontFeatureSettings: '"tnum"', fontVariantNumeric: 'tabular-nums' }}>
            {running ? vpm.toLocaleString() : '---'}
          </div>
        </div>
      </div>

      {/* 4) Ultra-Premium Start/Pause Control */}
      <div className="flex-none relative z-10" style={{ paddingLeft: 18, paddingRight: 18 }}>
        <button onClick={() => { if (time === 0) { setTime(120); setQuad(0); } setRunning(r => !r); }}
          className="w-full h-[52px] rounded-[16px] flex items-center justify-center gap-3 transition-transform active:scale-[0.97] border relative overflow-hidden"
          style={{
            background: running ? 'rgba(255,255,255,0.04)' : `linear-gradient(135deg, ${gc}dd, ${gc}88)`,
            color: running ? gc : '#000',
            borderColor: running ? 'rgba(255,255,255,0.08)' : 'transparent',
            boxShadow: running ? 'inset 0 4px 10px rgba(0,0,0,0.6)' : `0 8px 24px ${gc}60, inset 0 2px 4px rgba(255,255,255,0.4)`,
          }}>
          <span className="text-[16px] leading-none " style={{ filter: running ? `drop-shadow(0 0 8px ${gc})` : 'none' }}>{time === 0 ? '↻' : running ? '⏸' : '▶'}</span>
          <span className="text-[12px] font-black uppercase tracking-widest leading-none mt-[1px]">{time === 0 ? 'Restart Session' : running ? 'Pause Timer' : 'Start Brushing'}</span>
        </button>
      </div>

      {/* 5) Advanced Feature Details - Floating bottom text */}
      <div className="absolute inset-x-0 flex justify-center z-10 pointer-events-none" style={{ bottom: 20 }}>
        <div className="text-[7.5px] text-white/50 font-black uppercase tracking-[0.2em] flex items-center gap-2 drop-shadow-md">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: gc, boxShadow: `0 0 6px ${gc}`, animation: running ? 'pulse 1.5s infinite' : 'none' }} />
          Neural Engine Active · 40,000 VPM
        </div>
      </div>
    </div>
  );
}

function ChatScreen({ botName, glowColor }) {
  const gc = glowColor || '#00E5FF';
  const botLabel = botName ? botName.charAt(0).toUpperCase() + botName.slice(1) : 'Zero';
  const isLuna = botName === 'luna';
  const isBatman = botName === 'batman';
  const isDark = true;

  const BOT_REPLIES = isBatman
    ? ['Zone 3. Fix it.', 'No excuses. 40K strokes minimum.', 'Acceptable progress. Push harder.', 'Plaque detected. Eliminate it.']
    : isLuna
      ? ['Great question! Focus on Zone 3 💕', "You're doing amazing! Keep it up 🌸", 'Try the Spa Care mode tonight! ✨', 'Your smile is glowing today! 💖']
      : ["Based on your scan: focus on Zone 3! 🤖", 'Great habit! Your score is rising 📈', 'Try the AI timer for better coverage 🎯', "You're on a 7-day streak! Keep going 🔥"];

  const QUICK_REPLIES = isLuna
    ? ['My streak 🌸', 'Floss tips 💅', 'Night routine ✨']
    : isBatman
      ? ['My stats', 'Plaque scan', 'Night ops']
      : ['Brush tips?', 'My streak', 'AI Scan'];

  const [messages, setMessages] = useState([
    { role: 'bot', text: isLuna ? 'Hey! Your coverage improved 12% this week! 🌸✨' : isBatman ? 'Coverage +12%. Acceptable. Keep pushing.' : 'Your coverage improved 12% this week! 🦷✨', time: '9:41 AM' },
    { role: 'user', text: 'Tips for back molars?', time: '9:42 AM' },
    { role: 'bot', text: isLuna ? "Angle 45° with short strokes — I'll cheer you on! 💖" : isBatman ? 'Angle 45°. Short strokes. No excuses.' : "Angle 45° with short strokes. I'll guide you live! 🎯", time: '9:42 AM' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [kbOpen, setKbOpen] = useState(false);
  const [caps, setCaps] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (kbOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [kbOpen]);

  const send = (txt) => {
    const msg = txt ?? input;
    if (!msg.trim()) return;
    const now = new Date();
    const ts = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(p => [...p, { role: 'user', text: msg, time: ts }]);
    setInput('');
    setKbOpen(false);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
      setMessages(p => [...p, { role: 'bot', text: reply, time: ts }]);
    }, 900 + Math.random() * 400);
  };

  const KB_ROWS = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']];
  const handleKey = (k) => {
    if (k === '⌫') { setInput(p => p.slice(0, -1)); return; }
    if (k === '⇧') { setCaps(c => !c); return; }
    const ch = caps ? k.toUpperCase() : k;
    setInput(p => p + ch);
    if (caps) setCaps(false);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden select-none bg-[#030303]">

      {/* 1) Premium Pro Header - MOVED UP */}
      <div className="flex-none flex items-center justify-between relative z-10 border-b border-white/[0.04]"
        style={{ paddingTop: 52, paddingBottom: 16, paddingLeft: 18, paddingRight: 18, background: 'rgba(3,3,3,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-4">
          <div className="relative w-[42px] h-[42px] rounded-[14px] flex items-center justify-center p-0.5 overflow-hidden group">
            <div className="absolute inset-0 rounded-[14px] opacity-20" style={{ background: gc }} />
            <div className="absolute inset-0 rounded-[14px] border border-white/10" />
            <div className="z-10 bg-black/40 rounded-[12px] w-full h-full flex items-center justify-center p-1 border border-white/5">
              {botName === 'buddy' ? <MiniBuddy size={38} /> : botName === 'luna' ? <MiniLuna size={38} /> : <MiniBatman size={38} />}
            </div>
            {/* Pulsing Status Ring */}
            <div className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 rounded-full bg-[#030303] flex items-center justify-center z-20 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ boxShadow: `0 0 10px rgba(34,197,94,0.8)` }} />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-black tracking-tight text-white">{botLabel}</span>
              <div className="px-1.5 py-[1px] rounded-[4px] bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <span className="text-[6px] font-black uppercase text-blue-400 tracking-wider">AI Advisor</span>
              </div>
            </div>
            <span className="text-[7.5px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Live Diagnostic Sync</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/5 cursor-pointer active:scale-95 transition-transform">
          <span className="text-white/40 text-[10px]">⋯</span>
        </div>
      </div>

      {/* 2) Chat Conversation Stream - Liquid Premium Redesign */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-5 pt-6 pb-6"
        style={{ scrollbarWidth: 'none', minHeight: 0, paddingLeft: 16, paddingRight: 16 }}>

        {messages.map((m, i) => {
          const isBot = m.role === 'bot';
          const isDiagnostic = isBot && (m.text.includes('%') || m.text.includes('Scan') || m.text.includes('Score'));

          return (
            <div key={i} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
              <div className={`flex items-start gap-1.5 max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Bot Avatar */}
                {isBot && (
                  <div className="flex-none self-end mb-0.5">
                    <div className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center" style={{ background: `${gc}18`, border: `1px solid ${gc}35` }}>
                      {botName === 'buddy' ? <MiniBuddy size={24} /> : botName === 'luna' ? <MiniLuna size={24} /> : <MiniBatman size={24} />}
                    </div>
                  </div>
                )}

                {/* Message Bubble — Clean Rectangle */}
                <div className="relative group">
                  <div className="px-5 py-3.5 relative z-10"
                    style={{
                      background: isBot
                        ? 'rgba(0,30,36,0.95)'
                        : gc,
                      color: isBot ? '#fff' : '#000',
                      border: isBot ? `1px solid ${gc}28` : 'none',
                      boxShadow: isBot
                        ? '0 2px 12px rgba(0,0,0,0.5)'
                        : `0 3px 14px ${gc}45`,
                      borderRadius: '4px',
                    }}>

                    {isDiagnostic && (
                      <div className="flex items-center gap-2 mb-2 pb-1.5" style={{ borderBottom: `1px solid ${gc}30` }}>
                        <span className="text-[10px]">📊</span>
                        <span className="text-[7px] font-black uppercase tracking-widest" style={{ color: gc }}>Diagnostic Report</span>
                      </div>
                    )}

                    <p className={`text-[11.5px] leading-[1.5] ${!isBot ? 'font-semibold' : 'font-normal text-white/90'}`}>
                      {m.text}
                    </p>

                    {/* Timestamp */}
                    <div className={`flex items-center gap-1 mt-1.5 ${isBot ? 'justify-start' : 'justify-end'}`}>
                      <span className={`text-[8px] font-medium opacity-40 ${isBot ? 'text-white' : 'text-black'}`}>{m.time}</span>
                      {!isBot && (
                        <div className="flex items-center opacity-50" style={{ color: '#000' }}>
                          <span className="text-[9px] -mr-[3px]">✓</span>
                          <span className="text-[9px]">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {typing && (
          <div className="flex items-end gap-1.5 max-w-[75%]">
            <div className="flex-none w-[28px] h-[28px] rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: `${gc}18`, border: `1px solid ${gc}35` }}>
              {botName === 'buddy' ? <MiniBuddy size={24} /> : botName === 'luna' ? <MiniLuna size={24} /> : <MiniBatman size={24} />}
            </div>
            <div className="px-5 py-3 flex items-center gap-3"
              style={{ background: 'rgba(0,30,36,0.95)', border: `1px solid ${gc}28`, borderRadius: '4px', boxShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
              <div className="flex gap-[5px] items-center">
                {[0, 0.18, 0.36].map(d => <div key={d} className="w-[6px] h-[6px] rounded-full animate-bounce" style={{ background: gc, animationDelay: `${d}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* 3) Quick-Reply Suggestion Chips */}
      <div className="flex-none pt-2 pb-1 relative z-10" style={{ paddingLeft: 18, paddingRight: 18 }}>
        {!kbOpen && (
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {QUICK_REPLIES.map(q => (
              <button key={q} onClick={() => send(q)}
                className="flex-shrink-0 h-[36px] px-5 rounded-[10px] flex items-center justify-center transition-all duration-200 active:scale-95"
                style={{
                  background: '#1a1a1e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                }}>
                <span className="text-[8.5px] font-bold uppercase tracking-wider text-white/80">{q}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4) Pro iOS-Style Unified Input Area */}
      <div className="flex-none pb-4 pt-1 flex items-center gap-3 relative z-10" style={{ paddingLeft: 18, paddingRight: 18 }}>
        <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/5 text-white/40 text-[16px] flex-shrink-0 active:scale-90 transition-all">
          +
        </button>

        <div className="flex-1 relative flex items-center group">
          <div onClick={() => setKbOpen(o => !o)}
            className="w-full h-[40px] rounded-[14px] px-4 flex items-center transition-all duration-300 cursor-text"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${kbOpen ? gc : 'rgba(255,255,255,0.06)'}`,
              boxShadow: kbOpen ? `0 0 20px ${gc}15` : 'none'
            }}>
            <span className="text-[10px] tracking-tight" style={{ color: input ? 'white' : 'rgba(255,255,255,0.25)' }}>
              {input || 'Message your AI companion...'}
            </span>
            {kbOpen && (
              <div className="w-[1.5px] h-[14px] ml-1 rounded-full animate-pulse" style={{ background: gc }} />
            )}
          </div>
        </div>

        <button onClick={() => send()}
          className="w-[40px] h-[40px] rounded-[14px] flex items-center justify-center text-black flex-shrink-0 transition-all active:scale-90"
          style={{
            background: input.trim() ? gc : 'rgba(255,255,255,0.1)',
            boxShadow: input.trim() ? `0 8px 16px ${gc}60` : 'none',
            opacity: input.trim() ? 1 : 0.4
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={input.trim() ? '#000' : '#fff'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 5) Sleek Slide-Up Custom Keyboard Integration */}
      <div className="flex-none overflow-hidden transition-all duration-300 bg-[#161616]"
        style={{ maxHeight: kbOpen ? '200px' : '0px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="px-1.5 pt-2 pb-4">
          {KB_ROWS.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-[4px] mb-[6px]">
              {row.map((k) => {
                const isSpecial = k === '⇧' || k === '⌫';
                const isCapsActive = k === '⇧' && caps;
                return (
                  <button key={k} onClick={() => handleKey(k)}
                    className="flex items-center justify-center rounded-[6px] font-black transition-all duration-75 active:scale-90 active:bg-white/10"
                    style={{
                      height: 32,
                      minWidth: isSpecial ? 42 : 26,
                      flex: isSpecial ? '0 0 42px' : '0 1 26px',
                      fontSize: 12,
                      background: isCapsActive ? gc : 'rgba(255,255,255,0.1)',
                      color: isCapsActive ? '#000' : '#fff',
                      boxShadow: '0 1px 0 rgba(0,0,0,0.5)',
                    }}>
                    {k === '⌫' ? '⌫' : (caps && !isSpecial) ? k.toUpperCase() : k}
                  </button>
                );
              })}
            </div>
          ))}
          <div className="flex gap-1.5 px-2 mt-1">
            <button onClick={() => setInput(p => p + ' ')} className="flex-1 h-[32px] rounded-[6px] font-black text-[11px] uppercase tracking-widest text-white/50 transition-all border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
              space
            </button>
            <button onClick={() => send()} className="w-[84px] h-[32px] rounded-[6px] font-black text-[10px] uppercase tracking-widest text-black transition-all shadow-lg" style={{ background: gc }}>
              send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanScreen({ botName, glowColor }) {
  const gc = glowColor || '#00E5FF';
  const [mode, setMode] = useState('results'); // 'results' | 'camera' | 'analyzing'
  const [scanPct, setScanPct] = useState(0);
  const [directionIdx, setDirectionIdx] = useState(0);
  const [scanScore] = useState(87);

  const DIRECTIONS = [
    { text: 'Open mouth wide', icon: '👄', color: '#00E5FF' },
    { text: 'Tilt head right', icon: '➡️', color: '#a78bfa' },
    { text: 'Show upper teeth', icon: '🦷', color: '#22c55e' },
    { text: 'Tilt head left', icon: '⬅️', color: '#f472b6' },
    { text: 'Show lower teeth', icon: '🦷', color: '#fbbf24' },
    { text: 'Hold still...', icon: '📸', color: '#ef4444' },
  ];

  const zones = [
    { n: 'Upper Front', s: 'good', c: '#22c55e', score: 94 },
    { n: 'Upper Left', s: 'watch', c: '#f59e0b', score: 72 },
    { n: 'Upper Right', s: 'good', c: '#22c55e', score: 91 },
    { n: 'Lower Front', s: 'good', c: '#22c55e', score: 96 },
    { n: 'Lower Left', s: 'good', c: '#22c55e', score: 88 },
    { n: 'Lower Right', s: 'watch', c: '#f59e0b', score: 68 },
  ];

  const scanHistory = [82, 79, 85, 83, 87]; // last 5 scans

  const startCameraScan = () => {
    setMode('camera');
    setScanPct(0);
    setDirectionIdx(0);

    // Cycle through directions
    let dirI = 0;
    const dirTimer = setInterval(() => {
      dirI++;
      if (dirI >= 6) { clearInterval(dirTimer); return; }
      setDirectionIdx(dirI);
    }, 1800);

    // Progress bar
    let p = 0;
    const progTimer = setInterval(() => {
      p += 1;
      setScanPct(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(progTimer);
        clearInterval(dirTimer);
        setMode('analyzing');
        // Analyzing phase
        setTimeout(() => setMode('results'), 1500);
      }
    }, 110);
  };

  // ── CAMERA MODE ──
  if (mode === 'camera' || mode === 'analyzing') {
    const dir = DIRECTIONS[directionIdx];
    return (
      <div className="w-full h-full flex flex-col overflow-hidden bg-[#030303] text-white select-none relative">
        {/* Simulated camera background with dark gradient */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, #0a1a1f 0%, #040808 50%, #020404 100%)',
        }} />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        {/* Header */}
        <div className="flex-none flex items-center justify-between relative z-20" style={{ paddingTop: 68, paddingBottom: 12, paddingLeft: 18, paddingRight: 18 }}>
          <div>
            <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">AI Dental Scanner</div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
              <span className="text-[11px] font-black text-white/80">LIVE</span>
            </div>
          </div>
          <button onClick={() => setMode('results')} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform border border-white/10">
            <span className="text-white/60 text-[14px]">✕</span>
          </button>
        </div>

        {/* Camera viewfinder area */}
        <div className="flex-1 flex items-center justify-center relative z-10 px-6">
          <div className="relative w-[220px] h-[220px]">
            {/* Corner brackets */}
            {[
              { t: 0, l: 0, br: 'borderTop', bl: 'borderLeft' },
              { t: 0, r: 0, br: 'borderTop', bl: 'borderRight' },
              { b: 0, l: 0, br: 'borderBottom', bl: 'borderLeft' },
              { b: 0, r: 0, br: 'borderBottom', bl: 'borderRight' },
            ].map((pos, i) => (
              <div key={i} className="absolute w-[40px] h-[40px]" style={{
                top: pos.t, bottom: pos.b, left: pos.l, right: pos.r,
                [pos.br]: `3px solid ${gc}`,
                [pos.bl]: `3px solid ${gc}`,
                filter: `drop-shadow(0 0 6px ${gc}60)`,
                animation: `pulse 2s infinite ${i * 0.15}s`,
              }} />
            ))}

            {/* Scanning line animation */}
            <div className="absolute left-[8px] right-[8px] h-[2px] z-10" style={{
              background: `linear-gradient(90deg, transparent, ${gc}, white, ${gc}, transparent)`,
              boxShadow: `0 0 20px 3px ${gc}60`,
              animation: 'scanLine 2.5s ease-in-out infinite',
            }} />

            {/* Center face guide outline */}
            <div className="absolute inset-[30px] rounded-[50%] border border-dashed opacity-20" style={{ borderColor: gc }} />

            {/* Crosshair center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-[2px] h-[16px] absolute -top-[8px] left-[-1px]" style={{ background: `${gc}60` }} />
              <div className="h-[2px] w-[16px] absolute -left-[8px] top-[-1px]" style={{ background: `${gc}60` }} />
            </div>

            {/* Detection points (simulated) */}
            {[[40, 60], [100, 45], [165, 55], [65, 140], [140, 150], [110, 100]].map(([x, y], i) => (
              <div key={i} className="absolute w-[6px] h-[6px] rounded-full" style={{
                left: x, top: y,
                background: i < 4 ? '#22c55e' : '#f59e0b',
                boxShadow: `0 0 8px ${i < 4 ? '#22c55e' : '#f59e0b'}`,
                animation: `pulse 1.5s infinite ${i * 0.2}s`,
                opacity: scanPct > (i * 15) ? 1 : 0,
                transition: 'opacity 0.3s',
              }} />
            ))}
          </div>
        </div>

        {/* AI Direction Card */}
        <div className="flex-none relative z-20 px-5 mb-3">
          <div className="rounded-[12px] px-5 py-3.5 flex items-center gap-4 transition-all duration-500" style={{
            background: 'rgba(0,20,25,0.9)',
            border: `1.5px solid ${dir.color}40`,
            boxShadow: `0 0 25px ${dir.color}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}>
            <div className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center flex-shrink-0 transition-all duration-500" style={{
              background: `${dir.color}20`,
              border: `1px solid ${dir.color}40`,
            }}>
              <span className="text-[22px]">{dir.icon}</span>
            </div>
            <div className="flex-1">
              <div className="text-[7px] font-black uppercase tracking-[0.2em] mb-0.5" style={{ color: dir.color }}>
                AI Direction · Step {directionIdx + 1}/6
              </div>
              <div className="text-[14px] font-black text-white tracking-tight transition-all duration-500">
                {dir.text}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-none relative z-20 px-5 mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">Scan Progress</span>
            <span className="text-[9px] font-black" style={{ color: gc }}>{scanPct}%</span>
          </div>
          <div className="w-full h-[4px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-100" style={{
              width: `${scanPct}%`,
              background: `linear-gradient(90deg, ${gc}, #a78bfa, #f472b6)`,
              boxShadow: `0 0 10px ${gc}80`,
            }} />
          </div>
        </div>

        {/* Analyzing overlay */}
        {mode === 'analyzing' && (
          <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center gap-3">
            <div className="w-[50px] h-[50px] rounded-full border-[3px] border-t-transparent animate-spin" style={{ borderColor: gc, borderTopColor: 'transparent' }} />
            <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: gc }}>Processing AI Analysis…</div>
          </div>
        )}

        {/* CSS for scan line */}
        <style>{`
          @keyframes scanLine {
            0%, 100% { top: 8px; }
            50% { top: calc(100% - 10px); }
          }
        `}</style>
      </div>
    );
  }

  // ── RESULTS MODE ──
  const circumference = 2 * Math.PI * 38;
  const scoreOffset = circumference * (1 - scanScore / 100);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden overflow-y-auto bg-[#050505] text-white select-none" style={{ scrollbarWidth: 'none' }}>

      {/* Header */}
      <div className="flex-none flex items-center justify-between" style={{ paddingTop: 68, paddingBottom: 10, paddingLeft: 18, paddingRight: 18 }}>
        <div>
          <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">AI Dental Scan</div>
          <div className="text-[15px] font-black tracking-tight mt-0.5">Report Ready ✓</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded-[6px] text-[6px] font-black uppercase tracking-wider" style={{ background: `${gc}20`, color: gc, border: `1px solid ${gc}30` }}>
            Pro Analysis
          </div>
        </div>
      </div>

      {/* Score Ring + Summary */}
      <div className="flex-none flex items-center gap-5 mt-4" style={{ paddingLeft: 18, paddingRight: 18 }}>
        {/* Animated score ring */}
        <div className="relative flex-shrink-0">
          <svg width="90" height="90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="url(#scoreGrad)" strokeWidth="7"
              strokeDasharray={circumference} strokeDashoffset={scoreOffset} strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px', transition: 'stroke-dashoffset 1.5s ease-out' }} />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor={gc} />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-black leading-none" style={{ color: gc }}>{scanScore}</span>
            <span className="text-[6px] font-black uppercase tracking-widest text-white/40 mt-0.5">Score</span>
          </div>
        </div>

        {/* Summary strip */}
        <div className="flex-1 flex flex-col gap-2">
          {[
            { l: 'Healthy Zones', v: '4', c: '#22c55e', icon: '✓' },
            { l: 'Watch Zones', v: '2', c: '#f59e0b', icon: '⚠' },
            { l: 'Critical', v: '0', c: '#ef4444', icon: '✕' },
          ].map(d => (
            <div key={d.l} className="flex items-center gap-3 px-3 py-2 rounded-[8px]" style={{ background: `${d.c}10`, border: `1px solid ${d.c}18` }}>
              <div className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center text-[10px] font-black" style={{ background: `${d.c}22`, color: d.c }}>{d.icon}</div>
              <div className="flex-1">
                <div className="text-[11px] font-black" style={{ color: d.c }}>{d.v}</div>
                <div className="text-[6.5px] font-bold text-white/40 uppercase tracking-wider">{d.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Detail Grid */}
      <div className="flex-none mt-7" style={{ paddingLeft: 18, paddingRight: 18 }}>
        <div className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-3">Zone Breakdown</div>
        <div className="grid grid-cols-3 gap-2.5">
          {zones.map((z, i) => (
            <div key={i} className="rounded-[10px] overflow-hidden border transition-all duration-300" style={{
              borderColor: `${z.c}25`,
              background: 'rgba(255,255,255,0.02)',
            }}>
              {/* Gradient top accent */}
              <div className="h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${z.c}, transparent)` }} />
              <div className="px-2 py-2.5 text-center">
                <div className="text-[16px] mb-1">🦷</div>
                <div className="text-[6.5px] font-black text-white/50 uppercase tracking-wider mb-1.5">{z.n}</div>
                <div className="text-[14px] font-black" style={{ color: z.c }}>{z.score}%</div>
                <div className="mt-1.5 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${z.score}%`, background: z.c, transition: 'width 1s ease-out' }} />
                </div>
                <div className="text-[5.5px] font-black uppercase mt-1.5" style={{ color: z.c }}>
                  {z.s === 'good' ? '✓ Good' : '⚠ Watch'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scan History */}
      <div className="flex-none mt-14 mb-4" style={{ paddingLeft: 18, paddingRight: 18 }}>
        <div className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-4">Recent Scans</div>
        <div className="flex items-end justify-between gap-1.5 px-2 h-[50px]">
          {scanHistory.map((s, i) => {
            const h = (s / 100) * 35; // Constrained height so text above it fits inside the container
            const isLatest = i === scanHistory.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                <div className="text-[8px] font-black" style={{ color: isLatest ? gc : 'rgba(255,255,255,0.4)' }}>{s}</div>
                <div className="w-full rounded-[4px] transition-all" style={{
                  height: h,
                  background: isLatest ? `linear-gradient(to top, ${gc}, #a78bfa)` : 'rgba(255,255,255,0.06)',
                  boxShadow: isLatest ? `0 0 10px ${gc}40` : 'none',
                }} />
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-3 px-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
            <div className="flex-1 text-center text-[7px] font-black text-white/20 uppercase tracking-widest" key={i}>{d}</div>
          ))}
        </div>
      </div>

      {/* Bot Insight */}
      <div className="flex-none mt-[64px] rounded-[10px] px-3.5 py-3 flex items-center gap-3" style={{
        marginLeft: 18, marginRight: 18,
        background: `linear-gradient(135deg, ${gc}10, rgba(167,139,250,0.06))`,
        border: `1px solid ${gc}20`,
      }}>
        <div className="w-8 h-8 rounded-[8px] flex-shrink-0 flex items-center justify-center" style={{ background: `${gc}20` }}>
          {botName === 'buddy' ? <MiniBuddy size={28} /> : botName === 'luna' ? <MiniLuna size={28} /> : <MiniBatman size={28} />}
        </div>
        <div className="flex-1 py-1">
          <div className="text-[7px] font-black uppercase tracking-widest mb-1" style={{ color: gc }}>AI Insight</div>
          <div className="text-[9px] font-bold text-white/80 leading-snug">
            {botName === 'batman' ? 'Upper Left & Lower Right flagged. Fix it tonight.' : botName === 'luna' ? 'Almost perfect! Focus on Upper Left zone 💕' : 'Great progress! Spend extra time on watch zones.'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-none mt-4 mb-4 flex gap-3" style={{ paddingLeft: 18, paddingRight: 18 }}>
        <button onClick={startCameraScan}
          className="flex-1 h-[50px] rounded-[10px] flex items-center justify-center gap-2.5 transition-all active:scale-[0.97] relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${gc}dd, ${gc}88)`, boxShadow: `0 6px 20px ${gc}50` }}>
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="z-10">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span className="text-[10px] font-black text-black uppercase tracking-widest z-10">Open Scanner</span>
        </button>

        <button onClick={startCameraScan}
          className="w-[50px] h-[50px] rounded-[10px] flex items-center justify-center transition-all active:scale-[0.97]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Boot screen (shows all 3 bots) ────────────────── */
function BootScreen() {
  return (
    <div className="absolute inset-0 bg-[#030303] z-50 flex flex-col items-center justify-center gap-3 overflow-hidden">
      {/* Bots trio */}
      <div className="flex items-end gap-3">
        {[
          { Comp: MiniBuddy, color: '#00E5FF', size: 52, delay: '0s' },
          { Comp: MiniLuna, color: '#FF69B4', size: 60, delay: '0.15s' },
          { Comp: MiniBatman, color: '#FFD700', size: 48, delay: '0.3s' },
        ].map(({ Comp, color, size, delay }, i) => (
          <div key={i} className="flex flex-col items-center gap-1"
            style={{ animation: `bootBotFloat ${1.2 + i * 0.15}s ease-in-out infinite alternate`, animationDelay: delay }}>
            <div className="rounded-[16px] overflow-hidden"
              style={{
                background: `radial-gradient(circle at 40% 35%, ${color}30, ${color}08)`,
                border: `1.5px solid ${color}40`,
                boxShadow: `0 4px 20px ${color}35, 0 0 0 1px ${color}20`,
                padding: 3,
              }}>
              <Comp size={size} />
            </div>
          </div>
        ))}
      </div>

      <div className="text-[11px] text-white font-black tracking-[0.22em] uppercase mt-1">DENTY AI</div>

      <div className="w-28 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full" style={{
          background: 'linear-gradient(90deg, #00E5FF, #FF69B4, #FFD700)',
          animation: 'loadBar 2.4s cubic-bezier(0.4,0,0.2,1) forwards',
        }} />
      </div>

      <div className="text-[7px] text-white/25 font-black uppercase tracking-widest animate-pulse mt-0.5">
        Initializing AI Core...
      </div>
    </div>
  );
}

/* ── Companion selector ─────────────────────────────── */
const COMPANIONS = [
  { id: 'buddy', label: 'Buddy', color: '#00E5FF', Icon: MiniBuddy },
  { id: 'luna', label: 'Luna', color: '#FF69B4', Icon: MiniLuna },
  { id: 'batman', label: 'Batman', color: '#FFD700', Icon: MiniBatman },
];

const TABS = [
  { icon: '❤️', label: 'Health' },
  { icon: '⏱️', label: 'Timer' },
  { icon: '💬', label: 'Chat' },
  { icon: '🔍', label: 'Scan' },
];

const FEATURES = [
  { icon: '🧠', text: 'AI teeth scan after every session' },
  { icon: '⏱️', text: 'Real-time 4-zone brushing guide' },
  { icon: '🔥', text: 'Daily streak & health score tracking' },
  { icon: '💬', text: 'Chat with your AI companion 24/7' },
];

export default function AppSection({ onEnter }) {
  const sectionRef = useRef(null);
  const featuresRef = useRef([]);
  const [phoneState, setPhoneState] = useState('off'); // off | booting | on
  const [activeScreen, setActiveScreen] = useState(0);
  const [companion, setCompanion] = useState('buddy');
  const navigate = useNavigate();

  const gc = COMPANIONS.find(c => c.id === companion)?.color || '#00E5FF';

  useEffect(() => {
    let timer;
    if (phoneState === 'booting') timer = setTimeout(() => setPhoneState('on'), 2700);
    return () => clearTimeout(timer);
  }, [phoneState]);

  // Stabilize onEnter via ref — prevents GSAP context teardown on re-render
  const onEnterRef = useRef(onEnter);
  useEffect(() => { onEnterRef.current = onEnter; }, [onEnter]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      if (onEnterRef.current) {
        ScrollTrigger.create({ trigger: section, start: 'top 50%', onEnter: () => onEnterRef.current?.(), onEnterBack: () => onEnterRef.current?.() });
      }
      gsap.from(featuresRef.current.filter(Boolean), {
        x: -24, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 60%', toggleActions: 'restart none none none' },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const PHONE_W = 320;
  const PHONE_H = 660;
  const FRAME_PAD = 12; // Thinner physical bezels, screen fills it entirely
  const BEZEL_R = 48;
  const SCREEN_R = 38;
  const NAV_H = 48;

  // All pixels inside the bezel that are available for text/content
  const SCREEN_W = PHONE_W - FRAME_PAD * 2;
  const SCREEN_H = PHONE_H - FRAME_PAD * 2;

  return (
    <section
      id="app"
      ref={sectionRef}
      className="relative flex items-center justify-center pb-24 px-6 overflow-hidden transition-colors duration-700"
      style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '120px' }}
    >
      {/* Background orb */}
      <div className="absolute pointer-events-none" style={{
        left: '65%', top: '50%', width: 700, height: 700,
        transform: 'translate(-50%,-50%)',
        background: `radial-gradient(circle, ${gc}12 0%, transparent 60%)`,
        animation: 'appGlowOrb 5s ease-in-out infinite',
        transition: 'background 0.6s',
      }} />

      <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 px-6 lg:px-24">

        {/* ── LEFT: Text (Moved Right) ──────────────────── */}
        <div className="flex-1 flex flex-col pt-12 lg:pt-0 pb-12 lg:pb-0 z-20 items-center lg:items-start text-center lg:text-left px-12 sm:px-16 lg:px-0 lg:translate-x-12">
          {/* Aesthetic Line Segment on mobile above the content */}
          <div className="lg:hidden w-16 h-1 rounded-full mb-8 opacity-60" style={{ background: gc }} />

          <div className="inline-flex items-center justify-center lg:justify-start gap-3 md:gap-4 mb-4 lg:mb-6">
            <span className="w-3 h-3 md:w-4 md:h-4 rounded-full animate-pulse" style={{ background: gc, boxShadow: `0 0 15px ${gc}` }} />
            <h1 className="text-[22px] md:text-[32px] font-black tracking-[0.25em] uppercase" style={{ color: gc, transition: 'color 0.4s', textShadow: `0 0 20px ${gc}40` }}>
              DENTAL OS
            </h1>
          </div>

          <h2 className="text-[42px] sm:text-[54px] md:text-[68px] font-black tracking-[-0.04em] leading-[1.05] md:leading-[0.95] mb-2 lg:mb-4 transition-colors duration-700 mx-auto lg:mx-0 max-w-lg lg:max-w-xl"
            style={{ background: 'linear-gradient(135deg, var(--text) 0%, rgba(128,128,128,0.35) 150%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Intelligence<br />
            <span className="italic relative inline-block pr-2">built right in.<svg className="absolute w-full h-[6px] md:h-[10px] bottom-[-2px] md:bottom-[-4px] left-0 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0,7 Q50,-1 100,9" fill="none" stroke={gc} strokeWidth="4" strokeLinecap="round" /></svg></span>
          </h2>

          {/* Feature list */}
          <div className="flex flex-col gap-6 w-full max-w-sm mb-12 mx-auto lg:mx-0">
            {FEATURES.map((f, i) => (
              <div key={i} ref={el => featuresRef.current[i] = el}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl group hover:scale-[1.02] transition-all duration-300 text-left"
                style={{ background: 'color-mix(in srgb, var(--text) 4%, transparent)', border: '1px solid color-mix(in srgb, var(--text) 8%, transparent)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[16px] flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
                  style={{ background: `${gc}25`, boxShadow: `0 4px 14px ${gc}15`, border: `1px solid ${gc}40` }}>{f.icon}</div>
                <span className="text-[15px] font-extrabold" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* New App Store Trust Badge */}
          <div className="mb-12 flex flex-col items-center lg:items-start gap-8 mx-auto lg:mx-0 w-full max-w-sm mt-8">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--text) 4%, transparent)' }}>
              <div className="flex gap-[3px] text-yellow-500 text-[14px]">★★★★★</div>
              <span className="text-[13px] font-black uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--text) 60%, transparent)' }}>4.9/5 Rating</span>
            </div>
            <p className="text-[15px] font-bold leading-relaxed mb-2" style={{ color: 'color-mix(in srgb, var(--text) 55%, transparent)' }}>
              Unlock the full potential of your DENTY brush. Get personalized AI insights and real-time guidance directly on your phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 w-full justify-center lg:justify-start mt-10">
              <button onClick={() => window.open('https://apps.apple.com', '_blank')}
                className="group relative flex items-center justify-center gap-4 rounded-[8px] transition-all duration-400 hover:-translate-y-1 overflow-hidden flex-shrink-0"
                style={{ padding: '14px 28px', minWidth: '210px', background: 'var(--text)', color: 'var(--bg)', boxShadow: '0 14px 30px color-mix(in srgb, var(--text) 25%, transparent)' }}>
                {/* Subtle hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: `radial-gradient(circle at center, ${gc}, transparent)` }} />

                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[32px] h-[32px] flex-shrink-0 z-10 transition-transform duration-400 group-hover:scale-110">
                  <path d="M16.365 14.331c-.024-3.14 2.56-4.664 2.675-4.738-1.46-2.138-3.731-2.433-4.544-2.473-1.928-.194-3.763 1.134-4.745 1.134-.981 0-2.51-1.1-4.093-1.07-2.071.028-3.987 1.205-5.05 3.053-2.146 3.714-.548 9.215 1.545 12.235 1.026 1.482 2.247 3.148 3.86 3.088 1.554-.06 2.14-.1 4.093-.1s2.483 0 4.093 0c1.65-.06 2.716-1.583 3.72-3.05 1.16-1.69 1.637-3.328 1.66-3.414-.038-.016-3.153-1.21-3.214-4.665M14.613 6.64c.854-1.033 1.428-2.473 1.272-3.896-1.219.05-2.73.811-3.605 1.867-.701.83-1.391 2.308-1.212 3.704 1.363.106 2.695-.644 3.545-1.675" />
                </svg>
                <div className="flex flex-col items-start z-10 text-left flex-shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.08em] uppercase opacity-70 mb-[-2px] ml-[2px]">Download for</span>
                  <span className="text-[20px] font-black tracking-tight leading-none">iOS App</span>
                </div>
              </button>

              <button onClick={() => window.open('https://play.google.com', '_blank')}
                className="group relative flex items-center justify-center gap-4 rounded-[8px] transition-all duration-400 hover:-translate-y-1 overflow-hidden flex-shrink-0"
                style={{ padding: '14px 28px', minWidth: '210px', background: 'color-mix(in srgb, var(--text) 4%, transparent)', color: 'var(--text)', border: '1.5px solid color-mix(in srgb, var(--text) 15%, transparent)' }}>
                {/* Subtle hover background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500" style={{ background: 'var(--text)' }} />

                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[32px] h-[32px] flex-shrink-0 z-10 transition-transform duration-400 group-hover:scale-110">
                  <path d="M17.525 10.45l-.946-1.64c-.11-.19-.348-.255-.544-.145-.19.11-.257.348-.145.545l.91 1.574A8.774 8.774 0 0 0 12 9.53a8.774 8.774 0 0 0-4.8 1.255l.91-1.575c.112-.196.046-.435-.145-.544-.195-.11-.434-.045-.544.144L6.475 10.45A8.835 8.835 0 0 0 3.254 18h17.493a8.835 8.835 0 0 0-3.222-7.55ZM8.349 15.397a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Zm7.302 0a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z" />
                </svg>
                <div className="flex flex-col items-start z-10 text-left flex-shrink-0">
                  <span className="text-[10px] font-bold tracking-[0.08em] uppercase opacity-70 mb-[-2px] ml-[2px]">Download for</span>
                  <span className="text-[20px] font-black tracking-tight leading-none">Android</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Phone Mockup (Moved Right) ──────────────── */}
        <div className="flex-1 flex justify-center lg:justify-start w-full lg:translate-x-16">
          {/* Dynamic scaling ensures the phone never gets chopped on small edge-to-edge mobile constraints */}
          <div className="relative origin-top scale-[0.80] sm:scale-100 transition-transform duration-300" style={{ width: PHONE_W }}>
            
            {/* ── Ultra-Realistic Black Phone Frame ── */}
            <div className="relative"
              style={{
                width: PHONE_W,
                height: PHONE_H,
                borderRadius: BEZEL_R,
                background: 'linear-gradient(160deg, #2a2a2c 0%, #1a1a1c 18%, #0f0f11 38%, #08080a 55%, #141416 72%, #222224 88%, #111112 100%)',
                boxShadow: [
                  '0 60px 120px rgba(0,0,0,0.45)', 
                  '0 24px 50px rgba(0,0,0,0.35)',
                  'inset 0 3px 6px rgba(255,255,255,0.15)',
                  'inset 0 -2px 4px rgba(0,0,0,0.8)', 
                  '0 0 0 1.5px rgba(0,0,0,0.6)', 
                  '0 0 0 0.5px rgba(255,255,255,0.1)', 
                ].join(', '),
                padding: FRAME_PAD,
              }}>

              {/* Left vertical specular stripe — matte dark curve */}
              <div className="absolute pointer-events-none" style={{
                top: '12%', bottom: '12%', left: 6, width: 3,
                borderRadius: 3,
                background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 70%, rgba(255,255,255,0) 100%)',
              }} />

              {/* Right edge shadow stripe — graphite */}
              <div className="absolute pointer-events-none" style={{
                top: '15%', bottom: '15%', right: 6, width: 4,
                borderRadius: 4,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)',
              }} />

              {/* Camera bump — top center speaker + cam */}
              <div className="absolute pointer-events-none" style={{ top: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #080808, #000)', boxShadow: '0 0 0 1px #111, inset 0 2px 2px rgba(255,255,255,0.15)' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(80,140,255,0.6)', margin: '3px auto' }} />
                </div>
                <div style={{ width: 40, height: 4, borderRadius: 2, background: '#0a0a0a', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.08)' }} />
              </div>

              {/* HW buttons — dark metal */}
              {[{ top: 108, h: 20 }, { top: 140, h: 52 }, { top: 206, h: 52 }].map((b, i) => (
                <div key={i} className="absolute" style={{
                  left: -4, top: b.top, width: 4, height: b.h,
                  borderRadius: '3px 0 0 3px',
                  background: 'linear-gradient(to right, #2a2a2a, #1a1a1a, #0f0f0f)',
                  boxShadow: 'inset 1px 0 1px rgba(255,255,255,0.15), -1px 0 2px rgba(0,0,0,0.8)',
                }} />
              ))}

              {/* Power button — right, interactive, dark metal */}
              <div
                onClick={() => { if (phoneState === 'off') setPhoneState('booting'); else if (phoneState === 'on') setPhoneState('off'); }}
                className="absolute z-50 cursor-pointer group"
                style={{ right: -40, top: 156, width: 56, height: 88 }}
              >
                {/* The physical button itself */}
                <div className={`w-[4px] h-[68px] rounded-r-[4px] ml-1 transition-all duration-300 group-active:brightness-75 relative ${phoneState === 'off' ? 'shadow-[0_0_20px_#fff,0_0_40px_var(--accent)] animate-pulse' : ''}`}
                  style={{ background: phoneState === 'off' ? '#fff' : 'linear-gradient(to right, #1f1f1f, #111, #000)' }} />

                {/* The animated pointing arrow and text */}
                <div className={`absolute left-[16px] top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none transition-opacity duration-500 ${phoneState === 'off' ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="flex items-center" style={{ animation: 'bounceX 1.5s infinite' }}>
                    <div className="w-8 h-[3px] rounded-full" style={{ background: `linear-gradient(to right, ${gc}, transparent)` }} />
                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px]" style={{ borderLeftColor: gc }} />
                  </div>
                  <span className="text-[12px] font-black tracking-widest uppercase whitespace-nowrap px-3 py-1.5 rounded-lg border"
                    style={{ color: '#fff', background: gc, borderColor: 'rgba(255,255,255,0.4)', textShadow: '0 1px 4px rgba(0,0,0,0.5)', boxShadow: `0 0 20px ${gc}80` }}>
                    Click Here to Wake
                  </span>
                </div>
              </div>

              {/* Inner bevel ring around screen — deep black glass well */}
              <div className="absolute pointer-events-none z-20" style={{
                inset: FRAME_PAD - 2,
                borderRadius: BEZEL_R - 2,
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9), inset 0 -1px 1px rgba(255,255,255,0.05)',
              }} />

              {/* ── Black display glass ── */}
              <div className="relative w-full h-full bg-[#030303] overflow-hidden" style={{ borderRadius: BEZEL_R - FRAME_PAD }}>

                {/* ── iOS Pro Status Bar & Dynamic Island ── */}
                <div className="absolute top-0 inset-x-0 z-[60] flex items-start justify-between pointer-events-none drop-shadow-md" style={{ paddingTop: 14, paddingLeft: 28, paddingRight: 24 }}>
                  {/* Time */}
                  <div className="text-[13px] font-medium tracking-tight text-white mt-[1px]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
                    9:41
                  </div>

                  {/* Dynamic Island */}
                  <div className="absolute top-[11px] left-1/2 -translate-x-1/2 flex items-center justify-end"
                    style={{ width: 100, height: 30, background: '#000', borderRadius: 20, paddingRight: 14, boxShadow: 'inset 0 -1px 2px rgba(255,255,255,0.06), 0 2px 10px rgba(0,0,0,0.5)' }}>
                    <div className="w-[12px] h-[12px] rounded-full bg-[#181818] border border-white/[0.08] relative overflow-hidden shadow-inner">
                      <div className="absolute top-[2.5px] right-[2.5px] w-[3px] h-[3px] bg-[#3b82f6] rounded-full opacity-60 blur-[0.5px]" />
                    </div>
                  </div>

                  {/* Right Icons: Signal, WiFi, Battery */}
                  <div className="flex items-center gap-1.5 opacity-95 mt-[3px]">
                    {/* Signal bars */}
                    <div className="flex items-end gap-[1.5px] h-[9px]">
                      <div className="w-[2.5px] h-[4px] bg-white rounded-sm"></div>
                      <div className="w-[2.5px] h-[5.5px] bg-white rounded-sm"></div>
                      <div className="w-[2.5px] h-[7.5px] bg-white rounded-sm"></div>
                      <div className="w-[2.5px] h-[9px] bg-white rounded-sm opacity-30"></div>
                    </div>
                    {/* WiFi (SVG) */}
                    <svg width="14" height="10" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[1px]">
                      <path d="M8 12C9.10457 12 10 11.1046 10 10C10 8.89543 9.10457 8 8 8C6.89543 8 6 8.89543 6 10C6 11.1046 6.89543 12 8 12Z" fill="white" />
                      <path opacity="0.8" d="M11.6569 6.34315C9.64539 4.33166 6.35461 4.33166 4.34315 6.34315L5.75736 7.75736C7.00067 6.51405 9.04308 6.51405 10.2431 7.75736L11.6569 6.34315Z" fill="white" />
                      <path opacity="0.5" d="M15.3137 2.68629C11.3196 -1.30784 4.6804 -1.30784 0.686292 2.68629L2.10051 4.10051C5.35338 0.847636 10.6869 0.847636 13.8995 4.10051L15.3137 2.68629Z" fill="white" />
                    </svg>
                    {/* Battery */}
                    <div className="flex items-center mt-[1px]">
                      <div className="w-[22px] h-[10.5px] border border-white/50 rounded-[3px] p-[1.5px] flex items-center">
                        <div className="w-[14px] h-full bg-white rounded-[1.5px]"></div>
                      </div>
                      <div className="w-[1.5px] h-[4px] bg-white/50 rounded-r-sm"></div>
                    </div>
                  </div>
                </div>

                {/* Screen pixel area — explicitly sized, no flex-based sizing */}
                <div className="absolute overflow-hidden" style={{
                  top: 0, left: 0, right: 0, bottom: 0,
                  borderRadius: SCREEN_R,
                }}>

                  {/* OFF screen */}
                  {phoneState === 'off' && (
                    <div className="absolute inset-0 bg-[#020202] z-40 flex flex-col items-center justify-center gap-4">
                      <div className="flex gap-4 mb-4">
                        {[{ C: MiniBuddy, c: '#00E5FF' }, { C: MiniLuna, c: '#FF69B4' }, { C: MiniBatman, c: '#FFD700' }].map(({ C, c }, i) => (
                          <div key={i} className="rounded-[16px] p-2" style={{ background: `${c}15`, border: `1px solid ${c}30` }}>
                            <C size={44} />
                          </div>
                        ))}
                      </div>

                      {/* Highlighted text inside screen pointing right */}
                      <div className="flex flex-col items-center gap-2 mt-4 text-center px-4">
                        <div className="text-[14px] font-black text-white uppercase tracking-widest drop-shadow-lg"
                          style={{ color: gc, textShadow: `0 0 16px ${gc}80` }}>
                          Device Offline
                        </div>
                        <div className="text-[11px] text-white/70 font-bold uppercase tracking-[0.1em] mt-2 flex items-center gap-2">
                          Click the glowing side button <span className="text-lg">→</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BOOTING */}
                  {phoneState === 'booting' && <BootScreen />}

                  {/* ON — App Layer container changed to deep dark to eliminate pixel leaks on rounded corners! */}
                  <div className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: phoneState === 'on' ? 1 : 0, pointerEvents: phoneState === 'on' ? 'auto' : 'none', zIndex: 10 }}>
                    <div className="relative w-full h-full bg-[#030303]">

                      {/* Each screen: absolute, top=0, bottom=NAV_H — no flex, no cropping */}
                      {[
                        <HealthScreen key="h" botName={companion} glowColor={gc} />,
                        <TimerScreen key="t" glowColor={gc} />,
                        <ChatScreen key="c" botName={companion} glowColor={gc} />,
                        <ScanScreen key="s" botName={companion} glowColor={gc} />,
                      ].map((Scr, i) => (
                        <div key={i} className="absolute inset-0 transition-opacity duration-250"
                          style={{ opacity: activeScreen === i ? 1 : 0, zIndex: activeScreen === i ? 10 : 0, pointerEvents: activeScreen === i ? 'auto' : 'none' }}>
                          <div className="absolute top-0 left-0 right-0 overflow-hidden" style={{ bottom: NAV_H }}>{Scr}</div>
                        </div>
                      ))}

                      {/* Bottom nav bar - Authentic iOS highly premium frosted glass */}
                      <div className="absolute left-0 right-0 bottom-0 flex justify-around items-center z-50 overflow-hidden border-t"
                        style={{ height: NAV_H, background: 'rgba(18,18,20,0.85)', backdropFilter: 'blur(40px)', borderColor: 'rgba(255,255,255,0.04)' }}>
                        {TABS.map((tab, idx) => (
                          <button key={idx} onClick={() => setActiveScreen(idx)}
                            className="flex flex-col items-center justify-center flex-1 h-full gap-1 pt-2 pb-1 relative transition-all duration-300 active:scale-95"
                            style={{ opacity: activeScreen === idx ? 1 : 0.4 }}>
                            {activeScreen === idx && <div className="absolute top-0 w-[40px] h-[30px] rounded-full blur-[20px] pointer-events-none" style={{ background: gc, opacity: 0.15 }} />}
                            <span className="text-[20px] leading-none z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ transform: activeScreen === idx ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.3s cubic-bezier(0.2,0.8,0.2,1)', filter: activeScreen === idx ? `drop-shadow(0 0 10px ${gc})` : 'grayscale(100%) brightness(1.2)' }}>
                              {tab.icon}
                            </span>
                            <span className="text-[6.5px] font-black uppercase tracking-widest z-10"
                              style={{ color: activeScreen === idx ? gc : '#888', transition: 'color 0.3s' }}>
                              {tab.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Glass screen gloss overlay — skeuomorphic reflection */}
                  <div className="absolute inset-0 pointer-events-none z-30" style={{ borderRadius: SCREEN_R }}>
                    {/* Top reflection band */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '38%',
                      borderRadius: `${SCREEN_R}px ${SCREEN_R}px 60% 60%`,
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)',
                    }} />
                    {/* Left edge streak */}
                    <div style={{
                      position: 'absolute', top: '5%', bottom: '5%', left: 0, width: '18%',
                      background: 'linear-gradient(to right, rgba(255,255,255,0.06), transparent)',
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Glow under phone */}
            <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-600"
              style={{ width: 220, height: 60, background: `radial-gradient(ellipse at center, ${gc}50, transparent 70%)`, filter: 'blur(24px)', opacity: 0.7 }} />

          </div>
        </div>
      </div>
    </section>
  );
}
