import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, colorClass, subtitle }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex flex-col justify-between h-full"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value ?? '0'}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {(trend || trendValue) && (
        <div className="mt-4 flex items-center text-sm">
          {trend === 'up' && (
            <span className="text-emerald-500 font-medium flex items-center">
              ↑ {trendValue}
            </span>
          )}
          {trend === 'down' && (
            <span className="text-red-500 font-medium flex items-center">
              ↓ {trendValue}
            </span>
          )}
          {trend === 'neutral' && (
            <span className="text-gray-500 font-medium flex items-center">
              - {trendValue}
            </span>
          )}
          <span className="text-gray-400 ml-2">vs last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;
