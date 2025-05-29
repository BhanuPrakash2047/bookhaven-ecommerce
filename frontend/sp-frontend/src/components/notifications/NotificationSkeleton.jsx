import React from 'react';
import  {useTheme} from '../../context/ThemeContext';
// Custom hook for theme (mock implementation)

const NotificationSkeleton = ({ count = 3 }) => {
  const { isDark } = useTheme();

  const SkeletonItem = () => (
    <div className={`p-4 border-b animate-pulse ${
      isDark ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <div className="flex items-start gap-3 ml-4">
        {/* Icon Skeleton */}
        <div className={`w-8 h-8 rounded-lg ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`} />

        {/* Content Skeleton */}
        <div className="flex-1 space-y-2">
          {/* Title and Button */}
          <div className="flex items-start justify-between">
            <div className={`h-4 rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`} style={{ width: '60%' }} />
            <div className={`w-5 h-5 rounded-full ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
          </div>

          {/* Message */}
          <div className="space-y-1">
            <div className={`h-3 rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`} style={{ width: '90%' }} />
            <div className={`h-3 rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`} style={{ width: '70%' }} />
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 pt-1">
            <div className={`h-3 rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`} style={{ width: '50px' }} />
            <div className={`h-4 rounded-full ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`} style={{ width: '60px' }} />
            <div className={`h-3 rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`} style={{ width: '40px' }} />
          </div>
        </div>
      </div>

      {/* Unread Indicator */}
      <div className={`absolute left-2 top-6 w-2 h-2 rounded-full ${
        isDark ? 'bg-gray-700' : 'bg-gray-200'
      }`} />
    </div>
  );

  return (
    <div className="relative">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonItem key={index} />
      ))}
    </div>
  );
};

export default NotificationSkeleton;