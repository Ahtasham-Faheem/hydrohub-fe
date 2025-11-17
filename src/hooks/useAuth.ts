import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../services/api';
import type { LoginCredentials, RequestResetPasswordData, ResetPasswordData } from '../services/api';

// Login Mutation
export const useLogin = () => {
  return useMutation({
    mutationFn: ({ credentials, userType }: { credentials: LoginCredentials; userType: string }) => 
      authService.login(credentials, userType),
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

// Request Reset Password Mutation
export const useRequestResetPassword = () => {
  return useMutation({
    mutationFn: (data: RequestResetPasswordData) => authService.requestResetPassword(data),
    onError: (error) => {
      console.error('Failed to request password reset:', error);
    },
  });
};

// Reset Password Mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordData) => authService.resetPassword(data),
    onError: (error) => {
      console.error('Failed to reset password:', error);
    },
  });
};

// Get Profile Query
export const useProfile = () => {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => authService.getProfile(),
    enabled: !!localStorage.getItem('authToken'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};