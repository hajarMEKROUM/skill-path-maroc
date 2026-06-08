import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ActivityChart = ({ data, title = "Platform Activity" }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      
      <div style={{ width: '100%', minHeight: 300 }}>
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
              <Bar dataKey="students" name="New Students" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="courses" name="Course Views" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full bg-gray-100 rounded-lg animate-pulse" style={{ height: 300 }} />
        )}
      </div>
    </div>
  );
};

export default ActivityChart;

