import { useState } from "react";
import { Box, Card, Divider } from "@mui/material";
import dayjs from "dayjs";
import { useGetStaff } from "../../hooks/useStaff";
import { LuUserRoundCheck, LuUserRoundX } from "react-icons/lu";
import { UserStatsCards } from "../../components/users/UserStatsCards";
import { UserFilters } from "../../components/users/UserFilters";
import { SortAndManageColumns } from "../../components/users/SortAndManageColumns";
import { DataTable } from "../../components/common/DataTable";
import type { Column } from "../../components/common/DataTable";

export const UsersPage = () => {
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get vendorId from localStorage
  const vendorData = localStorage.getItem('userData');
  const vendorId = vendorData ? JSON.parse(vendorData).id : null;
  
  // Using TanStack Query to fetch staff members
  const { data: staffData, isLoading } = useGetStaff(vendorId, currentPage, 10);
  
  const staff = staffData?.data || [];
  const totalPages = staffData?.pagination?.totalPages || 1;
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

  // Filter users based on selected filters
  const filteredStaff = staff.filter((staffMember: any) => {
    // Filter by date range - fixed date range issue (was off by 1)
    if (startDate && endDate) {
      const userCreatedDate = dayjs(staffMember.createdAt);
      const isInRange =
        (userCreatedDate.isAfter(startDate) || userCreatedDate.isSame(startDate, "day")) &&
        (userCreatedDate.isBefore(endDate) || userCreatedDate.isSame(endDate, "day"));
      if (!isInRange) {
        return false;
      }
    }

    // Filter by status - fixed field name (was "status" not "userStatus")
    if (status && staffMember?.status !== status.toLowerCase()) {
      return false;
    }

    // Filter by role - fixed field name (was "userRole" should be "role")
    if (role && staffMember?.role !== role) {
      return false;
    }

    // Filter by search - updated to check correct fields
    if (search) {
      const searchLower = search.toLowerCase();
      const firstName = staffMember?.firstName || '';
      const lastName = staffMember?.lastName || '';
      const email = staffMember?.email || '';
      const staffId = staffMember?.staffId || '';
      
      if (
        !firstName.toLowerCase().includes(searchLower) &&
        !lastName.toLowerCase().includes(searchLower) &&
        !email.toLowerCase().includes(searchLower) &&
        !staffId.toLowerCase().includes(searchLower)
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

  // const handleDeleteStaff = async (item: any) => {
  //   try {
  //     await staffService.deleteStaff(item.id);
  //     // Refetch staff list after deletion
  //     refetch();
  //   } catch (err: any) {
  //     alert(err.response?.data?.message || 'Failed to delete staff member');
  //   }
  // };

  const cards = [
    {
      title: "Active Users",
      value: staff.filter((u: any) => u?.status === "active").length.toString(),
      change: "+0%",
      desc: "All staff currently authorized in the system",
      color: "var(--color-status-success)",
      bgColor: "var(--color-status-success-light)",
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Total Staff",
      value: staff.length.toString(),
      change: "+0%",
      desc: "Total staff members in the system",
      color: "var(--color-primary-600)",
      bgColor: "var(--color-primary-bg-light)",
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Supervisors",
      value: staff.filter((u: any) => u?.role === "supervisor").length.toString(),
      change: "0%",
      desc: "Supervisory staff members",
      color: "var(--color-status-warning)",
      bgColor: "var(--color-status-warning-light)",
      icon: <LuUserRoundX />,
    },
    {
      title: "Inactive Users",
      value: staff.filter((u: any) => u?.status === "inactive").length.toString(),
      change: "0%",
      desc: "Users no longer active in operations",
      color: "var(--color-status-error)",
      bgColor: "var(--color-status-error-light)",
      icon: <LuUserRoundX />,
    },
  ];

  // Define columns for the DataTable
  const tableColumns: Column[] = [
    {
      key: "firstName",
      label: "User",
      render: (_: any, item: any) => {
        const firstName = item?.firstName || 'N/A';
        const lastName = item?.lastName || 'N/A';
        const initials = (firstName?.[0] || 'U') + (lastName?.[0] || 'S');
        return (
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'var(--color-primary-600)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {initials}
            </Box>
            <Box>
              <Box sx={{ fontWeight: 600, fontSize: 14 }}>
                {firstName} {lastName}
              </Box>
              <Box sx={{ fontSize: 12, color: '#6b7280' }}>
                @{item.staffId}
              </Box>
            </Box>
          </Box>
        );
      },
    },
    {
      key: "email",
      label: "Email",
      render: (_: any, item: any) => {
        return item?.email || 'N/A';
      }
    },
    {
      key: "role",
      label: "Role",
      render: (_: any, item: any) => {
        return (item?.role || 'N/A').replace('_', ' ').toUpperCase();
      }
    },
    {
      key: "status",
      label: "Status",
      render: (_: any, item: any) => (
        <Box
          sx={{
            display: 'inline-block',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            bgcolor: item?.status === "active" ? "var(--color-status-success-light)" : "var(--color-status-error-light)",
            color: item?.status === "active" ? "var(--color-status-success)" : "var(--color-status-error)",
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        >
          {item?.status || 'N/A'}
        </Box>
      ),
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
      <DataTable
        columns={tableColumns}
        data={filteredStaff}
        isLoading={isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        keyField="id"
        showActions={true}
        onView={(item) => console.log("View", item)}
        onEdit={(item) => console.log("Edit", item)}
        onDelete={(item) => console.log("Delete", item)}
      />
    </Box>
  );
};