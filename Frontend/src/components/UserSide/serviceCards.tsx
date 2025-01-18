const ServiceCard = ({ image, title, description, className = "" }) => {
return (
     <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-full aspect-square max-w-[300px] rounded-lg shadow-lg overflow-hidden group">
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover transform will-change-transform 
            transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay with left-to-right transition */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#9E8585]/40 to-[#9E8585]/40
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
      <p className="mt-4 px-4 text-gray-700 text-sm md:text-base max-w-[300px] 
        text-start leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard