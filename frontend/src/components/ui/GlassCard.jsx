import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = false, padding = 'p-6' }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        bg-white/80 backdrop-blur-md 
        border border-gray-200/50 
        shadow-glass rounded-2xl 
        ${hover ? 'hover:shadow-glass-hover' : ''}
        ${padding}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
