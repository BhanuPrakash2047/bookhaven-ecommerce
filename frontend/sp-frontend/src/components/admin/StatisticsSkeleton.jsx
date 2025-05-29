import { useTheme } from '../../context/ThemeContext';


const StatisticsSkeleton = () => {
  const { isDark } = useTheme();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {[...Array(5)].map((_, index) => (
        <div 
          key={index}
          className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} animate-pulse`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
            </div>
            <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default StatisticsSkeleton;
