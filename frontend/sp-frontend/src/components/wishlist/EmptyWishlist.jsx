import {Heart,BookOpen} from 'lucide-react';


const EmptyWishlist = () => (
  <div className="text-center py-16">
    <div className="mb-4">
      <Heart size={64} className="mx-auto text-gray-300 dark:text-slate-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      Your wishlist is empty
    </h3>
    <p className="text-gray-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
      Start adding books you love to your wishlist. You can save items for later and keep track of your favorites.
    </p>
    <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto">
      <BookOpen size={20} />
      Browse Books
    </button>
  </div>
);

export default EmptyWishlist;