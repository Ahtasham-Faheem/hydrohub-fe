/**
 * Query Keys Factory
 * Centralized query key management for TanStack Query
 * Ensures consistent cache invalidation and prevents bugs
 */

export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
  },

  // Staff queries
  staff: {
    all: ['staff'] as const,
    lists: () => [...queryKeys.staff.all, 'list'] as const,
    list: (vendorId: string | null, page: number, limit: number) =>
      [...queryKeys.staff.lists(), { vendorId, page, limit }] as const,
    detail: (staffId: string) =>
      [...queryKeys.staff.all, 'detail', staffId] as const,
    supervisors: (vendorId: string) =>
      [...queryKeys.staff.all, 'supervisors', vendorId] as const,
  },

  // Customer queries
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (vendorId: string | null, page: number, limit: number) =>
      [...queryKeys.customers.lists(), { vendorId, page, limit }] as const,
    detail: (customerId: string) =>
      [...queryKeys.customers.all, 'detail', customerId] as const,
  },

  // Address queries
  addresses: {
    all: ['addresses'] as const,
    byCustomer: (customerId: string) =>
      [...queryKeys.addresses.all, 'customer', customerId] as const,
  },

  // Linked Accounts queries
  linkedAccounts: {
    all: ['linkedAccounts'] as const,
    byCustomer: (customerId: string) =>
      [...queryKeys.linkedAccounts.all, 'customer', customerId] as const,
  },

  // Assets queries
  assets: {
    all: ['assets'] as const,
  },

  // Documents queries
  documents: {
    all: ['documents'] as const,
    byStaff: (staffId: string) =>
      [...queryKeys.documents.all, 'staff', staffId] as const,
  },
} as const;

// Helper function to invalidate related queries after mutations
export const getRelatedQueryKeys = (mutationType: string) => {
  const mutations: Record<string, string[][]> = {
    createStaff: [[...queryKeys.staff.lists()]],
    updateStaff: [[...queryKeys.staff.lists()]],
    deleteStaff: [[...queryKeys.staff.lists()]],
    createCustomer: [[...queryKeys.customers.lists()]],
    updateCustomer: [[...queryKeys.customers.lists()]],
    deleteCustomer: [[...queryKeys.customers.lists()]],
    createAddress: [[...queryKeys.addresses.all]],
    updateAddress: [[...queryKeys.addresses.all]],
    deleteAddress: [[...queryKeys.addresses.all]],
    createLinkedAccount: [[...queryKeys.linkedAccounts.all]],
    updateLinkedAccount: [[...queryKeys.linkedAccounts.all]],
    deleteLinkedAccount: [[...queryKeys.linkedAccounts.all]],
  };

  return mutations[mutationType] || [];
};
