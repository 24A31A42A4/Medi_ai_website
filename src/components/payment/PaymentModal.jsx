import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const loadScript = (src) =>
  new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

/* ── Floating-label input ───────────────────────────── */
function FloatInput({ name, value, onChange, label, type = 'text', glowColor, required, halfWidth }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value;
  return (
    <div className={`relative ${halfWidth ? '' : 'w-full'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        required={required}
        autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'on'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-[14px] px-4 pt-[24px] pb-[8px] text-[15px] font-semibold outline-none transition-all duration-200"
        style={{
          background: '#FFFFFF',
          border: `1px solid ${focused ? glowColor : '#E4E4E7'}`,
          boxShadow: focused ? `0 0 0 4px ${glowColor}15, 0 1px 2px rgba(0,0,0,0.05)` : '0 1px 2px rgba(0,0,0,0.05)',
          color: '#111827',
        }}
      />
      <label className="absolute left-4 transition-all duration-200 pointer-events-none font-bold"
        style={{
          top: active ? 10 : '50%',
          transform: active ? 'none' : 'translateY(-50%)',
          fontSize: active ? 10 : 14,
          letterSpacing: active ? '0.06em' : '0.01em',
          textTransform: active ? 'uppercase' : 'none',
          color: focused ? glowColor : '#71717A',
        }}>
        {label}
      </label>
    </div>
  );
}

/* ── Step indicator ─────────────────────────────────── */
function StepBar({ step, glowColor }) {
  const steps = ['Contact', 'Shipping', 'Review'];
  return (
    <div style={{ display: 'flex', width: '100%', marginBottom: '32px', paddingTop: '8px' }}>
      {steps.map((s, i) => {
        const active = i <= step;
        const current = i === step;
        return (
          <div key={i} className="flex-1 flex flex-col gap-2 relative">
            <div className="h-1 rounded-full transition-all duration-500 mr-2"
              style={{ background: active ? glowColor : '#F4F4F5' }} />
            <span style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', transition: 'color 0.3s', color: current ? '#111827' : active ? '#71717A' : '#A1A1AA' }}>
              {s}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function PaymentModal({ product, qty, onClose, onSuccess }) {
  console.log("Premium PaymentModal Mounted!");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' });

  const gc = product.glowColor || 'var(--accent)';
  const border = '#E4E4E7';
  const surface = '#FFFFFF';
  const muted = '#71717A';
  const amountPaise = product.price * qty;
  const displayAmt = `₹${(amountPaise / 100).toLocaleString('en-IN')}`;

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const validateStep = () => {
    if (step === 0) {
      if (!form.name || !form.email || !form.phone) return 'Please fill all contact fields.';
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Invalid email address.';
      if (!/^[6-9]\d{9}$/.test(form.phone)) return 'Invalid 10-digit Indian phone number.';
    }
    if (step === 1) {
      if (!form.address || !form.city || !form.state || !form.pincode) return 'Please fill all shipping fields.';
      if (!/^\d{6}$/.test(form.pincode)) return 'Invalid 6-digit pincode.';
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError(null);
    setStep(s => s + 1);
  };

  const handleSuccess = async (response) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      const orderNumber = 'ORD-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const orderPayload = {
        user_id: userId || null, order_number: orderNumber,
        variant: product.stockKey || product.variant,
        amount: amountPaise, payment_id: response.razorpay_payment_id,
        customer_name: form.name, customer_email: form.email, customer_phone: form.phone,
        delivery_address: form.address, city: form.city, state: form.state, pincode: form.pincode,
        status: 'accepted'
      };
      await supabase.from('orders').insert([orderPayload]);
      supabase.rpc('decrement_stock', { p_variant: product.stockKey || product.variant }).catch(console.error);
      onSuccess({ paymentId: response.razorpay_payment_id, orderNumber, customerName: form.name, email: form.email, variant: product.variant });
    } catch {
      onSuccess({ paymentId: response.razorpay_payment_id, orderNumber: 'ORD-PENDING', customerName: form.name, email: form.email, variant: product.variant });
    } finally { setLoading(false); }
  };

  const handlePay = async () => {
    setLoading(true); setError(null);
    try {
      const isLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!isLoaded) throw new Error('Could not load checkout. Please check your connection.');
      const KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!KEY || KEY.includes('your_razorpay') || !KEY.trim()) {
        setTimeout(() => handleSuccess({ razorpay_payment_id: 'pay_sim_' + Math.random().toString(36).slice(-6) }), 900);
        return;
      }
      const rzp = new window.Razorpay({
        key: KEY, amount: amountPaise, currency: 'INR',
        name: 'DENTY by ZERO', description: product.name,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        notes: { address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}` },
        theme: { color: gc?.includes('#') ? gc : '#00E5FF' },
        handler: handleSuccess,
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.on('payment.failed', r => { setError(`Payment failed: ${r.error.description}`); setLoading(false); });
      rzp.open();
    } catch (err) {
      setError(err.message || 'Checkout failed.'); setLoading(false);
    }
  };

  useEffect(() => {
    const h = e => { if (e.key === 'Escape' && !loading) onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [loading, onClose]);

  return (
    <div className="fixed inset-0 z-[5000] bg-white overflow-y-auto w-full h-full animate-in slide-in-from-bottom-4 duration-300" style={{ fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Centered content wrapper */}
      <div className="relative w-full max-w-[540px] mx-auto flex flex-col"
        style={{ color: '#111827', paddingTop: '40px', paddingBottom: '40px', paddingLeft: '40px', paddingRight: '40px' }}>

        {/* Accent ambient glow */}
        <div className="absolute top-[5%] right-[-10%] w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: gc, filter: 'blur(100px)', opacity: 0.12 }} />

        {/* Clean full-width header block */}
        <div className="w-full relative z-20 mb-10 pt-4">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px', color: muted }}>Secure Checkout</p>
              <h2 style={{ fontSize: '36px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.5px', marginBottom: '0' }}>Complete Order</h2>
            </div>
            <button onClick={() => !loading && onClose()}
              className="w-10 h-10 rounded-full border flex items-center justify-center text-sm transition-all hover:scale-105 bg-white shadow-sm"
              style={{ borderColor: border, color: muted }}
              disabled={loading}>✕</button>
          </div>
          {/* 2-line gap below Complete Order */}
          <div style={{ height: '32px' }} />
          <StepBar step={step} glowColor={gc} />
        </div>

        <div className="w-full relative z-20 flex-1 pb-16">
          {/* Order summary pill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', position: 'relative', overflow: 'hidden', border: `1px solid ${border}`, background: surface }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: gc }} />
            <div style={{ marginLeft: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: muted }}>Order Summary</div>
              <div style={{ fontSize: '15px', fontWeight: 900, marginTop: '4px' }}>{product.name} × {qty}</div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: gc }}>{displayAmt}</div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 rounded-[14px] p-3.5 mb-5 text-[13px] text-red-500 font-semibold">
              <span className="mt-0.5">⚠️</span><span>{error}</span>
            </div>
          )}

          {/* Step 0: Contact */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px', color: muted }}>1 — Contact Information</div>
              <FloatInput name="name" value={form.name} onChange={onChange} label="Full Legal Name" glowColor={gc} required />
              <div className="grid grid-cols-2 gap-3">
                <FloatInput name="email" value={form.email} onChange={onChange} label="Email Address" type="email" glowColor={gc} required halfWidth />
                <FloatInput name="phone" value={form.phone} onChange={onChange} label="Phone Number" type="tel" glowColor={gc} required halfWidth />
              </div>
            </div>
          )}

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="text-[13px] font-black uppercase tracking-widest mb-1" style={{ color: muted }}>2 — Shipping Details</div>
              <div className="relative">
                  <textarea name="address" value={form.address} onChange={onChange} rows="2" 
                  placeholder=" " onFocus={e => { e.target.style.borderColor = gc; e.target.style.boxShadow = `0 0 0 4px ${gc}15, 0 1px 2px rgba(0,0,0,0.05)`; }}
                  onBlur={e => { e.target.style.borderColor = border; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
                  className="w-full rounded-[14px] px-4 pt-[24px] pb-[8px] text-[15px] font-semibold outline-none resize-none transition-all shadow-sm"
                  style={{ background: '#FFFFFF', border: `1px solid ${border}`, color: '#111827' }} />
                <label className="absolute left-4 top-3 text-[10px] font-bold uppercase tracking-[0.06em] pointer-events-none transition-all" style={{ color: muted }}>Street Address</label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FloatInput name="city" value={form.city} onChange={onChange} label="City" glowColor={gc} required halfWidth />
                <FloatInput name="state" value={form.state} onChange={onChange} label="State" glowColor={gc} required halfWidth />
                <FloatInput name="pincode" value={form.pincode} onChange={onChange} label="Pincode" glowColor={gc} required halfWidth />
              </div>
              {/* Delivery partner */}
              <div className="flex items-center gap-3 rounded-[14px] px-4 py-3 shadow-sm border" style={{ background: surface, borderColor: border }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black text-red-600 bg-white border border-black/5 shadow-sm flex-shrink-0">DTDC</div>
                <div>
                  <div className="text-[13px] font-black">Standard Delivery (Free)</div>
                  <div className="text-[11px]" style={{ color: muted }}>5–7 business days · Fully tracked</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="text-[13px] font-black uppercase tracking-widest mb-1" style={{ color: muted }}>3 — Review & Pay</div>

              {/* Review cards */}
              {[
                { title: 'Contact', lines: [form.name, form.email, form.phone] },
                { title: 'Shipping', lines: [form.address, `${form.city}, ${form.state} - ${form.pincode}`] },
              ].map((card, i) => (
                <div key={i} className="rounded-2xl px-4 py-3 border" style={{ background: surface, borderColor: border }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: muted }}>{card.title}</span>
                    <button onClick={() => { setStep(i); setError(null); }} className="text-[10px] font-black uppercase tracking-wide transition-opacity hover:opacity-70" style={{ color: gc }}>Edit</button>
                  </div>
                  {card.lines.filter(Boolean).map((l, j) => <div key={j} className="text-[13px] font-semibold leading-snug">{l}</div>)}
                </div>
              ))}

              {/* Total */}
              <div className="flex justify-between items-center rounded-2xl px-4 py-3 border" style={{ background: surface, borderColor: border }}>
                <span className="font-black tracking-widest uppercase text-[12px]" style={{ color: muted }}>Total</span>
                <span className="text-[22px] font-black" style={{ color: gc }}>{displayAmt}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {step < 2 ? (
              <button onClick={next}
                className="w-full h-[56px] rounded-2xl text-[15px] font-black uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: gc, color: '#000', boxShadow: `0 8px 24px ${gc}50` }}>
                Continue →
              </button>
            ) : (
              <button onClick={handlePay} disabled={loading}
                className="w-full h-[60px] rounded-2xl text-[16px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-wait hover:-translate-y-0.5"
                style={{ background: gc, color: '#000', boxShadow: `0 10px 30px ${gc}60` }}>
                {loading ? (
                  <><div className="w-5 h-5 border-[3px] border-black/20 border-t-black/80 rounded-full animate-spin" /><span>Processing...</span></>
                ) : `Pay ${displayAmt}`}
              </button>
            )}
            {step > 0 && (
              <button onClick={() => { setStep(s => s - 1); setError(null); }}
                className="w-full h-[44px] rounded-xl text-[13px] font-black uppercase tracking-widest border transition-all hover:opacity-80"
                style={{ borderColor: border, color: muted, background: 'transparent' }}>
                ← Back
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-green-500">
            <span className="w-3.5 h-3.5 rounded-full bg-green-500/20 flex items-center justify-center">✓</span>
            Secured by Razorpay — 256-bit SSL Encryption
          </div>
        </div>
      </div>
    </div>
  );
}
