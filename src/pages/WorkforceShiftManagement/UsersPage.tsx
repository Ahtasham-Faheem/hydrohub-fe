import { useState } from "react";
import { Box, Card, Divider } from "@mui/material";
import dayjs from "dayjs";
import { useUsers } from "../../hooks/useUsers";
import { LuUserRoundCheck, LuUserRoundX } from "react-icons/lu";
import { UserStatsCards } from "../../components/users/UserStatsCards";
import { UserFilters } from "../../components/users/UserFilters";
import { SortAndManageColumns } from "../../components/users/SortAndManageColumns";
import { UsersTable } from "../../components/users/UsersTable";

export const UsersPage = () => {
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Using TanStack Query
  const { data: usersData, isLoading, error } = useUsers(currentPage, 10);
  
  const users = usersData?.data || [];
  const totalPages = usersData?.pagination?.totalPages || 1;
  const [sortAnchorEl, setSortAnchorEl] = useState<HTMLElement | null>(null);
  const [manageAnchorEl, setManageAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const [columns, setColumns] = useState([
    { id: 1, label: "User", enabled: true },
    { id: 2, label: "Email", enabled: true },
    { id: 3, label: "Role", enabled: true },
    { id: 4, label: "Status", enabled: true },
    { id: 5, label: "Verified", enabled: true },
    { id: 6, label: "Actions", enabled: true },
  ]);

  const dateRangeOptions = [
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
      value: "last7",
      startDate: dayjs().subtract(7, "day").startOf("day"),
      endDate: dayjs().endOf("day"),
    },
    {
      label: "Last 30 Days",
      value: "last30",
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
  ];

  // TanStack Query handles the data fetching automatically

  // Filter users based on selected filters
  const filteredUsers = users.filter((user) => {
    // Filter by date range
    if (startDate && endDate) {
      const userCreatedDate = dayjs(user.createdAt);
      const isInRange =
        userCreatedDate.isAfter(startDate) && userCreatedDate.isBefore(endDate) ||
        userCreatedDate.isSame(startDate, "day") ||
        userCreatedDate.isSame(endDate, "day");
      if (!isInRange) {
        return false;
      }
    }

    // Filter by status
    if (status && user.status !== status.toLowerCase()) {
      return false;
    }

    // Filter by role
    if (role && !user.vendorRoles.some((r) => r.role === role)) {
      return false;
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !user.firstName.toLowerCase().includes(searchLower) &&
        !user.lastName.toLowerCase().includes(searchLower) &&
        !user.email.toLowerCase().includes(searchLower) &&
        !user.username.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    return true;
  });

  const handleToggleColumn = (id: number) =>
    setColumns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );

  const handleMove = (index: number, dir: string) => {
    const newCols = [...columns];
    const swap = dir === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= newCols.length) return;
    [newCols[index], newCols[swap]] = [newCols[swap], newCols[index]];
    setColumns(newCols);
  };

  const cards = [
    {
      title: "Active Users",
      value: users.filter((u) => u.status === "active").length.toString(),
      change: "+0%",
      desc: "All staff currently authorized in the system",
      color: "var(--color-status-success)",
      bgColor: "var(--color-status-success-light)",
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Present User",
      value: users
        .filter((u) => u.isEmailVerified && u.isPhoneVerified)
        .length.toString(),
      change: "+0%",
      desc: "Staff checked in for the ongoing shift",
      color: "var(--color-primary-600)",
      bgColor: "var(--color-primary-bg-light)",
      icon: <LuUserRoundCheck />,
    },
    {
      title: "On Leaves User",
      value: users
        .filter((u) => !u.isEmailVerified || !u.isPhoneVerified)
        .length.toString(),
      change: "0%",
      desc: "Staff offcially marked on leave",
      color: "var(--color-status-warning)",
      bgColor: "var(--color-status-warning-light)",
      icon: <LuUserRoundX />,
    },
    {
      title: "Inactive user",
      value: users.filter((u) => u.status === "inactive").length.toString(),
      change: "0%",
      desc: "Staff no longer of operations",
      color: "var(--color-status-error)",
      bgColor: "var(--color-status-error-light)",
      icon: <LuUserRoundX />,
    },
  ];

  return (
    <Box>
      <UserStatsCards cards={cards} />
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
          p: 3,
          overflow: "visible",
        }}
      >
        <h2 className="mb-4 text-lg">Filters</h2>

        <UserFilters
          {...{
            status,
            setStatus,
            role,
            setRole,
            startDate,
            setStartDate,
            endDate,
            setEndDate,
            isCalendarOpen,
            setIsCalendarOpen,
            dateRangeOptions,
          }}
        />
        <Divider sx={{ my: 2 }} />
        <SortAndManageColumns
          {...{
            sortAnchorEl,
            setSortAnchorEl,
            manageAnchorEl,
            setManageAnchorEl,
            columns,
            handleMove,
            handleToggleColumn,
            handleSaveColumns: () => setManageAnchorEl(null),
            search,
            setSearch,
          }}
        />
      </Card>
      <UsersTable
        {...{
          users: filteredUsers,
          isLoading,
          error,
          currentPage,
          setCurrentPage,
          totalPages,
        }}
      />
    </Box>
  );
};