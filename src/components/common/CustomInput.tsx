// components/CustomInput.tsx
import { TextField, InputAdornment } from "@mui/material";
import React from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTheme } from '../../contexts/ThemeContext';

interface CustomInputProps {
  label: string;
  type?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClearError?: () => void;
  error?: string;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  fullWidth?: boolean;
  placeholder?: string;
  size?: "small" | "medium";
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  sx?: SxProps<Theme>;
}

export const CustomInput = ({
  label,
  type = "text",
  value,
  onChange,
  onClearError,
  error,
  endAdornment,
  startAdornment,
  fullWidth = true,
  placeholder,
  size = "medium",
  disabled = false,
  multiline = false,
  rows = 1,
  required,
  sx,
}: CustomInputProps) => {
  const { colors } = useTheme();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Clear error when user starts typing
    if (onClearError && error) {
      onClearError();
    }
    
    if (onChange) {
      onChange(e);
    }
  };
  return (
    <TextField
      label={label}
      type={type}
      size={size}
      value={value}
      onChange={handleChange}
      fullWidth={fullWidth}
      error={!!error}
      helperText={error}
      sx={{ 
        fontSize: 12,
        // backgroundColor: colors.background.primary,
        '& .MuiInputLabel-root': {
          color: colors.text.primary,
          '&.Mui-focused': { color: colors.primary[500] }
        },
        '& .MuiOutlinedInput-root': {
          backgroundColor: colors.background.primary,
          color: colors.text.primary,
          '& fieldset': {
            borderColor: colors.border.primary,
          },
          '&:hover fieldset': {
            borderColor: colors.border.secondary,
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.primary[500],
          },
        },
        '& .MuiFormHelperText-root': {
          color: error ? colors.status.error : colors.text.secondary,
        },
        ...sx 
      }}
      placeholder={placeholder}
      variant="outlined"
      disabled={disabled}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      required={required}
      InputProps={{
        startAdornment: startAdornment ? (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ) : undefined,
        endAdornment: endAdornment ? (
          <InputAdornment position="end">{endAdornment}</InputAdornment>
        ) : undefined,
      }}
    />
  );
};
