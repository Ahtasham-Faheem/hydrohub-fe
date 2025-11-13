import { Stack, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

export const AdditionalNotes = () => {
  const [formData, setFormData] = useState({
    remarks: "",
    exitDate: dayjs() as Dayjs | null,
    reasonForLeaving: "",
  });

  const handleInputChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    };

  const handleDateChange = (date: Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      exitDate: date,
    }));
  };

  return (
    <Stack spacing={3}>
      {/* Reason for Leaving */}
      <Stack direction="row" spacing={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Exit Date"
            value={formData.exitDate}
            onChange={handleDateChange}
            sx={{ width: "100%" }}
          />
        </LocalizationProvider>
        <TextField
          fullWidth
          label="Reason for Leaving"
          value={formData.reasonForLeaving}
          onChange={handleInputChange("reasonForLeaving")}
          placeholder="Enter reason for leaving"
        />
      </Stack>
    </Stack>
  );
};
