import React from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({ message, ctaText, ctaLink, icon: Icon = Search }) => {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm px-4">
      <div className="mx-auto w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">{message}</h3>
      {ctaText && ctaLink && (
        <div className="mt-6">
          <Link to={ctaLink} className="btn-primary py-2 px-6 rounded-lg inline-block text-white bg-blue-600 hover:bg-blue-700 font-semibold">
            {ctaText}
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
