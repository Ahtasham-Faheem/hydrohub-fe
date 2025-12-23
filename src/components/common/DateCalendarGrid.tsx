import { Box, Button } from "@mui/material";
import { Dayjs } from "dayjs";
import { useTheme } from "../../contexts/ThemeContext";

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
  const { colors } = useTheme();
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
              color: colors.text.tertiary,
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
                    ? colors.primary[600]
                    : inRange
                    ? colors.primary[100]
                    : "transparent",
                color:
                  isStart || isEnd
                    ? colors.text.inverse
                    : inRange
                    ? colors.primary[700]
                    : colors.text.primary,
                borderRadius: 1,
                "&:hover": {
                  bgcolor:
                    isStart || isEnd 
                      ? colors.primary[700] 
                      : inRange 
                      ? colors.primary[200] 
                      : colors.background.secondary,
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
