// Loading Skeleton C
// omponents
const OrderCardSkeleton = ({ isDark }) => (
  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2">
        <div className={`h-4 w-32 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
        <div className={`h-3 w-24 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
      </div>
      <div className={`h-6 w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full animate-pulse`}></div>
    </div>
    <div className="space-y-3">
      <div className={`h-3 w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
      <div className={`h-3 w-3/4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
    </div>
    <div className="flex justify-between items-center mt-4">
      <div className={`h-4 w-16 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
      <div className={`h-8 w-24 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
    </div>
  </div>
);
export default OrderCardSkeleton;