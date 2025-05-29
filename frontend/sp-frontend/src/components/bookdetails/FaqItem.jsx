/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
const FAQItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left py-3 focus:outline-none"
      >
        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {faq.question}
        </span>
        <div className={`transform transition-transform ${isOpen ? 'rotate-45' : ''}`}>
          <Plus className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
      </button>
      {isOpen && (
        <div className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {faq.answer}
        </div>
      )}
    </div>
  );
};
export default FAQItem;
