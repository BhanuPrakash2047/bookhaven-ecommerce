import { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { addToCart } from "../../store/middleware/cartMiddleware";


// Add to Cart Button Component
const AddToCartButton = ({ bookId, onSuccess, disabled = false, className = "" }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const { loading } = useSelector(state => state.cart);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await dispatch(addToCart({ bookId, quantity: 1 }));
      onSuccess?.();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdding || loading}
      className={`
        bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed 
        text-white font-medium py-2 px-4 rounded-lg transition-colors 
        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
        dark:focus:ring-offset-gray-800 flex items-center gap-2 ${className}
      `}
    >
      {isAdding ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </>
      )}
    </button>
  );
};
export default AddToCartButton;