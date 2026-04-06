import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import CursorGlow from './components/CursorGlow';
import PageTransition from './components/PageTransition';
import ProtectedRoute from './components/ProtectedRoute';
import { trackPageView, trackPresence } from './lib/supabase';
import AdminDashboard from './pages/admin/AdminDashboard';
import HelpCenterPage from './pages/HelpCenterPage';
import WarrantyPage from './pages/WarrantyPage';
import ReturnsPage from './pages/ReturnsPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiesPage from './pages/CookiesPage';
import CareersPage from './pages/CareersPage';
import NotFoundPage from './pages/NotFoundPage';
import OrdersPage from './pages/OrdersPage';
import TrackPage from './pages/TrackPage';
import { useTheme } from './hooks/useTheme';
import { useCursor } from './hooks/useCursor';

import Hero from './components/Hero';
import BrushShowcase from './components/BrushShowcase';
import BrushInternals from './components/BrushInternals';
import AppSection from './components/AppSection';
import FeaturesGrid from './components/FeaturesGrid';
import Footer from './components/Footer';
import ProductPage from './components/ProductPage';
import ZeroLogo from './components/ZeroLogo';

import BotBuddy from './components/BotBuddy';
import BotLuna from './components/BotLuna';
import BotBatman from './components/BotBatman';

import './styles/globals.css';

// ─── Phase 3 Brush Showcase configuration ──────────────────────────────────────
const SHOWCASES = [
  {
    id: 'brush-buddy',
    theme: 'buddy',
    brushSrc: '/brushes/White%20Brush.png',
    tag: 'BUDDY',
    price: '₹1199',
    headline: 'Calm. Professional. Always there.',
    body: 'Buddy is your friendly dental AI. Clear guidance, zero judgment, always calm.',
    glowColor: '#00E5FF',
    pills: [
      { icon: '🦷', label: 'AI Scan' },
      { icon: '⏱️', label: '2-min Timer' },
      { icon: '💬', label: 'Chat' },
    ],
    Bot: BotBuddy,
    reverse: true,
  },
  {
    id: 'brush-luna',
    theme: 'luna',
    brushSrc: '/brushes/Pink%20Brush.png',
    tag: 'LUNA',
    price: '₹1299',
    headline: 'Sweet. Encouraging. Makes it fun.',
    body: 'Luna celebrates every win. Warm, cute, and always rooting for you.',
    glowColor: '#FF69B4',
    pills: [
      { icon: '🌸', label: 'Glow Mode' },
      { icon: '💖', label: 'Streaks' },
      { icon: '✨', label: 'Spa Care' },
    ],
    Bot: BotLuna,
    reverse: true,
  },
  {
    id: 'brush-batman',
    theme: 'batman',
    brushSrc: '/brushes/black_brush.png',
    tag: 'BATMAN',
    price: '₹999',
    headline: 'No excuses. Pure motivation.',
    body: "Batman doesn't celebrate. Batman demands results. Are you ready?",
    glowColor: '#FFD700',
    pills: [
      { icon: '⚡', label: '40K Strokes' },
      { icon: '🔬', label: 'Plaque Scan' },
      { icon: '🌙', label: 'Night Ops' },
    ],
    Bot: BotBatman,
    reverse: true,
  },
];

function HomePage() {
  const { setTheme } = useTheme();
  const cursorRef = useCursor();

  // Always start homepage with buddy (default) theme
  useEffect(() => {
    setTheme('buddy');
  }, []);

  return (
    <div className="w-full relative" style={{ background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>

      {/* ── Hero ──────────────────────────────────── */}
      <Hero onThemeChange={setTheme} />

      {/* ── Phase 3: Brush showcase sections ──────── */}
      {SHOWCASES.map((s) => (
        <BrushShowcase
          key={s.id}
          theme={s.theme}
          brushSrc={s.brushSrc}
          tag={s.tag}
          price={s.price}
          headline={s.headline}
          body={s.body}
          pills={s.pills}
          glowColor={s.glowColor}
          Bot={s.Bot}
          reverse={s.reverse}
          onEnter={() => setTheme(s.theme)}
          cursorRef={cursorRef}
        />
      ))}

      {/* ── Brush internals diagram ────────────────── */}
      <BrushInternals onEnter={() => setTheme('batman')} />

      {/* ── App section ────────────────────────────── */}
      <AppSection onEnter={() => setTheme('buddy')} />

      {/* ── Features grid ──────────────────────────── */}
      <FeaturesGrid />

      {/* ── Footer ─────────────────────────────────── */}
      <Footer />
    </div>
  );
}

// Helper to track views on route changes
function PageTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname);
    trackPresence(location.pathname);
  }, [location]);
  return null;
}

function AppRoutes() {
  return (
    <>
      <PageTracker />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:brushId" element={<ProductPage />} />
        
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/warranty" element={<WarrantyPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/careers" element={<CareersPage />} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CursorGlow />
        <PageTransition />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
