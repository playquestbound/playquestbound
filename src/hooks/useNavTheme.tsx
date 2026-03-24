import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type NavTheme = 'classic' | 'blue' | 'orange' | 'green' | 'red';
export type DesignStyle = 'sleek' | 'modern';

interface NavThemeConfig {
  name: string;
  bgColor: string;
  iconColor: string;
  activeIconColor: string;
  activeBgColor: string;
  glowColor: string;
  borderColor: string;
  // Global CSS variables (HSL values without hsl())
  cssVars: {
    primary: string;
    secondary: string;
    accent: string;
    ring: string;
    cardBorder: string;
  };
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
    cssVars: {
      primary: '0 0% 100%',
      secondary: '0 0% 85%',
      accent: '0 0% 70%',
      ring: '0 0% 60%',
      cardBorder: '0 0% 30%',
    },
  },
  blue: {
    name: 'Dekker',
    bgColor: 'rgba(10, 30, 50, 0.9)',
    iconColor: 'rgba(100, 200, 255, 0.7)',
    activeIconColor: '#000000',
    activeBgColor: '#60d0ff',
    glowColor: 'rgba(96, 208, 255, 0.4)',
    borderColor: 'rgba(96, 208, 255, 0.3)',
    cssVars: {
      primary: '195 100% 70%',
      secondary: '195 90% 60%',
      accent: '195 80% 50%',
      ring: '195 100% 65%',
      cardBorder: '195 60% 30%',
    },
  },
  orange: {
    name: 'Howitzer',
    bgColor: 'rgba(40, 25, 10, 0.9)',
    iconColor: 'rgba(255, 180, 80, 0.7)',
    activeIconColor: '#000000',
    activeBgColor: '#ffaa40',
    glowColor: 'rgba(255, 170, 64, 0.4)',
    borderColor: 'rgba(255, 170, 64, 0.3)',
    cssVars: {
      primary: '35 100% 65%',
      secondary: '35 90% 55%',
      accent: '35 80% 45%',
      ring: '35 100% 60%',
      cardBorder: '35 60% 30%',
    },
  },
  green: {
    name: 'The Fey',
    bgColor: 'rgba(15, 35, 15, 0.9)',
    iconColor: 'rgba(150, 255, 100, 0.7)',
    activeIconColor: '#000000',
    activeBgColor: '#90ff50',
    glowColor: 'rgba(144, 255, 80, 0.4)',
    borderColor: 'rgba(144, 255, 80, 0.3)',
    cssVars: {
      primary: '100 100% 70%',
      secondary: '100 90% 55%',
      accent: '100 70% 40%',
      ring: '100 100% 60%',
      cardBorder: '100 50% 25%',
    },
  },
  red: {
    name: 'Revenant',
    bgColor: 'rgba(40, 10, 10, 0.9)',
    iconColor: 'rgba(255, 100, 100, 0.7)',
    activeIconColor: '#000000',
    activeBgColor: '#ff5050',
    glowColor: 'rgba(255, 80, 80, 0.4)',
    borderColor: 'rgba(255, 80, 80, 0.3)',
    cssVars: {
      primary: '0 100% 65%',
      secondary: '0 85% 55%',
      accent: '0 70% 45%',
      ring: '0 100% 60%',
      cardBorder: '0 50% 30%',
    },
  },
};

export const designStyles: Record<DesignStyle, { name: string; description: string }> = {
  sleek: {
    name: 'Sleek',
    description: 'Modern dark minimal design',
  },
  modern: {
    name: 'Modern',
    description: 'Clean light minimal aesthetic',
  },
};

interface NavThemeContextType {
  theme: NavTheme;
  setTheme: (theme: NavTheme) => void;
  config: NavThemeConfig;
  designStyle: DesignStyle;
  setDesignStyle: (style: DesignStyle) => void;
}

const NavThemeContext = createContext<NavThemeContextType | undefined>(undefined);

export function NavThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<NavTheme>(() => {
    const saved = localStorage.getItem('navTheme');
    return (saved as NavTheme) || 'classic';
  });

  const [designStyle, setDesignStyleState] = useState<DesignStyle>(() => {
    const saved = localStorage.getItem('designStyle');
    return (saved as DesignStyle) || 'sleek';
  });

  const setTheme = (newTheme: NavTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('navTheme', newTheme);
  };

  const setDesignStyle = (newStyle: DesignStyle) => {
    setDesignStyleState(newStyle);
    localStorage.setItem('designStyle', newStyle);
  };

  const config = navThemes[theme];

  // Apply CSS variables globally when theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', config.cssVars.primary);
    root.style.setProperty('--secondary', config.cssVars.secondary);
    root.style.setProperty('--accent', config.cssVars.accent);
    root.style.setProperty('--ring', config.cssVars.ring);
    root.style.setProperty('--border', config.cssVars.cardBorder);
  }, [config]);

  // Apply design style class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('design-sleek', 'design-modern');
    root.classList.add(`design-${designStyle}`);
  }, [designStyle]);

  return (
    <NavThemeContext.Provider value={{ theme, setTheme, config, designStyle, setDesignStyle }}>
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
