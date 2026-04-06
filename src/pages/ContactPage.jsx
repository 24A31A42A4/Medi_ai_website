import React, { useState } from 'react';
import WhitePageLayout from '../components/WhitePageLayout';

export default function ContactPage() {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    window.location.href = `mailto:founderzero1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message + '\n\n---\nFrom: ' + name + '\nEmail: ' + email)}`;
    setSuccess(true);
  };

  return (
    <WhitePageLayout 
      title="Get in touch." 
      category="Contact"
      maxWidth="max-w-6xl" 
      disableProse={true} 
      hideTitle={true}
    >
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 mb-16 mt-24 md:mt-32 lg:mt-40" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
           {/* Left Column: Info */}
           <div className="space-y-12 pt-8" style={{ paddingLeft: '8px', paddingRight: '8px' }}>
             <div className="space-y-6">
               <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-gray-900">Get in touch.</h1>
               <p className="text-xl text-gray-600">
                 We typically respond within 24 hours<br/>
                 <span className="text-blue-600 font-bold">Mon–Sat, 10am–6pm IST</span>
               </p>
             </div>
             
             <div className="space-y-6 text-lg">
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-8">📧</span>
                  <div>
                     <p className="font-bold text-gray-900">General Support</p>
                     <a href="mailto:zero.denty.support@gmail.com" className="text-gray-600 hover:text-blue-600 transition truncate block max-w-[250px]">zero.denty.support@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-8">📦</span>
                  <div>
                     <p className="font-bold text-gray-900">Order Issues</p>
                     <a href="mailto:zero.denty.support@gmail.com" className="text-gray-600 hover:text-blue-600 transition truncate block max-w-[250px]">zero.denty.support@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-8">🔄</span>
                  <div>
                     <p className="font-bold text-gray-900">Returns & Refunds</p>
                     <a href="mailto:zero.denty.support@gmail.com" className="text-gray-600 hover:text-blue-600 transition truncate block max-w-[250px]">zero.denty.support@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-8">🛡️</span>
                  <div>
                     <p className="font-bold text-gray-900">Warranty Claims</p>
                     <a href="mailto:zero.denty.support@gmail.com" className="text-gray-600 hover:text-blue-600 transition truncate block max-w-[250px]">zero.denty.support@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-8">💼</span>
                  <div>
                     <p className="font-bold text-gray-900">Careers & Biz</p>
                     <a href="mailto:founderzero1@gmail.com" className="text-gray-600 hover:text-blue-600 transition truncate block max-w-[250px]">founderzero1@gmail.com</a>
                  </div>
                </div>
             </div>

             <div className="pt-8 flex gap-6">
                <a href="#" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition text-sm font-bold text-gray-900 shadow-sm">IG</a>
                <a href="#" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition text-sm font-bold text-gray-900 shadow-sm">X</a>
                <a href="#" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition text-sm font-bold text-gray-900 shadow-sm">YT</a>
             </div>
           </div>

           {/* Right Column: Form */}
           <div>
              <div className="w-card shadow-xl">
                <div className="w-card-body p-8 md:p-10 relative">
                  
                  {success ? (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-6 animate-fade-in relative z-10">
                       <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-4xl">✓</div>
                       <h3 className="text-2xl font-bold text-gray-900 mt-4">Draft Created!</h3>
                       <p className="text-gray-600">Your email client should open now.<br/>Just click send to reach our founder directly.</p>
                       <button onClick={() => setSuccess(false)} className="w-btn w-btn-secondary mt-8">Send another</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                       <h3 className="text-2xl font-bold mb-6 text-gray-900">Message the Founder</h3>
                       
                       <div className="space-y-2">
                          <label className="w-label">Your Name *</label>
                          <input required name="name" type="text" className="w-input" />
                       </div>
                       
                       <div className="space-y-2">
                          <label className="w-label">Your Email *</label>
                          <input required name="email" type="email" className="w-input" />
                       </div>
                       
                       <div className="space-y-2">
                          <label className="w-label">Subject *</label>
                          <select required name="subject" defaultValue="" className="w-input appearance-none cursor-pointer text-gray-900">
                             <option value="" disabled>Select an option</option>
                             <option>Order Issue</option>
                             <option>Partnership</option>
                             <option>Investment</option>
                             <option>General Feedback</option>
                             <option>Press</option>
                          </select>
                       </div>
                       
                       <div className="space-y-2">
                          <label className="w-label">Message *</label>
                          <textarea required name="message" className="w-input h-32 resize-none text-gray-900"></textarea>
                       </div>
                       
                       <button type="submit" className="w-btn w-btn-primary w-full text-lg mt-8 py-3">
                          Send Message
                       </button>
                    </form>
                  )}
                </div>
              </div>
           </div>
        </div>
    </WhitePageLayout>
  );
}
