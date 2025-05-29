import {useTheme} from '../../context/ThemeContext';
const OrdersSkeleton = () => {
  const { isDark } = useTheme();
  
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div 
          key={index}
          className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} animate-pulse`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            </div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-28"></div>
          </div>
          <div className="flex space-x-3">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default OrdersSkeleton;
