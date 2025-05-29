const CartSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="w-16 h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

export default CartSkeleton;