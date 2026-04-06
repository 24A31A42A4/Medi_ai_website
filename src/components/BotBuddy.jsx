import { useRef, useEffect } from 'react';

function lerp(a, b, t) { return a + (b - a) * t; }

/**
 * BotBuddy – exact match to reference image:
 *  • Chunky mint-teal rounded-square body with 3D shading
 *  • Two big glossy BLACK rounded-square eyes with white gloss
 *  • Small curved dark smile
 *  • Glowing cyan halo ring above head
 *  • Idle float + cursor eye track + blink
 */
export default function BotBuddy({ size = 280, cursorX = 0, cursorY = 0, cursorRef }) {
  const canvasRef = useRef(null);
  const propsRef  = useRef({ cursorX, cursorY });
  useEffect(() => { propsRef.current = { cursorX, cursorY }; }, [cursorX, cursorY]);

  useEffect(() => {
    const handleTouch = (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        propsRef.current.cursorX = (t.clientX / window.innerWidth) * 2 - 1;
        propsRef.current.cursorY = (t.clientY / window.innerHeight) * 2 - 1;
      }
    };
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('mousemove', handleTouch, { passive: true }); // Also capture mouse if not passed
    return () => {
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('mousemove', handleTouch);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const state = {
      eyeLX: 0, eyeLY: 0,
      eyeRX: 0, eyeRY: 0,
      blinkScale: 1,
      blinkTimer: 0,
      blinkPhase: 0,
      nextBlink: 3 + Math.random() * 2,
      isBlinking: false,
      emotion: 'neutral',
      emotionTimer: 0,
    };

    const startTime = performance.now();
    let rafId;

    const draw = (now) => {
      rafId = requestAnimationFrame(draw);
      const t   = (now - startTime) / 1000;
      const W   = size, H = size;
      ctx.clearRect(0, 0, W, H);

      // Float
      const floatY = Math.sin(t * 0.9) * 7;

      // Blink logic
      state.blinkTimer += 1 / 60;
      if (!state.isBlinking && state.blinkTimer >= state.nextBlink) {
        state.isBlinking = true; state.blinkPhase = 0;
      }
      if (state.isBlinking) {
        state.blinkPhase += 1;
        const p = state.blinkPhase;
        state.blinkScale = p < 5 ? Math.max(0.05, 1 - p / 5) : Math.min(1, (p - 5) / 5);
        if (p >= 10) {
          state.isBlinking = false; state.blinkTimer = 0;
          state.nextBlink = 3 + Math.random() * 2;
        }
      }

      // Autonomous expressions (every 1 second)
      state.emotionTimer += 1 / 60;
      if (state.emotionTimer >= 1.0) {
        state.emotionTimer = 0;
        const EMOTIONS = ['neutral', 'happy', 'excited', 'curious', 'sleepy'];
        const rand = Math.random();
        if (rand < 0.4) state.emotion = 'neutral';
        else state.emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      }

      // Eye cursor tracking (Ultra High sensitivity)
      const cr = cursorRef?.current;
      const cx = cr ? cr.x : propsRef.current.cursorX;
      const cy = cr ? cr.y : propsRef.current.cursorY;
      state.eyeLX = lerp(state.eyeLX, cx * 26, 0.6);
      state.eyeLY = lerp(state.eyeLY, cy * 22, 0.6);
      state.eyeRX = lerp(state.eyeRX, cx * 26, 0.6);
      state.eyeRY = lerp(state.eyeRY, cy * 22, 0.6);

      // ── Layout constants ──────────────────────────────────────
      const BODY_W = 196, BODY_H = 196, BODY_R = 52;
      const bx = (W - BODY_W) / 2;
      const by = (H - BODY_H) / 2 + floatY + 12;
      const bodyX = bx + BODY_W / 2;
      const bodyY = by + BODY_H / 2;

      // ── Halo ring (draw first, behind body) ───────────────────
      const haloY   = by - 22;
      const haloTilt = cx * 0.12;

      // Glow shadow
      ctx.save();
      ctx.translate(bodyX, haloY);
      ctx.scale(1, 0.22);
      ctx.beginPath();
      ctx.arc(0, 0, 88, 0, Math.PI * 2);
      ctx.restore();

      // Actual halo
      ctx.save();
      ctx.translate(bodyX, haloY);
      ctx.rotate(haloTilt);
      ctx.scale(1, 0.22);
      ctx.beginPath();
      ctx.arc(0, 0, 88, 0, Math.PI * 2);
      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur  = 28;
      ctx.strokeStyle  = '#00E5FF';
      ctx.lineWidth    = 18 / 0.22;   // compensate y-scale
      // reset shadow so just the stroke glows
      ctx.restore();

      // Halo – properly drawn as ellipse
      ctx.save();
      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur  = 30;
      ctx.strokeStyle = '#26F0FF';
      ctx.lineWidth   = 7;
      ctx.beginPath();
      ctx.ellipse(bodyX + cx * 3, haloY + cy * 1, 88, 20, haloTilt, 0, Math.PI * 2);
      ctx.stroke();
      // Second pass for inner brightness
      ctx.shadowBlur  = 10;
      ctx.strokeStyle = '#AAFBFF';
      ctx.lineWidth   = 2.5;
      ctx.beginPath();
      ctx.ellipse(bodyX + cx * 3, haloY + cy * 1, 88, 20, haloTilt, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // ── Body – 3D teal rounded square ─────────────────────────
      // Outer drop shadow
      ctx.save();
      ctx.shadowColor   = '#00D4E8';
      ctx.shadowBlur    = 36;
      ctx.shadowOffsetY = 14;

      // Base gradient (3D look: lighter top, slightly darker bottom edge)
      const bodyGrad = ctx.createLinearGradient(bx, by, bx, by + BODY_H);
      bodyGrad.addColorStop(0,   '#D6F3F6');
      bodyGrad.addColorStop(0.5, '#B8E8EC');
      bodyGrad.addColorStop(1,   '#9ED4D9');

      ctx.beginPath();
      ctx.roundRect(bx, by, BODY_W, BODY_H, BODY_R);
      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.restore();

      // Outer rim / border highlight (lighter top, subtle)
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(bx, by, BODY_W, BODY_H, BODY_R);
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // Inner face panel (slightly lighter inset)
      const INSET = 10;
      const panelGrad = ctx.createLinearGradient(bx + INSET, by + INSET, bx + INSET, by + BODY_H - INSET);
      panelGrad.addColorStop(0, '#E8F8FA');
      panelGrad.addColorStop(1, '#C9EBEF');
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(bx + INSET, by + INSET, BODY_W - INSET * 2, BODY_H - INSET * 2, BODY_R - 10);
      ctx.fillStyle = panelGrad;
      ctx.fill();
      ctx.restore();

      // ── Eyes (large glossy black rounded squares) ─────────────
      let LE_W = 52, LE_H = 52;
      let RE_W = 52, RE_H = 52;
      if (state.emotion === 'excited') { LE_W=RE_W=56; LE_H=RE_H=60; }
      else if (state.emotion === 'happy') { LE_H=RE_H=44; }
      else if (state.emotion === 'curious') { LE_W=56; LE_H=60; RE_W=44; RE_H=44; }
      else if (state.emotion === 'sleepy') { LE_H=RE_H=20; }
      
      const EYE_R = 14;
      const LEX = bodyX - 34 + state.eyeLX - LE_W / 2;
      const REX = bodyX + 34 + state.eyeRX - RE_W / 2;
      const EYE_Y_CEN = bodyY - 16 + state.eyeLY;

      [{ ex: LEX, w: LE_W, h: LE_H }, { ex: REX, w: RE_W, h: RE_H }].forEach(({ ex, w, h }) => {
        const eh = h * state.blinkScale;
        const eyeTop = EYE_Y_CEN - h / 2 + (h - eh) / 2;

        // Glossy black eye body
        const eyeGrad = ctx.createRadialGradient(
          ex + w * 0.4, eyeTop + eh * 0.3, 2,
          ex + w / 2,   eyeTop + eh / 2,   w * 0.75
        );
        eyeGrad.addColorStop(0,   '#3a3a3a');
        eyeGrad.addColorStop(0.4, '#111111');
        eyeGrad.addColorStop(1,   '#000000');

        ctx.save();
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur  = 10;
        ctx.beginPath();
        if (eh > 4) {
          ctx.roundRect(ex, eyeTop, w, eh, Math.min(EYE_R, eh / 2));
        } else {
          ctx.rect(ex, EYE_Y_CEN - 2, w, 4);
        }
        ctx.fillStyle = eyeGrad;
        ctx.fill();
        ctx.restore();

        // White gloss – large upper-right catch light
        if (eh > 15) {
          ctx.save();
          ctx.globalAlpha = 0.9;
          ctx.beginPath();
          ctx.ellipse(ex + w * 0.68, eyeTop + eh * 0.22, 8 * (w/52), 10 * (h/52), -0.4, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.restore();

          // Smaller secondary gloss dot
          ctx.save();
          ctx.globalAlpha = 0.65;
          ctx.beginPath();
          ctx.arc(ex + w * 0.28, eyeTop + eh * 0.28, 3.5 * (w/52), 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.restore();
        }
      });

      // ── Smile (small, dark, friendly arc) ────────────────────
      const smileY = bodyY + (state.emotion === 'excited' || state.emotion === 'curious' ? 24 : 28);
      ctx.save();
      ctx.beginPath();
      
      if (state.emotion === 'excited' || state.emotion === 'curious') {
        ctx.arc(bodyX, smileY, state.emotion === 'curious' ? 8 : 14, 0, Math.PI * 2);
        ctx.fillStyle = '#1a1a1a';
        ctx.fill();
      } else if (state.emotion === 'sleepy') {
        ctx.moveTo(bodyX - 12, smileY);
        ctx.lineTo(bodyX + 12, smileY);
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth   = 3.5;
        ctx.lineCap     = 'round';
        ctx.stroke();
      } else {
        const smileRadius = state.emotion === 'happy' ? 24 : 18;
        ctx.arc(bodyX, smileY, smileRadius, 0.15, Math.PI - 0.15);
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth   = 3.5;
        ctx.lineCap     = 'round';
        ctx.stroke();
      }
      ctx.restore();
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [size, cursorRef]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ display: 'block', width: '100%', maxWidth: size, height: 'auto', aspectRatio: '1/1', background: 'transparent', border: 'none', outline: 'none' }}
    />
  );
}
