import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber || !email) {
      setError('Please provide both order number and email.');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber.trim())
        .eq('customer_email', email.trim())
        .single();

      if (error || !data) {
        setError("We couldn't find an order with that number and email.");
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'accepted': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStep = order ? getStatusIndex(order.status) : 0;
  const isCancelled = order?.status === 'cancelled';

  return (
    <div className="pt-32 pb-32 min-h-[100dvh] relative overflow-hidden flex flex-col w-full" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--accent)] rounded-full blur-[150px] opacity-[0.04] pointer-events-none" />

      {/* Wrapper forcing dead center */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-8">
        
        <div className="w-full" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="text-center mb-12 relative flex flex-col items-center justify-center w-full">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4" style={{
              background: 'linear-gradient(135deg, var(--text) 0%, color-mix(in srgb, var(--text) 30%, transparent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Track Order</h1>
            <p className="text-lg font-bold opacity-50 max-w-md mx-auto leading-relaxed px-4 text-center">
              Enter your details below to see the real-time status of your shipment.
            </p>
          </div>

          {/* Form Section */}
          <div className="w-full mb-12">
            <div className="relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500" 
                 style={{ 
                   background: 'var(--surface)', 
                   border: '1px solid color-mix(in srgb, var(--text) 8%, transparent)',
                   borderRadius: '32px',
                   padding: 'clamp(32px, 6vw, 64px)'
                 }}>
              
              <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[80px] opacity-10 pointer-events-none" 
                   style={{ background: 'var(--accent)' }}></div>
                 
              <form onSubmit={handleTrack} className="flex flex-col gap-8 relative z-10 w-full" style={{ maxWidth: '100%' }}>
                <div className="flex flex-col gap-3">
                  <label className="text-[13px] font-black uppercase tracking-[0.15em] opacity-60 ml-2">Order Number</label>
                  <div className="relative group/input flex items-center">
                    <div className="absolute left-6 opacity-40 transition-opacity group-focus-within/input:opacity-100 pointer-events-none" style={{ color: 'var(--accent)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. ORD-12345678" 
                      value={orderNumber}
                      onChange={e => setOrderNumber(e.target.value)}
                      className="w-full py-[22px] pr-6 rounded-[20px] text-lg font-mono outline-none transition-all placeholder:font-sans placeholder:opacity-40"
                      style={{ 
                        background: 'color-mix(in srgb, var(--text) 4%, transparent)', 
                        border: '2px solid transparent',
                        color: 'var(--text)',
                        paddingLeft: '64px'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'transparent'}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="text-[13px] font-black uppercase tracking-[0.15em] opacity-60 ml-2">Email Address</label>
                  <div className="relative group/input flex items-center">
                    <div className="absolute left-6 opacity-40 transition-opacity group-focus-within/input:opacity-100 pointer-events-none" style={{ color: 'var(--accent)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <input 
                      type="email" 
                      placeholder="Email used during checkout" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full py-[22px] pr-6 rounded-[20px] text-lg font-bold outline-none transition-all placeholder:font-normal placeholder:opacity-40"
                      style={{ 
                        background: 'color-mix(in srgb, var(--text) 4%, transparent)', 
                        border: '2px solid transparent',
                        color: 'var(--text)',
                        paddingLeft: '64px'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'transparent'}
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-[12px] bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm tracking-wide text-center flex items-center justify-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-[22px] mt-4 rounded-[20px] font-black text-xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_var(--accent-glow)] active:scale-[0.98] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-3 relative overflow-hidden group"
                  style={{ background: 'var(--accent)', '--accent-glow': 'color-mix(in srgb, var(--accent) 50%, transparent)' }}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Track Package
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        {/* Order Details Section */}
        {order && (
          <div className="w-full">
            <div className="p-6 sm:p-10 md:p-14 lg:p-16 rounded-[40px] animation-slide-up shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-visible" 
                 style={{ background: 'var(--surface)', border: '1px solid color-mix(in srgb, var(--text) 8%, transparent)' }}>
              
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent)] rounded-full blur-[100px] opacity-10 pointer-events-none" />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 pb-6 sm:pb-8 relative z-10 gap-4" style={{ borderBottom: '1px solid color-mix(in srgb, var(--text) 8%, transparent)' }}>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.15em] opacity-60 mb-2">Order</div>
                  <div className="text-xl sm:text-2xl font-mono font-black" style={{ color: 'var(--accent)' }}>{order.order_number}</div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-[11px] font-black uppercase tracking-[0.15em] opacity-60 mb-2">Date</div>
                  <div className="text-base sm:text-lg font-bold">{new Date(order.created_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>

              {isCancelled ? (
                <div className="py-8 sm:py-12 rounded-2xl bg-red-500/5 border border-red-500/10 text-center mb-8 sm:mb-10 relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-red-500">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-red-500 mb-2">Order Cancelled</h3>
                  <p className="opacity-60 text-xs sm:text-sm font-bold max-w-sm mx-auto px-4">This order has been cancelled. If you believe this is a mistake, please contact support.</p>
                </div>
              ) : (
                <div className="relative mb-12 sm:mb-16 mt-6 sm:mt-8 z-10 px-0 sm:px-2 md:px-6">
                  {/* Progress Bar Line */}
                  <div className="absolute top-5 left-6 sm:left-10 right-6 sm:right-10 h-1 sm:h-1.5 rounded-full overflow-hidden" style={{ background: 'color-mix(in srgb, var(--text) 8%, transparent)' }}>
                    <div 
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ background: 'var(--accent)', width: `${(currentStep / 3) * 100}%` }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="relative flex justify-between gap-2 sm:gap-4">
                    {['Ordered', 'Processing', 'Shipped', 'Delivered'].map((step, i) => (
                      <div key={step} className="flex flex-col items-center gap-2 sm:gap-4 flex-1">
                        <div 
                          className="w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-500 z-10"
                          style={{ 
                            background: i <= currentStep ? 'var(--accent)' : 'var(--surface)',
                            color: i <= currentStep ? '#fff' : 'var(--text)',
                            border: `2px solid ${i <= currentStep ? 'var(--accent)' : 'color-mix(in srgb, var(--text) 15%, transparent)'}`,
                            boxShadow: i === currentStep ? '0 0 20px color-mix(in srgb, var(--accent) 40%, transparent)' : 'none'
                          }}
                        >
                          {i < currentStep ? (
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          ) : i + 1}
                        </div>
                        <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center transition-opacity duration-300 ${i <= currentStep ? 'opacity-100 text-[var(--accent)]' : 'opacity-40'}`}>
                          {step}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-10 relative z-10">
                <div className="p-4 sm:p-5 md:p-6 rounded-2xl" style={{ background: 'color-mix(in srgb, var(--text) 2%, transparent)', border: '1px solid color-mix(in srgb, var(--text) 5%, transparent)' }}>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.15em] opacity-60 mb-4 sm:mb-5 md:mb-6">Item Details</h3>
                  <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-sm flex-shrink-0" style={{ background: 'var(--surface)', border: '1px solid color-mix(in srgb, var(--text) 8%, transparent)' }}>
                      📦
                    </div>
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="font-extrabold text-base sm:text-lg md:text-xl break-words">{order.variant}</div>
                      <div className="opacity-60 text-xs sm:text-sm font-bold">Qty: {order.quantity} • ₹{(order.amount/100).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 md:p-6 rounded-2xl" style={{ background: 'color-mix(in srgb, var(--text) 2%, transparent)', border: '1px solid color-mix(in srgb, var(--text) 5%, transparent)' }}>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.15em] opacity-60 mb-3 sm:mb-4 md:mb-5">Delivery Details</h3>
                  <div className="text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">
                    <div className="font-extrabold text-sm sm:text-base mb-1 break-words">{order.customer_name}</div>
                    <div className="opacity-70 font-medium break-words">
                      {order.delivery_address}<br />
                      {order.city}, {order.state} {order.pincode}
                    </div>
                  </div>
                  
                  {order.tracking_number && (
                    <div className="p-3 sm:p-4 rounded-[12px] flex items-center justify-between flex-wrap gap-3" style={{ background: 'color-mix(in srgb, var(--accent) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)' }}>
                      <div className="min-w-0 flex-1">
                        <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] mb-1" style={{ color: 'color-mix(in srgb, var(--accent) 70%, var(--bg))' }}>Tracking No. (DTDC)</div>
                        <div className="font-mono font-black text-sm sm:text-base md:text-lg truncate" style={{ color: 'var(--accent)' }}>{order.tracking_number}</div>
                      </div>
                      <button className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 flex-shrink-0" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
