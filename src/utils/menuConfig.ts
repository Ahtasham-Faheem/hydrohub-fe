import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  ShoppingCart,
  Payment,
  AccountBalance,
  Receipt,
  Inventory,
  Category,
  RateReview,
  LocalShipping,
  Schedule,
  PointOfSale,
  Assessment,
  Mail,
  Chat,
  Notifications,
  Public,
  Stars,
  PersonAdd,
  Security,
  Extension,
  WbSunny,
  NightsStay,
  Assignment,
  MonetizationOn,
  Summarize,
  RateReviewOutlined,
  NotificationsActive,
  BarChart,
  PieChart,
  ShowChart,
  Group,
  DateRange,
  AccessTime,
  Flag,
  KeyboardReturn,
  PauseCircle,
} from "@mui/icons-material";

export interface MenuItem {
  id: string;
  label: string;
  icon?: any;
  children?: MenuItem[];
  type?: 'divider';
  dividerLabel?: string;
}

export const menuConfig: MenuItem[] = [
  {
    id: 'business-operations',
    label: 'Business Operations',
    type: 'divider',
    dividerLabel: 'Business Operations',
  },
  {
    id: 'overview',
    label: 'Business Overview',
    icon: DashboardIcon,
  },
  {
    id: 'customer-management',
    label: 'Customer Management',
    icon: PeopleIcon,
    children: [
      {
        id: 'customer-profiles',
        label: 'Customer Profiles',
        icon: PersonAdd,
      },
      {
        id: 'customer-orders',
        label: 'Customer Orders',
        icon: ShoppingCart,
      },
      {
        id: 'customer-payments',
        label: 'Customer Payments',
        icon: Payment,
      },
      {
        id: 'customer-ranking',
        label: 'Customer Ranking',
        icon: Stars,
      },
      {
        id: 'customer-categories',
        label: 'Customer Categories',
        icon: Category,
      },
      {
        id: 'chat-conversations',
        label: 'Chat / Conversations',
        icon: Chat,
      },
      {
        id: 'email-communication',
        label: 'Email / Communication Logs',
        icon: Mail,
      },
      {
        id: 'customer-insights',
        label: 'Customer Insights',
        icon: Assessment,
      },
      {
        id: 'reviews-ratings',
        label: 'Reviews & Ratings (Public)',
        icon: RateReview,
      },
      {
        id: 'alerts-followups',
        label: 'Alerts & Follow-ups',
        icon: NotificationsActive,
      },
    ],
  },
  {
    id: 'manage-reviews',
    label: 'Manage Reviews',
    icon: RateReviewOutlined,
    children: [
      {
        id: 'orders-management',
        label: 'Orders Management',
        icon: Assignment,
      },
      {
        id: 'payments-receipts',
        label: 'Payments & Receipts',
        icon: Receipt,
      },
      {
        id: 'accounts-overview',
        label: 'Accounts Overview',
        icon: AccountBalance,
      },
      {
        id: 'expenses-management',
        label: 'Expenses Management',
        icon: MonetizationOn,
      },
      {
        id: 'invoices-billing',
        label: 'Invoices & Billing',
        icon: Receipt,
      },
      {
        id: 'catalogue',
        label: 'Catalogue Management',
        icon: Inventory,
      },
      {
        id: 'orders',
        label: 'Create Order',
        icon: ShoppingCart,
      },
    ],
  },
  {
    id: 'workforce-divider',
    label: 'Workforce & Shift Management',
    type: 'divider',
    dividerLabel: 'Workforce & Shift Management',
  },
  {
    id: 'workforce-shift',
    label: 'Workforce & Shift Management',
    icon: Group,
    children: [
      {
        id: 'users',
        label: 'System Users',
        icon: PeopleIcon,
      },
      {
        id: 'shift-management',
        label: 'Shift Management',
        icon: Schedule,
      },
      {
        id: 'start-of-day',
        label: 'Start of Day (SOD)',
        icon: WbSunny,
      },
      {
        id: 'close-of-day',
        label: 'Close of Day (COD)',
        icon: NightsStay,
      },
      {
        id: 'scheduler',
        label: 'Scheduler',
        icon: DateRange,
      },
    ],
  },
  {
    id: 'sales-pos-divider',
    label: 'Sales & POS Operations',
    type: 'divider',
    dividerLabel: 'Sales & POS Operations',
  },
  {
    id: 'sales-pos',
    label: 'Sales & POS Operations',
    icon: PointOfSale,
    children: [
      {
        id: 'pos-dashboard',
        label: 'POS Dashboard',
        icon: DashboardIcon,
      },
      {
        id: 'parked-receipts',
        label: 'Parked Receipts',
        icon: PauseCircle,
      },
      {
        id: 'claims-foc',
        label: 'Claims & FOC',
        icon: Flag,
      },
      {
        id: 'returns-refunds',
        label: 'Returns & Refunds',
        icon: KeyboardReturn,
      },
      {
        id: 'sales-summary',
        label: 'Sales Summary',
        icon: Summarize,
      },
    ],
  },
  {
    id: 'logistics-divider',
    label: 'Logistics & Supply Chain',
    type: 'divider',
    dividerLabel: 'Logistics & Supply Chain',
  },
  {
    id: 'logistics-supply',
    label: 'Logistics & Supply Chain',
    icon: LocalShipping,
    children: [
      {
        id: 'logistics-management',
        label: 'Logistics Management',
        icon: LocalShipping,
      },
      {
        id: 'delivery-tracker',
        label: 'Delivery Tracker',
        icon: AccessTime,
      },
      {
        id: 'fleet-management',
        label: 'Fleet Management',
        icon: LocalShipping,
      },
      {
        id: 'inventory-stock',
        label: 'Inventory / Stock Control',
        icon: Inventory,
      },
      {
        id: 'route-planning',
        label: 'Route Planning',
        icon: Public,
      },
    ],
  },
  {
    id: 'communication-divider',
    label: 'Communication & Coordination',
    type: 'divider',
    dividerLabel: 'Communication & Coordination',
  },
  {
    id: 'communication',
    label: 'Communication & Coordination',
    icon: Chat,
    children: [
      {
        id: 'message-center',
        label: 'Message Center',
        icon: Mail,
        children: [
          {
            id: 'email',
            label: 'Email',
          },
          {
            id: 'chat',
            label: 'Chat',
          },
        ],
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: Notifications,
        children: [
          {
            id: 'todo',
            label: 'To-do',
          },
          {
            id: 'notes',
            label: 'Notes',
          },
          {
            id: 'calendar',
            label: 'Calendar',
          },
        ],
      },
    ],
  },
  {
    id: 'insights-divider',
    label: 'Insights & Reporting',
    type: 'divider',
    dividerLabel: 'Insights & Reporting',
  },
  {
    id: 'insights-reporting',
    label: 'Insights & Reporting',
    icon: BarChart,
    children: [
      {
        id: 'business-analytics',
        label: 'Business Analytics',
        icon: PieChart,
      },
      {
        id: 'revenue-reports',
        label: 'Revenue Reports',
        icon: ShowChart,
      },
      {
        id: 'operational-summary',
        label: 'Operational Summary',
        icon: Summarize,
      },
    ],
  },
  {
    id: 'system-divider',
    label: 'System & Configuration',
    type: 'divider',
    dividerLabel: 'System & Configuration',
  },
  {
    id: 'system-configuration',
    label: 'System & Configuration',
    icon: SettingsIcon,
    children: [
      {
        id: 'system-settings',
        label: 'System Settings',
        icon: SettingsIcon,
        children: [
          {
            id: 'outlet-profile',
            label: 'Outlet Profile',
          },
          {
            id: 'payment-channels',
            label: 'Payment Channels',
          },
          {
            id: 'regional-settings',
            label: 'Regional Settings',
          },
          {
            id: 'customer-labels',
            label: 'Customer Labels',
          },
          {
            id: 'customer-category-settings',
            label: 'Customer Category',
          },
          {
            id: 'customer-ranking-settings',
            label: 'Customer Ranking',
          },
        ],
      },
      {
        id: 'user-roles',
        label: 'User Roles & Permissions',
        icon: Security,
      },
      {
        id: 'integrations',
        label: 'Integrations',
        icon: Extension,
      },
    ],
  },
];

// Helper function to get all parent IDs for a given item ID
export const getParentIds = (
  items: MenuItem[],
  targetId: string,
  parents: string[] = []
): string[] => {
  for (const item of items) {
    if (item.id === targetId) {
      return parents;
    }
    if (item.children) {
      const found = getParentIds(item.children, targetId, [...parents, item.id]);
      if (found.length > 0 || item.children.some(child => child.id === targetId)) {
        return [...parents, item.id];
      }
    }
  }
  return [];
};

// Helper function to check if an item has children
export const hasChildren = (item: MenuItem): boolean => {
  return !!item.children && item.children.length > 0;
};

// Helper function to get all descendant IDs
export const getAllDescendantIds = (item: MenuItem): string[] => {
  let ids: string[] = [];
  if (item.children) {
    item.children.forEach(child => {
      ids.push(child.id);
      ids = [...ids, ...getAllDescendantIds(child)];
    });
  }
  return ids;
};