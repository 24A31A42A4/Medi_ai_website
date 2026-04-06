import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PaymentModal from './payment/PaymentModal';
import SuccessScreen from './payment/SuccessScreen';
import { useTheme } from '../hooks/useTheme';

const PRODUCTS = {
  'brush-buddy': {
    id: 'brush-buddy',
    variant: 'BUDDY',
    name: 'DENTY Buddy',
    price: 119900,
    displayPrice: '₹1,199',
    mrp: '₹2,499',
    discount: '52% off',
    brushSrc: '/brushes/White%20Brush.png',
    glowColor: '#00E5FF',
    themeKey: 'buddy',
    tagline: 'Calm. Professional. Always there.',
    description: 'Buddy is your friendly dental AI companion. Combines 40,000 strokes/min with real-time AI plaque scanning and a calm voice guide to make every brush perfect.',
    images: ['/brushes/White%20Brush.png'],
    specs: [
      { label: 'Bristle Speed',  value: '40,000 strokes/min' },
      { label: 'Battery Life',   value: '30 days' },
      { label: 'Charging',       value: 'USB-C Wireless' },
      { label: 'AI Features',    value: 'Plaque scan, Timer, Chat' },
      { label: 'Water Resistance', value: 'IPX7' },
      { label: 'Modes',          value: '5 (Clean, White, Sensitive, Gum, Tongue)' },
      { label: 'App',            value: 'DENTY AI App (iOS + Android)' },
      { label: 'Warranty',       value: '6 Months' },
    ],
    highlights: ['AI-Powered Plaque Detection', '30-Day Battery', 'IPX7 Waterproof', '5 Cleaning Modes', 'Built-in 2-Min Smart Timer', 'USB-C Fast Charge'],
    pills: ['AI Scan', '2-min Timer', 'Chat'],
    inBox: ['DENTY Buddy Brush', 'USB-C Charging Cable', 'Travel Case', 'Replacement Head (x2)', 'Quick Start Guide'],
    stockKey: 'BUDDY',
  },
  'brush-luna': {
    id: 'brush-luna',
    variant: 'LUNA',
    name: 'DENTY Luna',
    price: 129900,
    displayPrice: '₹1,299',
    mrp: '₹2,799',
    discount: '54% off',
    brushSrc: '/brushes/Pink%20Brush.png',
    glowColor: '#FF69B4',
    themeKey: 'luna',
    tagline: 'Sweet. Encouraging. Makes it fun.',
    description: 'Luna celebrates every brushing win. With streak tracking, glow mode, and spa-like vibration patterns, Luna turns your morning routine into the best part of your day.',
    images: ['/brushes/Pink%20Brush.png'],
    specs: [
      { label: 'Bristle Speed',  value: '38,000 strokes/min' },
      { label: 'Battery Life',   value: '28 days' },
      { label: 'Charging',       value: 'Wireless Qi Pad (included)' },
      { label: 'AI Features',    value: 'Glow Mode, Streak Tracking, Spa Care' },
      { label: 'Water Resistance', value: 'IPX7' },
      { label: 'Modes',          value: '5 (Glow, Spa, Sensitive, Kids, Whitening)' },
      { label: 'App',            value: 'DENTY AI App (iOS + Android)' },
      { label: 'Warranty',       value: '6 Months' },
    ],
    highlights: ['Streak & Habit Tracker', 'Glow Mode', 'IPX7 Waterproof', 'Qi Wireless Charging', 'Spa Vibration Patterns', 'Kids Mode'],
    pills: ['Glow Mode', 'Streaks', 'Spa Care'],
    inBox: ['DENTY Luna Brush', 'Qi Wireless Charging Pad', 'Travel Pouch', 'Replacement Head (x2)', 'Sticker Pack'],
    stockKey: 'LUNA',
  },
  'brush-batman': {
    id: 'brush-batman',
    variant: 'BATMAN',
    name: 'DENTY Batman',
    price: 99900,
    displayPrice: '₹999',
    mrp: '₹1,999',
    discount: '50% off',
    brushSrc: '/brushes/black_brush.png',
    glowColor: '#FFD700',
    themeKey: 'batman',
    tagline: 'No excuses. Pure motivation.',
    description: "Batman doesn't celebrate mediocrity. With 40K strokes/min, deep plaque scanning, and night ops mode, this is the brush for people serious about results.",
    images: ['/brushes/black_brush.png'],
    specs: [
      { label: 'Bristle Speed',  value: '40,000 strokes/min' },
      { label: 'Battery Life',   value: '45 days' },
      { label: 'Charging',       value: 'USB-C Fast Charge' },
      { label: 'AI Features',    value: 'Plaque Scan, Night Ops, Performance Score' },
      { label: 'Water Resistance', value: 'IPX8' },
      { label: 'Modes',          value: '6 (Clean, Deep, Night, Whitening, Gum, Pressure)' },
      { label: 'App',            value: 'DENTY AI App (iOS + Android)' },
      { label: 'Warranty',       value: '6 Months' },
    ],
    highlights: ['40K Strokes/Min Max Power', 'IPX8 Deep Waterproof', '45-Day Battery', 'Night Ops Mode', 'Pressure Alert Sensor', 'Performance Score AI'],
    pills: ['40K Strokes', 'Plaque Scan', 'Night Ops'],
    inBox: ['DENTY Batman Brush', 'USB-C Cable', 'Hard Shell Case', 'Replacement Head (x3)', 'Performance Log'],
    stockKey: 'BATMAN',
  },
};

