import React from 'react';
import { motion } from 'framer-motion';
import './white-theme.css'; // Import the dedicated white theme CSS

export default function WhitePageLayout({ 
  title, 
  lastUpdated, 
  children, 
  maxWidth = "max-w-4xl", 
  category = "Information", 
  disableProse = false, 
  hideTitle = false 
}) {
  return (
    <div className="white-theme-root pb-32 flex flex-col items-center w-full min-h-screen relative overflow-hidden" style={{ paddingTop: '160px' }}>
      {/* Universal ambient glow for white pages to make them feel premium */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px] opacity-[0.15] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-teal-400 rounded-full blur-[150px] opacity-[0.1] pointer-events-none" />

      <div className={`${maxWidth} w-full mx-auto px-8 sm:px-16 lg:px-20 xl:px-32 relative z-10`}>
        
        {/* Header */}
        {!hideTitle && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-page-header"
          >
            {category && (
              <div className="w-badge">
                {category}
              </div>
            )}
            <h1 className="w-page-title">
              {title}
            </h1>
            {lastUpdated && (
              <p className="w-page-subtitle">
                Last updated: {lastUpdated}
              </p>
            )}
          </motion.div>
        )}

        {/* Content Body */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={disableProse ? "w-full" : "w-prose"}
        >
          {disableProse ? (
            children
          ) : (
            <div className="w-card">
              <div className="w-card-body">
                {children}
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
