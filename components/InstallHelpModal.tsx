import React, { useState } from 'react';
import QRCode from './QRCode';
import InfoIcon from './icons/InfoIcon';
import ClipboardIcon from './icons/ClipboardIcon';

interface InstallHelpModalProps {
    onClose: () => void;
}

const InstallHelpModal: React.FC<InstallHelpModalProps> = ({ onClose }) => {
    const [copied, setCopied] = useState(false);

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

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
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
                        <QRCode url={window.location.href} />
                    </div>

                    <div className="mt-4 flex items-center bg-bg-main/50 border border-border rounded-lg">
                        <input 
                            type="text"
                            value={window.location.href}
                            readOnly
                            className="p-2 bg-transparent w-full text-text-light text-sm focus:outline-none"
                            aria-label="Application URL"
                        />
                        <button 
                            onClick={handleCopy}
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
                                This is a Local Development Link
                            </h4>
                            <p className="text-sm mt-2 mb-3">
                                Your QR code points to a private address (like <code>localhost</code>). Your phone can't access this unless it's on the <strong>exact same Wi-Fi network</strong> as your computer.
                            </p>
                            <p className="text-sm mt-1 mb-3">
                                If it's still not working, your computer's firewall might be blocking the connection.
                            </p>
                            <p className="text-sm font-semibold">
                                The best solution is to get a public link. Look for a <strong>"Deploy"</strong> or <strong>"Publish"</strong> button in your development tool to create a shareable link that works anywhere!
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