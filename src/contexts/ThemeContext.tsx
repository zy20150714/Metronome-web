import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Theme, themes, getThemeById } from '../themes';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<string>('tech');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved && themes.some(t => t.id === saved)) {
      setThemeId(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', themeId);
  }, [themeId]);

  const setTheme = useCallback((id: string) => {
    if (themes.some(t => t.id === id)) {
      setThemeId(id);
    }
  }, []);

  const theme = getThemeById(themeId);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      <div 
        className="min-h-screen"
        style={{ 
          backgroundColor: theme.background,
          color: theme.text
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
