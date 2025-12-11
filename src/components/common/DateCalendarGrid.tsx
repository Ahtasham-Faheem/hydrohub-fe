import { Box, Button } from "@mui/material";
import { Dayjs } from "dayjs";

interface DateCalendarGridProps {
  month: Dayjs;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
  onDateClick: (date: Dayjs) => void;
}

export const DateCalendarGrid = ({
  month,
  startDate,
  endDate,
  onDateClick,
}: DateCalendarGridProps) => {
  const daysInMonth = month.daysInMonth();
  const firstDay = month.startOf("month").day();
  const days = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(month.date(i));
  }

  const isDateInRange = (date: Dayjs) => {
    if (!startDate || !endDate) return false;
    return (
      (date.isAfter(startDate) || date.isSame(startDate, "day")) &&
      (date.isBefore(endDate) || date.isSame(endDate, "day"))
    );
  };

  const isStartDate = (date: Dayjs) => {
    return startDate && date.isSame(startDate, "day");
  };

  const isEndDate = (date: Dayjs) => {
    return endDate && date.isSame(endDate, "day");
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "280px" }}>
      {/* Day names header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0,
          mb: 1,
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Box
            key={day}
            sx={{
              textAlign: "center",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#6b7280",
              py: 0.5,
            }}
          >
            {day}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
        }}
      >
        {days.map((date, index) => {
          if (!date) {
            return (
              <Box
                key={`empty-${index}`}
                sx={{
                  aspectRatio: "1",
                  p: 0.5,
                }}
              />
            );
          }

          const inRange = isDateInRange(date);
          const isStart = isStartDate(date);
          const isEnd = isEndDate(date);

          return (
            <Button
              key={date.format("YYYY-MM-DD")}
              size="small"
              onClick={() => onDateClick(date)}
              sx={{
                width: "100%",
                aspectRatio: "1",
                p: 0.3,
                minWidth: "unset",
                fontWeight: isStart || isEnd ? 600 : 500,
                fontSize: "0.875rem",
                bgcolor:
                  isStart || isEnd
                    ? "#3b82f6"
                    : inRange
                    ? "#dbeafe"
                    : "transparent",
                color:
                  isStart || isEnd
                    ? "white"
                    : inRange
                    ? "#1e40af"
                    : "#374151",
                borderRadius: 1,
                "&:hover": {
                  bgcolor:
                    isStart || isEnd ? "#2563eb" : inRange ? "#dbeafe" : "#f3f4f6",
                },
              }}
            >
              {date.format("D")}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};
