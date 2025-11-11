import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import { useFormContext } from "../../contexts/FormContext";

const userRoles = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'vendor_admin', label: 'Vendor Admin' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'delivery_staff', label: 'Delivery Staff' },
  { value: 'billing_operator', label: 'Billing Operator' },
  { value: 'customer_support', label: 'Customer Support' },
  { value: 'data_entry', label: 'Data Entry' },
  { value: 'customer', label: 'Customer' },
];

export const SystemAccessRole = () => {
  const { formData, updateFormData } = useFormContext();

  return (
    <Stack spacing={3}>
      {/* User Role + Access Level */}
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel>User Role</InputLabel>
          <Select 
            label="User Role" 
            value={formData.userRole}
            onChange={(e) => updateFormData('userRole', e.target.value)}
          >
            {userRoles.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Access Level</InputLabel>
          <Select 
            label="Access Level" 
            value={formData.accessLevel}
            onChange={(e) => updateFormData('accessLevel', e.target.value)}
          >
            <MenuItem value="Full">Full Access</MenuItem>
            <MenuItem value="Limited">Limited Access</MenuItem>
            <MenuItem value="ReadOnly">Read Only</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Access Expiry + Branch Assignment */}
      <Stack direction="row" spacing={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker 
            label="Access Expiry" 
            sx={{ width: "100%" }}
            value={formData.accessExpiry ? dayjs(formData.accessExpiry) : null}
            onChange={(date) => updateFormData('accessExpiry', date ? date.format('YYYY-MM-DD') : '')}
          />
        </LocalizationProvider>

        <TextField
          fullWidth
          label="Branch Assignment"
          variant="outlined"
          placeholder="Lahore Head Office"
          value={formData.branchAssignment}
          onChange={(e) => updateFormData('branchAssignment', e.target.value)}
        />
      </Stack>

      {/* Two-Factor Authentication */}
      <FormControl fullWidth>
        <InputLabel>Two-Factor Authentication</InputLabel>
        <Select 
          label="Two-Factor Authentication" 
          value={formData.twoFactorAuth ? 'true' : 'false'}
          onChange={(e) => updateFormData('twoFactorAuth', e.target.value === 'true')}
        >
          <MenuItem value="true">Yes</MenuItem>
          <MenuItem value="false">No</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};
