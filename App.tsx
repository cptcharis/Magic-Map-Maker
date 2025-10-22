import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import LessonInput from './components/LessonInput';
import TreeView from './components/TreeView';
import Timeline from './components/Timeline';
import Storyboard from './components/Storyboard';
import CharacterWeb from './components/CharacterWeb';
import Loader from './components/Loader';
import Welcome from './components/Welcome';
import ErrorDisplay from './components/ErrorDisplay';
import { generateVisualization } from './services/geminiService';
import type { VisualizationData, MapType, TreeNode } from './types';

// Let TypeScript know html2canvas is available on the window
declare const html2canvas: any;

const LOCAL_STORAGE_key = 'magicMapData';

interface TreeViewHandle {
  exportPNG: () => void;
}

const App: React.FC = () => {
  const [visualizationData, setVisualizationData] = useState<VisualizationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSavedMap, setHasSavedMap] = useState<boolean>(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState<boolean>(false);
  const [currentMapType, setCurrentMapType] = useState<MapType>('TreeView');
  const [currentTheme, setCurrentTheme] = useState<string>('light');
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  
  // State for controlled components
  const [lessonText, setLessonText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const treeViewRef = useRef<TreeViewHandle>(null);
  const visualizationContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.body.style.fontFamily = currentTheme === 'sketchbook' 
      ? "'Patrick Hand', cursive" 
      : "'Nunito', sans-serif";
  }, [currentTheme]);

  useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_key)) {
      setHasSavedMap(true);
    }
  }, []);

  const handleSummarize = useCallback(async (mapType: MapType) => {
    if (isOffline) {
      setError("You're currently offline. The AI needs an internet connection to create a new map.");
      return;
    }
    if (!lessonText.trim() && !imageFile) {
      setError('Please write something or upload a scan!');
      return;
    }

    setIsLoading(true);
    setError(null);
    setVisualizationData(null);
    setShowSaveConfirmation(false);
    setCurrentMapType(mapType);

    try {
      const resultData = await generateVisualization(lessonText, imageFile, mapType);
      setVisualizationData(resultData);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "The magic ink didn't work. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [lessonText, imageFile, isOffline]);

  const handleStartOver = () => {
    setVisualizationData(null);
    setError(null);
    setIsLoading(false);
    setLessonText('');
    setImageFile(null);
    setShowSaveConfirmation(false);
  }

  const handleSaveMap = useCallback(() => {
    if (!visualizationData) return;
    try {
      const dataToSave = {
        mapType: currentMapType,
        data: visualizationData
      };
      localStorage.setItem(LOCAL_STORAGE_key, JSON.stringify(dataToSave));
      setHasSavedMap(true);
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 2000);
    } catch (e) {
      console.error("Failed to save map to local storage", e);
      setError("Oops! Couldn't save your map.");
    }
  }, [visualizationData, currentMapType]);

  const handleLoadMap = useCallback(() => {
    handleStartOver();
    try {
      const savedMapJson = localStorage.getItem(LOCAL_STORAGE_key);
      if (savedMapJson) {
        const savedData = JSON.parse(savedMapJson);
        setCurrentMapType(savedData.mapType || 'TreeView');
        setVisualizationData(savedData.data);
      }
    } catch (e) {
      console.error("Failed to load map from local storage", e);
      setError("Oh no! The saved map seems to be broken.");
      setVisualizationData(null);
    }
  }, []);
  
  const handleExportPNG = () => {
    if (currentMapType === 'TreeView') {
      treeViewRef.current?.exportPNG();
    } else if (visualizationContainerRef.current) {
      const elementToCapture = visualizationContainerRef.current.querySelector(':scope > div');
      if (elementToCapture) {
         html2canvas(elementToCapture as HTMLElement, {
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim(),
          scale: 2,
        }).then((canvas: HTMLCanvasElement) => {
          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = 'magic-map.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
      }
    }
  };

  const renderVisualization = () => {
    if (!visualizationData) return null;
    switch (currentMapType) {
      case 'TreeView':
        return <TreeView ref={treeViewRef} data={visualizationData as TreeNode} theme={currentTheme} />;
      case 'Timeline':
        return <Timeline data={visualizationData as any} />;
      case 'Storyboard':
        return <Storyboard data={visualizationData as any} />;
      case 'CharacterWeb':
        return <CharacterWeb data={visualizationData as any} />;
      default:
        return <Welcome />;
    }
  };

  return (
    <div className="min-h-screen text-text-main font-sans flex flex-col transition-colors duration-300">
      <Header 
        currentTheme={currentTheme} 
        onThemeChange={setCurrentTheme}
        onStartOver={handleStartOver}
        onExportPNG={handleExportPNG}
        onSaveMap={handleSaveMap}
        showSaveConfirmation={showSaveConfirmation}
        visualizationData={visualizationData}
        isLoading={isLoading}
        error={error}
        isOffline={isOffline}
      />
      <main className="flex-grow flex flex-col md:flex-row p-4 md:p-8 gap-8">
        <div className="w-full md:w-1/3 flex flex-col">
          <LessonInput
            onSummarize={handleSummarize}
            isLoading={isLoading}
            onLoadMap={handleLoadMap}
            hasSavedMap={hasSavedMap}
            text={lessonText}
            onTextChange={setLessonText}
            image={imageFile}
            onImageChange={setImageFile}
          />
        </div>
        <div ref={visualizationContainerRef} className="relative w-full md:w-2/3 flex-grow flex items-center justify-center bg-surface rounded-2xl border border-border shadow-lg p-4 min-h-[400px] md:min-h-0 transition-colors duration-300">
          {isLoading && <Loader />}
          {error && !isLoading && <ErrorDisplay message={error} />}
          {!isLoading && !error && visualizationData && renderVisualization()}
          {!isLoading && !error && !visualizationData && <Welcome />}
        </div>
      </main>
    </div>
  );
};

export default App;