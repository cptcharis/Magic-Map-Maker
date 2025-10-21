import React from 'react';

const TreeViewIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M3 4.5h4.5m-4.5 0V9m0 0h4.5m-4.5 0v4.5m0 0h4.5m4.5-9h4.5m-4.5 0V9m0 0h4.5m-4.5 0v4.5m0 0h4.5m-13.5 0v4.5m0 0h18" 
    />
  </svg>
);

export default TreeViewIcon;