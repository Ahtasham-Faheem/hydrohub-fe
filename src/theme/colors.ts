export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2092ec',
      700: '#1d4ed8',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
    },
    success: {
      500: '#10b981',
      600: '#059669',
      700: '#047857',
    },
    danger: {
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    warning: {
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    text600: '#4b5563',
    text300: '#9ca3af',
    bgColor: '#EAF2FB',
  }
};

export type ThemeColors = typeof theme.colors;