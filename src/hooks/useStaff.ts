import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffService } from '../services/api';
import { queryKeys } from '../services/queryKeys';
import type { CreateStaffData } from '../services/api';
import type { StaffResponse } from '../types/user';

export interface StaffFilters {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  year?: number;
  dateRange?: string;
  role?: string;
  status?: string;
}

// Get Staff Query
export const useGetStaff = (vendorId: string | null, page = 1, limit = 10, filters?: StaffFilters) => {
  return useQuery<StaffResponse, Error>({
    queryKey: queryKeys.staff.list(vendorId, page, limit, filters),
    queryFn: async () => {
      if (!vendorId) {
        return Promise.resolve({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false } });
      }
      return staffService.getStaff(vendorId, page, limit, filters);
    },
    enabled: !!vendorId,
  });
};

// Create Staff Mutation
export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (staffData: CreateStaffData) => staffService.createStaff(staffData),
    onSuccess: () => {
      // Invalidate staff list
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.lists() });
    },
    onError: (error) => {
      console.error('Failed to create staff:', error);
    },
  });
};

// Delete Staff Mutation
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffId: string) => staffService.deleteStaff(staffId),
    onSuccess: () => {
      // Invalidate staff list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.lists() });
    },
    onError: (error: any) => {
      console.error('Failed to delete staff:', error);
    },
  });
};