import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { customerService } from '../services/api';
import { queryKeys } from '../services/queryKeys';
import type { CustomersResponse } from '../types/customer';

export const useGetCustomers = (vendorId: string | null, page: number = 1, limit: number = 10) => {
  return useQuery<CustomersResponse>({
    queryKey: queryKeys.customers.list(vendorId, page, limit),
    queryFn: async () => {
      if (!vendorId) throw new Error('Vendor ID is required');
      const response = await api.get(`/customers`, {
        params: { vendorId, page, limit }
      });
      return response.data;
    },
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) => customerService.deleteCustomer(customerId),
    onSuccess: () => {
      // Invalidate customers list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
    },
    onError: (error: any) => {
      console.error('Failed to delete customer:', error);
    },
  });
};
