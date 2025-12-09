import { Box, Typography } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { CustomInput } from './CustomInput';
import { CustomSelect } from './CustomSelect';
import type { ReactNode } from 'react';

interface FormFieldProps extends Omit<BoxProps, 'onChange'> {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel';
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

/**
 * Reusable form input field component
 * Wraps CustomInput with consistent styling
 */
export const FormInputField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error = false,
  startAdornment,
  endAdornment,
  ...boxProps
}: FormFieldProps) => {
  return (
    <Box {...boxProps}>
      <CustomInput
        label={required ? `${label} *` : label}
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        error={String(error)}
        startAdornment={startAdornment}
        endAdornment={endAdornment}
      />
    </Box>
  );
};

interface FormSelectFieldProps extends Omit<BoxProps, 'onChange'> {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: Array<{ label: string; value: string | number }>;
  required?: boolean;
  error?: boolean;
}

/**
 * Reusable form select field component
 * Wraps CustomSelect with consistent styling
 */
export const FormSelectField = ({
  label,
  value,
  onChange,
  options,
  required = false,
  error = false,
  ...boxProps
}: FormSelectFieldProps) => {
  return (
    <Box {...boxProps}>
      <CustomSelect
        label={required ? `${label} *` : label}
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        options={options.map(opt => ({ ...opt, value: String(opt.value) }))}
        error={String(error)}
      />
    </Box>
  );
};

interface FormFieldGridProps extends Omit<BoxProps, 'children'> {
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  gap?: number;
  children: ReactNode;
}

/**
 * Reusable grid container for form fields
 * Handles responsive layout
 */
export const FormFieldGrid = ({
  columns = { xs: 1, sm: 2, md: 2, lg: 2 },
  gap = 2,
  children,
  ...boxProps
}: FormFieldGridProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: `repeat(${columns.xs || 1}, 1fr)`,
          sm: `repeat(${columns.sm || 2}, 1fr)`,
          md: `repeat(${columns.md || 2}, 1fr)`,
          lg: `repeat(${columns.lg || 2}, 1fr)`,
        },
        gap,
      }}
      {...boxProps}
    >
      {children}
    </Box>
  );
};

interface FormSectionProps extends Omit<BoxProps, 'children' | 'title'> {
  title: string;
  children: ReactNode;
}

/**
 * Reusable form section wrapper
 * Provides consistent styling for form sections
 */
export const FormSection = ({ title, children, ...boxProps }: FormSectionProps) => {
  return (
    <Box {...boxProps}>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, mb: 2, color: '#374151' }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {children}
      </Box>
    </Box>
  );
};
