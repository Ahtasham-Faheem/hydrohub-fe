import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { CustomSelect } from "../common/CustomSelect";
import { CustomDateInput } from "../common/CustomDateInput";
import { useFormContext } from "../../contexts/FormContext";
import { useEffect, useState } from "react";
import { staffService } from "../../services/api";

export const EmploymentDetails = () => {
  const { formData, updateFormData, fieldErrors, setFieldErrors } = useFormContext();
  const [supervisors, setSupervisors] = useState<Array<{ id: string; firstName?: string; lastName?: string; email?: string; username?: string }>>([]);
  const [loadingSupervisors, setLoadingSupervisors] = useState(false);
  
  useEffect(() => {
    let mounted = true;
    const loadSupervisors = async () => {
      setLoadingSupervisors(true);
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const vendorId = userData?.vendorId || userData?.id || '';
        const data = await staffService.getSupervisors(vendorId);
        if (mounted && Array.isArray(data)) {
          setSupervisors(data);
        }
      } catch (err) {
        console.error('Failed to load supervisors:', err);
      } finally {
        if (mounted) setLoadingSupervisors(false);
      }
    };

    loadSupervisors();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Stack spacing={3}>
      {/* Joining Date + Designation/Job Title + Department */}
      <Stack direction="row" spacing={2}>
        <CustomDateInput
          label="Joining Date"
          value={formData.joiningDate ? dayjs(formData.joiningDate) : null}
          onChange={(date) => updateFormData('joiningDate', date ? date.format('YYYY-MM-DD') : '')}
          error={fieldErrors['joiningDate']}
        />
        <CustomSelect
          label="Designation / Job Title"
          value={formData.jobTitle || ''}
          onChange={(e) => {
            updateFormData('jobTitle', e.target.value);
            // Clear error when user selects
            if (fieldErrors['jobTitle']) {
              setFieldErrors({ ...fieldErrors, jobTitle: "" });
            }
          }}
          error={fieldErrors['jobTitle']}
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
          onChange={(e) => {
            updateFormData('department', e.target.value);
            // Clear error when user selects
            if (fieldErrors['department']) {
              setFieldErrors({ ...fieldErrors, department: "" });
            }
          }}
          error={fieldErrors['department']}
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
          onChange={(e) => {
            updateFormData('employmentType', e.target.value);
            // Clear error when user selects
            if (fieldErrors['employmentType']) {
              setFieldErrors({ ...fieldErrors, employmentType: "" });
            }
          }}
          error={fieldErrors['employmentType']}
          options={[
            { value: "Full-Time", label: "Full-Time" },
            { value: "Part-Time", label: "Part-Time" },
            { value: "Contract", label: "Contract" },
          ]}
        />
        <CustomSelect
          label="Supervisor / Reporting To"
          value={formData.supervisorId || ''}
          onChange={(e) => {
            updateFormData('supervisorId', e.target.value);
            // Clear error when user selects
            if (fieldErrors['supervisorId']) {
              setFieldErrors({ ...fieldErrors, supervisorId: "" });
            }
          }}
          error={fieldErrors['supervisorId']}
          options={
            loadingSupervisors
              ? [{ value: '', label: 'Loading supervisors...' }]
              : supervisors.length > 0
              ? supervisors.map((s) => ({
                  value: s.id,
                  label: s.firstName || s.username || s.email || 'Supervisor',
                }))
              : [{ value: '', label: 'No supervisors available' }]
          }
        />
        <CustomSelect
          label="Work Location"
          value={formData.workLocation || ''}
          onChange={(e) => {
            updateFormData('workLocation', e.target.value);
            // Clear error when user selects
            if (fieldErrors['workLocation']) {
              setFieldErrors({ ...fieldErrors, workLocation: "" });
            }
          }}
          error={fieldErrors['workLocation']}
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
          onChange={(e) => {
            updateFormData('shiftType', e.target.value);
            // Clear error when user selects
            if (fieldErrors['shiftType']) {
              setFieldErrors({ ...fieldErrors, shiftType: "" });
            }
          }}
          error={fieldErrors['shiftType']}
          options={[
            { value: "Morning", label: "Morning" },
            { value: "Evening", label: "Evening" },
            { value: "Night", label: "Night" },
          ]}
        />
        <CustomSelect
          label="Status"
          value={formData.employmentStatus || ''}
          onChange={(e) => {
            updateFormData('employmentStatus', e.target.value);
            // Clear error when user selects
            if (fieldErrors['employmentStatus']) {
              setFieldErrors({ ...fieldErrors, employmentStatus: "" });
            }
          }}
          error={fieldErrors['employmentStatus']}
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
