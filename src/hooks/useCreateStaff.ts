import { useMutation } from '@tanstack/react-query';
import { usersService, staffService } from '../services/api';
import type { CreateUserData, CreateStaffData } from '../services/api';

export const useCreateStaff = () => {
  return useMutation({
    mutationFn: async (staffData: CreateStaffData) => {
      return await staffService.createStaff(staffData);
    },
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (userData: CreateUserData) => {
      return await usersService.createUser(userData);
    },
  });
};
