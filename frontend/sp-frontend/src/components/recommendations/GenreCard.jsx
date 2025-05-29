/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useSelector } from "react-redux";
import { selectBooksByGenre } from "../../store/slices/recommendationSlice";
import { useNavigate } from "react-router-dom";

const GenreCard = ({ genre, book, onGenreClick }) => {
  const { isDark } = useTheme();
  const booksByGenre = useSelector(selectBooksByGenre);
  
  const navigate=useNavigate();

  
   

  const genreIcons = {
    Fiction: '📚',
    Mystery: '🔍',
    Romance: '💖',
    'Sci-Fi': '🚀',
    Biography: '👤',
    Children: '🧸',
    Programming: '💻',
    Fantasy: '🐉',
    Thriller: '⚡',
    History: '🏛️'
  };

  return (
  <div 
    className={`flex-shrink-0 w-64 ${
      isDark 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    } rounded-2xl p-6 cursor-pointer shadow-lg border backdrop-blur-sm`}
    onClick={() => {
      navigate(`/books/${genre}`);
    }}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onGenreClick(genre);
      }
    }}
    aria-label={`Explore ${genre} books`}
  >
    {/* Icon container */}
    <div className={`h-32 ${
      isDark 
        ? 'bg-gradient-to-br from-orange-500 to-red-600' 
        : 'bg-gradient-to-br from-orange-400 to-red-500'
    } rounded-xl mb-4 flex items-center justify-center text-4xl shadow-sm`}>
      <span className="text-white drop-shadow-sm">
        {genreIcons[genre] || '📖'}
      </span>
    </div>
    
    {/* Content section */}
    <div className="space-y-3">
      <h3 className={`font-semibold text-xl ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {genre}
      </h3>
      
      <p className={`text-sm ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      } leading-relaxed`}>
        Discover amazing books in this genre
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
}
export default GenreCard;