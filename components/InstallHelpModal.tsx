import React, { useState, useEffect } from 'react';
import QRCode from './QRCode';
import InfoIcon from './icons/InfoIcon';
import ClipboardIcon from './icons/ClipboardIcon';

interface InstallHelpModalProps {
    onClose: () => void;
}

const InstallHelpModal: React.FC<InstallHelpModalProps> = ({ onClose }) => {
    const [copied, setCopied] = useState(false);
    const [localIp, setLocalIp] = useState('');
    const [qrUrl, setQrUrl] = useState(window.location.href);

    const isDevelopmentUrl = (hostname: string) => {
        return (
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            hostname.endsWith('.local')
        );
    };

    const isLocal = isDevelopmentUrl(window.location.hostname);

    useEffect(() => {
        if (isLocal && localIp.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
            try {
                const urlObject = new URL(window.location.href);
                urlObject.hostname = localIp;
                setQrUrl(urlObject.toString());
            } catch (e) {
                console.error("Failed to construct URL with local IP", e);
                setQrUrl(window.location.href);
            }
        } else {
            setQrUrl(window.location.href);
        }
    }, [localIp, isLocal]);

    const handleCopy = (urlToCopy: string) => {
        navigator.clipboard.writeText(urlToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-surface rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full relative text-text-main transform transition-transform duration-300 scale-95"
                onClick={e => e.stopPropagation()}
                style={{ transform: 'scale(1)' }}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-text-light hover:text-text-main text-3xl font-bold leading-none"
                    aria-label="Close installation help"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold text-primary mb-4">Install & Share</h2>
                <p className="mb-6 text-text-light">Add this app to your home screen or use the link below to open it on another device.</p>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold mb-2">iPhone & iPad (Safari)</h3>
                        <ol className="list-decimal list-inside space-y-2 text-text-light">
                            <li>At the bottom of the screen, tap the <span className="font-bold p-1 bg-bg-main rounded-md mx-1">Share</span> button.</li>
                            <li>Scroll down and select <span className="font-bold p-1 bg-bg-main rounded-md mx-1">Add to Home Screen</span>.</li>
                        </ol>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-2">Android (Chrome)</h3>
                        <ol className="list-decimal list-inside space-y-2 text-text-light">
                            <li>Tap the <span className="font-bold p-1 bg-bg-main rounded-md mx-1">Menu</span> button (3 dots).</li>
                            <li>Select <span className="font-bold p-1 bg-bg-main rounded-md mx-1">Install app</span> or <span className="font-bold p-1 bg-bg-main rounded-md mx-1">Add to Home screen</span>.</li>
                        </ol>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                    <h3 className="text-lg font-bold mb-3 text-center">Share & Install Remotely</h3>
                    
                    <div className="flex flex-col items-center">
                        <QRCode url={qrUrl} />
                    </div>

                    <div className="mt-4 flex items-center bg-bg-main/50 border border-border rounded-lg">
                        <input 
                            type="text"
                            value={qrUrl}
                            readOnly
                            className="p-2 bg-transparent w-full text-text-light text-sm focus:outline-none"
                            aria-label="Application URL"
                        />
                        <button 
                            onClick={() => handleCopy(qrUrl)}
                            className="p-3 text-primary hover:bg-primary/10 rounded-r-md transition-colors"
                            aria-label="Copy link"
                        >
                            {copied ? <span className="text-sm font-bold">Copied!</span> : <ClipboardIcon className="w-5 h-5" />}
                        </button>
                    </div>
                    
                    {isLocal && (
                        <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-300 text-yellow-900" role="alert">
                            <h4 className="font-bold flex items-center">
                                <InfoIcon className="h-5 w-5 mr-2 shrink-0" />
                                You're on a Local Link
                            </h4>
                            <p className="text-sm mt-2">
                                The QR code needs your computer's <strong>local network IP address</strong>, not <code>localhost</code>, to work on your phone.
                            </p>
                            
                            <div className="mt-4 pt-4 border-t border-yellow-300/50">
                                <h5 className="font-bold text-yellow-900">Try This Fix:</h5>
                                <p className="text-sm mt-1">
                                    Find your computer's IP address and enter it below. This generates a new QR code for your phone.
                                </p>
                                <ul className="text-xs list-disc list-inside mt-2 space-y-1">
                                    <li><strong>macOS:</strong> System Settings &rarr; Wi-Fi &rarr; Details.</li>
                                    <li><strong>Windows:</strong> Command Prompt &rarr; <code className="bg-yellow-200 px-1 rounded">ipconfig</code> &rarr; IPv4 Address.</li>
                                </ul>
                                <div className="mt-3">
                                    <label htmlFor="local-ip-input" className="sr-only">Local IP Address</label>
                                    <input
                                        id="local-ip-input"
                                        type="text"
                                        value={localIp}
                                        onChange={(e) => setLocalIp(e.target.value)}
                                        placeholder="e.g., 192.168.1.10"
                                        className="w-full p-2 border border-yellow-400 rounded-md bg-white text-yellow-900 placeholder-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                        aria-describedby="ip-fix-description"
                                    />
                                </div>
                            </div>
                             <p id="ip-fix-description" className="text-xs mt-3">
                                <strong>Note:</strong> Your phone and computer must be on the same Wi-Fi network. If it still doesn't work, a firewall may be blocking the connection.
                            </p>
                            <p className="text-sm font-semibold mt-4">
                                The best solution is to <strong className="underline">deploy the app</strong> to get a public link that works anywhere.
                            </p>
                        </div>
                    )}
                     {!isLocal && (
                         <p className="mt-4 text-text-light text-center text-sm">
                            Scan the code with another device's camera to open the app instantly.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstallHelpModal;
