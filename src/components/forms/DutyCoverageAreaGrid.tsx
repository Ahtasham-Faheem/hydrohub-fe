import {
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import { CustomSelect } from "../common/CustomSelect";

const dayTypeOptions = [
  { value: "Weekday", label: "Weekday" },
  { value: "Weekend", label: "Weekend" },
  { value: "Flexible", label: "Flexible" },
];

const serviceCoverageOptions = [
  { value: "Auto", label: "Auto (Based on proximity)" },
  { value: "Manual", label: "Manual" },
  { value: "Hybrid", label: "Hybrid" },
];

const dynamicTypeOptions = [
  { value: "Static", label: "Static" },
  { value: "Dynamic", label: "Dynamic" },
];

const assignmentTypeOptions = [
  { value: "Both", label: "Both" },
  { value: "OfficeOnly", label: "Office Only" },
  { value: "FieldOnly", label: "Field Only" },
];

const zoneOptions = [
  { value: "ZoneA", label: "Zone A" },
  { value: "ZoneB", label: "Zone B" },
  { value: "ModelTown", label: "Model Town" },
];

const weekDayOptions = [
  { value: "Sunday", label: "Sunday" },
  { value: "Monday", label: "Monday" },
  { value: "Saturday", label: "Saturday" },
];

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

  const handleSelectChange = (name: string) => (e: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Section Title */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#1976d2" }}
        >
          Duty Coverage Area
        </Typography>
      </Box>

      {/* Select Day Type */}
      <Box>
        <CustomSelect
          label="Select Day Type"
          value={formData.dayType}
          onChange={handleSelectChange("dayType")}
          options={dayTypeOptions}
        />
      </Box>

      {/* Service Coverage Type */}
      <Box>
        <CustomSelect
          label="Service Coverage Type"
          value={formData.serviceCoverageType}
          onChange={handleSelectChange("serviceCoverageType")}
          options={serviceCoverageOptions}
        />
      </Box>

      {/* Dynamic Type + Assignment Type + Eligible Zones */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#1976d2", mb: 2 }}
        >
          Weekly Fixed Area Assignments
        </Typography>
        
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <CustomSelect
              label="Dynamic Type"
              value={formData.dynamicType}
              onChange={handleSelectChange("dynamicType")}
              options={dynamicTypeOptions}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <CustomSelect
              label="Assignment Type"
              value={formData.assignmentType}
              onChange={handleSelectChange("assignmentType")}
              options={assignmentTypeOptions}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <CustomSelect
              label="Eligible Zones / Areas"
              value={formData.eligibleZones}
              onChange={handleSelectChange("eligibleZones")}
              options={zoneOptions}
            />
          </Box>
        </Box>

        {/* Week Off Day + Special Duty Day */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <CustomSelect
              label="Default Week Off Day"
              value={formData.weekOffDay}
              onChange={handleSelectChange("weekOffDay")}
              options={weekDayOptions}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <CustomSelect
              label="Special Duty Day"
              value={formData.specialDutyDay}
              onChange={handleSelectChange("specialDutyDay")}
              options={weekDayOptions}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
