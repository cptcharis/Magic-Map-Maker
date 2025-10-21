import React from 'react';
import DrawingBotIcon from './icons/DrawingBotIcon';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="text-center p-8 text-text-light">
      <div className="relative inline-block">
        <DrawingBotIcon className="mx-auto h-24 w-24 text-gray-300 mb-4" />
        <div className="absolute top-0 right-0 -mt-2 -mr-2 text-4xl">😟</div>
      </div>
      <h2 className="text-2xl font-extrabold text-red-500">Oops, an Error!</h2>
      <p className="mt-2 max-w-md mx-auto text-lg text-text-main">
        {message}
      </p>
    </div>
  );
};

export default ErrorDisplay;