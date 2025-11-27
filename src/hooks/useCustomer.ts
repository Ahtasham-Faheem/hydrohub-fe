import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { CustomersResponse } from '../types/customer';

export const useGetCustomers = (vendorId: string | null, page: number = 1, limit: number = 10) => {
  return useQuery<CustomersResponse>({
    queryKey: ['customers', vendorId, page, limit],
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
