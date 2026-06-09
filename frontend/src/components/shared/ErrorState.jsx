import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl text-center shadow-sm">
      <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
      <p className="text-lg font-medium mb-4">{message || 'Une erreur est survenue.'}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
};

export default ErrorState;
