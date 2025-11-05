import { Stack } from "@mui/material";
import { CustomDateInput } from "../CustomDateInput";
import { CustomSelect } from "../CustomSelect";
import { useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

const departmentOptions = [
  { value: "engineering", label: "Engineering" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "it", label: "Information Technology" },
];

const employmentTypeOptions = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
];

const shiftTypeOptions = [
  { value: "morning", label: "Morning" },
  { value: "evening", label: "Evening" },
  { value: "night", label: "Night" },
  { value: "rotating", label: "Rotating" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "probation", label: "Probation" },
  { value: "suspended", label: "Suspended" },
  { value: "terminated", label: "Terminated" },
];

export const EmploymentDetails = () => {
  const [formData, setFormData] = useState({
    joiningDate: dayjs() as Dayjs | null,
    jobTitle: "",
    department: "",
    employmentType: "",
    supervisor: "",
    workLocation: "",
    shiftType: "",
    status: "",
  });

  const handleDateChange = (date: Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      joiningDate: date,
    }));
  };

  const handleSelectChange = (name: string) => (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <CustomDateInput
          label="Joining Date"
          value={formData.joiningDate}
          onChange={handleDateChange}
        />
        <CustomSelect
          label="Job Title"
          value={formData.jobTitle}
          onChange={handleSelectChange("jobTitle")}
          options={[
            { value: "manager", label: "Manager" },
            { value: "developer", label: "Developer" },
            { value: "designer", label: "Designer" },
            { value: "analyst", label: "Analyst" },
          ]}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Department"
          value={formData.department}
          onChange={handleSelectChange("department")}
          options={departmentOptions}
        />
        <CustomSelect
          label="Employment Type"
          value={formData.employmentType}
          onChange={handleSelectChange("employmentType")}
          options={employmentTypeOptions}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Supervisor"
          value={formData.supervisor}
          onChange={handleSelectChange("supervisor")}
          options={[
            { value: "john-doe", label: "John Doe" },
            { value: "jane-smith", label: "Jane Smith" },
            { value: "bob-wilson", label: "Bob Wilson" },
          ]}
        />
        <CustomSelect
          label="Work Location"
          value={formData.workLocation}
          onChange={handleSelectChange("workLocation")}
          options={[
            { value: "main-office", label: "Main Office" },
            { value: "branch-1", label: "Branch 1" },
            { value: "branch-2", label: "Branch 2" },
            { value: "remote", label: "Remote" },
          ]}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Shift Type"
          value={formData.shiftType}
          onChange={handleSelectChange("shiftType")}
          options={shiftTypeOptions}
        />
        <CustomSelect
          label="Status"
          value={formData.status}
          onChange={handleSelectChange("status")}
          options={statusOptions}
        />
      </Stack>
    </Stack>
  );
};