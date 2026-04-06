import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2.5 h-6 rounded-full opacity-0"
          style={{
            left: `${Math.random() * 100}vw`,
            top: `-5vh`,
            backgroundColor: ['#00E5FF', '#FF69B4', '#FFD700', '#FFFFFF', '#4ADE80'][Math.floor(Math.random() * 5)],
            animation: `fallDown ${Math.random() * 2 + 2}s linear ${Math.random() * 2}s infinite`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes fallDown {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default function SuccessScreen({ product, successData, onClose }) {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const mutedTextStr = '#6B7280';
  const secondaryTextStr = '#4B5563';
  const borderStr = '#E5E7EB';
  const surfaceAlphaStr = '#F9FAFB';
  const summaryBgStr = '#FFFFFF';

  return (
    <div className="fixed inset-0 z-[6000] flex flex-col items-center justify-center p-6 font-sans overflow-y-auto" style={{ backgroundColor: '#FFFFFF', color: '#111827' }}>
      {showConfetti && <Confetti />}
      
      <div className="max-w-[540px] w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-700 delay-150 relative z-10 my-auto py-12">
        
        {/* Animated Check */}
        <div className="relative mb-10 group">
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: product.glowColor || 'var(--accent)' }} />
          <div className="w-28 h-28 rounded-full flex items-center justify-center relative shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-transform hover:scale-110 duration-500" style={{ backgroundColor: product.glowColor || 'var(--accent)', color: '#000' }}>
            <span className="text-6xl font-black drop-shadow-md">✓</span>
          </div>
        </div>

        <h1 className="text-[36px] sm:text-[48px] font-black leading-none mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>Order Placed!</h1>
        <p className="text-[15px] sm:text-[16px] font-medium leading-relaxed mb-10" style={{ color: secondaryTextStr }}>Payment ID: {successData.paymentId}</p>

        {/* Order Summary Card */}
        <div className="w-full rounded-[32px] p-6 sm:p-8 text-left border mb-10 shadow-lg relative overflow-hidden" style={{ backgroundColor: summaryBgStr, borderColor: borderStr }}>
          <div className="absolute top-0 left-0 w-full h-[6px]" style={{ backgroundColor: product.glowColor || 'var(--accent)' }} />
          
          <div className="flex justify-between items-start mb-6 pt-2">
            <div>
              <div className="text-[11px] sm:text-[12px] font-black tracking-widest uppercase mb-1" style={{ color: mutedTextStr }}>Order Number</div>
              <div className="text-[16px] sm:text-[18px] font-black font-mono tracking-tight">{successData.orderNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] sm:text-[12px] font-black tracking-widest uppercase mb-1" style={{ color: mutedTextStr }}>Status</div>
              <div className="text-[13px] sm:text-[14px] font-black text-green-500 uppercase tracking-wider">Processing</div>
            </div>
          </div>

          <div className="h-[2px] w-full mb-6" style={{ backgroundColor: borderStr }} />

          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[20px] flex items-center justify-center p-3 border shadow-inner" style={{ backgroundColor: surfaceAlphaStr, borderColor: borderStr }}>
              <img src={product.brushSrc} alt={product.name} className="h-full object-contain drop-shadow-lg" style={{ filter: `drop-shadow(0 15px 15px ${product.glowColor}40)` }} />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-[18px] sm:text-[20px] font-black mb-1">DENTY {product.name}</div>
              <div className="text-[13px] sm:text-[14px] font-medium leading-snug" style={{ color: secondaryTextStr }}>Will be delivered to {successData.customerName}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button 
            onClick={() => { onClose(); navigate('/track'); }}
            className="flex-1 h-[60px] rounded-[20px] text-[15px] sm:text-[16px] font-black uppercase tracking-widest transition-all duration-300 shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:shadow-2xl text-black border-2 border-transparent"
            style={{ backgroundColor: product.glowColor || 'var(--accent)', fontFamily: 'Nunito, sans-serif' }}
          >
            Track Order
          </button>
          <button 
            onClick={() => { onClose(); navigate('/'); }}
            className="flex-1 h-[60px] rounded-[20px] text-[15px] sm:text-[16px] font-black uppercase tracking-widest transition-all duration-300 hover:opacity-80 border-2"
            style={{ 
              borderColor: borderStr, 
              color: '#111827',
              backgroundColor: surfaceAlphaStr,
              fontFamily: 'Nunito, sans-serif'
            }}
          >
            Shop More
          </button>
        </div>
      </div>
    </div>
  );
}
