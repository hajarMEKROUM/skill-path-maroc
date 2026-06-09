import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white rounded-2xl h-80 border border-gray-100 shadow-sm p-4 flex flex-col">
      <div className="bg-gray-200 h-40 rounded-xl mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="mt-auto h-8 bg-gray-200 rounded w-full"></div>
    </div>
  );
};

export default SkeletonCard;
