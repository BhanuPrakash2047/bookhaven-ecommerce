/* eslint-disable no-unused-vars */
import { useTheme } from '../context/ThemeContext';
import { Calendar, User } from 'lucide-react';      
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';   
import { fetchBookById, fetchBookImages, fetchBookFAQs, fetchBookRatingsReviews } from '../store/middleware/booksMiddleware';
import { selectSelectedBook, selectBookImages, selectBookFaqs, selectBookRatingsReviews, selectBooksLoading, selectImagesLoading, selectFaqsLoading, selectRatingsLoading } from '../store/slices/booksSlice';
// import BookDetailsSkeleton from '../components/bookdetails/skeleton';
import ImageGallery from '../components/bookdetails/ImageGallery';
import RatingStars from '../components/bookdetails/RatingStars';
import ReviewItem from '../components/bookdetails/ReviewItem';
import FAQItem from '../components/bookdetails/FaqItem';
import { Star } from 'lucide-react';        
import { Minus, Plus, ShoppingCart, Heart, Share2, Eye, Book, Globe, Building, Hash } from 'lucide-react';
import {FAQSkeleton, BookDetailsSkeleton, ReviewsSkeleton} from '../components/bookdetails/skeleton';
// import ReviewsSkeleton from '../components/bookdetails/skeleton';

const BookDetailsPage = () => {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  
  const book = useSelector(selectSelectedBook);
  const bookImages = useSelector(selectBookImages);
  const bookFaqs = useSelector(selectBookFaqs);
  const bookReviews = useSelector(selectBookRatingsReviews);
  const loading = useSelector(selectBooksLoading);
  const imagesLoading = useSelector(selectImagesLoading);
  const faqsLoading = useSelector(selectFaqsLoading);
  const ratingsLoading = useSelector(selectRatingsLoading);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (bookId) {
      dispatch(fetchBookById(bookId));
      dispatch(fetchBookImages(bookId));
      dispatch(fetchBookFAQs(bookId));
      dispatch(fetchBookRatingsReviews(bookId));
    }
  }, [dispatch, bookId]);

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const openGallery = (index = 0) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4 py-8">
          <BookDetailsSkeleton />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
        <div className={`text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <h2 className="text-2xl font-bold mb-2">Book not found</h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            The book you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const mainImage = bookImages.find(img => img.isMain) || bookImages[0];
  const discountPercentage = book.discountedPrice ? 
    Math.round(((book.price - book.discountedPrice) / book.price) * 100) : 0;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
        <div className="container mx-auto px-4 py-4">
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Books</span>
            <span className="mx-2">/</span>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>{book.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative">
              <div 
                className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openGallery(0)}
              >
                <img
                  src={
                    `data:image/png;base64,${mainImage?.imageBlob}` 
                  }
                  alt={book.title}
                  className="w-full h-full object-fit group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 hover:bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              
              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  -{discountPercentage}%
                </div>
              )}
              
              {/* Bestseller Badge */}
              {book.tag === 'bestseller' && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Bestseller
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {bookImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {bookImages.slice(0, 5).map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => openGallery(index)}
                    className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-orange-500 transition-all"
                  >
                    <img
                      src={image.imageBlob ? 
                        `data:image/png;base64,${image.imageBlob}` : 
                        '/api/placeholder/64/64'
                      }
                      alt={`${book.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {bookImages.length > 5 && (
                  <button
                    onClick={() => openGallery(5)}
                    className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:ring-2 hover:ring-orange-500 transition-all"
                  >
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      +{bookImages.length - 5}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                {book.title}
              </h1>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                by {book.author}
              </p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <RatingStars rating={book.averageRating || 0} />
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  ({book.totalRatings || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${book.discountedPrice || book.price}
                </span>
                {book.discountedPrice && (
                  <span className={`text-xl line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    ${book.price}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {book.quantity > 0 ? (
                  <span className="text-green-600 font-medium">✓ In Stock ({book.quantity} available)</span>
                ) : (
                  <span className="text-red-600 font-medium">✗ Out of Stock</span>
                )}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className={`mr-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Quantity:</span>
                  <div className={`flex items-center border ${isDark ? 'border-gray-600' : 'border-gray-300'} rounded-lg`}>
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      className={`p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} disabled:opacity-50`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className={`px-4 py-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className={`p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button 
                  disabled={book.quantity === 0}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-lg border transition-colors ${
                    isWishlisted 
                      ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800' 
                      : `${isDark ? 'border-gray-600 hover:bg-gray-700 text-gray-400' : 'border-gray-300 hover:bg-gray-50 text-gray-600'}`
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <button className={`p-3 rounded-lg border transition-colors ${isDark ? 'border-gray-600 hover:bg-gray-700 text-gray-400' : 'border-gray-300 hover:bg-gray-50 text-gray-600'}`}>
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Book Details */}
            <div className={`grid grid-cols-2 gap-4 p-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
              <div className="flex items-center space-x-2">
                <Book className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Genre: {book.genre}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Published: {book.yearPublished}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Language: {book.language}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Publisher: {book.publisher}
                </span>
              </div>
              <div className="flex items-center space-x-2 col-span-2">
                <Hash className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  ISBN: {book.isbn}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} mb-8`}>
          <nav className="flex space-x-8">
            {['description', 'reviews', 'faqs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-600'
                    : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                {tab === 'description' && 'Description'}
                {tab === 'reviews' && `Reviews (${bookReviews.length})`}
                {tab === 'faqs' && `FAQs (${bookFaqs.length})`}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl">
          {activeTab === 'description' && (
            <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {book.description || 'No description available for this book.'}
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {ratingsLoading ? (
                <ReviewsSkeleton />
              ) : bookReviews.length > 0 ? (
                <div className="space-y-6">
                  {bookReviews.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No reviews yet. Be the first to review this book!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'faqs' && (
            <div>
              {faqsLoading ? (
                <FAQSkeleton />
              ) : bookFaqs.length > 0 ? (
                <div className="space-y-4">
                  {bookFaqs.map((faq, index) => (
                    <FAQItem key={faq.id} faq={faq} index={index} />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No frequently asked questions available for this book.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGallery
        images={bookImages}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />
    </div>
  );
};

export default BookDetailsPage;