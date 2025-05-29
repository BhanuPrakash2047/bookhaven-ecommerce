/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, List, Search, SlidersHorizontal, X, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSidebar from '../components/fetchbooks/FilterSidebar';
import BookCard from '../components/fetchbooks/BookCard';
import BookSkeleton from '../components/fetchbooks/BookSkeleton';
import { 
  setFilters, 
  clearFilters,
  selectAllBooks,
  selectBooksLoading,
  selectBooksError,
  selectBookFilters
} from '../store/slices/booksSlice';
import { fetchAllBooks } from '../store/middleware/booksMiddleware';
import { useTheme } from '../context/ThemeContext';
import { useParams } from 'react-router-dom';

const BooksPage = () => {
  const { selectedGenreFromBrowse } = useParams();
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const books = useSelector(selectAllBooks);
  const loading = useSelector(selectBooksLoading);
  const error = useSelector(selectBooksError);
  const filters = useSelector(selectBookFilters);
  
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  
  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsVoiceSupported(true);
        recognitionRef.current = new SpeechRecognition();
        
        const recognition = recognitionRef.current;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setVoiceError('');
        };

        recognition.onresult = (event) => {
          let transcript = '';
          let isFinal = false;

          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              isFinal = true;
            }
          }

          if (isFinal) {
            setSearchQuery(transcript.trim());
            setIsListening(false);
          }
        };

        recognition.onerror = (event) => {
          setIsListening(false);
          
          switch (event.error) {
            case 'network':
              setVoiceError('Network error occurred. Please check your connection.');
              break;
            case 'not-allowed':
              setVoiceError('Microphone access denied. Please allow microphone access.');
              break;
            case 'no-speech':
              setVoiceError('No speech detected. Please try again.');
              break;
            case 'audio-capture':
              setVoiceError('No microphone found. Please connect a microphone.');
              break;
            case 'service-not-allowed':
              setVoiceError('Speech recognition service not allowed.');
              break;
            default:
              setVoiceError('Speech recognition error occurred.');
          }
          
          // Clear error after 3 seconds
          setTimeout(() => setVoiceError(''), 3000);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Fetch books when component mounts or filters change
  useEffect(() => {
    dispatch(fetchAllBooks(filters));
  }, [dispatch, filters]);

  // Handle category selection from BrowseByCategory
  useEffect(() => {
    if (selectedGenreFromBrowse) {
      dispatch(setFilters({ genre: selectedGenreFromBrowse }));
    }
  }, [selectedGenreFromBrowse, dispatch]);

  const handleFiltersChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchQuery('');
  };

  const handleBookClick = (book) => {
    console.log('Clicked book:', book);
  };

  // Voice search functions
  const startVoiceRecognition = () => {
    if (!isVoiceSupported) {
      setVoiceError('Speech recognition is not supported in this browser.');
      setTimeout(() => setVoiceError(''), 3000);
      return;
    }

    if (isListening) {
      stopVoiceRecognition();
      return;
    }

    try {
      recognitionRef.current.start();
      
      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        if (isListening && recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 10000);
    } catch (error) {
      setVoiceError('Failed to start voice recognition.');
      setTimeout(() => setVoiceError(''), 3000);
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Clear voice recognition on component unmount
  useEffect(() => {
    return () => {
      stopVoiceRecognition();
    };
  }, []);

  // Filter and sort books based on search and sort options
  const getFilteredAndSortedBooks = () => {
    let filteredBooks = books;

    // Apply search filter
    if (searchQuery) {
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Clone before sorting to avoid mutating read-only data
    filteredBooks = [...filteredBooks].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (parseFloat(a.discountedPrice || a.price) || 0) - (parseFloat(b.discountedPrice || b.price) || 0);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'year':
          return (b.yearPublished || 0) - (a.yearPublished || 0);
        case 'title':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filteredBooks;
  };

  const filteredBooks = getFilteredAndSortedBooks();

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== null && value !== undefined && value !== ''
  ) || searchQuery;

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    } transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Discover Books
            </h1>
            <p className={`${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {filteredBooks.length} books found
              {hasActiveFilters && ' with current filters'}
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border mt-4 ${
              isDark 
                ? 'border-gray-700 text-white hover:bg-gray-800' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } transition-colors`}
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        {/* Voice Error Message */}
        {voiceError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-3 rounded-lg border ${
              isDark 
                ? 'bg-red-900/20 border-red-800 text-red-400' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {voiceError}
          </motion.div>
        )}

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Bar with Voice */}
          <div className="relative flex-1">
            <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search books, authors, genres... or use voice search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-16 py-3 rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500'
              } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            />
            
            {/* Voice Search Button */}
            <button
              onClick={startVoiceRecognition}
              disabled={!isVoiceSupported}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200 ${
                !isVoiceSupported
                  ? 'opacity-50 cursor-not-allowed'
                  : isListening
                    ? 'bg-red-500 text-white animate-pulse hover:bg-red-600'
                    : isDark
                      ? 'text-gray-400 hover:text-orange-400 hover:bg-gray-700'
                      : 'text-gray-500 hover:text-orange-500 hover:bg-gray-100'
              }`}
              title={
                !isVoiceSupported 
                  ? 'Voice search not supported' 
                  : isListening 
                    ? 'Stop voice search' 
                    : 'Start voice search'
              }
            >
              {isListening ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <MicOff size={18} />
                </motion.div>
              ) : (
                <Mic size={18} />
              )}
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-3 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-400' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          >
            <option value="title">Sort by Title</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
            <option value="year">Sort by Year</option>
          </select>

          {/* View Mode Toggle */}
          <div className={`flex rounded-lg border ${
            isDark ? 'border-gray-700' : 'border-gray-300'
          } overflow-hidden`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-colors ${
                viewMode === 'grid'
                  ? (isDark ? 'bg-orange-500 text-white' : 'bg-orange-500 text-white')
                  : (isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-white text-gray-600 hover:text-gray-900')
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-colors ${
                viewMode === 'list'
                  ? (isDark ? 'bg-orange-500 text-white' : 'bg-orange-500 text-white')
                  : (isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-white text-gray-600 hover:text-gray-900')
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Voice Search Status */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-4 p-4 rounded-lg border-2 border-dashed ${
              isDark 
                ? 'border-orange-400 bg-orange-500/10 text-orange-400' 
                : 'border-orange-500 bg-orange-50 text-orange-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <Mic size={20} />
              </motion.div>
              <span className="font-medium">Listening... Speak now to search for books</span>
            </div>
            <p className="text-sm mt-1 opacity-80">
              Say something like "mystery novels" or "books by Agatha Christie"
            </p>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              selectedGenre={selectedGenreFromBrowse}
              isDark={isDark}
            />
          </div>

          {/* Books Grid/List */}
          <div className="flex-1">
            {error && (
              <div className={`p-4 rounded-lg mb-6 border ${
                isDark 
                  ? 'bg-red-900/20 border-red-800 text-red-400' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                Error loading books: {error}
              </div>
            )}

            {loading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {[...Array(8)].map((_, i) => (
                  <BookSkeleton key={i} isDark={isDark} />
                ))}
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className={`text-center py-12 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <div className="text-6xl mb-4">📚</div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  No books found
                </h3>
                <p className="mb-4">
                  {hasActiveFilters 
                    ? 'Try adjusting your filters or search terms'
                    : 'No books available at the moment'
                  }
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <motion.div 
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}
                layout
              >
                <AnimatePresence>
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      isDark={isDark}
                      onBookClick={handleBookClick}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Filters Modal */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              className="fixed inset-0 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div 
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setShowMobileFilters(false)}
              />
              
              <motion.div
                className={`absolute right-0 top-0 h-full w-full max-w-sm ${
                  isDark ? 'bg-gray-900' : 'bg-white'
                } shadow-xl overflow-y-auto`}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
              >
                <div className={`flex items-center justify-between p-4 border-b ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <h2 className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className={`p-2 rounded-full ${
                      isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                    } transition-colors`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4">
                  <FilterSidebar
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                    selectedGenre={selectedGenreFromBrowse}
                    isDark={isDark}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BooksPage;