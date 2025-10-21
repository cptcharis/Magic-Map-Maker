import React from 'react';
import type { CharacterWeb } from '../types';

interface CharacterWebProps {
  data: CharacterWeb;
}

const CharacterWeb: React.FC<CharacterWebProps> = ({ data }) => {
  return (
    <div className="w-full h-full p-4 overflow-y-auto text-text-main">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Characters List */}
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold text-primary mb-4">Characters</h2>
          <div className="space-y-4">
            {data.characters.map((char) => (
              <div key={char.name} className="p-4 bg-bg-main rounded-lg border border-border transition-colors duration-300">
                <h3 className="text-xl font-bold flex items-center">
                  <span className="text-2xl mr-2">{char.emoji || '👤'}</span>
                  {char.name}
                </h3>
                <p className="mt-1 text-text-light">{char.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Relationships List */}
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold text-secondary mb-4">Relationships</h2>
          <div className="space-y-4">
            {data.relationships.map((rel, index) => (
              <div key={index} className="p-4 bg-bg-main rounded-lg border border-border transition-colors duration-300">
                 <div className="font-bold text-text-main">
                    <span className="text-primary">{rel.source}</span>
                    <span className="text-text-light mx-2">&harr;</span>
                    <span className="text-accent">{rel.target}</span>
                 </div>
                 <p className="mt-1 text-text-light italic">"{rel.description}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterWeb;
