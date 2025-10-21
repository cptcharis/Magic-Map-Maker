import React from 'react';

const DrawingBotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g strokeWidth="8" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Crayon */}
            <g transform="translate(130, 80) rotate(45)">
                <path d="M 0 -35 L 15 -35 L 15 20 L 7.5 30 L 0 30 L -7.5 30 L -15 20 L -15 -35 Z" fill="#f97316" stroke="#f97316" />
                <path d="M -15 -25 L 15 -25" stroke="white" strokeWidth="4"/>
                <path d="M 0 30 L 7.5 45 L -7.5 45 Z" fill="#f97316" stroke="#f97316"/>
            </g>

            {/* Body */}
            <rect x="50" y="70" width="100" height="80" rx="20" fill="#3b82f6" stroke="#3b82f6"/>
            
            {/* Eye */}
            <circle cx="100" cy="110" r="15" fill="white" stroke="white" />
            <circle cx="100" cy="110" r="5" fill="#1f2937" stroke="#1f2937"/>
            
            {/* Antenna */}
            <line x1="100" y1="70" x2="100" y2="40" />
            <circle cx="100" cy="35" r="8" fill="#10b981" stroke="#10b981" />
            
            {/* Wheels */}
            <circle cx="70" cy="150" r="15" strokeWidth="6"/>
            <circle cx="130" cy="150" r="15" strokeWidth="6"/>

             {/* Arm */}
            <path d="M 70 100 C 50 110, 100 125, 120 95" />

        </g>
    </svg>
);

export default DrawingBotIcon;
