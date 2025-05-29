/* eslint-disable no-unused-vars */
import {useNavigate} from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {motion} from 'framer-motion';
const PopularGenres = () => {
  const navigate = useNavigate();
  
  const genres = [
    { name: 'Fiction', emoji: '📚', path: `/books/Fiction`, color: 'from-blue-500 to-purple-500' },
    { name: 'Mystery', emoji: '🕵️', path: '/books/Mystery', color: 'from-red-500 to-pink-500' },
    { name: 'Romance', emoji: '💕', path: '/books/Romance', color: 'from-pink-500 to-rose-500' },
    { name: 'Sci-Fi', emoji: '🚀', path: '/books/Sci-fi', color: 'from-cyan-500 to-blue-500' },
    { name: 'Biography', emoji: '👤', path: '/books/Biography', color: 'from-green-500 to-teal-500' },
    { name: 'Children', emoji: '🧸', path: '/books/Children', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Popular Genres
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover your next favorite book from our most popular categories
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {genres.map((genre, index) => (
            <motion.button
              key={genre.name}
              onClick={() => navigate(genre.path)}
              className="group relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative z-10 text-center">
                <motion.div 
                  className="text-4xl mb-3"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {genre.emoji}
                </motion.div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {genre.name}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
export default PopularGenres