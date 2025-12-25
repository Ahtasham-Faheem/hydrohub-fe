import { useState, useMemo } from "react";
import { Box, Card, Divider, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LuUserRoundCheck, LuUserRoundX } from "react-icons/lu";
import { HiOutlineRefresh } from "react-icons/hi";
import { UserStatsCards } from "../../components/users/UserStatsCards";
import { UserFilters } from "../../components/users/UserFilters";
import { SortAndManageColumns } from "../../components/users/SortAndManageColumns";
import { DataTable } from "../../components/common/DataTable";
import type { Column, SortConfig } from "../../components/common/DataTable";
import { useGetCustomers } from "../../hooks/useCustomer";
import { customerService } from "../../services/api";
import { useTheme } from "../../contexts/ThemeContext";
import { CustomSelect } from "../../components/common/CustomSelect";
import { GoMoveToTop } from "react-icons/go";

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
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<HTMLElement | null>(null);
  const [manageAnchorEl, setManageAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const [exportFormat, setExportFormat] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  // Get vendorId from localStorage
  const vendorData = localStorage.getItem("userData");
  const vendorId = vendorData ? JSON.parse(vendorData).id : null;

  // Build filters object for API
  const buildFilters = () => {
    const filters: any = {};
    if (status) filters.status = status;
    if (customerType) filters.customerType = customerType;
    if (startDate) filters.dateFrom = startDate.format("YYYY-MM-DD");
    if (endDate) filters.dateTo = endDate.format("YYYY-MM-DD");
    if (search) filters.search = search;
    return Object.keys(filters).length > 0 ? filters : undefined;
  };

  // Fetch customers using the API with filters
  const {
    data: customerData,
    isLoading,
    refetch,
  } = useGetCustomers(vendorId, currentPage, 10, buildFilters());

  const customers = customerData?.data || [];
  const totalPages = customerData?.pagination?.totalPages || 1;

  const handleDeleteCustomer = async (item: any) => {
    console.log(item)
    try {
      await customerService.deleteCustomer(item.id);
      // Refetch customers list after deletion
      // refetch();
    } catch (err: any) {
      console.error(err.response?.data?.message || "Failed to delete customer");
    }
  };

  // Handle export functionality
  const handleExport = (format: string) => {
    console.log(`Exporting customers data as ${format}...`);
    // TODO: Implement export functionality based on format
    switch (format) {
      case "csv":
        // Implement CSV export
        break;
      case "excel":
        // Implement Excel export
        break;
      case "json":
        // Implement JSON export
        break;
      case "print":
        // Implement Print functionality
        break;
      case "pdf":
        // Implement PDF export
        break;
      default:
        console.log("Unknown export format");
    }
  };

  // Handle refresh functionality
  const handleRefresh = () => {
    refetch();
  };

  const [columns, setColumns] = useState([
    { id: 1, key: "firstName", label: "Customer Name", enabled: true },
    { id: 2, key: "email", label: "Email", enabled: true },
    { id: 3, key: "customerType", label: "Type", enabled: true },
    { id: 4, key: "status", label: "Status", enabled: true },
  ]);

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig((prevSort) => {
      if (prevSort?.key === key) {
        // Toggle direction if same key
        return {
          key,
          direction: prevSort.direction === "asc" ? "desc" : "asc",
        };
      } else {
        // New key, default to ascending
        return { key, direction: "asc" };
      }
    });
  };

  // Helper function to get nested values
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  // Sort and filter data based on sortConfig and search
  const sortedAndFilteredCustomers = useMemo(() => {
    let filteredData = customers;

    // Apply search filter
    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      filteredData = customers.filter((item: any) => {
        const firstName = (item?.firstName || "").toLowerCase();
        const lastName = (item?.lastName || "").toLowerCase();
        const email = (item?.email || "").toLowerCase();
        const customerType = (item?.customerType || "").toLowerCase();
        const status = (item?.status || "").toLowerCase();
        const customerId = (item?.customerId || "").toLowerCase();

        return (
          firstName.includes(searchTerm) ||
          lastName.includes(searchTerm) ||
          email.includes(searchTerm) ||
          customerType.includes(searchTerm) ||
          status.includes(searchTerm) ||
          customerId.includes(searchTerm) ||
          `${firstName} ${lastName}`.includes(searchTerm)
        );
      });
    }

    // Apply sorting
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Convert to strings for comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [customers, sortConfig, search]);

  // Get visible columns based on enabled state
  const visibleColumns = columns
    .filter((col) => col.enabled)
    .map((col) => col.key);

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
      value: sortedAndFilteredCustomers.length.toString(),
      change: "0%",
      desc: "Total customers in the system",
      color: colors.status.success,
      bgColor: colors.status.successLight,
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Active Customers",
      value: sortedAndFilteredCustomers
        .filter((c: any) => c.status === "active")
        .length.toString(),
      change: "+0%",
      desc: "All customers currently active in the system",
      color: colors.primary[600],
      bgColor: colors.status.infoLight,
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Verified Customers",
      value: sortedAndFilteredCustomers
        .filter((c: any) => c.personalInfo !== null)
        .length.toString(),
      change: "+0%",
      desc: "Customers with complete profile information",
      color: colors.status.warning,
      bgColor: colors.status.warningLight,
      icon: <LuUserRoundX />,
    },
    {
      title: "Inactive Customers",
      value: sortedAndFilteredCustomers
        .filter((c: any) => c.status === "inactive")
        .length.toString(),
      change: "0%",
      desc: "Customers no longer active",
      color: colors.status.error,
      bgColor: colors.status.errorLight,
      icon: <LuUserRoundX />,
    },
  ];

  const tableColumns: Column[] = [
    {
      key: "firstName",
      label: "Customer Name",
      sortable: true,
      visible: columns.find((c) => c.key === "firstName")?.enabled,
      render: (_: any, item: any) => {
        const firstName = item?.firstName || "N/A";
        const lastName = item?.lastName || "N/A";
        const initials = (firstName?.[0] || "U") + (lastName?.[0] || "S");
        return (
          <Box display="flex" alignItems="center" gap={2}>
            {item?.profilePictureAsset?.fileUrl ? (
              <img
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.primary[600],
                  color: colors.text.inverse,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
                src={item?.profilePictureAsset?.fileUrl}
              />
            ) : (
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
            )}
            <Box>
              <Box
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: colors.text.primary,
                }}
              >
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
      sortable: true,
      visible: columns.find((c) => c.key === "email")?.enabled,
      render: (_: any, item: any) => {
        return item?.email || "N/A";
      },
    },
    {
      key: "customerType",
      label: "Type",
      sortable: true,
      visible: columns.find((c) => c.key === "customerType")?.enabled,
      render: (_: any, item: any) => {
        return item?.customerType || "N/A";
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      visible: columns.find((c) => c.key === "status")?.enabled,
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
              border: `1px solid ${
                item?.status === "active"
                  ? colors.status.success
                  : colors.status.error
              }`,
            }}
          >
            {item?.status || "N/A"}
          </Box>
        );
      },
    },
  ];

  return (
    <Box
      sx={{ backgroundColor: colors.background.primary, minHeight: "100vh" }}
    >
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
          <h2 className="text-xl" style={{ color: colors.text.primary }}>
            Filters
          </h2>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              minWidth: 150,
            }}
          >
            {/* Export Dropdown */}
            <Box sx={{ minWidth: 150 }}>
              <CustomSelect
                label="Export"
                value={exportFormat}
                onChange={(e) => {
                  setExportFormat(e.target.value);
                  handleExport(e.target.value);
                }}
                options={[
                  { value: "csv", label: "Export as CSV" },
                  { value: "excel", label: "Export as Excel" },
                  { value: "json", label: "Export as JSON" },
                  { value: "print", label: "Print" },
                  { value: "pdf", label: "Export as PDF" },
                ]}
                size="small"
              />
            </Box>

            {/* Refresh Button */}
            <IconButton
              onClick={handleRefresh}
              sx={{
                color: colors.text.primary,
                border: `1px solid ${colors.border.primary}`,
                borderRadius: 1,
                "&:hover": {
                  borderColor: colors.primary[600],
                  backgroundColor: colors.background.secondary,
                },
              }}
            >
              <HiOutlineRefresh size={20} />
            </IconButton>

            {/* More Options Icon */}
            <IconButton
              sx={{
                color: colors.text.primary,
                border: `1px solid ${colors.border.primary}`,
                borderRadius: 1,
                "&:hover": {
                  borderColor: colors.primary[600],
                  backgroundColor: colors.background.secondary,
                },
              }}
            >
              <GoMoveToTop size={20} />
            </IconButton>
          </Box>
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
            currentSort: sortConfig,
            onSort: handleSort,
            searchPlaceholder: "Search Customer",
            sortOptions: [
              { key: "firstName", label: "Name" },
              { key: "email", label: "Email" },
              { key: "customerType", label: "Type" },
              { key: "status", label: "Status" },
              { key: "createdAt", label: "Created Date" },
            ],
          }}
        />
      </Card>
      <DataTable
        columns={tableColumns}
        data={sortedAndFilteredCustomers}
        isLoading={isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        keyField="id"
        showActions={true}
        showCheckbox={true}
        selectedItems={selectedCustomers}
        onSelectionChange={setSelectedCustomers}
        onView={(item) => console.log("View customer", item)}
        onEdit={(item) =>
          navigate(`/dashboard/customer-profiles/edit/${item.id}`)
        }
        onDelete={(item) => handleDeleteCustomer(item)}
        sortConfig={sortConfig}
        onSort={handleSort}
        visibleColumns={visibleColumns}
      />
    </Box>
  );
};
