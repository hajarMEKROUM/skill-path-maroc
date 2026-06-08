import React from 'react';
import { BookOpen, Search } from 'lucide-react';

const CoursesEmptyState = ({
  title = 'No courses available yet',
  description = 'No courses available yet. Please check later.',
  action = null,
  variant = 'catalog',
}) => {
  const Icon = variant === 'search' ? Search : BookOpen;

  return (
    <div className="text-center py-16 px-4">
      <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-gray-200">
        <Icon className="w-9 h-9 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default CoursesEmptyState;
