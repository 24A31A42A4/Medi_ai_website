import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/* Inject keyframes once */
if (typeof document !== 'undefined' && !document.getElementById('auth-style')) {
  const s = document.createElement('style');
  s.id = 'auth-style';
  s.textContent = `
    @keyframes authModalIn {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes authBorderGlow {
      0%, 100% { border-color: rgba(255,255,255,0.08); }
      50% { border-color: rgba(255,255,255,0.15); }
    }
    @keyframes authOverlayIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  document.head.appendChild(s);
}

export default function AuthModal({ onSuccess, onClose }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();

  const validate = () => {
    if (!email || !password || (!isSignIn && (!fullName || !confirmPassword))) {
      setError('Please fill in all fields');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Enter a valid email');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!isSignIn && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validate()) return;
    
    setLoading(true);
    
    if (isSignIn) {
      const { error: signInErr, profile } = await signIn(email, password);
      setLoading(false);
      
      if (signInErr) {
        setError(signInErr.message);
      } else {
        const adminCheck = profile?.role === 'admin';
        onSuccess && onSuccess({ isAdmin: adminCheck });
      }
    } else {
      const { error: signUpErr } = await signUp(email, password, fullName);
      setLoading(false);
      
      if (signUpErr) {
        setError(signUpErr.message);
      } else {
        setSuccess('Account created! Please sign in.');
        setIsSignIn(true);
        setPassword('');
        setConfirmPassword('');
      }
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1.5px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '14px 18px',
    color: '#fff',
    fontSize: '15px',
    fontFamily: 'Nunito, sans-serif',
    fontWeight: 600,
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.65)', 
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        animation: 'authOverlayIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div 
        className="relative w-full overflow-y-auto"
        style={{ 
          background: 'linear-gradient(145deg, rgba(22,22,22,0.98), rgba(12,12,12,0.98))', 
          border: '1px solid rgba(255,255,255,0.08)', 
          borderRadius: '28px',
          padding: '32px 28px 36px',
          maxWidth: '420px',
          maxHeight: '90vh',
          animation: 'authModalIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
          style={{ fontSize: '16px' }}
        >
          ✕
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '28px', color: 'var(--accent, #00E5FF)', letterSpacing: '-0.5px' }}>
            DENTY
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginTop: '4px' }}>
            Your AI Dental Companion
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-2xl p-[3px] mb-7" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            className="flex-1 py-2.5 text-sm font-bold rounded-[14px] transition-all duration-300"
            style={{ 
              backgroundColor: isSignIn ? 'var(--accent, #00E5FF)' : 'transparent',
              color: isSignIn ? '#000' : 'rgba(255,255,255,0.45)',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 800,
              boxShadow: isSignIn ? '0 4px 16px color-mix(in srgb, var(--accent, #00E5FF) 30%, transparent)' : 'none',
            }}
            onClick={() => { setIsSignIn(true); setError(''); setSuccess(''); }}
          >
            Sign In
          </button>
          <button
            className="flex-1 py-2.5 text-sm font-bold rounded-[14px] transition-all duration-300"
            style={{ 
              backgroundColor: !isSignIn ? 'var(--accent, #00E5FF)' : 'transparent',
              color: !isSignIn ? '#000' : 'rgba(255,255,255,0.45)',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 800,
              boxShadow: !isSignIn ? '0 4px 16px color-mix(in srgb, var(--accent, #00E5FF) 30%, transparent)' : 'none',
            }}
            onClick={() => { setIsSignIn(false); setError(''); setSuccess(''); }}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-5 py-2.5 px-4 rounded-2xl text-center text-sm font-semibold" style={{ backgroundColor: 'rgba(255,68,68,0.08)', color: '#ff6666', border: '1px solid rgba(255,68,68,0.1)' }}>
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-5 py-2.5 px-4 rounded-2xl text-center text-sm font-semibold" style={{ backgroundColor: 'rgba(68,255,68,0.08)', color: '#66ff88', border: '1px solid rgba(68,255,68,0.1)' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {!isSignIn && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent, #00E5FF)';
                e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--accent, #00E5FF) 10%, transparent)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent, #00E5FF)';
              e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--accent, #00E5FF) 10%, transparent)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.08)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent, #00E5FF)';
              e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--accent, #00E5FF) 10%, transparent)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.08)';
              e.target.style.boxShadow = 'none';
            }}
          />
          {!isSignIn && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent, #00E5FF)';
                e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--accent, #00E5FF) 10%, transparent)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3.5 rounded-2xl text-black font-bold flex items-center justify-center transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.98]"
            style={{ 
              background: 'linear-gradient(135deg, var(--accent, #00E5FF), color-mix(in srgb, var(--accent, #00E5FF) 80%, #fff))',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 800,
              fontSize: '15px',
              boxShadow: '0 8px 32px color-mix(in srgb, var(--accent, #00E5FF) 25%, transparent)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2" />
                Please wait...
              </>
            ) : (
              isSignIn ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
