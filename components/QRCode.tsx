import React, { useEffect, useState } from 'react';
import * as QRCodeLib from 'qrcode';

interface QRCodeProps {
  url: string;
}

const QRCode: React.FC<QRCodeProps> = ({ url }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQRCode = async () => {
      setError(null);
      setQrCodeUrl(null); // Reset on URL change
      try {
        const dataUrl = await QRCodeLib.toDataURL(url, {
          errorCorrectionLevel: 'M', // Increased for better robustness
          margin: 1,
          width: 224, // 14rem
        });
        setQrCodeUrl(dataUrl);
      } catch (err) {
        console.error("Could not generate QR code:", err);
        setError('Could not generate QR code.');
      }
    };

    if (url) {
      generateQRCode();
    }
  }, [url]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 w-64 bg-gray-100 rounded-xl p-4 border border-red-200">
        <p className="text-sm text-center text-red-600">{error}</p>
      </div>
    );
  }
  
  if (!qrCodeUrl) {
    return (
      <div className="flex justify-center items-center h-64 w-64 bg-gray-200 rounded-xl animate-pulse">
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg border border-border" aria-label={`QR code for URL: ${url}`}>
      <img src={qrCodeUrl} alt={`QR code for ${url}`} width="224" height="224" className="rounded-md"/>
    </div>
  );
};

export default QRCode;