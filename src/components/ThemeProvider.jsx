import { useState } from 'react';
import { ThemeContext } from './context/theme';


export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Le thème par défaut est 'light'

  const toggleTheme = () => {
    setTheme((prevTheme) => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
