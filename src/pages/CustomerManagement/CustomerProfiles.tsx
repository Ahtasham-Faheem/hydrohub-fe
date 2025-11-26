import { useState } from "react";
import { Box, Card, Divider } from "@mui/material";
import dayjs from "dayjs";
import { LuUserRoundCheck, LuUserRoundX } from "react-icons/lu";
import { UserStatsCards } from "../../components/users/UserStatsCards";
import { UserFilters } from "../../components/users/UserFilters";
import { SortAndManageColumns } from "../../components/users/SortAndManageColumns";
import { UsersTable } from "../../components/users/UsersTable";

// Dummy customer data
const dummyCustomers = [
  {
    id: 1,
    firstName: "Ahmed",
    lastName: "Khan",
    email: "ahmed.khan@example.com",
    username: "ahmedkhan",
    status: "active",
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: dayjs().subtract(5, "days").toISOString(),
    vendorRoles: [{ role: "Customer" }],
    phone: "+92-300-1234567",
    companyName: "Khan Trading Co.",
    profilePictureAssetId: '',
  },
  {
    id: 2,
    firstName: "Fatima",
    lastName: "Ali",
    email: "fatima.ali@example.com",
    username: "fatimaali",
    status: "active",
    isEmailVerified: true,
    isPhoneVerified: false,
    createdAt: dayjs().subtract(10, "days").toISOString(),
    vendorRoles: [{ role: "Customer" }],
    phone: "+92-300-2345678",
    companyName: "Ali Enterprises",
    profilePictureAssetId: '',
  },
  {
    id: 3,
    firstName: "Hassan",
    lastName: "Malik",
    email: "hassan.malik@example.com",
    username: "hassanmalik",
    status: "inactive",
    isEmailVerified: false,
    isPhoneVerified: true,
    createdAt: dayjs().subtract(15, "days").toISOString(),
    vendorRoles: [{ role: "Customer" }],
    phone: "+92-300-3456789",
    companyName: "Malik Industries",
    profilePictureAssetId: '',
  },
  {
    id: 4,
    firstName: "Aisha",
    lastName: "Hussain",
    email: "aisha.hussain@example.com",
    username: "aishahussain",
    status: "active",
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: dayjs().subtract(20, "days").toISOString(),
    vendorRoles: [{ role: "Customer" }],
    phone: "+92-300-4567890",
    companyName: "Hussain Group",
    profilePictureAssetId: '',
  },
  {
    id: 5,
    firstName: "Muhammad",
    lastName: "Raza",
    email: "muhammad.raza@example.com",
    username: "muhammadraza",
    status: "active",
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: dayjs().subtract(25, "days").toISOString(),
    vendorRoles: [{ role: "Customer" }],
    phone: "+92-300-5678901",
    companyName: "Raza Logistics",
    profilePictureAssetId: '',
  },
];

export const CustomerProfiles = () => {
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAnchorEl, setSortAnchorEl] = useState<HTMLElement | null>(null);
  const [manageAnchorEl, setManageAnchorEl] = useState<HTMLElement | null>(null);

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
  // const filteredCustomers = dummyCustomers.filter((customer) => {
  //   // Filter by date range
  //   if (startDate && endDate) {
  //     const customerCreatedDate = dayjs(customer.createdAt);
  //     const isInRange =
  //       (customerCreatedDate.isAfter(startDate) && customerCreatedDate.isBefore(endDate)) ||
  //       customerCreatedDate.isSame(startDate, "day") ||
  //       customerCreatedDate.isSame(endDate, "day");
  //     if (!isInRange) {
  //       return false;
  //     }
  //   }

  //   // Filter by status
  //   if (status && customer.status !== status.toLowerCase()) {
  //     return false;
  //   }

  //   // Filter by role
  //   if (role && !customer.vendorRoles.some((r) => r.role === role)) {
  //     return false;
  //   }

  //   // Filter by search
  //   if (search) {
  //     const searchLower = search.toLowerCase();
  //     if (
  //       !customer.firstName.toLowerCase().includes(searchLower) &&
  //       !customer.lastName.toLowerCase().includes(searchLower) &&
  //       !customer.email.toLowerCase().includes(searchLower) &&
  //       !customer.username.toLowerCase().includes(searchLower)
  //     ) {
  //       return false;
  //     }
  //   }

  //   return true;
  // });

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
      value: dummyCustomers.filter((c) => c.status === "active").length.toString(),
      change: "+0%",
      desc: "All customers currently active in the system",
      color: "var(--color-status-success)",
      bgColor: "var(--color-status-success-light)",
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Verified Customers",
      value: dummyCustomers
        .filter((c) => c.isEmailVerified && c.isPhoneVerified)
        .length.toString(),
      change: "+0%",
      desc: "Customers with verified email and phone",
      color: "var(--color-primary-600)",
      bgColor: "var(--color-primary-bg-light)",
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Pending Verification",
      value: dummyCustomers
        .filter((c) => !c.isEmailVerified || !c.isPhoneVerified)
        .length.toString(),
      change: "0%",
      desc: "Customers awaiting email or phone",
      color: "var(--color-status-warning)",
      bgColor: "var(--color-status-warning-light)",
      icon: <LuUserRoundX />,
    },
    {
      title: "Inactive Customers",
      value: dummyCustomers.filter((c) => c.status === "inactive").length.toString(),
      change: "0%",
      desc: "Customers no longer active",
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
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
      <UsersTable
        {...{
          users: dummyCustomers as any,
          isLoading: false,
          error: '',
          currentPage,
          setCurrentPage,
          totalPages: 1,
        }}
      />
    </Box>
  );
};
