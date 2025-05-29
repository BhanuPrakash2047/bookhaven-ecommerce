/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { CategorySkeleton } from "./SkeletonLoader";
import { motion } from 'framer-motion';
import {useNavigate} from 'react-router-dom'

const BrowseByCategory = ({ onCategorySelect }) => {
  const [genreCount, setGenreCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate =useNavigate();

  // Mock API call - replace with actual Redux dispatch
  useEffect(() => {
    const fetchGenreCount = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock data - replace with actual API call
        const mockData = {
          Fiction: 2847,
          Mystery: 1256,
          Romance: 1892,
          'Sci-Fi': 967,
          Biography: 734,
          Children: 1543,
          Fantasy: 1234,
          Thriller: 876,
          'Self-Help': 654,
          History: 432,
          Programming: 10,
          Adventure: 298,
          Comedy: 156,
          Drama: 445,
          Horror: 287
        };
        
        setGenreCount(mockData);
      } catch (err) {
        setError('Failed to fetch genre data');
      } finally {
        setLoading(false);
      }
    };

    fetchGenreCount();
  }, []);

  const handleCategoryClick = (genre) => {
    // if (onCategorySelect) {
    //   onCategorySelect(genre);
    // }

    console.log(`Category selected: ${genre}`);
    navigate(`/books/${genre}`);
    // Navigate to books page with genre filter
    // window.location.href = `/books?genre=${encodeURIComponent(genre)}`;
  };

  const getEmoji = (genre) => {
    const emojiMap = {
      Fiction: '📚',
      Mystery: '🕵️',
      Romance: '💕',
      'Sci-Fi': '🚀',
      Biography: '👤',
      Children: '🧸',
      Fantasy: '🧙‍♂️',
      Thriller: '😱',
      'Self-Help': '💪',
      History: '📜',
      Programming: '💻',
      Adventure: '🗺️',
      Comedy: '😂',
      Drama: '🎭',
      Horror: '👻'
    };
    return emojiMap[genre] || '📖';
  };

  const getGradient = (index) => {
    const gradients = [
      'from-blue-500 to-purple-500',
      'from-red-500 to-pink-500',
      'from-pink-500 to-rose-500',
      'from-cyan-500 to-blue-500',
      'from-green-500 to-teal-500',
      'from-yellow-500 to-orange-500',
      'from-purple-500 to-indigo-500',
      'from-red-500 to-orange-500',
      'from-emerald-500 to-cyan-500',
      'from-amber-500 to-yellow-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 relative">
            Browse by Category
            <motion.div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            ></motion.div>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our diverse collection of books organized by your favorite genres
          </p>
        </motion.div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(genreCount || {}).map(([genre, count], index) => (
              <motion.div
                key={genre}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-900/20 transition-all duration-300 cursor-pointer overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(genre)}
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(index)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative z-10 text-center">
                  <motion.div 
                    className="text-4xl mb-4"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {getEmoji(genre)}
                  </motion.div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {genre}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {count.toLocaleString()} books
                  </p>
                </div>
                
                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-200 dark:group-hover:border-orange-800 transition-colors duration-300"></div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseByCategory;