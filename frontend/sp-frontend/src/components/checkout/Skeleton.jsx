
// Skeleton Components
const AddressSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-1"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
  </div>
);

const CartItemSkeleton = () => (
  <div className="animate-pulse flex items-center space-x-4 p-4">
    <div className="w-16 h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
    </div>
    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
  </div>
);

export { AddressSkeleton, CartItemSkeleton };