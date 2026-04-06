import React from 'react';
import { motion } from 'framer-motion';

export default function PremiumPageLayout({ title, lastUpdated, children, maxWidth = "max-w-3xl", category = "Legal & Support", disableProse = false, hideTitle = false }) {
  return (
    <div className="min-h-screen pt-28 pb-32 overflow-hidden relative" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, color-mix(in srgb, var(--text) 15%, transparent), transparent 70%)',
          filter: 'blur(60px)'
        }}
      />

      <div className={`${maxWidth} mx-auto px-6 relative z-10`}>
        
        {/* Header */}
        {!hideTitle && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`mb-16 ${maxWidth === 'max-w-3xl' ? 'text-center' : 'text-center'}`}
          >
            {category && (
              <div className="inline-block mb-4 px-3 py-1 rounded-full border text-[11px] font-black uppercase tracking-[0.2em]"
                style={{ 
                  borderColor: 'color-mix(in srgb, var(--text) 20%, transparent)',
                  color: 'color-mix(in srgb, var(--text) 70%, transparent)',
                  background: 'color-mix(in srgb, var(--text) 3%, transparent)'
                }}>
                {category}
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4"
              style={{
                background: 'linear-gradient(to bottom right, var(--text) 30%, color-mix(in srgb, var(--text) 30%, transparent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
              {title}
            </h1>
            {lastUpdated && (
              <p className="text-sm tracking-wide font-medium" style={{ color: 'color-mix(in srgb, var(--text) 45%, transparent)' }}>
                Last updated: {lastUpdated}
              </p>
            )}
          </motion.div>
        )}

        {/* Content Body */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={disableProse ? "w-full" : "prose prose-invert prose-lg max-w-none"}
          style={disableProse ? {} : {
            '--tw-prose-body': 'color-mix(in srgb, var(--text) 75%, transparent)',
            '--tw-prose-headings': 'var(--text)',
            '--tw-prose-links': 'var(--text)',
            '--tw-prose-bold': 'var(--text)',
          }}
        >
          {children}
        </motion.div>

      </div>
    </div>
  );
}
