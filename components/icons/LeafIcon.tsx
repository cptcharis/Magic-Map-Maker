import React from 'react';

const LeafIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M19.5 12c0-5.143-4.12-9.3-9.215-9.3C5.193 2.7.9 6.913.9 12.028c0 5.424 4.12 9.272 9.3 9.272 4.935 0 9.3-3.848 9.3-9.3zM15.9 8.99a4.5 4.5 0 11-8.583 3.513" 
    />
  </svg>
);

export default LeafIcon;
