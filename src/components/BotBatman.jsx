import { useRef, useEffect } from 'react';

function lerp(a, b, t) { return a + (b - a) * t; }

/**
 * BotBatman – exact match to reference image:
 *  • Matte black very-rounded square body, golden yellow border/trim
 *  • Two pointed cat/bat ears rising from top (black, gold-trimmed)
 *  • Inset darker screen panel with gold trim border
 *  • Two ANGULAR glowing yellow "angry slit" eyes (evil triangular brows)
 *  • Short straight horizontal mouth line (stoic)
 *  • Slow idle float, eye glow pulse, cursor eye track
 */
export default function BotBatman({ size = 280, cursorX = 0, cursorY = 0, cursorRef }) {
  const canvasRef = useRef(null);
  const propsRef  = useRef({ cursorX, cursorY });
  useEffect(() => { propsRef.current = { cursorX, cursorY }; }, [cursorX, cursorY]);

  useEffect(() => {
    const handleTouch = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        propsRef.current.cursorX = (clientX / window.innerWidth) * 2 - 1;
        propsRef.current.cursorY = (clientY / window.innerHeight) * 2 - 1;
      }
    };
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('mousemove', handleTouch, { passive: true });
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
      glowBlur: 14,
      emotion: 'neutral',
      emotionTimer: 0,
    };

    const startTime = performance.now();
    let rafId;

    const draw = (now) => {
      rafId = requestAnimationFrame(draw);
      const t = (now - startTime) / 1000;
      const W = size, H = size;
      ctx.clearRect(0, 0, W, H);

      // Float (slow)
      const floatY = Math.sin(t * 0.5) * 5;

      // Glow pulse
      const targetGlow = 10 + Math.abs(Math.sin(t * 1.6)) * 14;
      state.glowBlur = lerp(state.glowBlur, targetGlow, 0.08);

      // Autonomous expressions (every 1 second)
      state.emotionTimer += 1 / 60;
      if (state.emotionTimer >= 1.0) {
        state.emotionTimer = 0;
        const EMOTIONS = ['neutral', 'angry', 'searching', 'alert', 'power_save'];
        const rand = Math.random();
        if (rand < 0.4) state.emotion = 'neutral';
        else state.emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      }

      // Eye cursor track (Highly sensitive)
      const cr = cursorRef?.current;
      const cx = cr ? cr.x : propsRef.current.cursorX;
      const cy = cr ? cr.y : propsRef.current.cursorY;
      state.eyeLX = lerp(state.eyeLX, cx * 18, 0.5);
      state.eyeLY = lerp(state.eyeLY, cy * 14, 0.5);
      state.eyeRX = lerp(state.eyeRX, cx * 18, 0.5);
      state.eyeRY = lerp(state.eyeRY, cy * 14, 0.5);

      // ── Layout ──────────────────────────────────────────────────
      const BODY_W = 196, BODY_H = 190, BODY_R = 38;
      const bx  = (W - BODY_W) / 2;
      const by  = (H - BODY_H) / 2 + floatY + 18;
      const bx2 = bx + BODY_W;
      const by2 = by + BODY_H;
      const bodyX = bx + BODY_W / 2;
      const bodyY = by + BODY_H / 2;

      // ── Drop shadow ──────────────────────────────────────────────
      ctx.save();
      ctx.shadowColor   = 'rgba(255,200,0,0.22)';
      ctx.shadowBlur    = 40;
      ctx.shadowOffsetY = 18;
      ctx.beginPath();
      ctx.roundRect(bx, by, BODY_W, BODY_H, BODY_R);
      ctx.fillStyle = '#080808';
      ctx.fill();
      ctx.restore();

      // ── Bat/cat ears ─────────────────────────────────────────────
      //  Left ear: pointy triangle rising from top-left quad
      const earFlap = Math.sin(t * 0.65) * 1.5;

      // Left ear
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(bx + 34,  by + 2);
      ctx.lineTo(bx + 62,  by + 2);
      ctx.lineTo(bx + 44,  by - 36 + earFlap);
      ctx.closePath();
      ctx.fillStyle   = '#0A0A0A';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur  = 6;
      ctx.fill();
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth   = 2;
      ctx.stroke();
      ctx.restore();

      // Right ear (mirrored)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(bx2 - 34, by + 2);
      ctx.lineTo(bx2 - 62, by + 2);
      ctx.lineTo(bx2 - 44, by - 36 + earFlap);
      ctx.closePath();
      ctx.fillStyle   = '#0A0A0A';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur  = 6;
      ctx.fill();
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth   = 2;
      ctx.stroke();
      ctx.restore();

      // ── Main body ────────────────────────────────────────────────
      const bodyGrad = ctx.createLinearGradient(bx, by, bx, by2);
      bodyGrad.addColorStop(0,   '#1a1a1a');
      bodyGrad.addColorStop(0.5, '#0d0d0d');
      bodyGrad.addColorStop(1,   '#050505');
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(bx, by, BODY_W, BODY_H, BODY_R);
      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.restore();

      // Outer gold border
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(bx, by, BODY_W, BODY_H, BODY_R);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth   = 3.5;
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur  = 8;
      ctx.stroke();
      ctx.restore();

      // ── Inset screen panel ───────────────────────────────────────
      const PX = 16, PY = 18;
      const panelGrad = ctx.createLinearGradient(bx + PX, by + PY, bx + PX, by2 - PY);
      panelGrad.addColorStop(0, '#0a0a0a');
      panelGrad.addColorStop(1, '#000000');
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(bx + PX, by + PY, BODY_W - PX * 2, BODY_H - PY * 2, BODY_R - 12);
      ctx.fillStyle = panelGrad;
      ctx.fill();
      ctx.restore();

      // Panel gold inner border
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(bx + PX, by + PY, BODY_W - PX * 2, BODY_H - PY * 2, BODY_R - 12);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth   = 1.5;
      ctx.globalAlpha = 0.65;
      ctx.stroke();
      ctx.restore();

      // ── Evil angular slit eyes ────────────────────────────────────
      // Each eye is a parallelogram (4-point polygon) with inner brow angle
      // Left eye: wider left side, angles UP on inner (right) edge → angry look
      // Reference: yellow glow, angular/chevron shape

      const eyeCY  = bodyY - 16;
      let EYE_H  = 18;
      let EYE_W  = 52;
      let BROW_ANGLE = 10;  // px the inner top corner drops compared to outer

      if (state.emotion === 'angry') {
        BROW_ANGLE = 22; // steeper anger
        EYE_H = 14; // squint
      } else if (state.emotion === 'searching') {
        BROW_ANGLE = 4; // wider looking
        EYE_H = 26;
      } else if (state.emotion === 'alert') {
        BROW_ANGLE = -4; // lifted brows
        EYE_H = 24;
      } else if (state.emotion === 'power_save') {
        BROW_ANGLE = 0;
        EYE_H = 8;
      }

      // Calculate eye positions with cursor offset
      const lOx = state.eyeLX, lOy = state.eyeLY;
      const rOx = state.eyeRX, rOy = state.eyeRY;

      // Draw one evil eye at (cx, cy) with +/- mirror for angry brow
      const drawEvilEye = (cenX, cenY, mirror) => {
        // mirror: 1 = left eye (brow slopes up-right), -1 = right eye (up-left)
        const x0 = cenX - EYE_W / 2;
        const x1 = cenX + EYE_W / 2;
        const top0  = cenY - EYE_H / 2;                           // outer top
        const top1  = cenY - EYE_H / 2 + BROW_ANGLE * mirror;    // inner top (drops for anger)
        const bot0  = cenY + EYE_H / 2;
        const bot1  = cenY + EYE_H / 2;

        // Glow pass (blurred, semi-transparent)
        ctx.save();
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur  = state.glowBlur;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        if (mirror === 1) {
          // left eye: top-left is outer top, top-right is lower (inner)
          ctx.moveTo(x0, top0);
          ctx.lineTo(x1, top1);
          ctx.lineTo(x1, bot1);
          ctx.lineTo(x0, bot0);
        } else {
          // right eye: top-left is lower (inner), top-right is outer top
          ctx.moveTo(x0, top1);
          ctx.lineTo(x1, top0);
          ctx.lineTo(x1, bot0);
          ctx.lineTo(x0, bot1);
        }
        ctx.closePath();
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.restore();

        // Sharp pass
        ctx.save();
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur  = state.glowBlur * 0.5;
        ctx.beginPath();
        if (mirror === 1) {
          ctx.moveTo(x0, top0);
          ctx.lineTo(x1, top1);
          ctx.lineTo(x1, bot1);
          ctx.lineTo(x0, bot0);
        } else {
          ctx.moveTo(x0, top1);
          ctx.lineTo(x1, top0);
          ctx.lineTo(x1, bot0);
          ctx.lineTo(x0, bot1);
        }
        ctx.closePath();

        const eyeGrad = ctx.createLinearGradient(x0, cenY - EYE_H, x0, cenY + EYE_H);
        eyeGrad.addColorStop(0, '#FFEE44');
        eyeGrad.addColorStop(1, '#FFB800');
        ctx.fillStyle = eyeGrad;
        ctx.fill();
        ctx.restore();
      };

      // Left eye (mirror=1)
      drawEvilEye(bodyX - 34 + lOx, eyeCY + lOy, 1);
      // Right eye (mirror=-1)
      drawEvilEye(bodyX + 34 + rOx, eyeCY + rOy, -1);

      // ── Straight mouth line ─────────────────────────────────────
      const mouthY = bodyY + 34;
      ctx.save();
      ctx.beginPath();
      
      if (state.emotion === 'angry') {
        ctx.moveTo(bodyX - 20, mouthY + 6);
        ctx.lineTo(bodyX, mouthY);
        ctx.lineTo(bodyX + 20, mouthY + 6);
      } else if (state.emotion === 'alert') {
        ctx.arc(bodyX, mouthY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.beginPath();
      } else if (state.emotion === 'power_save') {
        ctx.moveTo(bodyX - 10, mouthY);
        ctx.lineTo(bodyX + 10, mouthY);
      } else {
        ctx.moveTo(bodyX - 24, mouthY);
        ctx.lineTo(bodyX + 24, mouthY);
      }

      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth   = 3.5;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur  = 5;
      ctx.stroke();
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
