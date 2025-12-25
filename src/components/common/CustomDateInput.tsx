import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Box } from "@mui/material";
import { Dayjs } from "dayjs";
import { useTheme } from "../../contexts/ThemeContext";

interface CustomDateInputProps {
  label: string;
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  error?: string;
  fullWidth?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

export const CustomDateInput = ({
  label,
  value,
  onChange,
  error,
  fullWidth = true,
  minDate,
  maxDate,
}: CustomDateInputProps) => {
  const { colors } = useTheme();

  return (
    <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          slotProps={{
            textField: {
              size: "medium",
              fullWidth: true,
              error: !!error,
              helperText: error,
              sx: {
                backgroundColor: colors.background.primary,
                color: colors.text.primary,
                '& .MuiPickersInputBase-sectionsContainer ': {
                  color: colors.text.primary,
                },
                '& .MuiOutlinedInput-root': {
                  color: colors.text.primary,
                  backgroundColor: colors.background.primary,
                  '& fieldset': {
                    borderColor: colors.border.primary,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.border.secondary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary[600],
                  },
                  '&.Mui-error fieldset': {
                    borderColor: colors.status.error,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: colors.text.secondary,
                  '&.Mui-focused': {
                    color: colors.primary[600],
                  },
                  '&.Mui-error': {
                    color: colors.status.error,
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: colors.status.error,
                  backgroundColor: colors.background.card,
                  width: '100%',
                  margin: 0,
                  marginLeft: "0px !important",
                },
                '& .MuiInputBase-input': {
                  color: colors.text.primary,
                  '&::placeholder': {
                    color: colors.text.tertiary,
                    opacity: 1,
                  },
                },
                '& .MuiSvgIcon-root': {
                  color: colors.text.secondary,
                },
                '& .MuiInputAdornment-root': {
                  color: colors.text.secondary,
                },
              },
            },
            popper: {
              sx: {
                '& .MuiPaper-root': {
                  backgroundColor: colors.background.card,
                  color: colors.text.primary,
                  border: `1px solid ${colors.border.primary}`,
                  boxShadow: colors.shadow.lg,
                },
                '& .MuiPickersCalendarHeader-root': {
                  backgroundColor: colors.background.secondary,
                  color: colors.text.primary,
                },
                '& .MuiPickersCalendarHeader-label': {
                  color: colors.text.primary,
                  fontWeight: 600,
                },
                '& .MuiPickersArrowSwitcher-button': {
                  color: colors.text.secondary,
                  '&:hover': {
                    backgroundColor: colors.background.tertiary,
                    color: colors.text.primary,
                  },
                },
                '& .MuiDayCalendar-weekDayLabel': {
                  color: colors.text.secondary,
                  fontWeight: 500,
                },
                '& .MuiPickersDay-root': {
                  color: colors.text.primary,
                  '&:hover': {
                    backgroundColor: colors.primary[100],
                    color: colors.text.primary,
                  },
                  '&.Mui-selected': {
                    backgroundColor: colors.primary[600],
                    color: colors.text.inverse,
                    '&:hover': {
                      backgroundColor: colors.primary[700],
                    },
                  },
                  '&.MuiPickersDay-today': {
                    borderColor: colors.primary[600],
                    color: colors.text.primary,
                  },
                  '&.Mui-disabled': {
                    color: colors.text.tertiary,
                  },
                },
                '& .MuiPickersYear-yearButton': {
                  color: colors.text.primary,
                  '&:hover': {
                    backgroundColor: colors.background.tertiary,
                  },
                  '&.Mui-selected': {
                    backgroundColor: colors.primary[600],
                    color: colors.text.inverse,
                  },
                  '&.Mui-disabled': {
                    color: colors.text.tertiary,
                  },
                },
                '& .MuiPickersMonth-monthButton': {
                  color: colors.text.primary,
                  '&:hover': {
                    backgroundColor: colors.background.tertiary,
                  },
                  '&.Mui-selected': {
                    backgroundColor: colors.primary[600],
                    color: colors.text.inverse,
                  },
                  '&.Mui-disabled': {
                    color: colors.text.tertiary,
                  },
                },
                '& .MuiPickersToolbar-root': {
                  backgroundColor: colors.primary[600],
                  color: colors.text.inverse,
                },
                '& .MuiPickersToolbar-content': {
                  color: colors.text.inverse,
                },
                '& .MuiTypography-root': {
                  color: 'inherit',
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
}