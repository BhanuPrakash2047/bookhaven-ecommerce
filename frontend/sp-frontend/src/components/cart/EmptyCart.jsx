import { Calendar, User } from 'lucide-react';  
import { ShoppingCart } from 'lucide-react';


const EmptyCart = () => (
  <div className="text-center py-12">
    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      Your cart is empty
    </h2>
    <p className="text-gray-600 dark:text-gray-400 mb-6">
      Discover thousands of books and add them to your cart
    </p>
    <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
      Explore Books
    </button>
  </div>
);
export default EmptyCart;