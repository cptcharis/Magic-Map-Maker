import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import SaveIcon from './icons/SaveIcon';
import CameraIcon from './icons/CameraIcon';
import RefreshIcon from './icons/RefreshIcon';
import InstallIcon from './icons/InstallIcon';
import OfflineIndicator from './OfflineIndicator';
import { VisualizationData } from '../types';

interface HeaderProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  onStartOver: () => void;
  onExportPNG: () => void;
  onSaveMap: () => void;
  onInstall: () => void;
  showSaveConfirmation: boolean;
  visualizationData: VisualizationData | null;
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  currentTheme, 
  onThemeChange,
  onStartOver,
  onExportPNG,
  onSaveMap,
  onInstall,
  showSaveConfirmation,
  visualizationData,
  isLoading,
  error,
  isOffline,
}) => {
  const showActions = (visualizationData || error) && !isLoading;

  return (
    <header className="relative p-4 md:p-6 border-b border-border bg-surface/80 backdrop-blur-sm transition-colors duration-300">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Magic Map Maker
      </h1>
      <p className="text-center text-text-light mt-1">Turn your words into a fun idea map!</p>
      
      {isOffline && <OfflineIndicator />}

      <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-2">
        {showActions && (
          <>
            <button
              onClick={onStartOver}
              className="p-3 bg-accent text-accent-content rounded-full shadow-lg hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-accent transition-transform duration-200 ease-in-out hover:scale-110 active:scale-100"
              aria-label="Start Over"
              title="Start Over"
            >
              <RefreshIcon className="w-6 h-6" />
            </button>
            {visualizationData && (
              <button
                onClick={onExportPNG}
                className="p-3 bg-secondary text-secondary-content rounded-full shadow-lg hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-secondary transition-transform duration-200 ease-in-out hover:scale-110 active:scale-100"
                aria-label="Export as PNG"
                title="Export as PNG"
              >
                <CameraIcon className="w-6 h-6" />
              </button>
            )}
            {visualizationData && (
              showSaveConfirmation ? (
                <div className="px-4 py-3 rounded-full bg-accent text-accent-content font-bold shadow-md animate-pulse">
                  Saved!
                </div>
              ) : (
                  <button
                    onClick={onSaveMap}
                    className="p-3 bg-primary text-primary-content rounded-full shadow-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary transition-transform duration-200 ease-in-out hover:scale-110 active:scale-100"
                    aria-label="Save map"
                    title="Save map"
                  >
                    <SaveIcon className="w-6 h-6" />
                  </button>
              )
            )}
          </>
        )}
        
        <button
          onClick={onInstall}
          className="p-3 bg-accent text-accent-content rounded-full shadow-lg hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-accent transition-transform duration-200 ease-in-out hover:scale-110 active:scale-100"
          aria-label="Install App"
          title="Install App"
        >
          <InstallIcon className="w-6 h-6" />
        </button>

        <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />
      </div>
    </header>
  );
};

export default Header;