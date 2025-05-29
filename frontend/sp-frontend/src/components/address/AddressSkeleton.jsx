
const AddressSkeleton = ({ isDark }) => (
  <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
    <div className="animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 flex-1">
          <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded w-3/4`}></div>
          <div className={`h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/2`}></div>
        </div>
        <div className={`h-6 w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className={`h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded w-full`}></div>
        <div className={`h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded w-2/3`}></div>
      </div>
      <div className="flex space-x-2">
        <div className={`h-8 w-16 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
        <div className={`h-8 w-16 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
        <div className={`h-8 w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
      </div>
    </div>
  </div>
);

export default AddressSkeleton;