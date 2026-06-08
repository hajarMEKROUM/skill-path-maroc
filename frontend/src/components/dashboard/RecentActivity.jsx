import React from 'react';
import { motion } from 'framer-motion';

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        <button className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</button>
      </div>

      {activities.length > 0 ? (
        <div className="relative border-l border-gray-200 ml-3 space-y-6">
          {activities.map((activity, index) => (
            <motion.div 
              key={activity.id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-6"
            >
              <div className={`absolute w-3 h-3 rounded-full -left-1.5 top-1.5 border-2 border-white ${activity.colorClass || 'bg-primary-500'}`}></div>
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                <span className="text-xs text-gray-400 mt-1 block">{activity.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No recent activity to show yet.
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
