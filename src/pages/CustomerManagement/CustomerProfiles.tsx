import { useState, useMemo } from "react";
import { Box, Card, Divider } from "@mui/material";
import dayjs from "dayjs";
import { LuUserRoundCheck, LuUserRoundX } from "react-icons/lu";
import { UserStatsCards } from "../../components/users/UserStatsCards";
import { UserFilters } from "../../components/users/UserFilters";
import { SortAndManageColumns } from "../../components/users/SortAndManageColumns";
import { DataTable } from "../../components/common/DataTable";
import type { Column } from "../../components/common/DataTable";
import { useGetCustomers } from "../../hooks/useCustomer";

export const CustomerProfiles = () => {
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAnchorEl, setSortAnchorEl] = useState<HTMLElement | null>(null);
  const [manageAnchorEl, setManageAnchorEl] = useState<HTMLElement | null>(
    null
  );

  // Get vendorId from localStorage
  const vendorData = localStorage.getItem("userData");
  const vendorId = vendorData ? JSON.parse(vendorData).id : null;

  // Fetch customers using the API
  const { data: customerData, isLoading } = useGetCustomers(
    vendorId,
    currentPage,
    10
  );

  const customers = customerData?.data || [];
  const totalPages = customerData?.pagination?.totalPages || 1;

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

  // Filter customers based on selected filters
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer: any) => {
      // Filter by date range
      if (startDate && endDate) {
        const customerCreatedDate = dayjs(customer.createdAt);
        const isInRange =
          (customerCreatedDate.isAfter(startDate) &&
            customerCreatedDate.isBefore(endDate)) ||
          customerCreatedDate.isSame(startDate, "day") ||
          customerCreatedDate.isSame(endDate, "day");
        if (!isInRange) {
          return false;
        }
      }

      // Filter by status - check customerStatus field
      if (status && customer.customerStatus !== status.toLowerCase()) {
        return false;
      }

      // Filter by search
      if (search) {
        const searchLower = search.toLowerCase();
        const firstName = customer.user?.firstName || "";
        const lastName = customer.user?.lastName || "";
        const email = customer.user?.email || "";

        if (
          !firstName.toLowerCase().includes(searchLower) &&
          !lastName.toLowerCase().includes(searchLower) &&
          !email.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [customers, status, startDate, endDate, search]);

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
      title: "Active Customers",
      value: customers
        .filter((c: any) => c.customerStatus === "active")
        .length.toString(),
      change: "+0%",
      desc: "All customers currently active in the system",
      color: "var(--color-status-success)",
      bgColor: "var(--color-status-success-light)",
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Verified Customers",
      value: customers
        .filter((c: any) => c.user?.status === "active")
        .length.toString(),
      change: "+0%",
      desc: "Customers with verified email and phone",
      color: "var(--color-primary-600)",
      bgColor: "var(--color-primary-bg-light)",
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Total Customers",
      value: customers.length.toString(),
      change: "0%",
      desc: "Total customers in the system",
      color: "var(--color-status-warning)",
      bgColor: "var(--color-status-warning-light)",
      icon: <LuUserRoundX />,
    },
    {
      title: "Inactive Customers",
      value: customers
        .filter((c: any) => c.customerStatus === "inactive")
        .length.toString(),
      change: "0%",
      desc: "Customers no longer active",
      color: "var(--color-status-error)",
      bgColor: "var(--color-status-error-light)",
      icon: <LuUserRoundX />,
    },
  ];

  const tableColumns: Column[] = [
    {
      key: "user.firstName",
      label: "Customer Name",
      render: (_: any, item: any) => {
        const firstName = item.user?.firstName || "N/A";
        const lastName = item.user?.lastName || "N/A";
        const initials = (firstName?.[0] || "C") + (lastName?.[0] || "U");
        return (
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "var(--color-primary-600)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              {initials}
            </Box>
            <Box>
              <Box sx={{ fontWeight: 600, fontSize: 14 }}>
                {firstName} {lastName}
              </Box>
              <Box sx={{ fontSize: 12, color: "#6b7280" }}>
                ID: {item.customerId}
              </Box>
            </Box>
          </Box>
        );
      },
    },
    {
      key: "user.email",
      label: "Email",
    },
    {
      key: "customerType",
      label: "Type",
      render: (value: string) => {
        return value ? value.charAt(0).toUpperCase() + value.slice(1) : "N/A";
      },
    },
    {
      key: "customerStatus",
      label: "Status",
      render: (value: string) => (
        <Box
          sx={{
            display: "inline-block",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            bgcolor:
              value === "active"
                ? "var(--color-status-success-light)"
                : "var(--color-status-error-light)",
            color:
              value === "active"
                ? "var(--color-status-success)"
                : "var(--color-status-error)",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {value || "N/A"}
        </Box>
      ),
    },
    {
      key: "user.status",
      label: "User Status",
      render: (value: string) => (
        <Box
          sx={{
            display: "inline-block",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            bgcolor:
              value === "active"
                ? "var(--color-status-success-light)"
                : "var(--color-status-error-light)",
            color:
              value === "active"
                ? "var(--color-status-success)"
                : "var(--color-status-error)",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {value || "N/A"}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <h2 className="text-lg">Filters</h2>
        </Box>

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
            addButtonLabel: "Add New Customer",
            addButtonPath: "/dashboard/customer-profiles/create",
          }}
        />
      </Card>
      <DataTable
        columns={tableColumns}
        data={filteredCustomers}
        isLoading={isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        keyField="id"
        showActions={true}
        onView={(item) => console.log("View customer", item)}
        onEdit={(item) => console.log("Edit customer", item)}
        onDelete={(item) => console.log("Delete customer", item)}
      />
    </Box>
  );
};
