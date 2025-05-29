
// Skeleton Components
const BookCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-3/4"></div>
    <div className="flex justify-between">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
      <div className="flex space-x-2">
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  </div>
);

export default BookCardSkeleton;