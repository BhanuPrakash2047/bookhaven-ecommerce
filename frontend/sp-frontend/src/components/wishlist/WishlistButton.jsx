/* eslint-disable no-unused-vars */
import { useSelector,useDispatch } from "react-redux";
import { useState } from "react";
import { addToWishlist, removeFromWishlist } from '../../store/middleware/wishlistMiddleware';
import { Heart } from 'lucide-react';




// Heart Button Component for adding to wishlist
const WishlistButton = ({ bookId, className = "" }) => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.wishlist);
  const [isAdding, setIsAdding] = useState(false);
  
  const isInWishlist = items.some(item => item.bookId === bookId);

  const handleToggle = async () => {
    setIsAdding(true);
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(bookId));
      } else {
        await dispatch(addToWishlist(bookId));
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isAdding}
      className={`p-2 rounded-full transition-colors disabled:opacity-50 ${
        isInWishlist
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400'
      } ${className}`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        size={20} 
        className={isInWishlist ? 'fill-current' : ''} 
      />
    </button>
  );
};

export default WishlistButton;