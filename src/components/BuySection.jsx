import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    id: 'buddy',
    label: 'White Edition',
    name: 'DENTY Sonic Brush',
    price: '₹1,199',
    strike: '₹12,999',
    img: '/brushes/white_brush.jpg',
    color: '#00E5FF',
    specs: ['40,000 VPM Motor', '3 Brush Heads included', '30-Day Battery', 'IPX7 Waterproof'],
  },
  {
    id: 'luna',
    label: 'Pink Edition',
    name: 'DENTY Sonic Brush',
    price: '₹1,299',
    strike: '₹12,999',
    img: '/brushes/pink_brush.jpg',
    color: '#FF69B4',
    specs: ['40,000 VPM Motor', '3 Brush Heads included', '30-Day Battery', 'IPX7 Waterproof'],
  },
  {
    id: 'batman',
    label: 'Black Edition',
    name: 'DENTY Sonic Brush',
    price: '₹999',
    strike: '₹12,999',
    img: '/brushes/black_brush.jpg',
    color: '#FFD700',
    specs: ['40,000 VPM Motor', '3 Brush Heads included', '30-Day Battery', 'IPX7 Waterproof'],
  },
  {
    id: 'heads',
    label: 'Replacement Heads',
    name: 'DuPont™ Brush Heads (2x)',
    price: '₹199',
    strike: '₹499',
    img: '/brushes/white_brush.jpg', // Using brush image temporarily, should be heads
    color: '#22c55e',
    specs: ['Medium Soft Bristles', 'Fading Indicator', 'Includes 2 heads', 'Dentist Recommended'],
  }
];

export default function BuySection() {
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();
  const activeProduct = PRODUCTS[activeIdx];

  // Animate product change
  useEffect(() => {
    gsap.fromTo('.spec-content', 
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out', overwrite: true }
    );
  }, [activeIdx]);

  return (
    <section
      id="buy"
      ref={sectionRef}
      className="relative min-h-[100vh] flex flex-col items-center justify-center py-20 px-6 overflow-hidden"
      style={{ background: '#ffffff' }}
    >
      {/* Massive ambient background glow based on selected product color */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.08] transition-colors duration-1000 pointer-events-none"
        style={{ background: activeProduct.color }} />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Model Selector Pill */}
        <div className="flex p-1.5 rounded-full mb-12 shadow-sm" style={{ background: '#f8f8f8', border: '1px solid #f0f0f0' }}>
          {PRODUCTS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveIdx(i)}
              className="px-6 py-2.5 rounded-full text-[13px] font-800 transition-all duration-300 relative"
              style={{
                color: activeIdx === i ? '#fff' : '#888',
                background: activeIdx === i ? '#111' : 'transparent',
                boxShadow: activeIdx === i ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* The "Meteor Spec" Showcase */}
        <div className="spec-content w-full flex flex-col items-center mt-6">
          
          <h2 className="text-[64px] md:text-[100px] font-900 tracking-[-0.05em] leading-[0.85] text-center mb-6 transition-all duration-700 drop-shadow-sm"
            style={{ 
              background: `linear-gradient(135deg, #111 0%, ${activeProduct.color} 150%)`, 
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' 
            }}>
            {activeProduct.name}
          </h2>

          <div className="flex items-baseline gap-4 mb-14">
            <span className="text-[48px] font-900 tracking-tighter text-[#111]">
              {activeProduct.price}
            </span>
            <span className="text-[22px] line-through text-zinc-400 font-700 tracking-tight">
              {activeProduct.strike}
            </span>
          </div>

          {/* Massive Central Image */}
          <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center mb-16 group cursor-pointer"
            onClick={() => navigate(`/product/${activeProduct.id}`)}>
            <div className="absolute inset-0 rounded-full opacity-[0.02] transition-all duration-700 group-hover:scale-[1.15] group-hover:opacity-[0.04]"
              style={{ background: `radial-gradient(circle, ${activeProduct.color} 0%, transparent 70%)` }} />
            
            <img src={activeProduct.img} alt={activeProduct.name}
              className="h-full w-auto object-contain relative z-10 transition-transform duration-700 group-hover:scale-105"
              style={{ filter: `drop-shadow(0 40px 80px ${activeProduct.color}40)` }}
              draggable={false} />
              
            {activeIdx === 3 && (
               <div className="absolute top-[15%] right-[-5%] bg-green-500 text-white px-5 py-2.5 rounded-2xl text-[16px] font-900 rotate-12 shadow-2xl border-4 border-white z-20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                 2-PACK!
               </div>
            )}
          </div>

          {/* Specs Row */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-5 mb-14 max-w-3xl">
            {activeProduct.specs.map((spec, i) => (
              <div key={i} className="px-6 py-3 rounded-full text-[14px] font-800 tracking-wide text-zinc-600 bg-zinc-50 border border-zinc-200 shadow-sm transition-colors duration-300 hover:bg-white hover:border-zinc-300 hover:text-zinc-900">
                {spec}
              </div>
            ))}
          </div>

          {/* Huge Central Buy Button */}
          <div className="relative group w-full sm:w-auto mt-6">
            <div className="multicolor-glow-bg absolute inset-[-2px] rounded-full opacity-50 blur-[12px] group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <button
              onClick={() => navigate(`/product/${activeProduct.id}?checkout=true`)}
              className="relative w-full px-20 py-6 rounded-full font-900 text-[22px] tracking-wide transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              style={{ 
                background: activeProduct.id === 'batman' ? '#09090b' : activeProduct.color,
                color: activeProduct.id === 'batman' ? '#fff' : '#fff',
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2)`
              }}
            >
              <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <span className="relative z-10">BUY {activeProduct.label.toUpperCase()}</span>
            </button>
          </div>
          
          <div className="mt-8 flex gap-8 text-[14px] font-800 tracking-wide text-zinc-400">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/>Free Shipping</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/>30-Day Returns</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/>Secure Checkout</span>
          </div>

        </div>
      </div>
    </section>
  );
}
