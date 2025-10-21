import React from 'react';
import CloudSlashIcon from './icons/CloudSlashIcon';

const OfflineIndicator: React.FC = () => {
  return (
    <div 
        className="absolute top-4 left-4 flex items-center gap-2 bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
        role="status"
        aria-live="polite"
    >
        <CloudSlashIcon className="w-5 h-5" />
        <span>Offline Mode</span>
    </div>
  );
};

export default OfflineIndicator;