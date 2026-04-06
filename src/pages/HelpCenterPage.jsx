import React, { useState } from 'react';
import WhitePageLayout from '../components/WhitePageLayout';

export default function HelpCenterPage() {
  const [search, setSearch] = useState('');

  const faqs = [
    {
      category: 'Getting Started',
      items: [
        { q: 'How do I set up my DENTY brush?', a: 'Charge for 2 hours. Download DENTY AI App. Pair via Bluetooth. Follow the in-app tutorial.' },
        { q: 'Which app should I download?', a: '"DENTY AI" is available on iOS App Store and Google Play. Search "DENTY Brush".' },
        { q: 'How do I connect to Bluetooth?', a: 'Press and hold the power button for 3 seconds until blue light flashes. Open app → Add Device.' }
      ]
    },
    {
      category: 'Orders & Shipping',
      items: [
        { q: 'How long does delivery take?', a: '5-7 business days via DTDC Express. Faster delivery not available currently.' },
        { q: 'Can I change my delivery address?', a: 'Contact us within 2 hours of ordering at zero.denty.support@gmail.com' },
        { q: 'How do I track my order?', a: "You'll receive DTDC tracking details via email within 24 hours of dispatch." }
      ]
    },
    {
      category: 'Warranty & Repairs',
      items: [
        { q: 'What is covered under warranty?', a: 'Manufacturing defects, motor/motor-controller failures, charging port issues.\n\nNOT covered: physical damage, water damage beyond IPX rating misuse.' },
        { q: 'How do I claim warranty?', a: 'Email zero.denty.support@gmail.com with your order ID and photos/video of the issue.' },
        { q: 'How long does warranty claim take?', a: '7-14 business days including shipping.' }
      ]
    },
    {
      category: 'Returns',
      items: [
        { q: 'What is the return policy?', a: '7-day returns for unused products in original packaging. No questions asked.' },
        { q: 'How do I initiate a return?', a: 'Email zero.denty.support@gmail.com with your order ID.' }
      ]
    }
  ];

  return (
    <WhitePageLayout 
      title="How can we help?" 
      category="Support" 
      maxWidth="max-w-3xl" 
      disableProse={true}
    >
      <div className="space-y-16">
        
        {/* HERO SEARCH */}
        <section className="text-center space-y-8">
          <div className="relative max-w-xl mx-auto">
             <input 
               type="text" 
               placeholder="Search for answers..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-input pl-14 py-4 text-lg shadow-sm"
             />
             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-gray-400">🔍</span>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-12">
           {faqs.map((cat, i) => (
             <div key={i} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">{cat.category}</h2>
                <div className="space-y-4">
                   {cat.items.filter(item => item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())).map((item, j) => (
                     <Accordion key={j} question={item.q} answer={item.a} />
                   ))}
                </div>
             </div>
           ))}
        </section>

        <div className="text-center pt-12 border-t border-gray-200">
           <p className="text-gray-600 text-lg">Still need help? Email us at <a href="mailto:zero.denty.support@gmail.com" className="text-blue-600 font-bold hover:underline">zero.denty.support@gmail.com</a></p>
        </div>

      </div>
    </WhitePageLayout>
  );
}

function Accordion({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-card transition-all duration-300">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition"
      >
        <h3 className="text-lg font-semibold text-gray-900 pr-8">{question}</h3>
        <span className={`text-xl text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div 
        className="transition-all duration-300 ease-in-out"
        style={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0, overflow: 'hidden' }}
      >
        <div className="px-6 pb-6 text-gray-600 leading-relaxed whitespace-pre-line">
          {answer}
        </div>
      </div>
    </div>
  );
}
