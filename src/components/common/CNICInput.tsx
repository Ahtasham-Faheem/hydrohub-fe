import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Badge } from "@mui/icons-material";
import { formatCNIC } from "../../utils/validationSchemas";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTheme } from '../../contexts/ThemeContext';

interface CNICInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onClearError?: () => void;
  error?: string;
  fullWidth?: boolean;
  placeholder?: string;
  size?: "small" | "medium";
  disabled?: boolean;
  required?: boolean;
  sx?: SxProps<Theme>;
}

export const CNICInput = ({
  label,
  value,
  onChange,
  onClearError,
  error,
  fullWidth = true,
  placeholder = "12345-1234567-1",
  size = "medium",
  disabled = false,
  required = false,
  sx,
}: CNICInputProps) => {
  const { colors } = useTheme();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNIC(e.target.value);
    
    // Clear error when user starts typing
    if (onClearError && error) {
      onClearError();
    }
    
    onChange(formatted);
  };

  return (
    <TextField
      label={label}
      type="text"
      size={size}
      value={value}
      onChange={handleChange}
      fullWidth={fullWidth}
      error={!!error}
      helperText={error}
      sx={{ 
        fontSize: 12,
        '& .MuiInputLabel-root': {
          color: colors.text.secondary,
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
      required={required}
      inputProps={{
        maxLength: 15, // 13 digits + 2 dashes
        pattern: "[0-9-]*",
        inputMode: "numeric",
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Badge sx={{ color: colors.text.secondary, fontSize: 22 }} />
          </InputAdornment>
        ),
      }}
    />
  );
};