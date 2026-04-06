import { useRef, useEffect } from 'react';

function lerp(a, b, t) { return a + (b - a) * t; }

/**
 * BotLuna – exact match to reference image:
 *  • White/cream rounded-square robot head body with slight 3D shading
 *  • Two square pink eyes, rosy cheek blush circles, tiny beauty-mark dot
 *  • Small pink curved smile
 *  • Large pink bow (two round lobes + round knot) top-left
 *  • Side antenna nubs (left + right ear stubs)
 *  • Orbiting hearts crown above head (string of mixed solid+outline hearts)
 *  • Idle float + cursor eye track + blink
 */
export default function BotLuna({ size = 280, cursorX = 0, cursorY = 0, cursorRef }) {
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
      blinkScale: 1, blinkTimer: 0, blinkPhase: 0,
      nextBlink: 3 + Math.random() * 2,
      isBlinking: false,
      emotion: 'neutral',
      emotionTimer: 0,
    };

    const startTime = performance.now();
    let rafId;

    // ── Draw a heart centered at (cx, cy) ─────────────────────────────
    function drawHeart(cx, cy, s, fill, outline) {
      ctx.save();
      ctx.translate(cx, cy - s * 0.5);
      const hs = s * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, hs);
      ctx.bezierCurveTo(-hs * 0.1, hs * 0.6, -hs, hs * 0.2, -hs, -hs * 0.1);
      ctx.bezierCurveTo(-hs, -hs * 0.6, -hs * 0.4, -hs, 0, -hs * 0.3);
      ctx.bezierCurveTo(hs * 0.4, -hs, hs, -hs * 0.6, hs, -hs * 0.1);
      ctx.bezierCurveTo(hs, hs * 0.2, hs * 0.1, hs * 0.6, 0, hs);
      ctx.closePath();
      if (outline) {
        ctx.strokeStyle = fill;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      } else {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      ctx.restore();
    }

    const draw = (now) => {
      rafId = requestAnimationFrame(draw);
      const t = (now - startTime) / 1000;
      const W = size, H = size;
      ctx.clearRect(0, 0, W, H);

      // Float
      const floatY = Math.sin(t * 0.85) * 6;

      // Blink
      state.blinkTimer += 1 / 60;
      if (!state.isBlinking && state.blinkTimer >= state.nextBlink) {
        state.isBlinking = true; state.blinkPhase = 0;
      }
      if (state.isBlinking) {
        state.blinkPhase += 1;
        const p = state.blinkPhase;
        state.blinkScale = p < 5 ? Math.max(0.05, 1 - p / 5) : Math.min(1, (p - 5) / 5);
        if (p >= 10) { state.isBlinking = false; state.blinkTimer = 0; state.nextBlink = 3 + Math.random() * 2; }
      }

      state.emotionTimer += 1 / 60;
      if (state.emotionTimer >= 1.0) {
        state.emotionTimer = 0;
        const EMOTIONS = ['neutral', 'happy', 'surprised', 'wink', 'sleepy'];
        const rand = Math.random();
        if (rand < 0.4) state.emotion = 'neutral';
        else state.emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      }

      // High sensitivity eye track
      const cr = cursorRef?.current;
      const cx = cr ? cr.x : propsRef.current.cursorX;
      const cy = cr ? cr.y : propsRef.current.cursorY;
      state.eyeLX = lerp(state.eyeLX, cx * 20, 0.6);
      state.eyeLY = lerp(state.eyeLY, cy * 16, 0.6);
      state.eyeRX = lerp(state.eyeRX, cx * 20, 0.6);
      state.eyeRY = lerp(state.eyeRY, cy * 16, 0.6);

      // ── Layout ──────────────────────────────────────────────────
      const BODY_W = 186, BODY_H = 172, BODY_R = 32;
      const bx = (W - BODY_W) / 2 + 10;   // slightly right to make room for bow
      const by = (H - BODY_H) / 2 + floatY + 24;
      const bodyX    = bx + BODY_W / 2;
      const bodyY    = by + BODY_H / 2;
      const bodyTop  = by;
      const bodyLeft = bx;
      const bodyRight = bx + BODY_W;

      // ── Orbiting hearts crown ─────────────────────────────────
      const ORBIT_X  = bodyX;
      const ORBIT_Y  = bodyTop - 40; // float higher above head
      const ORBIT_RX = 85, ORBIT_RY = 18; // flat ring
      const HEART_COUNT = 24; // more dense beautiful halo

      const crownGrad = ctx.createRadialGradient(ORBIT_X, ORBIT_Y, 5, ORBIT_X, ORBIT_Y, 90);
      crownGrad.addColorStop(0, 'rgba(255,182,193,0.3)');
      crownGrad.addColorStop(1, 'rgba(255,182,193,0)');
      ctx.save();
      ctx.fillStyle = crownGrad;
      // no fillRect
      ctx.restore();

      for (let i = 0; i < HEART_COUNT; i++) {
        const baseAngle = (i / HEART_COUNT) * Math.PI * 2;
        const angle     = baseAngle - t * 0.4;
        const hx = ORBIT_X + Math.cos(angle) * ORBIT_RX;
        const hy = ORBIT_Y + Math.sin(angle) * ORBIT_RY;
        const isOutline = i % 2 !== 0; 
        const s = 5.5; // tiny delicate hearts
        drawHeart(hx, hy, s, '#FF69B4', isOutline);
      }



      // ── Body (white/cream 3D rounded square) ──────────────────
      ctx.save();
      ctx.shadowColor   = 'rgba(255,182,193,0.3)';
      ctx.shadowBlur    = 60;
      ctx.shadowOffsetY = 0; // perfectly centered, NO boxed drop shadow

      const bodyGrad = ctx.createLinearGradient(bx, by, bx, by + BODY_H);
      bodyGrad.addColorStop(0,   '#FFFFFF');
      bodyGrad.addColorStop(0.6, '#FFF0F5');
      bodyGrad.addColorStop(1,   '#FFB6C1');

      ctx.beginPath();
      ctx.roundRect(bx, by, BODY_W, BODY_H, BODY_R);
      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.restore();

      // Rim highlight
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(bx, by, BODY_W, BODY_H, BODY_R);
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth   = 2.5;
      ctx.stroke();
      ctx.restore();

      // Inner face panel
      const faceGrad = ctx.createLinearGradient(bx + 12, by + 12, bx + 12, by + BODY_H - 12);
      faceGrad.addColorStop(0, '#FFFFFF');
      faceGrad.addColorStop(1, '#FFF0F5');
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(bx + 12, by + 12, BODY_W - 24, BODY_H - 24, BODY_R - 12);
      ctx.fillStyle = faceGrad;
      ctx.fill();
      ctx.restore();

      // ── Bow (top-left of head) ────────────────────────────────
      // Base positions for the bow as requested:
      const bowLeftX = bx + 18;
      const bowLeftY = by + 12;
      const bowRightX = bx + 38;
      const bowRightY = by + 12;
      const knotX = bx + 28;
      const knotY = by + 12;

      // Left lobe (28x20px -> radius 14x10, rotated -40deg = -0.7 rad)
      ctx.save();
      ctx.translate(bowLeftX, bowLeftY + Math.sin(t * 1.4) * 2);
      ctx.rotate(-0.7);
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 10, 0, 0, Math.PI * 2);
      const lobeGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, 14);
      lobeGrad.addColorStop(0, '#FF85C0');
      lobeGrad.addColorStop(1, '#E91E8C');
      ctx.fillStyle = lobeGrad;
      ctx.shadowColor = 'rgba(233,30,140,0.4)';
      ctx.shadowBlur  = 8;
      ctx.fill();
      ctx.restore();

      // Right lobe (28x20px -> radius 14x10, rotated 40deg = 0.7 rad)
      ctx.save();
      ctx.translate(bowRightX, bowRightY + Math.sin(t * 1.4) * 2);
      ctx.rotate(0.7);
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = lobeGrad;
      ctx.shadowColor = 'rgba(233,30,140,0.4)';
      ctx.shadowBlur  = 8;
      ctx.fill();
      ctx.restore();

      // Knot ball (circle 8px -> radius 4)
      ctx.save();
      ctx.beginPath();
      ctx.arc(knotX, knotY + Math.sin(t * 1.4) * 2, 4, 0, Math.PI * 2);
      const knotGrad = ctx.createRadialGradient(knotX - 2, knotY - 1, 1, knotX, knotY, 4);
      knotGrad.addColorStop(0, '#FF4DA6');
      knotGrad.addColorStop(1, '#C2185B');
      ctx.fillStyle = knotGrad;
      ctx.shadowColor = 'rgba(194,24,91,0.5)';
      ctx.shadowBlur  = 6;
      ctx.fill();
      ctx.restore();

      // ── Eyes (bright pink rounded squares) ───────────────────
      let LE_W = 32, LE_H = 32;
      let RE_W = 32, RE_H = 32;

      if (state.emotion === 'surprised') {
        LE_W = RE_W = 36; LE_H = RE_H = 40;
      } else if (state.emotion === 'happy') {
        LE_H = RE_H = 24;
      } else if (state.emotion === 'wink') {
        LE_H = 6;
        RE_W = 36; RE_H = 36;
      } else if (state.emotion === 'sleepy') {
        LE_H = RE_H = 12;
      }

      const EYE_R = 10;
      const LEX = bodyX - 32 + state.eyeLX - LE_W / 2;
      const REX = bodyX + 32 + state.eyeRX - RE_W / 2;
      const EYE_Y_CEN = bodyY - 14 + state.eyeLY;

      [{ ex: LEX, w: LE_W, h: LE_H }, { ex: REX, w: RE_W, h: RE_H }].forEach(({ ex, w, h }) => {
        const eh = h * state.blinkScale;
        const eyeTop = EYE_Y_CEN - h / 2 + (h - eh) / 2;

        ctx.save();
        ctx.beginPath();
        if (eh > 4) {
          ctx.roundRect(ex, eyeTop, w, eh, Math.min(EYE_R, eh / 2));
        } else {
          ctx.rect(ex, EYE_Y_CEN - 2, w, 4);
        }
        ctx.fillStyle = '#E91E8C'; // Rich solid pink eyes
        ctx.fill();
        ctx.restore();

        // Delicate top-right gloss
        if (eh > 12) {
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(ex + w * 0.7, eyeTop + eh * 0.25, 3, 4, -0.3, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.restore();
        }
      });

      // ── Blush cheeks (Tiny perfect soft pink circles) ─────────────────────────
      ctx.save();
      ctx.globalAlpha = 0.35;
      const blushRadius = state.emotion === 'happy' ? 14 : 10;
      const bY = EYE_Y_CEN + 20; // right below outer corner
      const bLx = LEX - 6; 
      const bRx = REX + RE_W + 6;

      const blushL = ctx.createRadialGradient(bLx, bY, 0, bLx, bY, blushRadius);
      blushL.addColorStop(0,   '#FF1493');
      blushL.addColorStop(1,   'transparent');
      ctx.fillStyle = blushL;
      ctx.beginPath();
      ctx.arc(bLx, bY, blushRadius, 0, Math.PI * 2);
      ctx.fill();

      const blushR = ctx.createRadialGradient(bRx, bY, 0, bRx, bY, blushRadius);
      blushR.addColorStop(0,   '#FF1493');
      blushR.addColorStop(1,   'transparent');
      ctx.fillStyle = blushR;
      ctx.beginPath();
      ctx.arc(bRx, bY, blushRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ── Smile (Delicate tiny pink arc) ──────────────────────────────────────────────────
      ctx.save();
      ctx.beginPath();
      if (state.emotion === 'surprised' || state.emotion === 'sleepy') {
        ctx.arc(bodyX, bodyY + 30, state.emotion === 'sleepy' ? 2 : 4, 0, Math.PI * 2);
        ctx.fillStyle = '#E91E8C';
        ctx.fill();
      } else {
        const smileW = state.emotion === 'happy' ? 10 : 8;
        ctx.arc(bodyX, bodyY + 30, smileW, 0.1, Math.PI - 0.1);
        ctx.strokeStyle = '#E91E8C';
        ctx.lineWidth   = 3;
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
