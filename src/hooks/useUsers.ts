import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/api';
import type { CreateUserData } from '../services/api';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...userKeys.lists(), { page, limit }] as const,
};

// Get Users Query
export const useUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: userKeys.list(page, limit),
    queryFn: () => usersService.getUsers(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create User Mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: CreateUserData) => usersService.createUser(userData),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });
};