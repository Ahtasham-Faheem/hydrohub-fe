import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";

interface LeaveConfig {
  type: string;
  allowed: number;
  period: string;
}

export const AttendanceDutyInfo = () => {
  const [formData, setFormData] = useState({
    attendanceType: "",
    trackingSource: "",
    userAttendanceType: "",
    gracePeriod: "",
    dutyNotes: "",
  });

  const [leaveConfig, setLeaveConfig] = useState<LeaveConfig[]>([
    { type: "Annual Leave", allowed: 14, period: "Yearly" },
    { type: "Casual Leave", allowed: 6, period: "Half-Yearly" },
    { type: "Sick Leave", allowed: 10, period: "Yearly" },
    { type: "Short Leave", allowed: 3, period: "Monthly" },
  ]);

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

  const handleDeleteLeave = (index: number) => {
    setLeaveConfig((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Stack spacing={3}>
      {/* Attendance Type + Tracking Source */}
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Attendance Type</InputLabel>
          <Select
            label="Attendance Type"
            value={formData.attendanceType}
            onChange={() => handleSelectChange("attendanceType")}
          >
            <MenuItem value="Biometric">Biometric</MenuItem>
            <MenuItem value="Manual">Manual</MenuItem>
            <MenuItem value="Remote">Remote</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Tracking Source</InputLabel>
          <Select
            label="Tracking Source"
            value={formData.trackingSource}
            onChange={() => handleSelectChange("trackingSource")}
          >
            <MenuItem value="Mobile App">Mobile App</MenuItem>
            <MenuItem value="Web Portal">Web Portal</MenuItem>
            <MenuItem value="RFID">RFID</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* User Attendance Type + Grace Period */}
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel>User Attendance Type</InputLabel>
          <Select
            label="User Attendance Type"
            value={formData.userAttendanceType}
            onChange={() => handleSelectChange("userAttendanceType")}
          >
            <MenuItem value="Shift-based">Shift-based</MenuItem>
            <MenuItem value="Flexible">Flexible</MenuItem>
            <MenuItem value="Fixed">Fixed</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Grace Period (Minutes)"
          value={formData.gracePeriod}
          onChange={handleInputChange("gracePeriod")}
          placeholder="10"
        />
      </Stack>

      {/* Leave Configuration Table */}
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, color: "#1976d2" }}
      >
        Allowed Leave Configuration
      </Typography>
      <Box sx={{ pl: 1 }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0px 0px 5px var(--color-text-300)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: 600 }}>Leave Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Allowed</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveConfig.map((leave, index) => (
                <TableRow key={index}>
                  <TableCell>{leave.type}</TableCell>
                  <TableCell>{leave.allowed}</TableCell>
                  <TableCell>{leave.period}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteLeave(index)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Custom Duty Notes */}
      <TextField
        fullWidth
        label="Custom Duty Notes"
        multiline
        minRows={3}
        value={formData.dutyNotes}
        onChange={handleInputChange("dutyNotes")}
        placeholder="User allowed to clock-in from mobile app only. Required to maintain attendance logs."
      />
    </Stack>
  );
};
