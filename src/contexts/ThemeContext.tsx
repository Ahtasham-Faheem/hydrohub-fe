import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  // Background colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    modal: string;
  };
  
  // Text colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    primaryBlue: string;
  };
  
  // Border colors
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };
  
  // Status colors (same for both themes)
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  // Primary brand colors
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Shadow colors
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

const lightTheme: ThemeColors = {
  background: {
    primary: '#f4f5fa',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    card: '#ffffff',
    modal: '#ffffff',
  },
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
    primaryBlue: '#2092EC',
  },
  border: {
    primary: '#e5e7eb',
    secondary: '#d1d5db',
    focus: '#3b82f6',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2092EC',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

const darkTheme: ThemeColors = {
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
    card: '#1e293b',
    modal: '#0f172a',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    inverse: '#0f172a',
    primaryBlue: '#2092EC',
  },
  border: {
    primary: '#334155',
    secondary: '#475569',
    focus: '#60a5fa',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  primary: {
    50: '#1e3a8a',
    100: '#1e40af',
    200: '#1d4ed8',
    300: '#2092EC',
    400: '#3b82f6',
    500: '#60a5fa',
    600: '#93c5fd',
    700: '#bfdbfe',
    800: '#dbeafe',
    900: '#eff6ff',
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
  },
};

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Get saved theme from localStorage or default to light
    const savedTheme = localStorage.getItem('app-theme') as ThemeMode;
    return savedTheme || 'light';
  });

  const colors = mode === 'light' ? lightTheme : darkTheme;

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('app-theme', mode);
    
    // Apply theme to document root for global CSS variables
    const root = document.documentElement;
    
    // Set CSS custom properties for easy access in regular CSS
    root.style.setProperty('--bg-primary', colors.background.primary);
    root.style.setProperty('--bg-secondary', colors.background.secondary);
    root.style.setProperty('--bg-tertiary', colors.background.tertiary);
    root.style.setProperty('--bg-card', colors.background.card);
    root.style.setProperty('--bg-modal', colors.background.modal);
    
    root.style.setProperty('--text-primary', colors.text.primary);
    root.style.setProperty('--text-secondary', colors.text.secondary);
    root.style.setProperty('--text-tertiary', colors.text.tertiary);
    root.style.setProperty('--text-inverse', colors.text.inverse);
    
    root.style.setProperty('--border-primary', colors.border.primary);
    root.style.setProperty('--border-secondary', colors.border.secondary);
    root.style.setProperty('--border-focus', colors.border.focus);
    
    root.style.setProperty('--shadow-sm', colors.shadow.sm);
    root.style.setProperty('--shadow-md', colors.shadow.md);
    root.style.setProperty('--shadow-lg', colors.shadow.lg);
    root.style.setProperty('--shadow-xl', colors.shadow.xl);
    
    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', mode);
  }, [mode, colors]);

  const value: ThemeContextType = {
    mode,
    colors,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Utility function to get theme-aware styles
export const getThemeStyles = (colors: ThemeColors) => ({
  // Common style patterns
  card: {
    backgroundColor: colors.background.card,
    borderColor: colors.border.primary,
    boxShadow: colors.shadow.sm,
    color: colors.text.primary,
  },
  
  cardHover: {
    backgroundColor: colors.background.card,
    borderColor: colors.border.primary,
    boxShadow: colors.shadow.md,
    color: colors.text.primary,
  },
  
  input: {
    backgroundColor: colors.background.primary,
    borderColor: colors.border.primary,
    color: colors.text.primary,
    '&:focus': {
      borderColor: colors.border.focus,
      boxShadow: `0 0 0 3px ${colors.primary[200]}`,
    },
  },
  
  button: {
    primary: {
      backgroundColor: colors.primary[600],
      color: colors.text.inverse,
      '&:hover': {
        backgroundColor: colors.primary[700],
      },
    },
    secondary: {
      backgroundColor: colors.background.secondary,
      color: colors.text.primary,
      borderColor: colors.border.primary,
      '&:hover': {
        backgroundColor: colors.background.tertiary,
      },
    },
  },
});