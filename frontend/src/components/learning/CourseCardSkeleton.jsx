import React from 'react';

export const MyCourseCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="flex flex-col sm:flex-row">
      <div className="sm:w-48 h-36 bg-gray-200" />
      <div className="flex-1 p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-2 bg-gray-200 rounded w-full mt-4" />
        <div className="h-9 bg-gray-200 rounded w-40 mt-4" />
      </div>
    </div>
  </div>
);

const CourseCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl h-full min-h-[380px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
    <div className="bg-gray-200 h-44" />
    <div className="p-5 flex flex-col flex-1 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
      <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-16" />
        <div className="h-9 w-9 bg-gray-200 rounded-full" />
      </div>
    </div>
  </div>
);

export const CourseCatalogSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <CourseCardSkeleton key={index} />
    ))}
  </div>
);

export const MyCoursesSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <MyCourseCardSkeleton key={index} />
    ))}
  </div>
);

export default CourseCardSkeleton;
