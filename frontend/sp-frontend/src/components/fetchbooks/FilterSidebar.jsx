import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  selectedGenre = null,
  isDark = false 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    genre: true,
    price: true,
    author: true,
    language: true,
    year: true
  });

  // Popular authors (you can replace with dynamic data)
  const popularAuthors = [
    'Stephen King', 'J.K. Rowling', 'Agatha Christie', 'Dan Brown',
    'John Grisham', 'Nicholas Sparks', 'James Patterson', 'Paulo Coelho',
    'Harper Lee', 'George Orwell', 'Jane Austen', 'Ernest Hemingway'
  ];

  // Categories matching your browse categories
  const categories = [
    'Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Biography', 'Children',
    'Fantasy', 'Thriller', 'Self-Help', 'History', 'Programming', 
    'Adventure', 'Comedy', 'Drama', 'Horror'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  // Set selected genre when it changes from BrowseByCategory
  useEffect(() => {
    if (selectedGenre && selectedGenre !== filters.genre) {
      onFiltersChange({ genre: selectedGenre });
    }
  }, [selectedGenre]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filterType, value) => {
    onFiltersChange({ [filterType]: value });
  };

  const handlePriceChange = (type, value) => {
    onFiltersChange({ [type]: parseFloat(value) || null });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== null && value !== undefined && value !== ''
  );

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} pb-4 mb-4`}>
      <button
        onClick={onToggle}
        className={`flex items-center justify-between w-full text-left font-semibold text-sm mb-2 ${
          isDark ? 'text-white hover:text-orange-400' : 'text-gray-900 hover:text-orange-600'
        } transition-colors`}
      >
        {title}
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isExpanded && <div className="space-y-2">{children}</div>}
    </div>
  );

  return (
    <div className={`w-full h-fit sticky top-4 ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-xl p-6 shadow-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter size={20} className={isDark ? 'text-orange-400' : 'text-orange-600'} />
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Filters
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className={`text-sm font-medium px-3 py-1 rounded-full transition-colors ${
              isDark 
                ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                : 'text-red-600 hover:text-red-700 hover:bg-red-50'
            }`}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Genre Filter */}
      <FilterSection 
        title="Genre" 
        isExpanded={expandedSections.genre}
        onToggle={() => toggleSection('genre')}
      >
        <select
          value={filters.genre || ''}
          onChange={(e) => handleFilterChange('genre', e.target.value || null)}
          className={`w-full px-3 py-2 rounded-lg border transition-colors ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-400' 
              : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
          } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        >
          <option value="">All Genres</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection 
        title="Price Range" 
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Min Price: ${filters.minPrice || 0}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.minPrice || 0}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Max Price: ${filters.maxPrice || 100}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.maxPrice || 100}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </FilterSection>

      {/* Author Filter */}
      <FilterSection 
        title="Author" 
        isExpanded={expandedSections.author}
        onToggle={() => toggleSection('author')}
      >
        <select
          value={filters.author || ''}
          onChange={(e) => handleFilterChange('author', e.target.value || null)}
          className={`w-full px-3 py-2 rounded-lg border transition-colors ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-400' 
              : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
          } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        >
          <option value="">All Authors</option>
          {popularAuthors.map(author => (
            <option key={author} value={author}>{author}</option>
          ))}
        </select>
      </FilterSection>

      {/* Language Filter */}
      <FilterSection 
        title="Language" 
        isExpanded={expandedSections.language}
        onToggle={() => toggleSection('language')}
      >
        <select
          value={filters.language || ''}
          onChange={(e) => handleFilterChange('language', e.target.value || null)}
          className={`w-full px-3 py-2 rounded-lg border transition-colors ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-400' 
              : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
          } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        >
          <option value="">All Languages</option>
          {languages.map(language => (
            <option key={language} value={language}>{language}</option>
          ))}
        </select>
      </FilterSection>

      {/* Year Published Filter */}
      <FilterSection 
        title="Year Published" 
        isExpanded={expandedSections.year}
        onToggle={() => toggleSection('year')}
      >
        <select
          value={filters.yearPublished || ''}
          onChange={(e) => handleFilterChange('yearPublished', e.target.value ? parseInt(e.target.value) : null)}
          className={`w-full px-3 py-2 rounded-lg border transition-colors ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-400' 
              : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
          } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        >
          <option value="">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </FilterSection>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: ${isDark ? '#fb923c' : '#ea580c'};
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: ${isDark ? '#fb923c' : '#ea580c'};
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-webkit-slider-track {
          background: ${isDark ? '#4b5563' : '#e5e7eb'};
        }
        .slider::-moz-range-track {
          background: ${isDark ? '#4b5563' : '#e5e7eb'};
        }
      `}</style>
    </div>
  );
};

export default FilterSidebar;