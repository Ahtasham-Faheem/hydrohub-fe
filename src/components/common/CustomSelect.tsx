import { FormControl, InputLabel, MenuItem, Select, FormHelperText } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useTheme } from '../../contexts/ThemeContext';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (e: SelectChangeEvent<string>) => void;
  onClearError?: () => void;
  options: Option[];
  error?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
}

export const CustomSelect = ({
  label,
  value,
  onChange,
  onClearError,
  options,
  error,
  fullWidth = true,
  size = 'medium' as const
}: CustomSelectProps) => {
  const { colors } = useTheme();
  
  const handleChange = (e: SelectChangeEvent<string>) => {
    if (onClearError && error) {
      onClearError();
    }
    
    onChange(e);
  };
  return (
    <FormControl fullWidth={fullWidth} error={!!error} size="small">
      <InputLabel 
        size="medium"
        sx={{ 
          color: colors.text.secondary,
          '&.Mui-focused': { color: colors.primary[500] }
        }}
      >
        {label}
      </InputLabel>
      <Select
        label={label}
        value={value}
        onChange={handleChange}
        size={size}
        sx={{
          backgroundColor: colors.background.primary,
          color: colors.text.primary,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.primary,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.secondary,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary[500],
          },
          '& .MuiSvgIcon-root': {
            color: colors.text.secondary,
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              '& .MuiMenuItem-root': {
                color: colors.text.primary,
                '&:hover': {
                  backgroundColor: colors.background.tertiary,
                },
                '&.Mui-selected': {
                  backgroundColor: colors.primary[100],
                  '&:hover': {
                    backgroundColor: colors.primary[200],
                  },
                },
              },
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && (
        <FormHelperText sx={{ color: colors.status.error }}>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
};