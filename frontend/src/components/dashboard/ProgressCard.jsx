import React from 'react';
import { motion } from 'framer-motion';

const ProgressCard = ({ title, description, progress, colorClass = "bg-primary-500", icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100"
    >
      <div className="flex items-center mb-4">
        {Icon && (
          <div className="p-2 bg-gray-50 rounded-lg mr-3 text-gray-600">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-2.5 rounded-full ${colorClass}`}
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressCard;
