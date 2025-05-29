import { useTheme } from "../../context/ThemeContext";

// Skeleton Loader Component
const SkeletonCard = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`flex-shrink-0 w-48 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-4 animate-pulse`}>
      <div className={`h-32 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg mb-3`}></div>
      <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
      <div className={`h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4`}></div>
    </div>
  );
};

export default SkeletonCard