import { useTheme } from "../../context/ThemeContext";
// Section Header Component
const SectionHeader = ({ title, description }) => {
  const { isDark } = useTheme();
  
  return (
    <div className="mb-6">
      <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
    </div>
  );
};

export default SectionHeader;