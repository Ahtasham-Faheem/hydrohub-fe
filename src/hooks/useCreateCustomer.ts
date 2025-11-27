import { useMutation } from '@tanstack/react-query';
import { customerService } from '../services/api';
import type { CreateCustomerData } from '../services/api';

export const useCreateCustomer = () => {
  return useMutation({
    mutationFn: async (customerData: CreateCustomerData) => {
      return await customerService.createCustomer(customerData);
    },
  });
};
