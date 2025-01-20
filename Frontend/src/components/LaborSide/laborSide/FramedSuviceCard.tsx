import React from 'react';

const FramedServiceCard = ({ image, title, className = "" }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-full aspect-[3/4] max-w-[300px]  overflow-hidden group 
                      border-[9px] border-[#1C3D7A] p-1">
        <div className="w-full h-full overflow-hidden rounded-lg">
          <img 
            src={image}
            alt={title}
            className="w-full h-full object-cover transform will-change-transform 
              transition-transform duration-700 group-hover:scale-105"
          />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-[#6E7C95]/40 to-[#6E7C95]/40
              backdrop-blur-[1px] transform will-change-transform pointer-events-none
              transition-all duration-700 ease-in-out origin-left
              group-hover:scale-x-0"
          />
          <h2 
            className="absolute inset-0 flex items-center justify-center text-white 
              font-['Italianno'] text-3xl md:text-4xl pointer-events-none
              transition-opacity duration-700 ease-in-out
              group-hover:opacity-0"
          >
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default FramedServiceCard