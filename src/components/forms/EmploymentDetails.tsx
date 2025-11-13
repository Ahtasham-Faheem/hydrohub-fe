import {
  Stack,
} from "@mui/material";
import dayjs from "dayjs";
import { CustomSelect } from "../CustomSelect";
import { CustomDateInput } from "../CustomDateInput";
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
            { value: "permanent", label: "Permanent" },
            { value: "contract", label: "Contract" },
            { value: "part_time", label: "Part-Time" },
          ]}
        />
        <CustomSelect
          label="Supervisor / Reporting To"
          value={formData.supervisor || ''}
          onChange={(e) => updateFormData('supervisor', e.target.value)}
          options={[
            { value: "sarah_khan", label: "Sarah Khan" },
            { value: "ahmed_malik", label: "Ahmed Malik" },
            { value: "fatima_ali", label: "Fatima Ali" },
            { value: "hassan_khan", label: "Hassan Khan" },
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
            { value: "lahore_head_office", label: "Lahore Head Office" },
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
            { value: "morning", label: "Morning" },
            { value: "evening", label: "Evening" },
            { value: "night", label: "Night" },
          ]}
        />
        <CustomSelect
          label="Status"
          value={formData.employmentStatus || ''}
          onChange={(e) => updateFormData('employmentStatus', e.target.value)}
          options={[
            { value: "active", label: "Active" },
            { value: "on_leave", label: "On Leave" },
            { value: "resigned", label: "Resigned" },
            { value: "terminated", label: "Terminated" },
          ]}
        />
      </Stack>
    </Stack>
  );
};
