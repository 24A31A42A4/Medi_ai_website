import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-[#0A0A0A] text-[#86868b] text-[14px] font-sans pt-28 md:pt-32 pb-12 relative z-10 w-full">
      {/* Gradient transition to prevent hard edge against previous section */}
      <div className="absolute -top-32 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0A0A0A)' }} />

      <div className="w-full mx-auto" style={{ maxWidth: '1100px', paddingLeft: '8vw', paddingRight: '8vw' }}>

        {/* Top Section: Links Grid */}
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8 mb-16">

          {/* Brand & Socials */}
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-start space-y-5 text-center md:text-left">
            <div>
              <Link to="/" className="inline-block relative">
                <span className="font-['Nunito'] font-black text-4xl md:text-3xl tracking-tight text-[#00E5FF] leading-none block">
                  DENTY
                </span>
                <span className="text-[12px] font-bold text-[#555] tracking-widest uppercase block mt-1">
                  by ZERO
                </span>
              </Link>
            </div>
            <p className="text-[#86868b] leading-relaxed max-w-[280px]">
              Brushing, reimagined with AI. The future of dental care right in your home.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 pt-2 justify-center md:justify-start">
              {[
                { name: 'Instagram', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
                { name: 'Twitter', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg> },
                { name: 'YouTube', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> }
              ].map((social, i) => (
                <a key={i} href="#" aria-label={social.name} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-[#86868b] hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-300">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="w-full md:w-2/3 grid grid-cols-3 gap-6 sm:gap-8 text-left pt-8 md:pt-0">

            <div className="flex flex-col space-y-4">
              <h4 className="text-[#f5f5f7] font-bold text-[14px] md:text-[15px] tracking-widest uppercase mb-2">Platform</h4>
              <Link to="/#features" className="text-[13px] md:text-[14px] hover:text-white transition-colors duration-200">Features</Link>
              <Link to="/#products" className="text-[13px] md:text-[14px] hover:text-white transition-colors duration-200">Products</Link>
              <Link to="/careers" className="text-[13px] md:text-[14px] hover:text-white transition-colors duration-200">Careers</Link>
            </div>

            <div className="flex flex-col space-y-4">
              <h4 className="text-[#f5f5f7] font-bold text-[14px] md:text-[15px] tracking-widest uppercase mb-2">Support</h4>
              <Link to="/help-center" className="text-[13px] md:text-[14px] hover:text-white transition-colors duration-200">Help Center</Link>
              <Link to="/warranty" className="text-[13px] md:text-[14px] hover:text-white transition-colors duration-200">Warranty</Link>
              <Link to="/returns" className="text-[13px] md:text-[14px] hover:text-white transition-colors duration-200">Returns</Link>
              <Link to="/contact" className="text-[13px] md:text-[14px] hover:text-white transition-colors duration-200">Contact</Link>
            </div>

            <div className="flex flex-col space-y-4">
              <h4 className="text-[#f5f5f7] font-bold text-[14px] md:text-[15px] tracking-widest uppercase mb-2">Legal</h4>
              <Link to="/privacy" className="text-[13px] md:text-[14px] hover:text-white transition-colors duration-200">Privacy Policy</Link>
              <Link to="/terms" className="text-[13px] md:text-[14px] hover:text-white transition-colors duration-200">Terms of Service</Link>
              <Link to="/cookies" className="text-[13px] md:text-[14px] hover:text-white transition-colors duration-200">Cookie Policy</Link>
              {isAdmin && <Link to="/admin" className="text-[#00E5FF] text-[13px] md:text-[14px] hover:text-white transition-colors duration-200 mt-2 block font-medium">Admin Dashboard</Link>}
            </div>

          </div>

        </div>

        {/* Bottom Section: Copyright & Legal Text */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <p>Copyright © 2025 ZERO Inc. All rights reserved.</p>
            <span className="hidden md:inline text-[#555]">|</span>
            <p>Made with ❤️ in India.</p>
          </div>

          <div className="text-[12px] text-[#555]">
            DENTY is not a registered trademark. Demo purposes only.
          </div>
        </div>

      </div>
    </footer>
  );
}
