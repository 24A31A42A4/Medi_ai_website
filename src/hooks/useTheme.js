import { useState, useEffect, useCallback, useRef } from 'react';

// ── Theme definitions ─────────────────────────────────────────────────
const THEMES = {
  buddy: {
    bg:      '#FFFFFF',
    accent:  '#00E5FF',
    text:    '#0A0A0A',
    surface: '#F5F5F5',
  },
  luna: {
    bg:      '#FFF0F5',
    accent:  '#FF69B4',
    text:    '#3D0020',
    surface: '#FFE4EF',
  },
  batman: {
    bg:      '#0A0A0A',
    accent:  '#FFD700',
    text:    '#FFFFFF',
    surface: '#1A1A1A',
  },
};

// ── Color helpers ─────────────────────────────────────────────────────

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b]
    .map(v => Math.round(Math.max(0, Math.min(255, v)))
      .toString(16).padStart(2, '0'))
    .join('');
}

function hexToRgba(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Direct RGB lerp — no hue cycling, no rainbow flashes
function lerpColor(hexA, hexB, t) {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  return rgbToHex(
    r1 + (r2 - r1) * t,
    g1 + (g2 - g1) * t,
    b1 + (b2 - b1) * t,
  );
}

// ── "Snap" easing — zips through the midpoint, lingers at endpoints ──
// This means ugly mid-tone colors are visible for only 2-3 frames
function snapEasing(t) {
  if (t < 0.5) {
    return 8 * t * t * t * t;          // slow leave from source
  }
  return 1 - 8 * Math.pow(1 - t, 4);   // slow arrival at target
}

// ── Apply theme to :root CSS variables ────────────────────────────────
function applyColors(bg, accent, text, surface) {
  const root = document.documentElement;
  root.style.setProperty('--bg',          bg);
  root.style.setProperty('--accent',      accent);
  root.style.setProperty('--text',        text);
  root.style.setProperty('--surface',     surface);
  root.style.setProperty('--accent-glow', hexToRgba(accent, 0.4));
}

// ── Transition duration ───────────────────────────────────────────────
const TRANSITION_MS = 500;

// ── Clean up leftover infrastructure from previous versions ───────────
function cleanupOldInfra() {
  const el1 = document.getElementById('denty-theme-overlay');
  if (el1) el1.remove();
  const el2 = document.getElementById('denty-theme-transition-styles');
  if (el2) el2.remove();
}

// ── Hook ─────────────────────────────────────────────────────────────
export function useTheme() {
  const [currentTheme, setCurrentThemeName] = useState(() => {
    return localStorage.getItem('denty-theme') || 'buddy';
  });

  const rafRef = useRef(null);
  const currentColorsRef = useRef(null);

  // Apply immediately on first mount (no animation)
  useEffect(() => {
    cleanupOldInfra();
    const theme = THEMES[currentTheme] ?? THEMES.buddy;
    if (!currentColorsRef.current) {
      currentColorsRef.current = { ...theme };
      applyColors(theme.bg, theme.accent, theme.text, theme.surface);
    }
  }, []);

  // Animate when theme changes
  useEffect(() => {
    const target = THEMES[currentTheme] ?? THEMES.buddy;

    // If no previous colors yet (first mount), just set directly
    if (!currentColorsRef.current) {
      currentColorsRef.current = { ...target };
      applyColors(target.bg, target.accent, target.text, target.surface);
      return;
    }

    // Cancel any running animation
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Snapshot the CURRENT interpolated colors as start
    const from = { ...currentColorsRef.current };
    const to = target;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const rawT = Math.min(elapsed / TRANSITION_MS, 1);
      const t = snapEasing(rawT);

      const bg      = lerpColor(from.bg, to.bg, t);
      const accent  = lerpColor(from.accent, to.accent, t);
      const text    = lerpColor(from.text, to.text, t);
      const surface = lerpColor(from.surface, to.surface, t);

      applyColors(bg, accent, text, surface);
      currentColorsRef.current = { bg, accent, text, surface };

      if (rawT < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure we land exactly on target
        applyColors(to.bg, to.accent, to.text, to.surface);
        currentColorsRef.current = { ...to };
        rafRef.current = null;
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [currentTheme]);

  const setTheme = useCallback((name) => {
    if (!THEMES[name]) {
      console.warn(`[useTheme] Unknown theme: "${name}"`);
      return;
    }
    localStorage.setItem('denty-theme', name);
    setCurrentThemeName(name);
  }, []);

  return {
    currentTheme,
    themeData: THEMES[currentTheme] ?? THEMES.buddy,
    themes: THEMES,
    setTheme,
  };
}
