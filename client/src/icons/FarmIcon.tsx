import React from "react";

interface FarmIconProps {
  className?: string;
}

const FarmIcon: React.FC<FarmIconProps> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 2l-8 4v4l8 4 8-4V6l-8-4z" />
      <path d="M8 16l-4 2v4l8 -4 8 4v-4l-4 -2" />
      <path d="M8 6v10" />
      <path d="M16 6v10" />
    </svg>
  );
};

export default FarmIcon;
