/* eslint-disable no-unused-vars */
import { User, User2Icon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const AuthorCard = ({ author, books, onAuthorClick }) => {
  const { isDark } = useTheme();
  
return (
  <div 
    className={`flex-shrink-0 w-64 ${
      isDark 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    } rounded-2xl p-6 cursor-pointer shadow-lg border backdrop-blur-sm`}
    onClick={() => onAuthorClick(author)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onAuthorClick(author);
      }
    }}
    aria-label={`Explore books by ${author}`}
  >
    {/* Author avatar container */}
    <div className={`h-32 ${
      isDark 
        ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
        : 'bg-gradient-to-br from-blue-400 to-purple-500'
    } rounded-xl mb-4 flex items-center justify-center shadow-sm`}>
      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
        <User size={28} className="text-gray-400 drop-shadow-sm" />
      </div>
    </div>
    
    {/* Content section */}
    <div className="space-y-3">
      <h3 className={`font-semibold text-xl ${
        isDark ? 'text-white' : 'text-gray-900'
      } line-clamp-1`}>
        {author}
      </h3>
      
      <p className={`text-sm ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      } leading-relaxed`}>
        Discover books from this author
      </p>
      
      {/* Action section */}
      <div className={`flex items-center justify-between pt-3 border-t ${
        isDark ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <span className={`text-sm font-medium ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          View Collection
        </span>
        <svg 
          className={`w-4 h-4 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
);
};
export default AuthorCard;
