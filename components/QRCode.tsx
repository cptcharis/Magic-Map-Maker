import React, { useEffect, useRef } from 'react';

// Let TypeScript know the qrcode function is available on the window
declare const qrcode: any;

interface QRCodeProps {
  url: string;
}

const QRCode: React.FC<QRCodeProps> = ({ url }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (qrCodeRef.current && typeof qrcode !== 'undefined') {
      qrCodeRef.current.innerHTML = ''; // Clear previous QR code
      try {
        // Use type '0' to allow the library to auto-detect the required QR code size
        const typeNumber = 0;
        const errorCorrectionLevel = 'L';
        const qr = qrcode(typeNumber, errorCorrectionLevel);
        qr.addData(url);
        qr.make();
        // createImgTag(cellSize, margin)
        const imgTag = qr.createImgTag(5, 10);
        qrCodeRef.current.innerHTML = imgTag;
        
        const imgElement = qrCodeRef.current.querySelector('img');
        if (imgElement) {
          imgElement.style.border = '10px solid white';
          imgElement.style.borderRadius = '8px';
          imgElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }

      } catch (e) {
        console.error("Could not generate QR code:", e);
        qrCodeRef.current.textContent = 'Could not generate QR code.';
      }
    }
  }, [url]);

  return <div ref={qrCodeRef} className="flex justify-center" aria-label={`QR code for URL: ${url}`} />;
};

export default QRCode;