import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import WhitePageLayout from '../components/WhitePageLayout';

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);

  useEffect(() => {
    // Fetch active jobs
    supabase.from('jobs').select('*').eq('is_active', true).then(({ data }) => {
      if (data) setJobs(data);
      setLoading(false);
    });
  }, []);

  return (
    <WhitePageLayout 
      title="Work with us." 
      category="Careers" 
      maxWidth="max-w-7xl" 
      disableProse={true}
    >
      <div className="w-full" style={{ marginTop: '40px', marginBottom: '40px', paddingLeft: '24px', paddingRight: '24px' }}>
        
        {/* HERO */}
        <section className="w-full text-center" style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '18px', color: '#4B5563', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6', fontWeight: '500' }}>
            We're a small team building big things. If you're obsessed with detail, love AI, and want to make something <span style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #14b8a6)', backgroundClip: 'text', color: 'transparent', fontWeight: 'bold' }}>real</span> — you should talk to us.
          </p>
        </section>

        {/* Culture */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px 50px', width: '100%', marginBottom: '60px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '24px', overflow: 'hidden', padding: '40px 48px', transition: 'all 0.3s ease' }} className="group hover:shadow-xl hover:-translate-y-2">
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ fontSize: '32px' }}>🏠</span> Remote First</h3>
            <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.6', fontWeight: '500' }}>Work from anywhere in India. We care about output, not hours logged.</p>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '24px', overflow: 'hidden', padding: '40px 48px', transition: 'all 0.3s ease' }} className="group hover:shadow-xl hover:-translate-y-2">
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ fontSize: '32px' }}>⚡</span> Move Fast</h3>
            <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.6', fontWeight: '500' }}>We ship hardware like software. No corporate red tape, just building.</p>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '24px', overflow: 'hidden', padding: '40px 48px', transition: 'all 0.3s ease' }} className="group hover:shadow-xl hover:-translate-y-2">
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ fontSize: '32px' }}>💡</span> Ownership</h3>
            <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.6', fontWeight: '500' }}>Every team member owns their piece of the puzzle. You build it, you own it.</p>
          </div>
        </section>

        {/* Open Positions */}
        <section style={{ marginTop: '60px', marginBottom: '60px', width: '100%' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px', color: '#111827' }}>Open Positions</h2>
          
          {loading ? (
            <div className="space-y-6">
               {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse"></div>)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="w-card text-center">
              <div className="w-card-body py-12">
                <p className="text-lg text-gray-600">We're not actively hiring right now, but we're always looking for exceptional talent.<br/><br/>Send your portfolio and tell us how you can help at <a href="mailto:founderzero1@gmail.com" className="text-blue-600 hover:underline font-semibold">founderzero1@gmail.com</a></p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {jobs.map(job => (
                <div key={job.id} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '40px', overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: '0 8px 12px -2px rgba(0,0,0,0.06)', width: '100%' }} className="hover:shadow-2xl hover:-translate-y-1">
                  <div style={{ padding: '0' }}>
                    {/* Header Section */}
                    <div style={{ padding: '48px 64px 24px 64px', borderBottom: '1px solid #E5E7EB' }}>
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-6 tracking-widest uppercase bg-blue-50 text-blue-600 border border-blue-100">
                        NEW ROLE
                      </div>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 md:gap-12">
                        <div className="flex-1">
                          <h3 className="text-3xl font-bold mb-6 text-gray-900">{job.title}</h3>
                        </div>
                        <button 
                          onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                          className={`w-btn ${expandedJob === job.id ? 'w-btn-secondary' : 'w-btn-primary'} w-full md:w-auto`}
                        >
                          {expandedJob === job.id ? 'Close' : 'Apply Now'}
                        </button>
                      </div>
                    </div>

                    {/* Duration & Experience Section */}
                    <div style={{ padding: '24px 64px', borderBottom: '1px solid #E5E7EB' }}>
                      <p className="text-sm text-gray-500 font-medium flex items-center gap-6 flex-wrap">
                        <span>⏳ Duration: {job.employment_type}</span>
                        {job.salary_range && <span>💰 {job.salary_range}</span>}
                        <span>🎓 Exp: {job.description}</span>
                      </p>
                    </div>

                    {/* Skills Required Section */}
                    <div style={{ padding: '24px 64px 48px 64px' }}>
                      <h4 className="text-lg font-extrabold uppercase tracking-wider text-gray-600 mb-6">Skills Required</h4>
                      <p className="text-gray-700 leading-relaxed text-sm md:text-base bg-gray-50 p-6 rounded-2xl border border-gray-100">{job.requirements}</p>
                    </div>
                  </div>
                  
                  {expandedJob === job.id && (
                    <div className="bg-gray-50 p-10 md:p-16 border-t border-gray-100 relative">
                      <JobApplicationForm jobTitle={job.title} job_id={job.id} onClose={() => setExpandedJob(null)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Perks */}
        <section style={{ marginTop: '60px', marginBottom: '80px', width: '100%' }}>
           <h2 style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', backgroundImage: 'linear-gradient(to right, #111827, #6B7280)', backgroundClip: 'text', color: 'transparent', marginBottom: '40px' }}>Perks & Benefits</h2>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', width: '100%' }}>
             {[
               { i: '🏥', t: 'Health Insurance', c: 'from-pink-50 to-white' },
               { i: '📱', t: 'Device Budget', c: 'from-blue-50 to-white' },
               { i: '📚', t: 'Learning Budget', c: 'from-purple-50 to-white' },
               { i: '🏖️', t: 'Unlimited PTO', c: 'from-yellow-50 to-white' },
               { i: '🎧', t: 'WFH Setup', c: 'from-indigo-50 to-white' },
               { i: '🦷', t: 'Free DENTY Brush', c: 'from-teal-50 to-white' }
             ].map(p => (
               <div key={p.t} className="relative aspect-square flex flex-col items-center justify-center text-center p-8 bg-[#FAFAFA] border border-gray-200 rounded-md shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-400 overflow-hidden group hover:-translate-y-2">
                 <div className={`absolute inset-0 bg-gradient-to-br ${p.c} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                 <div className="relative z-10 flex flex-col items-center">
                   <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-400">{p.i}</div>
                   <h4 className="font-bold text-lg text-gray-900 tracking-tight">{p.t}</h4>
                 </div>
               </div>
             ))}
           </div>
        </section>

      </div>
    </WhitePageLayout>
  );
}

function JobApplicationForm({ jobTitle, job_id, onClose }) {
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const f = e.target;
    
    // Using a simpler insert logic
    try {
      await supabase.from('job_applications').insert([{
        job_id: job_id,
        full_name: f.full_name.value,
        email: f.email.value,
        phone: f.phone.value,
        linkedin_url: f.linkedin.value || null,
        portfolio_url: f.portfolio.value || null,
        resume_url: f.resume.value,
        cover_letter: f.cover.value
      }]);
      setSuccess(true);
      setTimeout(() => onClose(), 3500);
    } catch (err) {
      alert('Error submitting application: ' + err.message);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12 animate-fade-in text-green-600 font-bold text-xl">
         ✅ Application sent! We'll be in touch within 7 days.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
       <h4 className="text-2xl font-bold mb-6 text-gray-900">Apply for {jobTitle}</h4>
       <div className="grid md:grid-cols-3 gap-6">
         <div className="space-y-2">
            <label className="w-label">Full Name *</label>
            <input name="full_name" required type="text" className="w-input" />
         </div>
         <div className="space-y-2">
            <label className="w-label">Email *</label>
            <input name="email" required type="email" className="w-input" />
         </div>
         <div className="space-y-2">
            <label className="w-label">Phone *</label>
            <input name="phone" required type="tel" className="w-input" />
         </div>
       </div>
       <div className="grid md:grid-cols-2 gap-6">
         <div className="space-y-2">
            <label className="w-label">LinkedIn URL</label>
            <input name="linkedin" type="url" className="w-input" />
         </div>
         <div className="space-y-2">
            <label className="w-label">Portfolio URL</label>
            <input name="portfolio" type="url" className="w-input" />
         </div>
       </div>
       <div className="space-y-2">
          <label className="w-label">Resume URL (Drive/Dropbox) *</label>
          <input name="resume" required type="url" className="w-input" />
       </div>
       <div className="space-y-2">
          <label className="w-label">Cover Letter (Tell us why you're perfect for this role) *</label>
          <textarea name="cover" required minLength="100" className="w-input h-40 resize-none"></textarea>
       </div>
       <div className="justify-end flex">
         <button className="w-btn w-btn-primary w-full md:w-auto text-lg px-8 py-3">Send Application</button>
       </div>
    </form>
  );
}
