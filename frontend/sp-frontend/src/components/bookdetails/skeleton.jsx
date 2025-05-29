
// Skeleton Components
const BookDetailsSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

const FAQSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    ))}
  </div>
);

const ReviewsSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    ))}
  </div>
);

export { BookDetailsSkeleton, FAQSkeleton, ReviewsSkeleton };