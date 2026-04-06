import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './auth/AuthModal';

/* Inject keyframes once */
if (typeof document !== 'undefined' && !document.getElementById('nav-style')) {
  const s = document.createElement('style');
  s.id = 'nav-style';
  s.textContent = `
    @keyframes mobileSlideIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(s);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, profile, isAdmin, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const close = () => setDropdownOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [dropdownOpen]);

  const handleAuthSuccess = ({ isAdmin: isUserAdmin }) => {
    setShowAuthModal(false);
    if (isUserAdmin) navigate('/admin');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/#products' },
    { label: 'Track Order', path: '/track' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' },
  ];

  /*
   * ALL colors use CSS variables (var(--accent), var(--bg), var(--text))
   * so they AUTOMATICALLY change when the theme updates from any component.
   * No useTheme() hook needed — CSS vars are the single source of truth.
   */

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[1000]"
        style={{
          height: 68,
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          /* Navbar tints toward the theme's accent color */
          background: scrolled
            ? 'color-mix(in srgb, var(--accent) 6%, rgba(8, 8, 10, 0.88))'
            : 'color-mix(in srgb, var(--accent) 4%, rgba(8, 8, 10, 0.6))',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.05)'
            : '0 2px 16px rgba(0,0,0,0.12)',
          transition: 'background 0.5s ease, box-shadow 0.5s ease',
        }}
      >
        {/* Bottom accent line — follows theme automatically */}
        <div
          className="absolute bottom-0 left-0 right-0 overflow-hidden"
          style={{ height: 1, opacity: scrolled ? 1 : 0.45, transition: 'opacity 0.5s ease' }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 5%, var(--accent) 50%, transparent 95%)',
              opacity: 0.5,
              transition: 'background 0.5s ease',
            }}
          />
        </div>

        <div className="max-w-[1200px] w-full h-full mx-auto px-5 md:px-8 flex items-center justify-between relative">
          {/* ─── Brand ─── */}
          <div className="flex items-center justify-start z-10 relative pointer-events-auto">
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 900,
                fontSize: 26,
                color: '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                DENTY
              </span>
              <span style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.3)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1,
                marginTop: 2,
              }}>
                by ZERO
              </span>
            </Link>
          </div>

          {/* ─── Desktop Nav Links (Center) ─── */}
          <div className="hidden md:flex absolute left-[54%] -translate-x-1/2 top-1/2 -translate-y-1/2 items-center justify-center pointer-events-auto">
            <div className="flex items-center" style={{ gap: 2 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: 13.5,
                    padding: '7px 16px',
                    borderRadius: 10,
                    letterSpacing: '0.01em',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    transition: 'color 0.25s ease, background 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  style={{
                    color: '#FF9B54', fontWeight: 700, fontFamily: 'Inter, sans-serif',
                    fontSize: 13.5, padding: '7px 16px', borderRadius: 10, lineHeight: 1,
                    textDecoration: 'none',
                  }}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* ─── Right actions (Right) ─── */}
          <div className="hidden md:flex items-center gap-3 z-10 relative pointer-events-auto">
              {/* Buy Now — uses var(--accent) so it changes with theme */}
              <button
                onClick={() => {
                  navigate('/#buy');
                  window.scrollTo(0, document.getElementById('buy')?.offsetTop || 0);
                }}
                style={{
                  background: 'linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 55%, #000) 100%)',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  borderRadius: 10,
                  padding: '8px 22px',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  boxShadow: '0 4px 20px color-mix(in srgb, var(--accent) 35%, transparent)',
                  transition: 'background 0.5s ease, box-shadow 0.4s ease, transform 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 8px 30px color-mix(in srgb, var(--accent) 50%, transparent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 4px 20px color-mix(in srgb, var(--accent) 35%, transparent)';
                }}
              >
                Buy Now
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 55%, #000) 100%)',
                      fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14,
                      color: '#fff', lineHeight: 1, border: 'none', cursor: 'pointer',
                      textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      boxShadow: '0 0 12px color-mix(in srgb, var(--accent) 40%, transparent)',
                      transition: 'transform 0.25s ease, box-shadow 0.3s ease, background 0.5s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = ''}
                  >
                    {profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email[0].toUpperCase()}
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 top-full mt-3 w-56 rounded-2xl overflow-hidden"
                      style={{
                        background: 'rgba(18,18,20,0.96)', backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.05)',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{profile?.full_name || 'User'}</p>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '4px 0 8px' }}>{user?.email}</p>
                        {isAdmin && (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,155,84,0.1)', color: '#FF9B54' }}>
                            ADMIN
                          </span>
                        )}
                      </div>
                      <div style={{ padding: 6, display: 'flex', flexDirection: 'column' }}>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setDropdownOpen(false)} style={{ padding: '10px 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', borderRadius: 12, textDecoration: 'none', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'transparent'; }}>
                            Admin Dashboard
                          </Link>
                        )}
                        <Link to="/orders" onClick={() => setDropdownOpen(false)} style={{ padding: '10px 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', borderRadius: 12, textDecoration: 'none', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'transparent'; }}>
                          My Orders
                        </Link>
                        <button
                          onClick={() => { setDropdownOpen(false); signOut(); navigate('/'); }}
                          style={{ padding: '10px 12px', fontSize: 14, textAlign: 'left', borderRadius: 12, color: '#ff5555', fontFamily: 'Inter, sans-serif', border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,70,70,0.06)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  style={{
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13,
                    background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)',
                    padding: '7px 18px', borderRadius: 10, cursor: 'pointer',
                    lineHeight: 1, whiteSpace: 'nowrap', transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 60%, transparent)';
                    e.currentTarget.style.background = 'color-mix(in srgb, var(--accent) 8%, transparent)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow = '0 0 16px color-mix(in srgb, var(--accent) 15%, transparent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Login
                </button>
              )}
          </div>

          {/* ─── Mobile Controls ─── */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => {
                navigate('/#buy');
                window.scrollTo(0, document.getElementById('buy')?.offsetTop || 0);
              }}
              style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 55%, #000) 100%)',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: 12,
                borderRadius: 8,
                padding: '7px 16px',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                boxShadow: '0 4px 16px color-mix(in srgb, var(--accent) 35%, transparent)',
                transition: 'background 0.5s ease',
              }}
            >
              Buy Now
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                width: 40, height: 40, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center', gap: 5, borderRadius: 12,
                background: mobileMenuOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: 'none', cursor: 'pointer', transition: 'background 0.25s ease',
              }}
            >
              <span style={{ display: 'block', width: 20, height: 1.5, background: '#fff', borderRadius: 99, transition: 'all 0.3s', transform: mobileMenuOpen ? 'rotate(45deg) translateY(6.5px)' : 'none' }} />
              <span style={{ display: 'block', width: 20, height: 1.5, background: '#fff', borderRadius: 99, transition: 'all 0.3s', opacity: mobileMenuOpen ? 0 : 0.8, transform: mobileMenuOpen ? 'scale(0)' : 'none' }} />
              <span style={{ display: 'block', width: 20, height: 1.5, background: '#fff', borderRadius: 99, transition: 'all 0.3s', transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Full-Screen Menu ─── */}
      <div
        className="md:hidden fixed inset-0 top-[68px] z-[999]"
        style={{
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          background: 'color-mix(in srgb, var(--accent) 5%, rgba(6, 6, 8, 0.97))',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          transition: 'opacity 0.35s ease, background 0.5s ease',
        }}
      >
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '32px 24px 24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navLinks.map((link, i) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 28,
                    color: '#fff', padding: '12px 16px', borderRadius: 16,
                    letterSpacing: '-0.02em', textDecoration: 'none', display: 'block',
                    animation: mobileMenuOpen ? `mobileSlideIn 0.3s ease ${i * 0.06}s both` : 'none',
                    transition: 'background 0.2s ease',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}
                  style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 28, padding: '12px 16px', borderRadius: 16, color: '#FF9B54', textDecoration: 'none', display: 'block' }}>
                  Admin
                </Link>
              )}
            </div>

            <div style={{ height: 1, width: '100%', margin: '24px 0', background: 'rgba(255,255,255,0.06)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Mobile buy button — uses var(--accent) */}
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/#buy'); window.scrollTo(0, document.getElementById('buy')?.offsetTop || 0); }}
                style={{
                  width: '100%', padding: '16px 0', textAlign: 'center', borderRadius: 16,
                  background: 'linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 55%, #000) 100%)',
                  color: '#fff', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 18,
                  border: 'none', cursor: 'pointer', textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  boxShadow: '0 6px 24px color-mix(in srgb, var(--accent) 35%, transparent)',
                  transition: 'background 0.5s ease, box-shadow 0.4s ease',
                }}
              >
                Buy Now
              </button>

              {isAuthenticated ? (
                <>
                  <div style={{ fontSize: 14, padding: 8, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>
                    Logged in as <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>{profile?.full_name || user?.email}</span>
                  </div>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)}
                    style={{ width: '100%', padding: '14px 16px', borderRadius: 16, fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter, sans-serif', background: 'rgba(255,255,255,0.05)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                    📦 My Orders
                  </Link>
                  <Link to="/account" onClick={() => setMobileMenuOpen(false)}
                    style={{ width: '100%', padding: '14px 16px', borderRadius: 16, fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter, sans-serif', background: 'rgba(255,255,255,0.05)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                    👤 Account
                  </Link>
                  <button onClick={() => { setMobileMenuOpen(false); signOut(); navigate('/'); }}
                    style={{ width: '100%', marginTop: 8, padding: '14px 0', borderRadius: 16, fontSize: 16, fontWeight: 600, color: '#ff5555', fontFamily: 'Inter, sans-serif', border: '1px solid rgba(255,70,70,0.15)', background: 'transparent', cursor: 'pointer' }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); setShowAuthModal(true); }}
                  style={{ width: '100%', padding: '14px 0', borderRadius: 16, fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                  👤 Sign In / Create Account
                </button>
              )}
            </div>
          </div>
        </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}
