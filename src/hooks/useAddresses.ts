import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/api';
import { queryKeys } from '../services/queryKeys';
import type { CreateAddressData, UpdateAddressData } from '../services/api';

export const useGetAddresses = (customerProfileId: string | null | undefined) => {
  return useQuery({
    queryKey: queryKeys.addresses.byCustomer(customerProfileId || ''),
    queryFn: () => customerService.getAddresses(customerProfileId!),
    enabled: !!customerProfileId,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerProfileId, addressData }: { customerProfileId: string; addressData: CreateAddressData }) => {
      return await customerService.createAddress(customerProfileId, addressData);
    },
    onSuccess: (_, { customerProfileId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.byCustomer(customerProfileId) });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerProfileId, addressId, addressData }: { customerProfileId: string; addressId: string; addressData: UpdateAddressData }) => {
      return await customerService.updateAddress(customerProfileId, addressId, addressData);
    },
    onSuccess: (_, { customerProfileId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.byCustomer(customerProfileId) });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerProfileId, addressId }: { customerProfileId: string; addressId: string }) => {
      return await customerService.deleteAddress(customerProfileId, addressId);
    },
    onSuccess: (_, { customerProfileId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.byCustomer(customerProfileId) });
    },
  });
};
