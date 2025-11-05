// components/CustomInput.tsx
import { TextField, InputAdornment } from "@mui/material";
import React from "react";

interface CustomInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  fullWidth?: boolean;
  placeholder?: string;
  size?: "small" | "medium";
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
  size = "small",
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
      sx={{ fontSize: 12 }}
      placeholder={placeholder}
      variant="outlined"
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
