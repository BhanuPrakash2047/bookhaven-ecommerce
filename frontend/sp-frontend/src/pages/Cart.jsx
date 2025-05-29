import { useTheme } from '../context/ThemeContext';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCart, updateCartItem, removeFromCart, clearCart } from '../store/middleware/cartMiddleware';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import ErrorMessage from '../components/cart/ErrorMessage';
import CartSkeleton from '../components/cart/CartSkeleton';
import EmptyCart from '../components/cart/EmptyCart';
import {  toggleCheckout } from '../store/slices/cartSlice';
import { Link ,useNavigate} from 'react-router-dom';




const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totalPrice, totalItems, loading, error } = useSelector(state => state?.cart);
  const { isDark } = useTheme();
  
  useEffect(() => {
    dispatch(fetchUserCart());
  }, [dispatch]);

  const handleUpdateQuantity = async (cartItemId, bookId, quantity) => {
    console.log('Updating quantity:', cartItemId, bookId, quantity);
    await dispatch(updateCartItem({ cartItemId, bookId, quantity }));
  };

  const handleRemoveItem = async (cartItemId) => {
    await dispatch(removeFromCart(cartItemId));
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    // Implement checkout logic
      dispatch(toggleCheckout());
      navigate("/address")

    console.log('Proceeding to checkout...');
  };

  const handleRetry = () => {
    dispatch(fetchUserCart());
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Shopping Cart
            </h1>
            {totalItems > 0 && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <ErrorMessage message={error} onRetry={handleRetry} />
          )}

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {loading && items.length === 0 ? (
                <CartSkeleton />
              ) : items.length === 0 ? (
                <EmptyCart />
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                      loading={loading}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {items.length > 0 && (
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <CartSummary
                    totalPrice={totalPrice}
                    totalItems={totalItems}
                    onClearCart={handleClearCart}
                    onCheckout={handleCheckout}
                    loading={loading}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;