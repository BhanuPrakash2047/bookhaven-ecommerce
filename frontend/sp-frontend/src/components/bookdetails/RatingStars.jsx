import { Star } from "lucide-react";

const RatingStars = ({ rating, size = 'default' }) => {
  const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
    </div>
  );
};
export default RatingStars;