import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Box } from "@mui/material";
import { Dayjs } from "dayjs";

interface CustomDateInputProps {
  label: string;
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  error?: string;
  fullWidth?: boolean;
}

export const CustomDateInput = ({
  label,
  value,
  onChange,
  error,
  fullWidth = true,
}: CustomDateInputProps) => {
  return (
    <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          slotProps={{
            textField: {
              size: "medium",
              fullWidth: true,
              error: !!error,
              helperText: error,
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};