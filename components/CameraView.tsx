import React, { useRef, useEffect, useCallback } from 'react';

interface CameraViewProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access the camera. Please make sure you have given permission.");
        onClose();
      }
    };

    startCamera();

    return cleanupCamera;
  }, [onClose, cleanupCamera]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        onCapture(file);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4">
      <video ref={videoRef} autoPlay playsInline className="w-full max-w-3xl h-auto rounded-lg shadow-2xl" />
      <div className="mt-6 flex items-center gap-6">
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-full text-white bg-gray-700 hover:bg-gray-600 font-bold transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCapture}
          className="p-5 rounded-full bg-white group"
          aria-label="Capture photo"
        >
            <div className="w-10 h-10 rounded-full bg-red-500 group-hover:bg-red-600 ring-4 ring-white ring-offset-2 ring-offset-black transition-colors"></div>
        </button>
      </div>
    </div>
  );
};

export default CameraView;
