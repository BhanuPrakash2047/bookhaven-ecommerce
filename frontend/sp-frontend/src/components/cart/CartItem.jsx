// import { useTheme } from '../../context/ThemeContext';
import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';


const CartItem = ({ item, onUpdateQuantity, onRemove, loading }) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    setLocalQuantity(newQuantity);
    await onUpdateQuantity(item.id, item.bookId, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    await onRemove(item.id);
    setIsUpdating(false);
  };

  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      {/* Book Image */}
      <div className="flex-shrink-0 w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
        {item.image ? (
          <img 
            src={`data:image/jpeg;base64,${item.image}`} 
            alt={item.bookTitle}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">
          {item.bookTitle}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          by {item.author}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-orange-600 dark:text-orange-400">
            ${item.price.toFixed(2)}
          </span>
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(localQuantity - 1)}
              disabled={localQuantity <= 1 || isUpdating || loading}
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            
            <span className="min-w-[2rem] text-center font-medium text-gray-900 dark:text-white">
              {localQuantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(localQuantity + 1)}
              disabled={isUpdating || loading}
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        disabled={isUpdating || loading}
        className="flex-shrink-0 p-2 text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Remove item"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};
export default CartItem;