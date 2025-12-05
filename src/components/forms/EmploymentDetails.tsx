import {
  Stack,
} from "@mui/material";
import dayjs from "dayjs";
import { CustomSelect } from "../common/CustomSelect";
import { CustomDateInput } from "../common/CustomDateInput";
import { useFormContext } from "../../contexts/FormContext";

export const EmploymentDetails = () => {
  const { formData, updateFormData } = useFormContext();

  return (
    <Stack spacing={3}>
      {/* Joining Date + Designation/Job Title + Department */}
      <Stack direction="row" spacing={2}>
        <CustomDateInput
          label="Joining Date"
          value={formData.joiningDate ? dayjs(formData.joiningDate) : null}
          onChange={(date) => updateFormData('joiningDate', date ? date.format('YYYY-MM-DD') : '')}
        />
        <CustomSelect
          label="Designation / Job Title"
          value={formData.jobTitle || ''}
          onChange={(e) => updateFormData('jobTitle', e.target.value)}
          options={[
            { value: "senior_manager", label: "Senior Manager" },
            { value: "delivery_rider", label: "Delivery Rider" },
            { value: "plant_operator", label: "Plant Operator" },
            { value: "admin_officer", label: "Admin Officer" },
            { value: "sales_executive", label: "Sales Executive" },
            { value: "manager", label: "Manager" },
            { value: "supervisor", label: "Supervisor" },
          ]}
        />
        <CustomSelect
          label="Department"
          value={formData.department || ''}
          onChange={(e) => updateFormData('department', e.target.value)}
          options={[
            { value: "operations", label: "Operations" },
            { value: "sales", label: "Sales" },
            { value: "accounts", label: "Accounts" },
            { value: "it", label: "IT" },
            { value: "hr", label: "HR" },
            { value: "marketing", label: "Marketing" },
          ]}
        />
      </Stack>

      {/* Employment Type + Supervisor/Reporting To + Work Location */}
      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Employment Type"
          value={formData.employmentType || ''}
          onChange={(e) => updateFormData('employmentType', e.target.value)}
          options={[
            { value: "Full-Time", label: "Full-Time" },
            { value: "Part-Time", label: "Part-Time" },
            { value: "Contract", label: "Contract" },
          ]}
        />
        <CustomSelect
          label="Supervisor / Reporting To"
          value={formData.supervisorId || ''}
          onChange={(e) => updateFormData('supervisorId', e.target.value)}
          options={[
            { value: "dfa452e2-4b58-4fad-a01e-fdebef553815", label: "Sarah Khan" },
            { value: "550e8400-e29b-41d4-a716-446655440001", label: "Ahmed Malik" },
            { value: "550e8400-e29b-41d4-a716-446655440002", label: "Fatima Ali" },
            { value: "550e8400-e29b-41d4-a716-446655440003", label: "Hassan Khan" },
          ]}
        />
        <CustomSelect
          label="Work Location"
          value={formData.workLocation || ''}
          onChange={(e) => updateFormData('workLocation', e.target.value)}
          options={[
            { value: "plant", label: "Plant" },
            { value: "office", label: "Office" },
            { value: "field", label: "Field" },
            { value: "head_office", label: "Head Office" },
            { value: "islamabad_branch", label: "Islamabad Branch" },
          ]}
        />
      </Stack>

      {/* Shift Type + Status */}
      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Shift Type"
          value={formData.shiftType || ''}
          onChange={(e) => updateFormData('shiftType', e.target.value)}
          options={[
            { value: "Morning", label: "Morning" },
            { value: "Evening", label: "Evening" },
            { value: "Night", label: "Night" },
          ]}
        />
        <CustomSelect
          label="Status"
          value={formData.employmentStatus || ''}
          onChange={(e) => updateFormData('employmentStatus', e.target.value)}
          options={[
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
            { value: "Terminated", label: "Terminated" },
          ]}
        />
      </Stack>
    </Stack>
  );
};
