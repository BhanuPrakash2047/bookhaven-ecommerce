// import { i } from "framer-motion/client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Star, ShoppingCart, Trash2 } from 'lucide-react';      
import { removeFromWishlist } from '../../store/middleware/wishlistMiddleware';



const WishlistItem = ({ item, viewMode = 'grid' }) => {
  const dispatch = useDispatch();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await dispatch(removeFromWishlist(item.bookId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

//   const renderStars = (rating = 0) => {
//     return Array(5).fill(0).map((_, i) => (
//       <Star 
//         key={i} 
//         size={12} 
//         className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-slate-600'}`} 
//       />
//     ));
//   };

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          <div className="relative">
            <img
  src={`data:image/jpeg;base64,${item.image}`}               alt={item.bookTitle}
              className="w-20 h-28 object-cover rounded"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 truncate">
              {item.bookTitle}
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">
              by {item.author}
            </p>
            
            {/* <div className="flex items-center gap-1 mb-3">
              {renderStars()}
              <span className="text-xs text-gray-500 dark:text-slate-500 ml-1">(0)</span>
            </div> */}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(item.price)}
                </span>
                <span className="text-sm text-gray-500 dark:text-slate-500 line-through">
                  {formatPrice(item.price * 1.2)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
                <button
                  onClick={handleRemove}
                  disabled={isRemoving}
                  className="p-2 text-gray-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
           src={`data:image/jpeg;base64,${item.image}`}           alt={item.bookTitle}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-gray-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
          title="Remove from wishlist"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-2">
          {item.bookTitle}
        </h3>
        <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">
          by {item.author}
        </p>
        
        {/* <div className="flex items-center gap-1 mb-3">
          {renderStars()}
          <span className="text-xs text-gray-500 dark:text-slate-500 ml-1">(0)</span>
        </div> */}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(item.price)}
            </span>
            <span className="text-sm text-gray-500 dark:text-slate-500 line-through">
              {formatPrice(item.price * 1.2)}
            </span>
          </div>
        </div>
        
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};
export default WishlistItem;
 // Export utility functions if needed elsewhere