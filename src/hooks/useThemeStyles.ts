import { useTheme } from '../contexts/ThemeContext';

/**
 * Custom hook that provides commonly used theme-aware styles
 * Makes it easy to apply consistent theming across components
 */
export const useThemeStyles = () => {
  const { colors, mode } = useTheme();

  return {
    // Background styles
    backgrounds: {
      primary: { backgroundColor: colors.background.primary },
      secondary: { backgroundColor: colors.background.secondary },
      tertiary: { backgroundColor: colors.background.tertiary },
      card: { backgroundColor: colors.background.card },
      modal: { backgroundColor: colors.background.modal },
    },

    // Text styles
    text: {
      primary: { color: colors.text.primary },
      secondary: { color: colors.text.secondary },
      tertiary: { color: colors.text.tertiary },
      inverse: { color: colors.text.inverse },
    },

    // Border styles
    borders: {
      primary: { borderColor: colors.border.primary },
      secondary: { borderColor: colors.border.secondary },
      focus: { borderColor: colors.border.focus },
    },

    // Common component styles
    card: {
      backgroundColor: colors.background.card,
      borderColor: colors.border.primary,
      boxShadow: colors.shadow.sm,
      color: colors.text.primary,
      border: `1px solid ${colors.border.primary}`,
    },

    cardHover: {
      backgroundColor: colors.background.card,
      borderColor: colors.border.primary,
      boxShadow: colors.shadow.md,
      color: colors.text.primary,
      border: `1px solid ${colors.border.primary}`,
    },

    input: {
      backgroundColor: colors.background.primary,
      borderColor: colors.border.primary,
      color: colors.text.primary,
      border: `1px solid ${colors.border.primary}`,
      '&:focus': {
        borderColor: colors.border.focus,
        boxShadow: `0 0 0 3px ${colors.primary[200]}`,
      },
      '&::placeholder': {
        color: colors.text.tertiary,
      },
    },

    button: {
      primary: {
        backgroundColor: colors.primary[600],
        color: colors.text.inverse,
        border: 'none',
        '&:hover': {
          backgroundColor: colors.primary[700],
        },
        '&:focus': {
          boxShadow: `0 0 0 3px ${colors.primary[200]}`,
        },
      },
      secondary: {
        backgroundColor: colors.background.secondary,
        color: colors.text.primary,
        border: `1px solid ${colors.border.primary}`,
        '&:hover': {
          backgroundColor: colors.background.tertiary,
        },
        '&:focus': {
          boxShadow: `0 0 0 3px ${colors.primary[200]}`,
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.text.secondary,
        border: 'none',
        '&:hover': {
          backgroundColor: colors.background.tertiary,
          color: colors.text.primary,
        },
      },
    },

    // Status styles
    status: {
      success: { color: colors.status.success },
      warning: { color: colors.status.warning },
      error: { color: colors.status.error },
      info: { color: colors.status.info },
    },

    // Shadow utilities
    shadows: {
      sm: { boxShadow: colors.shadow.sm },
      md: { boxShadow: colors.shadow.md },
      lg: { boxShadow: colors.shadow.lg },
      xl: { boxShadow: colors.shadow.xl },
    },

    // Utility functions
    isDark: mode === 'dark',
    isLight: mode === 'light',
    
    // Get CSS custom property name for use in regular CSS
    getCSSVar: (property: string) => `var(--${property})`,
  };
};

/**
 * Utility function to create theme-aware inline styles
 * Usage: const styles = createThemeStyles(colors)
 */
export const createThemeStyles = (colors: any) => ({
  card: {
    backgroundColor: colors.background.card,
    borderColor: colors.border.primary,
    boxShadow: colors.shadow.sm,
    color: colors.text.primary,
  },
  
  input: {
    backgroundColor: colors.background.primary,
    borderColor: colors.border.primary,
    color: colors.text.primary,
  },
  
  button: {
    backgroundColor: colors.primary[600],
    color: colors.text.inverse,
  },
});