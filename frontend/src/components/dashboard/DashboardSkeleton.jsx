import React from 'react';

export const StatsCardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-16" />
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

export const DashboardStatsSkeleton = ({ count = 3 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${Math.min(count, 4)} gap-6`} style={{
    gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))`,
  }}>
    {Array.from({ length: count }).map((_, index) => (
      <StatsCardSkeleton key={index} />
    ))}
  </div>
);

export const ContentCardSkeleton = ({ lines = 3 }) => (
  <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 animate-pulse space-y-3">
    <div className="h-5 bg-gray-200 rounded w-1/3" />
    {Array.from({ length: lines }).map((_, index) => (
      <div key={index} className="h-4 bg-gray-200 rounded" style={{ width: `${90 - index * 15}%` }} />
    ))}
  </div>
);

const DashboardSkeleton = ({ statCount = 3 }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="animate-pulse space-y-2">
      <div className="h-8 bg-gray-200 rounded w-64" />
      <div className="h-4 bg-gray-200 rounded w-96 max-w-full" />
    </div>
    <DashboardStatsSkeleton count={statCount} />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ContentCardSkeleton />
      <ContentCardSkeleton />
    </div>
  </div>
);

export default DashboardSkeleton;
