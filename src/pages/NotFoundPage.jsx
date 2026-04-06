import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 page-transition fade-in relative overflow-hidden">
      
      {/* Background glow just for flavor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[var(--accent)]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        <h1 className="text-[120px] leading-none font-black font-nunito text-[var(--accent)] mix-blend-screen drop-shadow-[0_0_30px_rgba(0,229,255,0.3)]">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-black text-white">Page Not Found</h2>
        <p className="text-xl text-white/50 pb-8">Looks like this page went on a dental vacation. 🦷</p>
        
        <button 
          onClick={() => navigate('/')} 
          className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition text-lg inline-flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Go Back Home
        </button>
      </div>

    </div>
  );
}
