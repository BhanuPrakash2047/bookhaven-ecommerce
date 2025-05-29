const BookSkeleton = ({ isDark = false }) => {
  return (
    <div className={`${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-xl overflow-hidden shadow-lg animate-pulse`}>
      {/* Image Skeleton */}
      <div className={`aspect-[3/4] ${
        isDark ? 'bg-gray-700' : 'bg-gray-200'
      }`}></div>
      
      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title */}
        <div className={`h-4 ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        } rounded mb-2`}></div>
        <div className={`h-3 ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        } rounded w-3/4 mb-2`}></div>
        
        {/* Author */}
        <div className={`h-3 ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        } rounded w-1/2 mb-2`}></div>
        
        {/* Genre */}
        <div className={`h-6 ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        } rounded-full w-16 mb-2`}></div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-3 h-3 ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            } rounded`}></div>
          ))}
          <div className={`h-3 ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          } rounded w-8 ml-1`}></div>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <div className={`h-4 ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          } rounded w-12`}></div>
          <div className={`h-3 ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          } rounded w-16`}></div>
        </div>
        
        {/* Quick Info */}
        <div className={`mt-2 pt-2 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex justify-between">
            <div className={`h-3 ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            } rounded w-12`}></div>
            <div className={`h-3 ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            } rounded w-8`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSkeleton;