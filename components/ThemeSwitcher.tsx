import React from 'react';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import LeafIcon from './icons/LeafIcon';
import SketchbookIcon from './icons/SketchbookIcon';

interface ThemeSwitcherProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
    { name: 'light', icon: SunIcon, label: 'Day Mode' },
    { name: 'space', icon: MoonIcon, label: 'Space Adventure' },
    { name: 'jungle', icon: LeafIcon, label: 'Jungle Explorer' },
    { name: 'sketchbook', icon: SketchbookIcon, label: 'Sketchbook' },
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-bg-main/80 rounded-full border border-border">
      {themes.map((theme) => {
        const isSelected = currentTheme === theme.name;
        return (
          <button
            key={theme.name}
            onClick={() => onThemeChange(theme.name)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isSelected ? 'bg-primary text-primary-content' : 'text-text-light hover:bg-primary/10'
            }`}
            aria-label={`Switch to ${theme.label}`}
            title={theme.label}
          >
            <theme.icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;