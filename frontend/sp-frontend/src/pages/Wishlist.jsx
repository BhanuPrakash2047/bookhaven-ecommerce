import React from 'react';
import { Calendar, User } from 'lucide-react';
// import { i } from 'framer-motion/client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserWishlist } from '../store/middleware/wishlistMiddleware';
import WishlistItem from '../components/wishlist/WishlistItem';
import {WishlistGridSkeleton} from '../components/wishlist/Skeleton';
import EmptyWishlist from '../components/wishlist/EmptyWishlist';
import { Search, Grid, List, Heart } from 'lucide-react';



const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, totalItems, loading, error } = useSelector(state => state.wishlist);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchUserWishlist());
  }, [dispatch]);

  const filteredItems = items?.filter(item =>
    item.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
          </div>
          <WishlistGridSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <Heart size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              {error}
            </p>
            <button
              onClick={() => dispatch(fetchUserWishlist())}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            {totalItems === 0 ? 'No items' : `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`} in your wishlist
          </p>
        </div>

        {totalItems === 0 ? (
          <EmptyWishlist />
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search your wishlist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-300 dark:border-slate-600'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-300 dark:border-slate-600'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Items */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <Search size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-slate-400">
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {filteredItems.map((item) => (
                  <WishlistItem key={item.id} item={item} viewMode={viewMode} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};


export default Wishlist;