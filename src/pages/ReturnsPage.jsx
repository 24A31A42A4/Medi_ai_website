import React from 'react';
import { Link } from 'react-router-dom';
import WhitePageLayout from '../components/WhitePageLayout';

export default function ReturnsPage() {
  return (
    <WhitePageLayout 
      title="Returns & Refunds" 
      category="Policies"
      lastUpdated="January 1, 2025" 
      disableProse={true}
    >
        
        {/* HERO */}
        <div className="text-center space-y-6 mb-16">
          <p className="text-2xl font-bold text-gray-900">No questions asked. 7-day returns.</p>
        </div>

        <div className="w-card mb-16">
           <div className="w-card-body space-y-8">
             <div className="grid md:grid-cols-2 gap-8">
                <div>
                   <h3 className="text-blue-600 font-bold mb-2 uppercase tracking-widest text-xs">Return Window</h3>
                   <p className="text-xl font-medium text-gray-900">7 days from delivery date</p>
                </div>
                <div>
                   <h3 className="text-blue-600 font-bold mb-2 uppercase tracking-widest text-xs">Condition</h3>
                   <p className="text-xl font-medium text-gray-900">Unused, original packaging, all accessories included</p>
                </div>
                <div>
                   <h3 className="text-blue-600 font-bold mb-2 uppercase tracking-widest text-xs">Refund Method</h3>
                   <p className="text-xl font-medium text-gray-900">Original payment method</p>
                </div>
                <div>
                   <h3 className="text-blue-600 font-bold mb-2 uppercase tracking-widest text-xs">Timeline</h3>
                   <p className="text-xl font-medium text-gray-900">5-7 business days after product receipt</p>
                </div>
             </div>

             <div className="pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-red-600 mb-4">Non-returnable Items</h3>
                <ul className="space-y-3 text-gray-600 list-disc pl-5 marker:text-red-400">
                   <li>Products with physical damage caused by user</li>
                   <li>Brush heads (hygiene product — not returnable once opened)</li>
                   <li>Products returned outside the 7-day window</li>
                </ul>
             </div>
           </div>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-16 w-full max-w-2xl mx-auto">
           <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">How to Return</h2>
           
           <div className="relative border-l-2 border-blue-100 ml-6 pl-8 space-y-12">
              <div className="relative">
                 <div className="absolute w-8 h-8 bg-blue-50 border-2 border-blue-600 rounded-full -left-[41px] top-0 flex items-center justify-center font-bold text-blue-600 text-sm">1</div>
                 <h4 className="text-xl font-bold mb-2 text-gray-900">Email Us</h4>
                 <p className="text-gray-600 text-base">Email <a href="mailto:zero.denty.support@gmail.com" className="text-blue-600 font-semibold hover:underline">zero.denty.support@gmail.com</a> with Subject: "RETURN — [Your Order ID]"</p>
              </div>
              <div className="relative">
                 <div className="absolute w-8 h-8 bg-white border-2 border-gray-300 rounded-full -left-[41px] top-0 flex items-center justify-center font-bold text-gray-500 text-sm">2</div>
                 <h4 className="text-xl font-bold mb-2 text-gray-900">Provide Details</h4>
                 <p className="text-gray-600 text-base">Include the reason for return and clear photos of the product and packaging.</p>
              </div>
              <div className="relative">
                 <div className="absolute w-8 h-8 bg-white border-2 border-green-500 rounded-full -left-[41px] top-0 flex items-center justify-center font-bold text-green-500 text-sm">3</div>
                 <h4 className="text-xl font-bold mb-2 text-gray-900">Pickup Arranged</h4>
                 <p className="text-gray-600 text-base">We'll arrange a DTDC pickup directly from your address.</p>
              </div>
              <div className="relative">
                 <div className="absolute w-8 h-8 bg-blue-600 rounded-full -left-[41px] top-0 flex items-center justify-center font-bold text-white text-sm">✓</div>
                 <h4 className="text-xl font-bold mb-2 text-gray-900">Refund Processed</h4>
                 <p className="text-gray-600 text-base">Refund is processed within 5-7 days of us receiving and inspecting the product.</p>
              </div>
           </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200 text-gray-600 shadow-sm max-w-2xl mx-auto">
           <span className="text-3xl mb-3 block">🔄</span>
           <span className="font-bold text-gray-900 block mb-2 text-lg">Exchange Policy</span>
           If your product is defective, we'll replace it under warranty.<br/>Exchange for a different variant is not available currently.
        </div>
    </WhitePageLayout>
  );
}
