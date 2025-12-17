import { useState } from "react";
import { Box, Card, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LuUserRoundCheck, LuUserRoundX } from "react-icons/lu";
import { UserStatsCards } from "../../components/users/UserStatsCards";
import { UserFilters } from "../../components/users/UserFilters";
import { SortAndManageColumns } from "../../components/users/SortAndManageColumns";
import { DataTable } from "../../components/common/DataTable";
import type { Column } from "../../components/common/DataTable";
import { useGetCustomers } from "../../hooks/useCustomer";
import { customerService } from "../../services/api";
import { useTheme } from "../../contexts/ThemeContext";

export const CustomerProfiles = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [status, setStatus] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAnchorEl, setSortAnchorEl] = useState<HTMLElement | null>(null);
  const [manageAnchorEl, setManageAnchorEl] = useState<HTMLElement | null>(
    null
  );

  // Get vendorId from localStorage
  const vendorData = localStorage.getItem("userData");
  const vendorId = vendorData ? JSON.parse(vendorData).id : null;

  // Build filters object for API
  const buildFilters = () => {
    const filters: any = {};
    if (status) filters.status = status;
    if (customerType) filters.customerType = customerType;
    if (startDate) filters.dateFrom = startDate.format('YYYY-MM-DD');
    if (endDate) filters.dateTo = endDate.format('YYYY-MM-DD');
    if (search) filters.search = search;
    return Object.keys(filters).length > 0 ? filters : undefined;
  };

  // Fetch customers using the API with filters
  const { data: customerData, isLoading } = useGetCustomers(
    vendorId,
    currentPage,
    10,
    buildFilters()
  );

  const customers = customerData?.data || [];
  const totalPages = customerData?.pagination?.totalPages || 1;
  console.log('Customers Data:', customers);

  const handleDeleteCustomer = async (item: any) => {
    try {
      await customerService.deleteCustomer(item.id);
      // Refetch customers list after deletion
      // refetch();
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
      color: colors.status.success,
      bgColor: colors.background.tertiary,
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Active Customers",
      value: customers
        .filter((c: any) => c.status === "active")
        .length.toString(),
      change: "+0%",
      desc: "All customers currently active in the system",
      color: colors.primary[600],
      bgColor: colors.background.tertiary,
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Verified Customers",
      value: customers
        .filter((c: any) => c.personalInfo !== null)
        .length.toString(),
      change: "+0%",
      desc: "Customers with complete profile information",
      color: colors.status.warning,
      bgColor: colors.background.tertiary,
      icon: <LuUserRoundX />,
    },
    {
      title: "Inactive Customers",
      value: customers
        .filter((c: any) => c.status === "inactive")
        .length.toString(),
      change: "0%",
      desc: "Customers no longer active",
      color: colors.status.error,
      bgColor: colors.background.tertiary,
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
                bgcolor: colors.primary[600],
                color: colors.text.inverse,
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              {initials}
            </Box>
            <Box>
              <Box sx={{ fontWeight: 600, fontSize: 14, color: colors.text.primary }}>
                {firstName} {lastName}
              </Box>
              <Box sx={{ fontSize: 12, color: colors.text.secondary }}>
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
                  ? colors.background.tertiary
                  : colors.background.tertiary,
              color:
                item?.status === "active"
                  ? colors.status.success
                  : colors.status.error,
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "capitalize",
              border: `1px solid ${item?.status === "active" ? colors.status.success : colors.status.error}`,
            }}
          >
            {item?.status || "N/A"}
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ backgroundColor: colors.background.primary, minHeight: '100vh' }}>
      <UserStatsCards cards={cards} />
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: colors.shadow.md,
          border: `1px solid ${colors.border.primary}`,
          backgroundColor: colors.background.card,
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
          <h2 className="text-lg" style={{ color: colors.text.primary }}>Filters</h2>
        </Box>

        <UserFilters
          status={status}
          setStatus={setStatus}
          dateRange={dateRange}
          setDateRange={setDateRange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          customerType={customerType}
          setCustomerType={setCustomerType}
          onFiltersChange={() => setCurrentPage(1)}
        />
        <Divider sx={{ my: 2, borderColor: colors.border.primary }} />
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
        data={customers}
        isLoading={isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        keyField="id"
        showActions={true}
        onView={(item) => console.log("View customer", item)}
        onEdit={(item) => navigate(`/dashboard/customer-profiles/edit/${item.id}`)}
        onDelete={(item) => handleDeleteCustomer(item)}
      />
    </Box>
  );
};
