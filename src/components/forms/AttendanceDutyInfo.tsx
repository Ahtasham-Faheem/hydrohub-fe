import {
  Stack,
} from "@mui/material";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { useFormContext } from "../../contexts/FormContext";

export const AttendanceDutyInfo = () => {
  const { formData, updateFormData } = useFormContext();

  return (
    <Stack spacing={3}>
      {/* Attendance Code + Duty Area/Zone + Weekly Off Day */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Attendance Code"
          placeholder="Auto-generated"
          value={formData.attendanceCode || ''}
          onChange={() => {}}
          disabled={true}
        />
        <CustomSelect
          label="Duty Area / Zone"
          value={formData.dutyArea || ''}
          onChange={(e) => updateFormData('dutyArea', e.target.value)}
          options={[
            { value: "plant", label: "Plant" },
            { value: "office", label: "Office" },
            { value: "field", label: "Field" },
            { value: "warehouse", label: "Warehouse" },
            { value: "delivery", label: "Delivery Zone" },
          ]}
        />
      </Stack>

      {/* Leave Balance */}
      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Weekly Off Day"
          value={formData.weeklyOffDay || ''}
          onChange={(e) => updateFormData('weeklyOffDay', e.target.value)}
          options={[
            { value: "monday", label: "Monday" },
            { value: "tuesday", label: "Tuesday" },
            { value: "wednesday", label: "Wednesday" },
            { value: "thursday", label: "Thursday" },
            { value: "friday", label: "Friday" },
            { value: "saturday", label: "Saturday" },
            { value: "sunday", label: "Sunday" },
          ]}
        />
        <CustomInput
          label="Leave Balance"
          placeholder="Auto-calculated"
          value={formData.leaveBalance || ''}
          onChange={() => {}}
          disabled={true}
        />
      </Stack>
    </Stack>
  );
};
