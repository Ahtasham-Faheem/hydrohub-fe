import { Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const SystemAccessRole = () => {
  return (
    <Stack spacing={3}>
      {/* Username */}
      <TextField
        fullWidth
        label="Username"
        variant="outlined"
        placeholder="johndoe"
        InputProps={{ readOnly: true }}
        helperText="View only"
      />

      {/* Email */}
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        placeholder="john.doe@waterinn.com"
        type="email"
        InputProps={{ readOnly: true }}
        helperText="View only"
      />

      {/* Phone */}
      <TextField
        fullWidth
        label="Phone"
        variant="outlined"
        placeholder="+92 302 6648100"
        InputProps={{ readOnly: true }}
        helperText="View only"
      />

      {/* User Role + Access Level */}
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel>User Role</InputLabel>
          <Select label="User Role" defaultValue="Admin">
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Access Level</InputLabel>
          <Select label="Access Level" defaultValue="Full Access">
            <MenuItem value="Full Access">Full Access</MenuItem>
            <MenuItem value="Limited Access">Limited Access</MenuItem>
            <MenuItem value="Read Only">Read Only</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Access Expiry + Branch Assignment */}
      <Stack direction="row" spacing={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Access Expiry" sx={{ width: "100%" }} />
        </LocalizationProvider>

        <TextField
          fullWidth
          label="Branch Assignment"
          variant="outlined"
          placeholder="Lahore Head Office"
        />
      </Stack>

      {/* Two-Factor Authentication */}
      <FormControl fullWidth>
        <InputLabel>Two-Factor Authentication</InputLabel>
        <Select label="Two-Factor Authentication" defaultValue="Yes">
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};
