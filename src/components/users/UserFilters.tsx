import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Button,
  Card,
  Typography,
} from "@mui/material";
import { GrRefresh } from "react-icons/gr";
import { PrimaryButton } from "../common/PrimaryButton";
import { DateCalendarGrid } from "../common/DateCalendarGrid";
import dayjs, { Dayjs } from "dayjs";
import { useState, useRef, useEffect } from "react";

interface UserFiltersProps {
  status: string;
  setStatus: (status: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  startDate: Dayjs | null;
  setStartDate: (date: Dayjs | null) => void;
  endDate: Dayjs | null;
  setEndDate: (date: Dayjs | null) => void;
  customerType?: string;
  setCustomerType?: (customerType: string) => void;
  role?: string;
  setRole?: (role: string) => void;
  onFiltersChange?: () => void;
}

interface DateRangeOption {
  label: string;
  value: string;
  startDate: Dayjs;
  endDate: Dayjs;
}

export const UserFilters = ({
  status,
  setStatus,
  dateRange,
  setDateRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  customerType,
  setCustomerType,
  role,
  setRole,
  onFiltersChange,
}: UserFiltersProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [leftMonth, setLeftMonth] = useState<Dayjs>(dayjs());
  const [rightMonth, setRightMonth] = useState<Dayjs>(dayjs().add(1, "month"));
  const calendarRef = useRef<HTMLDivElement>(null);

  const dateRangeOptions: DateRangeOption[] = [
    {
      label: "Today",
      value: "today",
      startDate: dayjs().startOf("day"),
      endDate: dayjs().endOf("day"),
    },
    {
      label: "Yesterday",
      value: "yesterday",
      startDate: dayjs().subtract(1, "day").startOf("day"),
      endDate: dayjs().subtract(1, "day").endOf("day"),
    },
    {
      label: "Last 7 Days",
      value: "last7days",
      startDate: dayjs().subtract(7, "day").startOf("day"),
      endDate: dayjs().endOf("day"),
    },
    {
      label: "Last 30 Days",
      value: "last30days",
      startDate: dayjs().subtract(30, "day").startOf("day"),
      endDate: dayjs().endOf("day"),
    },
    {
      label: "This Month",
      value: "thisMonth",
      startDate: dayjs().startOf("month"),
      endDate: dayjs().endOf("month"),
    },
    {
      label: "Last Month",
      value: "lastMonth",
      startDate: dayjs().subtract(1, "month").startOf("month"),
      endDate: dayjs().subtract(1, "month").endOf("month"),
    },
    {
      label: "This Year",
      value: "thisYear",
      startDate: dayjs().startOf("year"),
      endDate: dayjs().endOf("year"),
    },
    {
      label: "Last Year",
      value: "lastYear",
      startDate: dayjs().subtract(1, "year").startOf("year"),
      endDate: dayjs().subtract(1, "year").endOf("year"),
    },
  ];

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
  }, [isCalendarOpen]);

  const handleDateRangeOptionClick = (option: DateRangeOption) => {
    setStartDate(option.startDate);
    setEndDate(option.endDate);
    setDateRange(option.value);
    setLeftMonth(option.startDate);
    setRightMonth(option.endDate);
    setIsCalendarOpen(false);
    if (onFiltersChange) onFiltersChange();
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
    if (onFiltersChange) onFiltersChange();
  };

  const handleCalendarReset = () => {
    setStartDate(null);
    setEndDate(null);
    setDateRange("");
    setLeftMonth(dayjs());
    setRightMonth(dayjs().add(1, "month"));
    setIsCalendarOpen(false);
    if (onFiltersChange) onFiltersChange();
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    if (onFiltersChange) onFiltersChange();
  };

  const handleCustomerTypeChange = (value: string) => {
    if (setCustomerType) setCustomerType(value);
    if (onFiltersChange) onFiltersChange();
  };

  const handleRoleChange = (value: string) => {
    if (setRole) setRole(value);
    if (onFiltersChange) onFiltersChange();
  };

  const handleResetAllFilters = () => {
    setStatus("");
    setDateRange("");
    setStartDate(null);
    setEndDate(null);
    setLeftMonth(dayjs());
    setRightMonth(dayjs().add(1, "month"));
    if (setCustomerType) setCustomerType("");
    if (setRole) setRole("");
    setIsCalendarOpen(false);
    if (onFiltersChange) onFiltersChange();
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
        {/* Date Range Picker with Calendar */}
        <Box sx={{ position: "relative" }}>
          <Button
            variant="outlined"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            sx={{
              borderColor: "#d1d5db",
              textTransform: "none",
              color: "#374151",
              fontWeight: 500,
              width: "100%",
              py: 1,
              height: "40px",
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
                boxShadow: "0px 0px 10px rgba(0,0,0,0.15)",
              }}
            >
              {/* Quick Select Options */}
              <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Box sx={{ width: "140px" }}>
                  <Button
                    onClick={handleCalendarReset}
                    sx={{
                      width: "100%",
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
                  {dateRangeOptions.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => handleDateRangeOptionClick(option)}
                      sx={{
                        width: "100%",
                        justifyContent: "flex-start",
                        // py: 1,
                        px: 2,
                        textTransform: "none",
                        backgroundColor:
                          dateRange === option.value ? "#3b82f6" : "transparent",
                        color:
                          dateRange === option.value
                            ? "white"
                            : "text.primary",
                        "&:hover": {
                          bgcolor:
                            dateRange === option.value
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
                <Box sx={{ display: "flex", gap: 3, flex: 1 }}>
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
                        sx={{ fontWeight: 600, minWidth: "100px", textAlign: "center" }}
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
                        sx={{ fontWeight: 600, minWidth: "100px", textAlign: "center" }}
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

        {setCustomerType ? (
          <FormControl size="small">
            <InputLabel>Select Customer Type</InputLabel>
            <Select
              value={customerType || ""}
              onChange={(e) => handleCustomerTypeChange(e.target.value)}
              label="Select Customer Type"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Domestic Customer">Domestic Customer</MenuItem>
              <MenuItem value="Business Customer">Business Customer</MenuItem>
              <MenuItem value="Commercial Customer">
                Commercial Customer
              </MenuItem>
            </Select>
          </FormControl>
        ) : (
          <FormControl size="small">
            <InputLabel>Select Role</InputLabel>
            <Select
              value={role || ""}
              onChange={(e) => handleRoleChange(e.target.value)}
              label="Select Role"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="vendor_admin">Vendor Admin</MenuItem>
              <MenuItem value="supervisor">Supervisor</MenuItem>
              <MenuItem value="delivery_staff">Delivery Staff</MenuItem>
              <MenuItem value="billing_operator">Billing Operator</MenuItem>
              <MenuItem value="customer_support">Customer Support</MenuItem>
              <MenuItem value="data_entry">Data Entry</MenuItem>
            </Select>
          </FormControl>
        )}

        <FormControl size="small">
          <InputLabel>Select Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            label="Select Status"
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </Select>
        </FormControl>

        <Tooltip title="Reset All Filters">
          <PrimaryButton
            onClick={handleResetAllFilters}
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
