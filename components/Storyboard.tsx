import React from 'react';
import type { StoryboardPanel } from '../types';

interface StoryboardProps {
  data: StoryboardPanel[];
}

const Storyboard: React.FC<StoryboardProps> = ({ data }) => {
  // Sort panels by scene number just in case the API doesn't
  const sortedData = [...data].sort((a, b) => a.scene - b.scene);

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedData.map((panel) => (
          <div key={panel.scene} className="flex flex-col bg-bg-main rounded-lg border border-border p-4 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-primary">Scene {panel.scene}</span>
              <span className="text-3xl">{panel.emoji || '🎬'}</span>
            </div>
            <p className="text-text-light flex-grow">{panel.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Storyboard;
