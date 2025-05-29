import { useTheme } from '../../context/ThemeContext';
import React from 'react';
import { Calendar, User } from 'lucide-react';  
import RatingStars from './RatingStars';


// Review Item Component
const ReviewItem = ({ review }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'} mb-4`}>
      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'} flex items-center justify-center`}>
          <User className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              User {review.userId}
            </span>
            <RatingStars rating={review.rating} size="small" />
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(review.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {review.review}
      </p>
    </div>
  );
};
export default ReviewItem;