import React from 'react';
import type { TimelineEvent } from '../types';

interface TimelineProps {
  data: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ data }) => {
  return (
    <div className="w-full h-full p-4 md:p-8 overflow-y-auto">
      <div className="relative border-l-4 border-primary/30 ml-4 md:ml-8">
        {data.map((event, index) => (
          <div key={index} className="mb-8 pl-8 md:pl-12 relative">
            <div className="absolute -left-5 w-8 h-8 bg-secondary rounded-full border-4 border-surface flex items-center justify-center text-lg">
              {event.emoji || '📅'}
            </div>
            <div className="p-4 bg-bg-main rounded-lg shadow-sm transition-colors duration-300">
              <p className="text-sm font-bold text-primary">{event.date}</p>
              <h3 className="text-xl font-bold mt-1 text-text-main">{event.title}</h3>
              <p className="mt-2 text-text-light">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
