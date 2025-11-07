import {
  Stack,
  TextField,
  Typography,
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

export const AssetsAndEquipmentAssigned = () => {
  const [formData, setFormData] = useState({
    equipmentType: "",
    assetId: "",
    assignedDate: dayjs() as Dayjs | null,
    unitOfMeasure: dayjs() as Dayjs | null,
    quantity: "",
    issueBy: "",
    remarks: "",
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

  const handleDateChange = (name: string) => (date: Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  return (
    <Stack spacing={3}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, color: "#1976d2" }}
      >
        Assets & Equipment Assigned
      </Typography>

      {/* Equipment Type + Asset ID */}
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Equipment Type</InputLabel>
          <Select
            label="Equipment Type"
            value={formData.equipmentType}
            onChange={() => handleSelectChange("equipmentType")}
          >
            <MenuItem value="Laptop">Laptop</MenuItem>
            <MenuItem value="Tablet">Tablet</MenuItem>
            <MenuItem value="Mobile">Mobile</MenuItem>
            <MenuItem value="Uniform">Uniform</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Asset ID"
          value={formData.assetId}
          onChange={handleInputChange("assetId")}
          placeholder="Enter Asset ID"
        />
      </Stack>

      {/* Assigned Date + Unit of Measure */}
      <Stack direction="row" spacing={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Assigned Date"
            value={formData.assignedDate}
            onChange={handleDateChange("assignedDate")}
            sx={{ width: "100%" }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Unit of Measure"
            value={formData.unitOfMeasure}
            onChange={handleDateChange("unitOfMeasure")}
            sx={{ width: "100%" }}
          />
        </LocalizationProvider>
      </Stack>

      {/* Quantity + Issue By */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Quantity"
          value={formData.quantity}
          onChange={handleInputChange("quantity")}
          placeholder="Enter Quantity"
        />
        <TextField
          fullWidth
          label="Issue By"
          value={formData.issueBy}
          onChange={handleInputChange("issueBy")}
          placeholder="Enter Issuer Name"
        />
      </Stack>

      {/* Remarks */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Remarks"
          multiline
          minRows={3}
          value={formData.remarks}
          onChange={handleInputChange("remarks")}
          placeholder="Enter additional remarks or notes"
        />
        <div className="w-full"></div>
      </Stack>
    </Stack>
  );
};
