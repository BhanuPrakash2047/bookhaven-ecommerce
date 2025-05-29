/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import Wishlist from '../../pages/Wishlist';
import WishlistButton from '../wishlist/WishlistButton';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/middleware/cartMiddleware';

const BookCard = ({ book, isDark = false, onBookClick }) => {
  const dispatch=useDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async () => {
  
    try {
      await dispatch(addToCart({ bookId:book.id, quantity: 1 }));
     
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } 
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    console.log('Liked:', book.id);
  };

  const handleBookClick = () => {
    if (onBookClick) {
      onBookClick(book);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e) => {
    console.error('Image failed to load:', e);
    setImageError(true);
    setImageLoaded(false);
  };

  // Generate star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" style={{clipPath: 'inset(0 50% 0 0)'}} />
        );
      } else {
        stars.push(
          <Star key={i} size={14} className="text-gray-300" />
        );
      }
    }
    return stars;
  };

  const getDiscountPercentage = () => {
    if (book.discountedPrice && book.price) {
      const originalPrice = parseFloat(book.price);
      const discountedPrice = parseFloat(book.discountedPrice);
      return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
    }
    return 0;
  };

  const discount = getDiscountPercentage();

  // Create proper image URL from base64
  const getImageSrc = () => {
    if (!book.imageBlob) return null;
    
    // Check if it's already a data URL
    if (book.imageBlob.startsWith('data:')) {
      return book.imageBlob;
    }
    
    // If it's just base64 string, create proper data URL
    // Try different image formats
    return `data:image/png;base64,${book.imageBlob}`;
  };

  const imageSrc = getImageSrc();

  return (
    <motion.div
      className={`group relative w-full dark:hover:shadow-amber-900 dark:hover:shadow-sm ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleBookClick}
    >
      {/* Image Container - Fixed aspect ratio */}
      <div className="relative w-full h-42 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {/* Placeholder - show when no image or image failed to load */}
        {(!imageSrc || imageError || !imageLoaded) && (
          <div className="w-full h-full flex items-center justify-center">
            <div className={`w-16 h-20 rounded ${
              isDark ? 'bg-gray-600' : 'bg-gray-300'
            } flex items-center justify-center`}>
              <span className="text-2xl">📚</span>
            </div>
          </div>
        )}
        
        {/* Actual Image */}
        {imageSrc && !imageError && (
          <img
            src={imageSrc}
            alt={book.title || 'Book cover'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            {discount}%
          </div>
        )}

        {/* Tag Badge */}
        {book.tag && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            {book.tag}
          </div>
        )}
       

        {/* Hover Overlay */}
        <div className="absolute inset-0 hover:bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

              <WishlistButton bookId={book.id}/>
              
            {/* </button> */}
            <button
              
              onClick={handleAddToCart}
              className="p-2 bg-white/90 text-gray-700 rounded-full hover:bg-orange-500 hover:text-white transition-colors"
            >
              <ShoppingCart size={16} />
            </button>
            <button className="p-2 bg-white/90 text-gray-700 rounded-full hover:bg-blue-500 hover:text-white transition-colors">
              <Link to={`/book/${book.id}`}> <Eye size={16} /></Link>
            </button>
       
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        
        {/* Title */}
        <h3 className={`font-semibold text-sm mb-1 line-clamp-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        } group-hover:text-orange-500 transition-colors`}>
          {book.title}
        </h3>
        
        {/* Author */}
        <p className={`text-xs mb-2 ${
          isDark ? 'text-gray-400' : 'text-gray-600'      
        }`}>
          by {book.author}
        </p>

        {/* Genre */}
        <div className="mb-2">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            isDark 
              ? 'bg-gray-700 text-gray-300' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {book.genre}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex gap-0.5">
            {renderStars(book.averageRating)}
          </div>
          <span className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            ({book.totalRatings || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {book.discountedPrice ? (
              <>
                <span className={`font-bold text-sm ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  ${book.discountedPrice}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  ${book.price}
                </span>
              </>
            ) : (
              <span className={`font-bold text-sm ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                ${book.price}
              </span>
            )}
          </div>
          
          {/* Stock indicator */}
          <span className={`text-xs ${
            book.quantity > 0 
              ? (isDark ? 'text-green-400' : 'text-green-600')
              : (isDark ? 'text-red-400' : 'text-red-600')
          }`}>
            {book.quantity > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Quick Info */}
        <div className={`mt-2 pt-2 border-t text-xs ${
          isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
        }`}>
          <div className="flex justify-between">
            <span>{book.language}</span>
            <span>{book.yearPublished}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;