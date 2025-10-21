import React from 'react';
import type { MapType } from '../types';
import TreeViewIcon from './icons/TreeViewIcon';
import TimelineIcon from './icons/TimelineIcon';
import StoryboardIcon from './icons/StoryboardIcon';
import UsersIcon from './icons/UsersIcon';

interface MapTypeSelectorProps {
  onDraw: (type: MapType) => void;
  isLoading: boolean;
  hasInput: boolean;
}

const mapTypes: { id: MapType; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: 'TreeView', label: 'Tree View', icon: TreeViewIcon },
  { id: 'Timeline', label: 'Timeline', icon: TimelineIcon },
  { id: 'Storyboard', label: 'Storyboard', icon: StoryboardIcon },
  { id: 'CharacterWeb', label: 'Characters', icon: UsersIcon },
];

const MapTypeSelector: React.FC<MapTypeSelectorProps> = ({ onDraw, isLoading, hasInput }) => {
  return (
    <div className="mb-4">
      <label className="text-xl font-bold mb-3 text-primary block">
        Draw a...
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-bg-main/60 rounded-lg border border-border">
        {mapTypes.map((type) => {
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onDraw(type.id)}
              disabled={isLoading || !hasInput}
              className="flex flex-col items-center justify-center text-center p-2 rounded-md transition-all duration-200 ease-in-out bg-primary/5 text-primary hover:bg-primary hover:text-white hover:shadow-md disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
              aria-label={`Draw ${type.label}`}
            >
              <type.icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-bold">{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MapTypeSelector;