import { useState, useMemo } from "react";
import { Box, Card, Divider, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetStaff } from "../../hooks/useStaff";
import { LuUserRoundCheck, LuUserRoundX } from "react-icons/lu";
import { HiOutlineRefresh } from "react-icons/hi";
import { GoMoveToTop } from "react-icons/go";
import { UserStatsCards } from "../../components/users/UserStatsCards";
import { UserFilters } from "../../components/users/UserFilters";
import { SortAndManageColumns } from "../../components/users/SortAndManageColumns";
import { DataTable } from "../../components/common/DataTable";
import { CustomSelect } from "../../components/common/CustomSelect";
import type { Column, SortConfig } from "../../components/common/DataTable";
import { useTheme } from "../../contexts/ThemeContext";
import { staffService } from "../../services/api";

export const UsersPage = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState("");

  // Get vendorId from localStorage
  const vendorData = localStorage.getItem("userData");
  const vendorId = vendorData ? JSON.parse(vendorData).id : null;

  // Build filters object for API
  const buildFilters = () => {
    const filters: any = {};
    if (status) filters.status = status;
    if (role) filters.role = role;
    if (startDate) filters.dateFrom = startDate.format("YYYY-MM-DD");
    if (endDate) filters.dateTo = endDate.format("YYYY-MM-DD");
    if (search) filters.search = search;
    return Object.keys(filters).length > 0 ? filters : undefined;
  };

  // Using TanStack Query to fetch staff members with filters
  const { data: staffData, isLoading, refetch } = useGetStaff(
    vendorId,
    currentPage,
    10,
    buildFilters()
  );

  const staff = staffData?.data || [];
  const totalPages = staffData?.pagination?.totalPages || 1;
  const [sortAnchorEl, setSortAnchorEl] = useState<HTMLElement | null>(null);
  const [manageAnchorEl, setManageAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const [columns, setColumns] = useState([
    { id: 1, key: "firstName", label: "User", enabled: true },
    { id: 2, key: "email", label: "Email", enabled: true },
    { id: 3, key: "role", label: "Role", enabled: true },
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
  const sortedAndFilteredStaff = useMemo(() => {
    let filteredData = staff;

    // Apply search filter
    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      filteredData = staff.filter((item: any) => {
        const firstName = (item?.firstName || "").toLowerCase();
        const lastName = (item?.lastName || "").toLowerCase();
        const email = (item?.email || "").toLowerCase();
        const role = (item?.role || "").toLowerCase();
        const status = (item?.status || "").toLowerCase();
        const staffId = (item?.staffId || "").toLowerCase();

        return (
          firstName.includes(searchTerm) ||
          lastName.includes(searchTerm) ||
          email.includes(searchTerm) ||
          role.includes(searchTerm) ||
          status.includes(searchTerm) ||
          staffId.includes(searchTerm) ||
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
  }, [staff, sortConfig, search]);

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
  const handleDeleteUser = async (item: any) => {
      console.log(item)
      try {
        await staffService.deleteStaff(item.id);
        // Refetch customers list after deletion
        refetch();
      } catch (err: any) {
        console.error(err.response?.data?.message || "Failed to delete customer");
      }
    };

  // Handle export functionality
  const handleExport = (format: string) => {
    if (!format) return;
    console.log(`Exporting users data as ${format}...`);
    // TODO: Implement export functionality based on format
    switch (format) {
      case 'csv':
        // Implement CSV export
        break;
      case 'excel':
        // Implement Excel export
        break;
      case 'json':
        // Implement JSON export
        break;
      case 'print':
        // Implement Print functionality
        break;
      case 'pdf':
        // Implement PDF export
        break;
      default:
        console.log('Unknown export format');
    }
  };

  // Handle refresh functionality
  const handleRefresh = () => {
    refetch();
  };

  const cards = [
    {
      title: "Active Users",
      value: sortedAndFilteredStaff
        .filter((u: any) => u?.status === "active")
        .length.toString(),
      change: "+0%",
      desc: "All staff currently authorized in the system",
      color: colors.status.success,
      bgColor: colors.status.successLight,
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Total Staff",
      value: sortedAndFilteredStaff.length.toString(),
      change: "+0%",
      desc: "Total staff members in the system",
      color: colors.primary[600],
      bgColor: colors.status.infoLight,
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Supervisors",
      value: sortedAndFilteredStaff
        .filter((u: any) => u?.role === "supervisor")
        .length.toString(),
      change: "0%",
      desc: "Supervisory staff members",
      color: colors.status.warning,
      bgColor: colors.status.warningLight,
      icon: <LuUserRoundX />,
    },
    {
      title: "Inactive Users",
      value: sortedAndFilteredStaff
        .filter((u: any) => u?.status === "inactive")
        .length.toString(),
      change: "0%",
      desc: "Users no longer active in operations",
      color: colors.status.error,
      bgColor: colors.status.errorLight,
      icon: <LuUserRoundX />,
    },
  ];

  // Define columns for the DataTable
  const tableColumns: Column[] = [
    {
      key: "firstName",
      label: "User",
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
                  fontSize: "1.25rem",
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
      sortable: true,
      visible: columns.find((c) => c.key === "email")?.enabled,
      render: (_: any, item: any) => {
        return item?.email || "N/A";
      },
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      visible: columns.find((c) => c.key === "role")?.enabled,
      render: (_: any, item: any) => {
        return (item?.role || "N/A").replace("_", " ").toUpperCase();
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      visible: columns.find((c) => c.key === "status")?.enabled,
      render: (_: any, item: any) => (
        <Box
          sx={{
            display: "inline-block",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            bgcolor: colors.background.tertiary,
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
      ),
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
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
                  { value: 'csv', label: 'Export as CSV' },
                  { value: 'excel', label: 'Export as Excel' },
                  { value: 'json', label: 'Export as JSON' },
                  { value: 'print', label: 'Print' },
                  { value: 'pdf', label: 'Export as PDF' },
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
          role={role}
          setRole={setRole}
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
            currentSort: sortConfig,
            onSort: handleSort,
            sortOptions: [
              { key: "firstName", label: "Name" },
              { key: "email", label: "Email" },
              { key: "role", label: "Role" },
              { key: "status", label: "Status" },
              { key: "createdAt", label: "Created Date" },
            ],
          }}
        />
      </Card>
      <DataTable
        columns={tableColumns}
        data={sortedAndFilteredStaff}
        isLoading={isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        keyField="id"
        showActions={true}
        showCheckbox={true}
        selectedItems={selectedUsers}
        onSelectionChange={setSelectedUsers}
        onView={(item) => console.log("View", item)}
        onEdit={(item) => navigate(`/dashboard/users/edit/${item.id}`)}
        onDelete={(item) => handleDeleteUser(item)}
        sortConfig={sortConfig}
        onSort={handleSort}
        visibleColumns={visibleColumns}
      />
    </Box>
  );
};
