// components/CustomInput.tsx
import { TextField, InputAdornment, IconButton } from "@mui/material";
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
}: CustomInputProps) => {
  return (
    <TextField
      label={label}
      type={type}
      size="small"
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      error={!!error}
      helperText={error}
      sx={{ fontSize: 12 }}
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
