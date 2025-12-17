import React from "react";
import { TextField, InputAdornment, Box } from "@mui/material";
import { Phone } from "@mui/icons-material";
import { formatPhoneNumber } from "../../utils/validationSchemas";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTheme } from '../../contexts/ThemeContext';

interface PhoneInputProps {
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

export const PhoneInput = ({
  label,
  value,
  onChange,
  onClearError,
  error,
  fullWidth = true,
  placeholder = "3XXXXXXXXX",
  size = "medium",
  disabled = false,
  required = false,
  sx,
}: PhoneInputProps) => {
  const { colors } = useTheme();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    
    // Clear error when user starts typing
    if (onClearError && error) {
      onClearError();
    }
    
    // Store with +92 prefix, but make sure we don't double-add it
    let fullPhone = formatted;
    if (!fullPhone.startsWith('+92') && fullPhone.length > 0) {
      fullPhone = `+92${formatted}`;
    }
    
    onChange(fullPhone);
  };

  // Extract the phone number without country code for display
  const displayValue = value && value.startsWith('+92') ? value.substring(3) : value;

  return (
    <TextField
      label={label}
      type="tel"
      size={size}
      value={displayValue}
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
        maxLength: 11, // Allow up to 11 digits for 03XXXXXXXXX format
        pattern: "[0-9]*",
        inputMode: "numeric",
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <select
                value="+92"
                disabled={disabled}
                style={{ 
                  outline: 'none',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: colors.text.secondary,
                  fontSize: '14px',
                  cursor: disabled ? 'default' : 'pointer',
                  paddingRight: '8px',
                  opacity: disabled ? 0.5 : 1
                }}
              >
                <option value="+92" style={{ backgroundColor: colors.background.card, color: colors.text.primary }}>
                  PK +92
                </option>
              </select>
              <span 
                style={{ 
                  marginLeft: '8px', 
                  color: colors.border.primary, 
                  borderRight: `1px solid ${colors.border.primary}`, 
                  height: '24px' 
                }}
              ></span>
            </Box>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <Phone sx={{ color: colors.text.secondary, fontSize: 22 }} />
          </InputAdornment>
        ),
      }}
    />
  );
};