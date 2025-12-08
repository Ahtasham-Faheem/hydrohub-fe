import {
  Box,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRange } from "@mui/icons-material";
import { GrRefresh } from "react-icons/gr";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";
import { PrimaryButton } from "../common/PrimaryButton";

interface DateRangeOption {
  label: string;
  value: string;
  startDate: Dayjs;
  endDate: Dayjs;
}

// Simple calendar grid component
const DateCalendarGrid = ({
  month,
  startDate,
  endDate,
  onDateClick,
}: {
  month: Dayjs;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onDateClick: (date: Dayjs) => void;
}) => {
  const firstDay = month.startOf("month");
  const lastDay = month.endOf("month");
  const daysInMonth = lastDay.date();
  // dayjs().day() returns 0=Sunday, 1=Monday... 6=Saturday
  // Calendar starts with Monday, so we need to offset:
  // Sunday (0) -> 6 blanks, Monday (1) -> 0 blanks, etc.
  const startDayOfWeek = firstDay.day() === 0 ? 6 : firstDay.day() - 1;

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(month.date(i));
  }

  const isInRange = (date: Dayjs | null) => {
    if (!date || !startDate || !endDate) return false;
    return date.isAfter(startDate) && date.isBefore(endDate);
  };

  const isStartDate = (date: Dayjs | null) =>
    date && startDate ? date.isSame(startDate, "day") : false;
  const isEndDate = (date: Dayjs | null) =>
    date && endDate ? date.isSame(endDate, "day") : false;

  return (
    <Box sx={{ width: 280 }}>
      {/* Weekday headers */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.5,
          mb: 1,
        }}
      >
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <Typography
            key={day}
            variant="caption"
            sx={{ textAlign: "center", fontWeight: 600, py: 0.5 }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar days */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.5,
        }}
      >
        {days.map((date, index) => (
          <Button
            key={index}
            onClick={() => date && onDateClick(date)}
            disabled={!date}
            sx={{
              p: 1,
              minWidth: 0,
              aspectRatio: "1",
              backgroundColor:
                isStartDate(date) || isEndDate(date)
                  ? "#3b82f6"
                  : isInRange(date)
                  ? "#e0f2fe"
                  : "transparent",
              color:
                isStartDate(date) || isEndDate(date)
                  ? "white"
                  : date && date.day() >= 5
                  ? "#ef4444"
                  : "inherit",
              "&:hover": date
                ? {
                    backgroundColor:
                      isStartDate(date) || isEndDate(date)
                        ? "#2563eb"
                        : "#f3f4f6",
                  }
                : undefined,
              fontSize: 12,
              fontWeight: isStartDate(date) || isEndDate(date) ? 600 : 400,
            }}
          >
            {date?.date()}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

interface UserFiltersProps {
  status: string;
  setStatus: (status: string) => void;
  customerType?: string;
  setCustomerType?: (customerType: string) => void;
  role?: string;
  setRole?: (role: string) => void;
  startDate: Dayjs | null;
  setStartDate: (date: Dayjs | null) => void;
  endDate: Dayjs | null;
  setEndDate: (date: Dayjs | null) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  dateRangeOptions: DateRangeOption[];
}

export const UserFilters = ({
  status,
  setStatus,
  customerType,
  setCustomerType,
  role,
  setRole,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isCalendarOpen,
  setIsCalendarOpen,
  dateRangeOptions,
}: UserFiltersProps) => {
  const [leftMonth, setLeftMonth] = useState(startDate || dayjs());
  const [rightMonth, setRightMonth] = useState(
    endDate || dayjs().add(1, "month")
  );
  const calendarRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isCalendarOpen, setIsCalendarOpen]);

  const handleDateRangeOptionClick = (option: DateRangeOption) => {
    setStartDate(option.startDate);
    setEndDate(option.endDate);
    setLeftMonth(option.startDate);
    setRightMonth(option.endDate);
    setIsCalendarOpen(false);
  };

  const handleDateClick = (date: Dayjs, isStart: boolean) => {
    if (isStart) {
      setStartDate(date);
      setLeftMonth(date);
    } else {
      setEndDate(date);
      setRightMonth(date);
    }
  };

  const handleApply = () => {
    setIsCalendarOpen(false);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setLeftMonth(dayjs());
    setRightMonth(dayjs().add(1, "month"));
    setIsCalendarOpen(false);
  };

  const resetAllFilters = () => {
    setStatus("");
    if (setCustomerType) setCustomerType("");
    if (setRole) setRole("");
    setStartDate(null);
    setEndDate(null);
    setLeftMonth(dayjs());
    setRightMonth(dayjs().add(1, "month"));
    setIsCalendarOpen(false);
  };
  return (
    <div className="mb-4">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr auto",
          gap: 2,
          width: "100%",
          alignItems: "center",
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
              {startDate && endDate
                ? `${startDate.format("DD MMM YY")} - ${endDate.format(
                    "DD MMM YY"
                  )}`
                : "Select Date Range"}
            </Button>
            {isCalendarOpen && (
              <Card
                ref={calendarRef}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  mt: 1,
                  zIndex: 1000,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  width: 740,
                  boxShadow: "0px 0px 10px var(--color-text-300)",
                }}
              >
                {/* Quick Select Options */}
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                  <Box sx={{ width: "100%" }}>
                    <Button
                      onClick={handleReset}
                      sx={{
                        width: "max-content",
                        justifyContent: "flex-start",
                        py: 1,
                        px: 2,
                        textTransform: "none",
                        backgroundColor: "#ef4444",
                        color: "white",
                        fontWeight: 600,
                        mb: 1,
                        "&:hover": {
                          bgcolor: "#dc2626",
                        },
                      }}
                    >
                      Reset
                    </Button>
                    {dateRangeOptions.map((option: DateRangeOption) => (
                      <Button
                        key={option.value}
                        onClick={() => handleDateRangeOptionClick(option)}
                        sx={{
                          width: "max-content",
                          justifyContent: "flex-start",
                          py: 1,
                          textTransform: "none",
                          backgroundColor:
                            startDate?.isSame(option.startDate, "day") &&
                            endDate?.isSame(option.endDate, "day")
                              ? "#3b82f6"
                              : "transparent",
                          color:
                            startDate?.isSame(option.startDate, "day") &&
                            endDate?.isSame(option.endDate, "day")
                              ? "white"
                              : "text.primary",
                          "&:hover": {
                            bgcolor:
                              startDate?.isSame(option.startDate, "day") &&
                              endDate?.isSame(option.endDate, "day")
                                ? "#3b82f6"
                                : "#f3f4f6",
                          },
                        }}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </Box>

                  {/* Dual Calendars */}
                  <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
                    {/* Left Calendar */}
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() =>
                            setLeftMonth(leftMonth.subtract(1, "month"))
                          }
                        >
                          ←
                        </Button>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {leftMonth.format("MMM YYYY")}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() =>
                            setLeftMonth(leftMonth.add(1, "month"))
                          }
                        >
                          →
                        </Button>
                      </Box>
                      <DateCalendarGrid
                        month={leftMonth}
                        startDate={startDate}
                        endDate={endDate}
                        onDateClick={(date: Dayjs) =>
                          handleDateClick(date, true)
                        }
                      />
                    </Box>

                    <Divider orientation="vertical" flexItem />

                    {/* Right Calendar */}
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() =>
                            setRightMonth(rightMonth.subtract(1, "month"))
                          }
                        >
                          ←
                        </Button>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {rightMonth.format("MMM YYYY")}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() =>
                            setRightMonth(rightMonth.add(1, "month"))
                          }
                        >
                          →
                        </Button>
                      </Box>
                      <DateCalendarGrid
                        month={rightMonth}
                        startDate={startDate}
                        endDate={endDate}
                        onDateClick={(date: Dayjs) =>
                          handleDateClick(date, false)
                        }
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Apply Cancel Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pt: 2,
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "#374151",
                    }}
                  >
                    {startDate && endDate
                      ? `${startDate.format("DD-MM-YYYY")} to ${endDate.format(
                          "DD-MM-YYYY"
                        )}`
                      : "No range selected"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setIsCalendarOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleApply}
                      sx={{
                        bgcolor: "#3b82f6",
                        "&:hover": { bgcolor: "#2563eb" },
                      }}
                    >
                      Apply
                    </Button>
                  </Box>
                </Box>
              </Card>
            )}
          </Box>
        </LocalizationProvider>

        {setCustomerType ? (
          <FormControl size="small">
            <InputLabel>Select Customer Type</InputLabel>
            <Select
              value={customerType || ""}
              onChange={(e) => setCustomerType && setCustomerType(e.target.value)}
              label="Select Customer Type"
            >
              <MenuItem value="Domestic Customer">Domestic Customer</MenuItem>
              <MenuItem value="Business Customer">Business Customer</MenuItem>
              <MenuItem value="Commercial Customer">Commercial Customer</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <FormControl size="small">
            <InputLabel>Select Role</InputLabel>
            <Select
              value={role || ""}
              onChange={(e) => setRole && setRole(e.target.value)}
              label="Select Role"
            >
              <MenuItem value="super_admin">Super Admin</MenuItem>
              <MenuItem value="vendor_admin">Vendor Admin</MenuItem>
              <MenuItem value="supervisor">Supervisor</MenuItem>
              <MenuItem value="delivery_staff">Delivery Staff</MenuItem>
              <MenuItem value="billing_operator">Billing Operator</MenuItem>
              <MenuItem value="customer_support">Customer Support</MenuItem>
              <MenuItem value="data_entry">Data Entry</MenuItem>
              <MenuItem value="customer">Customer</MenuItem>
            </Select>
          </FormControl>
        )}

        <FormControl size="small">
          <InputLabel>Select Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Select Status"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </Select>
        </FormControl>

        <Tooltip title="Reset All Filters">
          <PrimaryButton
            onClick={resetAllFilters}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              p: 0,
              minWidth: "40px",
              flexShrink: 0,
            }}
          >
            <GrRefresh size={18} />
          </PrimaryButton>
        </Tooltip>
      </Box>
    </div>
  );
};
