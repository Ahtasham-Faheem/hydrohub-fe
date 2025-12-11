// components/CustomInput.tsx
import { TextField, InputAdornment } from "@mui/material";
import React from "react";
import type { SxProps, Theme } from "@mui/material/styles";

interface CustomInputProps {
  label: string;
  type?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  return (
    <TextField
      label={label}
      type={type}
      size={size}
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      error={!!error}
      helperText={error}
      sx={{ fontSize: 12, ...sx }}
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
