import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffService } from '../services/api';
import type { CreateStaffData } from '../services/api';
import type { StaffResponse } from '../types/user';
import { userKeys } from './useUsers';

// Get Staff Query
export const useGetStaff = (vendorId: string | null, page = 1, limit = 10) => {
  return useQuery<StaffResponse, Error>({
    queryKey: ['staff', vendorId, page, limit],
    queryFn: async () => {
      if (!vendorId) {
        return Promise.resolve({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false } });
      }
      return staffService.getStaff(vendorId, page, limit);
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
      // Invalidate users list since staff assignment affects user data
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create staff:', error);
    },
  });
};