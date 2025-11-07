import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

export const EmploymentDetails = () => {
  const [formData, setFormData] = useState({
    joiningDate: dayjs("2022-03-12") as Dayjs | null,
    jobTitle: "",
    department: "",
    employmentType: "",
    supervisor: "",
    workLocation: "",
    shiftType: "",
    status: "",
  });

  const handleInputChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    };

  const handleSelectChange =
    (name: string) => (e: React.ChangeEvent<{ value: unknown }>) => {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value as string,
      }));
    };

  const handleDateChange = (date: Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      joiningDate: date,
    }));
  };

  return (
    <Stack spacing={3}>
      {/* Joining Date + Job Title */}
      <Stack direction="row" spacing={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Joining Date"
            value={formData.joiningDate}
            onChange={handleDateChange}
            sx={{ width: "100%" }}
          />
        </LocalizationProvider>
        <TextField
          fullWidth
          label="Job Title"
          value={formData.jobTitle}
          onChange={handleInputChange("jobTitle")}
          placeholder="Sales Executive"
        />
      </Stack>

      {/* Department + Employment Type */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Department"
          value={formData.department}
          onChange={handleInputChange("department")}
          placeholder="Sales & Marketing"
        />
        <FormControl fullWidth>
          <InputLabel>Employment Type</InputLabel>
          <Select
            label="Employment Type"
            value={formData.employmentType}
            onChange={()=>handleSelectChange("employmentType")}
          >
            <MenuItem value="Full-Time">Full-Time</MenuItem>
            <MenuItem value="Part-Time">Part-Time</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
            <MenuItem value="Internship">Internship</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Supervisor + Work Location */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Supervisor"
          value={formData.supervisor}
          onChange={handleInputChange("supervisor")}
          placeholder="Sarah Khan"
        />
        <TextField
          fullWidth
          label="Work Location"
          value={formData.workLocation}
          onChange={handleInputChange("workLocation")}
          placeholder="Lahore Head Office"
        />
      </Stack>

      {/* Shift Type + Status */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Shift Type"
          value={formData.shiftType}
          onChange={handleInputChange("shiftType")}
          placeholder="Morning"
        />
        <TextField
          fullWidth
          label="Status"
          value={formData.status}
          onChange={handleInputChange("status")}
          placeholder="Active"
        />
      </Stack>
    </Stack>
  );
};
