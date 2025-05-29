const WishlistItemSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 animate-pulse">
    <div className="flex gap-4">
      <div className="w-20 h-28 bg-gray-200 dark:bg-slate-700 rounded"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-8"></div>
        </div>
      </div>
    </div>
  </div>
);

const WishlistGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array(6).fill(0).map((_, i) => (
      <WishlistItemSkeleton key={i} />
    ))}
  </div>
);

export { WishlistItemSkeleton, WishlistGridSkeleton };