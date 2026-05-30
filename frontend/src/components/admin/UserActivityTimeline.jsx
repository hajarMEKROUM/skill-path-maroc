import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, BookOpen, MessageSquare, AlertCircle, ShoppingCart } from 'lucide-react';

const UserActivityTimeline = ({ activities = [] }) => {
  // Mock data if empty
  const timeline = activities.length > 0 ? activities : [
    { id: 1, type: 'login', title: 'Logged in from new device', date: '2 hours ago', icon: LogIn, color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: 2, type: 'course', title: 'Completed "Advanced React Hooks"', date: 'Yesterday', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { id: 3, type: 'purchase', title: 'Purchased "Laravel Masterclass"', date: '3 days ago', icon: ShoppingCart, color: 'text-purple-500', bg: 'bg-purple-100' },
    { id: 4, type: 'message', title: 'Sent a message to Instructor Youssef', date: '1 week ago', icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-100' },
    { id: 5, type: 'warning', title: 'Received community warning', date: '2 months ago', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="py-6 px-4 max-w-3xl">
      <h3 className="text-lg font-bold text-gray-900 mb-8 border-b border-gray-100 pb-2">Activity Timeline</h3>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative border-l-2 border-gray-100 ml-4 space-y-8"
      >
        {timeline.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.id} variants={itemVariants} className="relative pl-8">
              {/* Timeline Dot */}
              <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full ${item.bg} flex items-center justify-center border-4 border-gray-50/50`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              
              {/* Content */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-soft transition-shadow">
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.date}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default UserActivityTimeline;
