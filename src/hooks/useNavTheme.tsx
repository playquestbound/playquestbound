import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type NavTheme = 'classic' | 'blue' | 'orange' | 'green' | 'red';

interface NavThemeConfig {
  name: string;
  bgColor: string;
  iconColor: string;
  activeIconColor: string;
  activeBgColor: string;
  glowColor: string;
  borderColor: string;
}

export const navThemes: Record<NavTheme, NavThemeConfig> = {
  classic: {
    name: 'Classic',
    bgColor: 'rgba(0, 0, 0, 0.85)',
    iconColor: 'rgba(255, 255, 255, 0.7)',
    activeIconColor: '#000000',
    activeBgColor: '#ffffff',
    glowColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  blue: {
    name: 'Dekker',
    bgColor: 'rgba(10, 30, 50, 0.9)',
    iconColor: 'rgba(100, 200, 255, 0.7)',
    activeIconColor: '#000000',
    activeBgColor: '#60d0ff',
    glowColor: 'rgba(96, 208, 255, 0.4)',
    borderColor: 'rgba(96, 208, 255, 0.3)',
  },
  orange: {
    name: 'Howitzer',
    bgColor: 'rgba(40, 25, 10, 0.9)',
    iconColor: 'rgba(255, 180, 80, 0.7)',
    activeIconColor: '#000000',
    activeBgColor: '#ffaa40',
    glowColor: 'rgba(255, 170, 64, 0.4)',
    borderColor: 'rgba(255, 170, 64, 0.3)',
  },
  green: {
    name: 'The Fey',
    bgColor: 'rgba(15, 35, 15, 0.9)',
    iconColor: 'rgba(150, 255, 100, 0.7)',
    activeIconColor: '#000000',
    activeBgColor: '#90ff50',
    glowColor: 'rgba(144, 255, 80, 0.4)',
    borderColor: 'rgba(144, 255, 80, 0.3)',
  },
  red: {
    name: 'Revenant',
    bgColor: 'rgba(40, 10, 10, 0.9)',
    iconColor: 'rgba(255, 100, 100, 0.7)',
    activeIconColor: '#000000',
    activeBgColor: '#ff5050',
    glowColor: 'rgba(255, 80, 80, 0.4)',
    borderColor: 'rgba(255, 80, 80, 0.3)',
  },
};

interface NavThemeContextType {
  theme: NavTheme;
  setTheme: (theme: NavTheme) => void;
  config: NavThemeConfig;
}

const NavThemeContext = createContext<NavThemeContextType | undefined>(undefined);

export function NavThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<NavTheme>(() => {
    const saved = localStorage.getItem('navTheme');
    return (saved as NavTheme) || 'classic';
  });

  const setTheme = (newTheme: NavTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('navTheme', newTheme);
  };

  const config = navThemes[theme];

  return (
    <NavThemeContext.Provider value={{ theme, setTheme, config }}>
      {children}
    </NavThemeContext.Provider>
  );
}

export function useNavTheme() {
  const context = useContext(NavThemeContext);
  if (!context) {
    throw new Error('useNavTheme must be used within NavThemeProvider');
  }
  return context;
}
