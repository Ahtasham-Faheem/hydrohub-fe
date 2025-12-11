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

export const CustomerProfiles = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [dateRange, setDateRange] = useState("");
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
    if (dateRange) filters.dateRange = dateRange;
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
          status={status}
          setStatus={setStatus}
          dateRange={dateRange}
          setDateRange={setDateRange}
          customerType={customerType}
          setCustomerType={setCustomerType}
          onFiltersChange={() => setCurrentPage(1)}
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
