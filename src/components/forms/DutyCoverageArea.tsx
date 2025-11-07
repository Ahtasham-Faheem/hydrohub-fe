import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export const DutyCoverageArea = () => {
  const [formData, setFormData] = useState({
    dutyType: "",
    assignmentType: "",
    area: "",
    zone: "",
    weekOffDay: "",
  });

  const handleSelectChange =
    (name: string) => (e: React.ChangeEvent<{ value: unknown }>) => {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value as string,
      }));
    };

  const handleInputChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    };

  return (
    <Stack spacing={3}>
      {/* Select Duty Type */}
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Select Duty Type</InputLabel>
          <Select
            label="Select Duty Type"
            value={formData.dutyType}
            onChange={()=>handleSelectChange("dutyType")}
          >
            <MenuItem value="Fixed Area">Fixed Area</MenuItem>
            <MenuItem value="Flexible Area">Flexible Area</MenuItem>
            <MenuItem value="Remote Area">Remote Area</MenuItem>
          </Select>
        </FormControl>
        <div className="w-full"></div>
      </Stack>

      {/* Section Title */}
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, color: "#1976d2", mt: 1 }}
      >
        Weekly Fixed Area Assignments
      </Typography>

      {/* Assignment Type + Area */}
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Assignment Type</InputLabel>
          <Select
            label="Assignment Type"
            value={formData.assignmentType}
            onChange={()=>handleSelectChange("assignmentType")}
          >
            <MenuItem value="Both">Both</MenuItem>
            <MenuItem value="Office Only">Office Only</MenuItem>
            <MenuItem value="Field Only">Field Only</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Area"
          value={formData.area}
          onChange={handleInputChange("area")}
          placeholder="Model Town"
        />
      </Stack>

      {/* Zone + Week Off Day */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Zone"
          value={formData.zone}
          onChange={handleInputChange("zone")}
          placeholder="Zone A"
        />
        <FormControl fullWidth>
          <InputLabel>Default Week Off Day</InputLabel>
          <Select
            label="Default Week Off Day"
            value={formData.weekOffDay}
            onChange={()=>handleSelectChange("weekOffDay")}
          >
            <MenuItem value="Sunday">Sunday</MenuItem>
            <MenuItem value="Monday">Monday</MenuItem>
            <MenuItem value="Tuesday">Tuesday</MenuItem>
            <MenuItem value="Wednesday">Wednesday</MenuItem>
            <MenuItem value="Thursday">Thursday</MenuItem>
            <MenuItem value="Friday">Friday</MenuItem>
            <MenuItem value="Saturday">Saturday</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
};
