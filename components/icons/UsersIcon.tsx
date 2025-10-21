import React from 'react';

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.023.57-2.308 0-3.332m-3.218 3.332a9.093 9.093 0 013.218 0c.57 1.023.57 2.308 0 3.332a9.093 9.093 0 01-3.218 0z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 18a9.094 9.094 0 00-3.742-.479 3 3 0 00-4.682 2.72M12 18a9.094 9.094 0 013.742-.479 3 3 0 014.682 2.72M12 18V9.75M14.25 9.75a2.25 2.25 0 00-4.5 0M12 18V9.75m0 0a2.25 2.25 0 00-2.25-2.25M12 9.75a2.25 2.25 0 012.25-2.25" 
    />
  </svg>
);

export default UsersIcon;