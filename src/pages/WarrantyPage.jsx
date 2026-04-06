import React from 'react';
import { Link } from 'react-router-dom';
import WhitePageLayout from '../components/WhitePageLayout';

export default function WarrantyPage() {
  return (
    <WhitePageLayout 
      title="6-Month Warranty" 
      category="Policies"
      lastUpdated="January 1, 2025"
      disableProse={true}
    >
        {/* HERO */}
        <div className="text-center space-y-6 mb-16">
          <div className="text-6xl mb-6">🛡️</div>
          <p className="text-xl text-gray-600 max-w-xl mx-auto">
            We stand by our products. If it breaks during normal use, we'll fix or replace it.
          </p>
        </div>

        {/* Coverage Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
           <div className="w-card relative overflow-hidden border-green-100">
              <div className="w-card-body p-8">
                <div className="absolute top-0 right-0 p-8 text-6xl opacity-5">✅</div>
                <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-3">COVERED</h3>
                <ul className="space-y-4 text-gray-700">
                   <li className="flex items-start gap-3"><span className="text-green-500 font-bold">✓</span> Manufacturing defects</li>
                   <li className="flex items-start gap-3"><span className="text-green-500 font-bold">✓</span> Motor and vibration mechanism failures</li>
                   <li className="flex items-start gap-3"><span className="text-green-500 font-bold">✓</span> Charging port defects (no physical damage)</li>
                   <li className="flex items-start gap-3"><span className="text-green-500 font-bold">✓</span> App connectivity failures</li>
                   <li className="flex items-start gap-3"><span className="text-green-500 font-bold">✓</span> Battery performance dropping below 70% capacity in 6 months</li>
                </ul>
              </div>
           </div>
           
           <div className="w-card relative overflow-hidden border-red-100">
              <div className="w-card-body p-8">
                <div className="absolute top-0 right-0 p-8 text-6xl opacity-5">❌</div>
                <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-3">NOT COVERED</h3>
                <ul className="space-y-4 text-gray-700">
                   <li className="flex items-start gap-3"><span className="text-red-500 font-bold">✕</span> Physical damage (drops, cracks)</li>
                   <li className="flex items-start gap-3"><span className="text-red-500 font-bold">✕</span> Water damage beyond IPX rating</li>
                   <li className="flex items-start gap-3"><span className="text-red-500 font-bold">✕</span> Wear items: brush heads</li>
                   <li className="flex items-start gap-3"><span className="text-red-500 font-bold">✕</span> Damage from unauthorized modifications</li>
                   <li className="flex items-start gap-3"><span className="text-red-500 font-bold">✕</span> Loss or theft</li>
                </ul>
              </div>
           </div>
        </div>

        {/* Claim Steps */}
        <div className="space-y-8 mb-16 max-w-2xl mx-auto">
           <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">How to Claim</h2>
           <div className="space-y-4">
              <div className="w-card p-6 flex items-center gap-6">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 border border-blue-200 rounded-full flex items-center justify-center font-bold text-xl shrink-0">1</div>
                 <div>
                    <h4 className="font-bold text-lg text-gray-900">Email us</h4>
                    <p className="text-gray-600 mt-1">Email <a href="mailto:founderzero1@gmail.com" className="text-blue-600 font-semibold hover:underline">founderzero1@gmail.com</a> with your Order ID</p>
                 </div>
              </div>
              <div className="w-card p-6 flex items-center gap-6">
                 <div className="w-12 h-12 bg-gray-50 text-gray-500 border border-gray-200 rounded-full flex items-center justify-center font-bold text-xl shrink-0">2</div>
                 <div>
                    <h4 className="font-bold text-lg text-gray-900">Provide Proof</h4>
                    <p className="text-gray-600 mt-1">Include clear photos or video explaining the defect</p>
                 </div>
              </div>
              <div className="w-card p-6 flex items-center gap-6">
                 <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0">3</div>
                 <div>
                    <h4 className="font-bold text-lg text-gray-900">Resolution</h4>
                    <p className="text-gray-600 mt-1">We'll respond within 48 hours with next steps</p>
                 </div>
              </div>
           </div>
           <p className="text-center text-gray-500 italic mt-6">Average resolution time: 7–14 business days</p>
        </div>

        <div className="text-center pt-8 border-t border-gray-200">
           <button disabled className="w-btn bg-gray-100 text-gray-400 cursor-not-allowed">
              Extend to 1 Year — ₹299 (Coming Soon)
           </button>
        </div>
    </WhitePageLayout>
  );
}
