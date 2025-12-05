import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (e: SelectChangeEvent<string>) => void;
  options: Option[];
  error?: string;
  fullWidth?: boolean;
}

export const CustomSelect = ({
  label,
  value,
  onChange,
  options,
  error,
  fullWidth = true,
}: CustomSelectProps) => {
  return (
    <FormControl fullWidth={fullWidth} error={!!error} size="small">
      <InputLabel size="medium">{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={onChange}
        size="medium"
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};