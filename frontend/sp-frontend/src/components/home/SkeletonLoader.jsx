export const CategorySkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
    </div>
  </div>
);

export const GenreSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
);
