import React from 'react';
import WhitePageLayout from '../components/WhitePageLayout';

export default function AboutPage() {
  const team = [
    { name: 'Mohideen', role: 'CEO & Co-founder', tagline: 'The vision behind DENTY', initial: 'M' },
    { name: 'Brahma', role: 'CTO & Co-founder', tagline: 'Builds the AI that powers Buddy', initial: 'B' },
    { name: 'Segu Rutesh', role: 'Head of Design', tagline: 'Makes DENTY look as good as it works', initial: 'S' },
    { name: 'Rohit', role: 'Head of Growth', tagline: "Makes sure you've heard of us", initial: 'R' }
  ];

  const timeline = [
    { time: '2025', title: 'The Spark', text: 'ZERO team formed in Rajahmundry. Late nights, bad coffee, wild ideas.' },
    { time: '2025', title: 'First Draft', text: 'First DENTY prototype. 3D-printed and purely functional.' },
    { time: '2026', title: 'Going Live', text: 'First 500 units sold in India. Sold out in 48 hours.', active: true },
    { time: '2027', title: 'The Evolution', text: 'DENTY v2 launches with IPX8, 45-day battery, 6 modes.' },
    { time: 'Future', title: 'Global', text: '🌍 Going global. Watch this space.' }
  ];

  return (
    <WhitePageLayout 
      title="About Us" 
      maxWidth="max-w-7xl" 
      category="Our Story"
      disableProse={true}
      hideTitle={true}
    >
      <div className="space-y-24 md:space-y-32 pb-24 font-sans max-w-5xl mx-auto">
        
        {/* HERO SECTION - Ultra Clean */}
        <section className="text-center space-y-6 pt-16 md:pt-24 px-4 max-w-4xl mx-auto">
          <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Designed in Rajahmundry</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            We're building the future of oral care.
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed pt-4">
            DENTY by ZERO is an AI-powered smart toothbrush brand. We combine precise hardware with behavioural AI to make brushing intuitive, effective, and beautiful.
          </p>
        </section>

        {/* MISSION - Minimal Grid */}
        <section className="space-y-12">
          <h3 className="text-3xl font-bold text-gray-900 px-4 text-center tracking-tight">Why we started ZERO.</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="w-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-card-body p-10 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl border border-gray-100">🦷</div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Precision Health</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">AI analyzes brushing patterns to ensure correct and consistent oral care, removing the guesswork.</p>
                </div>
              </div>
            </div>
            <div className="w-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-card-body p-10 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl border border-gray-100">🤖</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Human AI</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">Our bots don't judge. They guide. Meet your personal brushing coaches: Buddy, Luna, and Batman.</p>
                </div>
              </div>
            </div>
            <div className="w-card shadow-sm hover:shadow-md transition-shadow">
              <div className="w-card-body p-10 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl border border-gray-100">🌍</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Accessible Premium</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">High-end technology should not be an exclusive luxury. We build premium hardware at fair prices.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM - Clean Cards */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Leadership</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-[2rem] p-8 text-center flex flex-col items-center shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-2xl font-bold text-gray-900 mb-6 border border-gray-100">
                  {m.initial}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{m.name}</h3>
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">{m.role}</p>
                <div className="h-px w-8 bg-gray-200 mb-4"></div>
                <p className="text-sm text-gray-500">"{m.tagline}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* TIMELINE - Strict Minimalist */}
        <section className="space-y-16 max-w-3xl mx-auto pt-8">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Our Journey</h3>
          </div>
          <div className="space-y-0">
            {timeline.map((ev, i) => (
              <div key={i} className="flex gap-6 md:gap-12 items-start border-l-2 border-gray-100 pb-12 ml-4 md:ml-0 relative">
                <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${ev.active ? 'bg-gray-900' : 'bg-gray-300'}`}></div>
                <div className="w-24 shrink-0 pl-6 md:pl-8 pt-0.5">
                  <span className={`text-sm font-bold tracking-widest uppercase ${ev.active ? 'text-gray-900' : 'text-gray-400'}`}>{ev.time}</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-gray-900">{ev.title}</h4>
                  <p className="text-gray-500 leading-relaxed text-base">{ev.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* VALUES - Apple Style Pills */}
        <section className="space-y-12 text-center pb-12 pt-8">
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Software limits, Hardware scales.</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {['No BS', 'Radical Transparency', 'India First', 'Sustainable', 'Open Source AI Models'].map(v => (
              <div key={v} className="px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 font-medium text-sm shadow-sm">
                {v}
              </div>
            ))}
          </div>
        </section>

      </div>
    </WhitePageLayout>
  );
}

