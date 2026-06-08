import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const CoursesErrorState = ({ message, onRetry }) => (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="text-sm font-semibold text-red-800">Failed to load courses</h3>
        <p className="text-sm text-red-700 mt-1">{message}</p>
      </div>
    </div>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    )}
  </div>
);

export default CoursesErrorState;
