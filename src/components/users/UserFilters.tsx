import {
  Box,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateRange } from "@mui/icons-material";
import { CustomInput } from "../CustomInput";
import { LuSearch } from "react-icons/lu";
import type { Dayjs } from "dayjs";

interface DateRangeOption {
  label: string;
  value: string;
  date: Dayjs;
}

interface UserFiltersProps {
  status: string;
  setStatus: (status: string) => void;
  role: string;
  setRole: (role: string) => void;
  shift: string;
  setShift: (shift: string) => void;
  department: string;
  setDepartment: (department: string) => void;
  selectedDate: Dayjs | null;
  setSelectedDate: (date: Dayjs | null) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  dateRangeOptions: DateRangeOption[];
}

export const UserFilters = ({
  status,
  setStatus,
  role,
  setRole,
  shift,
  setShift,
  department,
  setDepartment,
  selectedDate,
  setSelectedDate,
  isCalendarOpen,
  setIsCalendarOpen,
  dateRangeOptions,
}: UserFiltersProps) => {
  return (
    <div className="mb-4">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 2,
          width: "100%",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ position: "relative" }}>
            <Button
              variant="outlined"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              startIcon={<DateRange />}
              sx={{
                borderColor: "#d1d5db",
                textTransform: "none",
                color: "#374151",
                fontWeight: 500,
                width: "100%",
                py: 1,
                height: "40px",
                minWidth: "200px",
                justifyContent: "flex-start",
              }}
            >
              {selectedDate?.format("DD MMM YY")}
            </Button>
            {isCalendarOpen && (
              <Card
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  mt: 1,
                  zIndex: 1000,
                  p: 2,
                  display: "flex",
                  gap: 2,
                }}
              >
                <Box sx={{ width: "50%" }}>
                  {dateRangeOptions.map((option: DateRangeOption) => (
                    <Button
                      key={option.value}
                      onClick={() => {
                        setSelectedDate(option.date);
                        setIsCalendarOpen(false);
                      }}
                      sx={{
                        width: "100%",
                        justifyContent: "flex-start",
                        color: "text.primary",
                        py: 1,
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: "primary.light",
                        },
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <DatePicker
                    value={selectedDate}
                    onChange={(newValue) => {
                      setSelectedDate(newValue);
                      setIsCalendarOpen(false);
                    }}
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { display: "none" },
                    }}
                  />
                </Box>
              </Card>
            )}
          </Box>
        </LocalizationProvider>

        {/* Dropdowns */}
        <FormControl size="small">
          <InputLabel>Select Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Select Status"
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Suspended">Suspended</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Select Role</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Select Role"
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Editor">Editor</MenuItem>
            <MenuItem value="Author">Author</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Select Shift</InputLabel>
          <Select
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            label="Select Shift"
          >
            <MenuItem value="Morning">Morning</MenuItem>
            <MenuItem value="Evening">Evening</MenuItem>
            <MenuItem value="Night">Night</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Select Department</InputLabel>
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            label="Select Department"
          >
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </div>
  );
};
