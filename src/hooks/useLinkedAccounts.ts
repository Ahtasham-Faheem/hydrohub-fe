import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/api';
import type { CreateLinkedAccountData, UpdateLinkedAccountData } from '../services/api';

export const useGetLinkedAccounts = (customerProfileId: string | null | undefined) => {
  return useQuery({
    queryKey: ['linkedAccounts', customerProfileId],
    queryFn: () => customerService.getLinkedAccounts(customerProfileId!),
    enabled: !!customerProfileId,
  });
};

export const useCreateLinkedAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerProfileId, accountData }: { customerProfileId: string; accountData: CreateLinkedAccountData }) => {
      return await customerService.createLinkedAccount(customerProfileId, accountData);
    },
    onSuccess: (_, { customerProfileId }) => {
      queryClient.invalidateQueries({ queryKey: ['linkedAccounts', customerProfileId] });
    },
  });
};

export const useUpdateLinkedAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerProfileId, accountId, accountData }: { customerProfileId: string; accountId: string; accountData: UpdateLinkedAccountData }) => {
      return await customerService.updateLinkedAccount(customerProfileId, accountId, accountData);
    },
    onSuccess: (_, { customerProfileId }) => {
      queryClient.invalidateQueries({ queryKey: ['linkedAccounts', customerProfileId] });
    },
  });
};

export const useDeleteLinkedAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerProfileId, accountId }: { customerProfileId: string; accountId: string }) => {
      return await customerService.deleteLinkedAccount(customerProfileId, accountId);
    },
    onSuccess: (_, { customerProfileId }) => {
      queryClient.invalidateQueries({ queryKey: ['linkedAccounts', customerProfileId] });
    },
  });
};
