/* eslint-disable no-unused-vars */
import {useTheme} from '../../context/ThemeContext';


const StatisticsCard = ({ title, count, icon: Icon, color, onClick, isActive }) => {
  const { isDark } = useTheme();
  
  return (
    <div 
      className={`p-6 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-105 ${
        isActive 
          ? 'ring-2 ring-orange-500 shadow-lg' 
          : ''
      } ${
        isDark 
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {count || 0}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
