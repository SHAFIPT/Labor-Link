import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // rating should be a number
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
   const formattedRating = Number(rating).toFixed(1);
  
  return (
    <div className="flex items-center gap-1">
      <Star 
        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" 
        fill="#118577"
        color="#118577"
      />
      <span className="text-sm sm:text-base text-[#118577] font-medium">
        {formattedRating}
      </span>
    </div>
  );
};

export default StarRating;