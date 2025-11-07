import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";

export const DutyCoverageAreaGrid = () => {
  const [formData, setFormData] = useState({
    dayType: "",
    serviceCoverageType: "",
    dynamicType: "",
    assignmentType: "",
    eligibleZones: "",
    weekOffDay: "",
    specialDutyDay: "",
  });

  const handleSelectChange =
    (name: string) => (e: React.ChangeEvent<{ value: unknown }>) => {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value as string,
      }));
    };

  return (
    <Grid container spacing={3}>
      {/* Section Title */}
      <Grid item xs={12}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#1976d2" }}
        >
          Duty Coverage Area
        </Typography>
      </Grid>

      {/* Select Day Type */}
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Select Day Type</InputLabel>
          <Select
            label="Select Day Type"
            value={formData.dayType}
            onChange={() => handleSelectChange("dayType")}
          >
            <MenuItem value="Weekday">Weekday</MenuItem>
            <MenuItem value="Weekend">Weekend</MenuItem>
            <MenuItem value="Flexible">Flexible</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Service Coverage Type */}
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Service Coverage Type</InputLabel>
          <Select
            label="Service Coverage Type"
            value={formData.serviceCoverageType}
            onChange={() => handleSelectChange("serviceCoverageType")}
          >
            <MenuItem value="Auto (Based on proximity)">
              Auto (Based on proximity)
            </MenuItem>
            <MenuItem value="Manual">Manual</MenuItem>
            <MenuItem value="Hybrid">Hybrid</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Dynamic Type + Assignment Type + Eligible Zones */}
      <Grid item xs={12}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#1976d2", mt: 1 }}
        >
          Weekly Fixed Area Assignments
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Dynamic Type</InputLabel>
              <Select
                label="Dynamic Type"
                value={formData.dynamicType}
                onChange={() => handleSelectChange("dynamicType")}
              >
                <MenuItem value="Static">Static</MenuItem>
                <MenuItem value="Dynamic">Dynamic</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Assignment Type</InputLabel>
              <Select
                label="Assignment Type"
                value={formData.assignmentType}
                onChange={() => handleSelectChange("assignmentType")}
              >
                <MenuItem value="Both">Both</MenuItem>
                <MenuItem value="Office Only">Office Only</MenuItem>
                <MenuItem value="Field Only">Field Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Eligible Zones / Areas</InputLabel>
              <Select
                label="Eligible Zones / Areas"
                value={formData.eligibleZones}
                onChange={() => handleSelectChange("eligibleZones")}
              >
                <MenuItem value="Zone A">Zone A</MenuItem>
                <MenuItem value="Zone B">Zone B</MenuItem>
                <MenuItem value="Model Town">Model Town</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>

      {/* Week Off Day + Special Duty Day */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Default Week Off Day</InputLabel>
              <Select
                label="Default Week Off Day"
                value={formData.weekOffDay}
                onChange={() => handleSelectChange("weekOffDay")}
              >
                <MenuItem value="Sunday">Sunday</MenuItem>
                <MenuItem value="Monday">Monday</MenuItem>
                <MenuItem value="Saturday">Saturday</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Special Duty Day</InputLabel>
              <Select
                label="Special Duty Day"
                value={formData.specialDutyDay}
                onChange={() => handleSelectChange("specialDutyDay")}
              >
                <MenuItem value="Sunday">Sunday</MenuItem>
                <MenuItem value="Friday">Friday</MenuItem>
                <MenuItem value="Saturday">Saturday</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
