import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/api';
import type { UpdatePreferencesData } from '../services/api';

interface UpdatePreferencesParams {
  customerProfileId: string;
  preferencesData: UpdatePreferencesData;
}

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerProfileId, preferencesData }: UpdatePreferencesParams) => {
      return await customerService.updatePreferences(customerProfileId, preferencesData);
    },
    onSuccess: () => {
      // Invalidate customer queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
