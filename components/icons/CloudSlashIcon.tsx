import React from 'react';

const CloudSlashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5" />
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M2.25 12.75l1.205-1.205a5.25 5.25 0 017.425 0l2.12 2.12M6.31 5.438A8.25 8.25 0 0118.75 12c-2.063 0-3.924-.8-5.282-2.119l-1.31-1.31a5.25 5.25 0 00-7.424 0L2.25 10.5M15.75 18a8.25 8.25 0 01-11.438-6.31" 
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
    </svg>
);

export default CloudSlashIcon;