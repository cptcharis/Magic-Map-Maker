import React, { useState, useRef, useEffect } from 'react';
import FolderOpenIcon from './icons/FolderOpenIcon';
import UploadIcon from './icons/UploadIcon';
import VideoCameraIcon from './icons/VideoCameraIcon';
import MapTypeSelector from './MapTypeSelector';
import CameraView from './CameraView';
import { MapType } from '../types';

interface LessonInputProps {
  onSummarize: (mapType: MapType) => void;
  isLoading: boolean;
  onLoadMap: () => void;
  hasSavedMap: boolean;
  text: string;
  onTextChange: (text: string) => void;
  image: File | null;
  onImageChange: (image: File | null) => void;
}

const LessonInput: React.FC<LessonInputProps> = ({ 
  onSummarize, 
  isLoading, 
  onLoadMap, 
  hasSavedMap,
  text,
  onTextChange,
  image,
  onImageChange
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCameraView, setShowCameraView] = useState(false);
  const [supportsCamera, setSupportsCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSupportsCamera(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
  }, []);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.onerror = () => {
        console.error('Error reading file for preview.');
        setImagePreview(null);
        onImageChange(null);
      };
      reader.readAsDataURL(image);
    } else {
      setImagePreview(null);
       if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [image, onImageChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageChange(file);
  };
  
  const handleClearImage = () => {
    onImageChange(null);
  }

  const handleCapture = (file: File) => {
    onImageChange(file);
    setShowCameraView(false);
  };

  const hasInput = !!text.trim() || !!image;

  return (
    <div className="flex flex-col h-full bg-surface rounded-2xl border border-border p-6 shadow-lg transition-colors duration-300">
      {showCameraView && <CameraView onCapture={handleCapture} onClose={() => setShowCameraView(false)} />}
      <MapTypeSelector 
        onDraw={onSummarize} 
        isLoading={isLoading} 
        hasInput={hasInput} 
      />
      
      <div className="relative flex-grow mt-4">
        <textarea
          id="lesson-text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Write notes here, or upload a scan below..."
          className="w-full h-full p-4 bg-bg-main/50 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all text-text-main resize-none text-base"
          disabled={isLoading}
        />
        {imagePreview && (
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm p-2 rounded-lg">
            <div className="relative w-full h-full border-2 border-dashed border-primary rounded-lg flex flex-col items-center justify-center">
                <img src={imagePreview} alt="Scan preview" className="max-h-full max-w-full object-contain rounded-md" />
                <button 
                    type="button" 
                    onClick={handleClearImage}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
                    aria-label="Remove image"
                >
                    &times;
                </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            disabled={isLoading}
        />
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={`w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed transition-colors ${!supportsCamera ? 'col-span-2' : ''}`}
          >
            <UploadIcon className="w-6 h-6 mr-2" />
            {image ? 'Change Scan' : 'Upload Scan'}
          </button>
          {supportsCamera && (
             <button
              type="button"
              onClick={() => setShowCameraView(true)}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-secondary text-secondary rounded-lg hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-secondary disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <VideoCameraIcon className="w-6 h-6 mr-2" />
              Take Photo
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onLoadMap}
          disabled={isLoading || !hasSavedMap}
          className="w-full flex items-center justify-center px-6 py-4 border border-primary text-primary bg-surface rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Load saved map"
          title={hasSavedMap ? "Load your saved map" : "You don't have a saved map yet!"}
        >
          <FolderOpenIcon className="w-6 h-6 mr-2" />
          <span className="font-bold">Load Saved Map</span>
        </button>
      </div>
    </div>
  );
};

export default LessonInput;