const REVIEWS = [
  { name: 'Rahul S.', rating: 5, date: '12 Oct 2025', text: 'Absolutely game changing. The bristles are soft yet incredibly effective. Plaque scan actually works perfectly.', verified: true },
  { name: 'Priya K.', rating: 5, date: '04 Oct 2025', text: "Battery life is insane. I charged it once a month ago and it's still going strong. Highly recommended.", verified: true },
  { name: 'Amit V.', rating: 4, date: '28 Sep 2025', text: 'Great brush, modes are useful. The app sync sometimes takes a few seconds but overall very happy.', verified: true },
];

export default function ProductPage() {
  const { brushId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  
  const normalizedId = brushId?.toLowerCase().replace('brush-', '');
  const productKey = 'brush-' + normalizedId;
  const product = PRODUCTS[productKey];
  
  const [qty, setQty] = useState(1);
  const [stock, setStock] = useState(null);
  const [loadingStock, setLoadingStock] = useState(true);
  
  const [activeTab, setActiveTab] = useState('Specifications');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    setQty(1);
    setPaymentOpen(false);
    setSuccessData(null);
    window.scrollTo(0, 0);

    if (product) {
      setTheme(product.themeKey);
      if (location.search.includes('checkout=true')) {
        setPaymentOpen(true);
      }
    }

    const fetchStock = async () => {
      if (!product) return;
      setLoadingStock(true);
      try {
        const { data, error } = await supabase
          .from('stock')
          .select('quantity')
          .eq('variant', product.stockKey)
          .single();
        
        if (error) throw error;
        setStock(data ? data.quantity : 0);
      } catch (err) {
        console.error('Error fetching stock:', err);
        setStock(15);
      } finally {
        setLoadingStock(false);
      }
    };

    fetchStock();
  }, [brushId, product, setTheme]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col pt-24 pb-12 px-6 text-center" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        <h1 className="text-3xl sm:text-4xl font-black mb-4">Product Not Found</h1>
        <Link to="/" className="text-lg font-bold hover:underline" style={{ color: 'var(--accent)' }}>Return Home</Link>
      </div>
    );
  }

  let stockBadge = null;
  let isOutOfStock = false;
  if (!loadingStock && stock !== null) {
    if (stock > 10) {
      stockBadge = <span className="text-green-600 font-bold text-[12px] sm:text-sm flex items-center gap-1.5 whitespace-nowrap"><span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> In Stock</span>;
    } else if (stock > 0 && stock <= 10) {
      stockBadge = <span className="text-orange-600 font-bold text-[12px] sm:text-sm flex items-center gap-1.5 whitespace-nowrap"><span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span> {stock} left!</span>;
    } else {
      stockBadge = <span className="text-red-600 font-bold text-[12px] sm:text-sm flex items-center gap-1.5 whitespace-nowrap"><span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span> Sold Out</span>;
      isOutOfStock = true;
    }
  }

  const handleQtyChange = (delta) => {
    if (isOutOfStock) return;
    const maxQty = Math.min(10, stock || 10);
    setQty(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > maxQty) return maxQty;
      return next;
    });
  };

  const relatedProducts = Object.values(PRODUCTS).filter(p => p.id !== product.id);

  // Dynamic Styles Using color-mix
  const mutedTextStr = 'color-mix(in srgb, var(--text) 50%, transparent)';
  const secondaryTextStr = 'color-mix(in srgb, var(--text) 70%, transparent)';
  const borderStr = 'color-mix(in srgb, var(--text) 12%, transparent)';
  const surfaceAlphaStr = 'color-mix(in srgb, var(--text) 4%, transparent)';
  const surfaceAlpha2Str = 'color-mix(in srgb, var(--text) 2%, transparent)';

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-24 font-sans transition-colors duration-500" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>
      
      {/* Breadcrumb - Now scrolls horizontally on small screens */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <div className="flex items-center text-[12px] sm:text-[14px] font-bold tracking-wide overflow-x-auto whitespace-nowrap scrollbar-hide py-1" style={{ color: mutedTextStr }}>
          <Link to="/" className="hover:opacity-100 transition-opacity">Home</Link>
          <span className="mx-2 sm:mx-3 opacity-50">/</span>
          <span className="hover:opacity-100 transition-opacity cursor-pointer">Products</span>
          <span className="mx-2 sm:mx-3 opacity-50">/</span>
          <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24">
        
        {/* Left Column - Image (Sticky) */}
        <div className="relative">
          <div className="lg:sticky lg:top-[120px] flex flex-col items-center">
            {/* Image Container - Adjusted max heights for mobile/desktop */}
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center mb-6 sm:mb-10 mx-auto">
              <div 
                className="absolute inset-0 rounded-[40px] transition-all duration-700"
                style={{
                  background: `radial-gradient(circle at center, ${product.glowColor} 0%, transparent 65%)`,
                  opacity: 0.15,
                  filter: 'blur(50px)',
                  transform: 'scale(0.85)'
                }}
              />
              <img 
                src={product.brushSrc} 
                alt={product.name}
                className="relative z-10 max-h-[300px] sm:max-h-[440px] object-contain transition-transform duration-700 hover:scale-105 drop-shadow-2xl"
                style={{ filter: `drop-shadow(0 30px 60px ${product.glowColor}30)` }}
              />
            </div>

            {/* Feature tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', width: '100%', padding: '0 8px' }}>
              {product.pills.map((pill, i) => (
                <div 
                  key={i} 
                  style={{
                    padding: '10px 20px',
                    fontSize: '11px',
                    fontWeight: 900,
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    border: `2px solid ${product.glowColor}30`,
                    backgroundColor: `${product.glowColor}08`,
                    color: product.glowColor,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {pill}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col pt-2 sm:pt-4" style={{ paddingLeft: '8px', paddingRight: '8px' }}>
          <div className="text-[12px] sm:text-[13px] font-black tracking-[4px] uppercase mb-4" style={{ color: mutedTextStr }}>DENTY PREMIUM</div>
          
          <h1 className="text-[32px] sm:text-4xl md:text-[52px] font-black leading-[1.1] mb-5 break-words" style={{ fontFamily: 'Nunito, sans-serif' }}>{product.name}</h1>
          
          <p className="text-[16px] sm:text-lg md:text-[22px] font-medium leading-relaxed mb-8" style={{ color: secondaryTextStr }}>{product.tagline}</p>
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[13px] sm:text-[15px] font-bold mb-10">
            <div className="text-[#FFD700] tracking-widest text-lg sm:text-xl drop-shadow-sm">★★★★★</div>
            <span style={{ color: 'var(--text)' }}>4.9</span>
            <span style={{ color: borderStr }}>|</span>
            <span className="cursor-pointer hover:opacity-80 transition-opacity" style={{ color: mutedTextStr }}>482 Ratings</span>
            <span style={{ color: borderStr }}>|</span>
            <span className="cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap" style={{ color: mutedTextStr }}>84 Reviews</span>
          </div>

          <div className="h-[2px] w-full mb-10" style={{ backgroundColor: borderStr }} />

          {/* Pricing Block */}
          <div className="mb-10 flex flex-col gap-4">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-[40px] sm:text-[48px] md:text-[56px] font-black leading-none drop-shadow-md" style={{ color: product.glowColor, fontFamily: 'Nunito, sans-serif' }}>
                {product.displayPrice}
              </span>
              <span className="text-[18px] sm:text-[22px] font-bold line-through" style={{ color: mutedTextStr }}>
                {product.mrp}
              </span>
              <span className="px-2 sm:px-3 py-1 bg-green-500/10 text-green-600 border border-green-500/20 rounded-lg text-[13px] sm:text-[15px] font-black uppercase tracking-wider relative -top-1 sm:-top-2">
                {product.discount}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
              <span style={{ padding: '10px 20px', border: `1.5px solid ${borderStr}`, borderRadius: '8px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', whiteSpace: 'nowrap', color: mutedTextStr }}>Free Fast Delivery</span>
              {stockBadge}
            </div>
          </div>

          {/* Offers */}
          <div style={{ borderRadius: '12px', padding: '28px 32px', marginBottom: '32px', transition: 'all 0.3s ease', backgroundColor: surfaceAlpha2Str, border: `1.5px solid ${borderStr}` }}>
            <h3 style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '24px', color: 'var(--text)' }}>Instant Benefits</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', fontSize: '15px', fontWeight: 500, lineHeight: 1.5 }}><span style={{ fontSize: '20px', flexShrink: 0 }}>💳</span> <span style={{ color: secondaryTextStr }}><strong style={{ color: 'var(--text)' }}>Bank Offer:</strong> Extra 10% off using selected Cards</span></div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', fontSize: '15px', fontWeight: 500, lineHeight: 1.5 }}><span style={{ fontSize: '20px', flexShrink: 0 }}>🎁</span> <span style={{ color: secondaryTextStr }}><strong style={{ color: 'var(--text)' }}>App Bonus:</strong> Lifetime Free DENTY AI insights</span></div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', fontSize: '15px', fontWeight: 500, lineHeight: 1.5 }}><span style={{ fontSize: '20px', flexShrink: 0 }}>🚚</span> <span style={{ color: secondaryTextStr }}><strong style={{ color: 'var(--text)' }}>Shipping:</strong> Free Next-Day Delivery available</span></div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', fontSize: '15px', fontWeight: 500, lineHeight: 1.5 }}><span style={{ fontSize: '20px', flexShrink: 0 }}>🔄</span> <span style={{ color: secondaryTextStr }}><strong style={{ color: 'var(--text)' }}>Returns:</strong> 7-Day completely hassle-free return policy</span></div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-8 flex items-center justify-between sm:justify-start gap-4 sm:gap-6">
            <span className="text-[13px] sm:text-[15px] font-black tracking-widest uppercase" style={{ color: mutedTextStr }}>Quantity</span>
            <div className="flex items-center rounded-2xl overflow-hidden shadow-sm border" style={{ backgroundColor: surfaceAlphaStr, borderColor: borderStr }}>
              <button onClick={() => handleQtyChange(-1)} disabled={qty <= 1 || isOutOfStock} className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl font-black disabled:opacity-30 transition-all hover:bg-black/5 dark:hover:bg-white/5">−</button>
              <span className="w-10 sm:w-12 text-center font-black text-[16px] sm:text-lg">{qty}</span>
              <button onClick={() => handleQtyChange(1)} disabled={stock ? qty >= stock : false || isOutOfStock} className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl font-black disabled:opacity-30 transition-all hover:bg-black/5 dark:hover:bg-white/5">+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-10 w-full">
            <button 
              disabled={isOutOfStock}
              className="w-full sm:w-1/2 h-[60px] sm:h-[64px] rounded-[16px] text-[15px] sm:text-[16px] font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50 hover:opacity-80 bg-transparent"
              style={{ border: `2px solid ${product.glowColor}`, color: product.glowColor, fontFamily: 'Nunito, sans-serif' }}
            >
              Add to Cart
            </button>
            <button 
              onClick={() => setPaymentOpen(true)}
              disabled={isOutOfStock}
              className="w-full sm:w-1/2 h-[60px] sm:h-[64px] rounded-[16px] text-[16px] sm:text-[18px] font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:transform-none hover:-translate-y-1"
              style={{ 
                backgroundColor: product.glowColor, color: '#000', fontFamily: 'Nunito, sans-serif',
                boxShadow: `0 10px 30px ${product.glowColor}50`
              }}
            >
              Buy Now
            </button>
          </div>

          {/* Warranty Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', width: '100%', paddingBottom: '24px' }}>
            {[ { i: '🛡️', t: '6 Month Warranty' }, { i: '🔄', t: '7 Day Returns' }, { i: '🚚', t: 'Free Delivery' }, { i: '✅', t: '100% Genuine' } ].map((b, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', textAlign: 'center', padding: '16px 8px', borderRadius: '10px', border: `1px solid ${borderStr}`, backgroundColor: surfaceAlpha2Str }}>
                <span style={{ fontSize: '28px' }}>{b.i}</span>
                <span style={{ fontSize: '11px', fontWeight: 800, maxWidth: '80px', lineHeight: 1.3, color: mutedTextStr }}>{b.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px', marginTop: '80px' }}>
        <div style={{ display: 'flex', overflowX: 'auto', borderBottom: `2px solid ${borderStr}`, marginBottom: '40px', gap: '8px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {['Specifications', "What's in Box", 'Highlights', 'Reviews'].map(tab => (
            <button
              key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '16px 24px',
                fontSize: '14px',
                fontWeight: 900,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease',
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === tab ? product.glowColor : mutedTextStr,
                borderBottom: activeTab === tab ? `3px solid ${product.glowColor}` : '3px solid transparent',
                marginBottom: '-2px'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ minHeight: '250px' }}>
          {activeTab === 'Specifications' && (
            <div style={{ width: '100%' }}>
              <p style={{ fontSize: '17px', fontWeight: 500, lineHeight: 1.7, marginBottom: '32px', color: secondaryTextStr, padding: '0 4px' }}>{product.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 48px', borderTop: `1px solid ${borderStr}` }}>
                {product.specs.map((spec, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'row', padding: '18px 8px', borderBottom: `1px solid ${borderStr}`, alignItems: 'baseline', gap: '16px' }}>
                    <div style={{ width: '40%', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '12px', color: mutedTextStr, flexShrink: 0 }}>{spec.label}</div>
                    <div style={{ width: '60%', fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "What's in Box" && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', padding: '0 4px' }}>
              {product.inBox.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', borderRadius: '16px', border: `1px solid ${borderStr}`, backgroundColor: surfaceAlpha2Str, transition: 'all 0.3s ease' }}>
                  <span style={{ fontSize: '22px' }}>✅</span>
                  <span style={{ fontWeight: 900, fontSize: '15px', color: 'var(--text)' }}>{item}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Highlights' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', padding: '0 4px' }}>
              {product.highlights.map((highlight, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', borderRadius: '16px', border: `1px solid ${borderStr}`, backgroundColor: surfaceAlpha2Str, transition: 'all 0.3s ease' }}>
                  <span style={{ fontSize: '22px' }}>⚡</span>
                  <span style={{ fontSize: '15px', fontWeight: 900, lineHeight: 1.4, color: 'var(--text)' }}>{highlight}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div>
              <div className="flex flex-col md:flex-row gap-8 md:gap-10 mb-10 md:mb-12 pb-10 md:pb-12 border-b" style={{ borderColor: borderStr }}>
                <div className="flex flex-col items-center justify-center p-6 md:p-8 rounded-[24px] border w-full md:w-64 shrink-0" style={{ backgroundColor: surfaceAlpha2Str, borderColor: borderStr }}>
                  <div className="text-[56px] md:text-[64px] font-black mb-1 md:mb-2 leading-none" style={{ color: 'var(--text)' }}>4.9</div>
                  <div className="text-[#FFD700] tracking-widest text-xl md:text-2xl mb-3 md:mb-4 drop-shadow-sm">★★★★★</div>
                  <div className="text-[13px] md:text-[14px] font-bold uppercase tracking-widest" style={{ color: mutedTextStr }}>482 Ratings</div>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-3 md:gap-4 w-full">
                  {[ { stars: 5, pt: '85%' }, { stars: 4, pt: '10%' }, { stars: 3, pt: '3%' }, { stars: 2, pt: '1%' }, { stars: 1, pt: '1%' } ].map(row => (
                    <div key={row.stars} className="flex items-center gap-4 md:gap-6 text-[13px] md:text-[14px] font-bold">
                      <span className="w-8 md:w-10 text-right shrink-0" style={{ color: mutedTextStr }}>{row.stars} ★</span>
                      <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: borderStr }}>
                        <div className="h-full rounded-full" style={{ width: row.pt, backgroundColor: 'var(--text)' }}></div>
                      </div>
                      <span className="w-10 shrink-0" style={{ color: secondaryTextStr }}>{row.pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                {REVIEWS.map((r, i) => (
                  <div key={i} className="pb-8 border-b last:border-0" style={{ borderColor: borderStr }}>
                    <div className="flex flex-wrap sm:flex-nowrap justify-between items-start mb-4 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg font-black shrink-0" style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}>{r.name.charAt(0)}</div>
                        <div className="flex flex-col">
                          <p className="text-[15px] sm:text-[16px] font-black leading-tight mb-1" style={{ color: 'var(--text)' }}>{r.name}</p>
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <span className="text-[12px] text-[#FFD700] tracking-widest drop-shadow-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                            {r.verified && <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-green-600 bg-green-500/10 px-2 py-0.5 sm:py-1 rounded-md">Verified</span>}
                          </div>
                        </div>
                      </div>
                      <span className="text-[12px] sm:text-[13px] font-bold shrink-0" style={{ color: mutedTextStr }}>{r.date}</span>
                    </div>
                    <p className="text-[15px] sm:text-[16px] font-medium leading-relaxed pl-0 sm:pl-16 mt-2 sm:mt-0" style={{ color: secondaryTextStr }}>"{r.text}"</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl text-[14px] sm:text-[15px] font-black uppercase tracking-widest transition-colors border shadow-sm" style={{ color: 'var(--text)', borderColor: borderStr, backgroundColor: surfaceAlphaStr }}>
                View All Reviews
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px', marginTop: '96px' }}>
        <h2 className="text-2xl sm:text-3xl font-black mb-8 sm:mb-10 uppercase tracking-widest text-center sm:text-left" style={{ color: 'var(--text)' }}>Other Editions</h2>
        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '48px', scrollSnapType: 'x mandatory' }}>
          {relatedProducts.map(rp => (
             <Link 
              to={`/product/${rp.id}`} 
              key={rp.id}
              className="group"
              style={{ display: 'block', minWidth: '300px', borderRadius: '12px', padding: '32px', scrollSnapAlign: 'center', transition: 'all 0.3s ease', border: `1.5px solid ${borderStr}`, backgroundColor: surfaceAlpha2Str, textDecoration: 'none' }}
            >
              <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', position: 'relative' }}>
                <div 
                  className="absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-30 scale-50 group-hover:scale-100"
                  style={{ background: `radial-gradient(circle, ${rp.glowColor} 0%, transparent 70%)`, filter: 'blur(50px)', borderRadius: '50%' }}
                />
                <img 
                  src={rp.brushSrc} 
                  alt={rp.name} 
                  className="group-hover:scale-110"
                  style={{ maxHeight: '90%', objectFit: 'contain', position: 'relative', zIndex: 10, transition: 'transform 0.5s ease', filter: `drop-shadow(0 20px 40px ${rp.glowColor}30)` }}
                />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px', color: mutedTextStr }}>Denty Core</div>
              <h3 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '8px', fontFamily: 'Nunito', color: 'var(--text)' }}>{rp.name}</h3>
              <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '24px', color: secondaryTextStr, lineHeight: 1.5 }}>{rp.tagline}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 900, color: rp.glowColor }}>{rp.displayPrice}</div>
                <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', padding: '10px 24px', borderRadius: '8px', border: `1.5px solid ${borderStr}`, color: 'var(--text)', transition: 'all 0.3s ease' }}>View</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Modals */}
      {paymentOpen && (
        <PaymentModal product={product} qty={qty} onClose={() => setPaymentOpen(false)} onSuccess={(data) => { setPaymentOpen(false); setSuccessData(data); }} />
      )}
      {successData && (
        <SuccessScreen product={product} successData={successData} onClose={() => setSuccessData(null)} />
      )}

    </div>
  );
}
