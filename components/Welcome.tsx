import React from 'react';
import DrawingBotIcon from './icons/DrawingBotIcon';

const Welcome: React.FC = () => {
  return (
    <div className="text-center p-8 text-text-light">
      <DrawingBotIcon className="mx-auto h-24 w-24 text-gray-300 mb-4" />
      <h2 className="text-3xl font-extrabold text-text-main">Let's Draw Your Ideas!</h2>
      <p className="mt-2 max-w-md mx-auto text-lg">
        Type in the box, or <span className="text-primary font-bold">upload a scan</span> of your notes, and I'll turn them into a cool idea map for you!
      </p>
    </div>
  );
};

export default Welcome;