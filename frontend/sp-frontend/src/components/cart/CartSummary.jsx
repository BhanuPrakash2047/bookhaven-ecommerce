const CartSummary = ({ totalPrice, totalItems, onClearCart, onCheckout, loading }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Order Summary
      </h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Items ({totalItems})</span>
          <span className="text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Shipping</span>
          <span className="text-green-600 dark:text-green-400">Free</span>
        </div>
        <hr className="border-gray-200 dark:border-gray-700" />
        <div className="flex justify-between text-lg font-semibold">
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onCheckout}
          disabled={loading || totalItems === 0}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Proceed to Checkout
        </button>
        
        <button
          onClick={onClearCart}
          disabled={loading || totalItems === 0}
          className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};
export default CartSummary;