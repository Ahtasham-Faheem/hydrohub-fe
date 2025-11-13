import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '../services/api';
import type { CreateStaffData } from '../services/api';
import { userKeys } from './useUsers';

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