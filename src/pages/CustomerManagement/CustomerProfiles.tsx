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
import { customerService } from "../../services/api";

export const CustomerProfiles = () => {
  const [status, setStatus] = useState("");
  const [customerType, setCustomerType] = useState("");
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
  const { data: customerData, isLoading, refetch } = useGetCustomers(
    vendorId,
    currentPage,
    10
  );

  const customers = customerData?.data || [];
  const totalPages = customerData?.pagination?.totalPages || 1;
  console.log('Customers Data:', customers);

  const handleDeleteCustomer = async (item: any) => {
    try {
      await customerService.deleteCustomer(item.id);
      // Refetch customers list after deletion
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete customer');
    }
  };

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
          (customerCreatedDate.isAfter(startDate) || customerCreatedDate.isSame(startDate, "day")) &&
          (customerCreatedDate.isBefore(endDate) || customerCreatedDate.isSame(endDate, "day"));
        if (!isInRange) {
          return false;
        }
      }

      // Filter by status - check status field directly
      if (status && customer.status !== status.toLowerCase()) {
        return false;
      }

      // Filter by customer type
      if (customerType && customer.customerType !== customerType) {
        return false;
      }

      // Filter by search
      if (search) {
        const searchLower = search.toLowerCase();
        const firstName = customer.firstName || "";
        const lastName = customer.lastName || "";
        const email = customer.email || "";
        const customerId = customer.customerId || "";

        if (
          !firstName.toLowerCase().includes(searchLower) &&
          !lastName.toLowerCase().includes(searchLower) &&
          !email.toLowerCase().includes(searchLower) &&
          !customerId.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [customers, status, customerType, startDate, endDate, search]);

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
      title: "Total Customers",
      value: customers.length.toString(),
      change: "0%",
      desc: "Total customers in the system",
      color: "var(--color-status-success)",
      bgColor: "var(--color-status-success-light)",
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Active Customers",
      value: customers
        .filter((c: any) => c.status === "active")
        .length.toString(),
      change: "+0%",
      desc: "All customers currently active in the system",
      color: "var(--color-primary-600)",
      bgColor: "var(--color-primary-bg-light)",
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Verified Customers",
      value: customers
        .filter((c: any) => c.personalInfo !== null)
        .length.toString(),
      change: "+0%",
      desc: "Customers with complete profile information",
      color: "var(--color-status-warning)",
      bgColor: "var(--color-status-warning-light)",
      icon: <LuUserRoundX />,
    },
    {
      title: "Inactive Customers",
      value: customers
        .filter((c: any) => c.status === "inactive")
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
      key: "firstName",
      label: "Customer Name",
      render: (_: any, item: any) => {
        const firstName = item?.firstName || "N/A";
        const lastName = item?.lastName || "N/A";
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
      key: "email",
      label: "Email",
      render: (_: any, item: any) => {
        return item?.email || "N/A";
      },
    },
    {
      key: "customerType",
      label: "Type",
      render: (_: any, item: any) => {
        return item?.customerType || "N/A";
      },
    },
    {
      key: "customerStatus",
      label: "Status",
      render: (_: any, item: any) => {
        return (
          <Box
            sx={{
              display: "inline-block",
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              bgcolor:
                item?.status === "active"
                  ? "var(--color-status-success-light)"
                  : "var(--color-status-error-light)",
              color:
                item?.status === "active"
                  ? "var(--color-status-success)"
                  : "var(--color-status-error)",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {item?.status || "N/A"}
          </Box>
        );
      },
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
            customerType,
            setCustomerType,
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
        onDelete={(item) => handleDeleteCustomer(item)}
      />
    </Box>
  );
};
