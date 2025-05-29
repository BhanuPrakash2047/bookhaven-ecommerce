/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  
  
  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');

    } else {
      root.classList.remove('dark');
    }
    console.log("From local stroeage"+localStorage.getItem('darkMode'));
    
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export { ThemeProvider}