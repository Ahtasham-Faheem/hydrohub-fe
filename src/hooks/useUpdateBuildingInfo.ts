import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/api';
import type { UpdateBuildingInfoData } from '../services/api';

interface UpdateBuildingInfoParams {
  customerProfileId: string;
  buildingData: UpdateBuildingInfoData;
}

export const useUpdateBuildingInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerProfileId, buildingData }: UpdateBuildingInfoParams) => {
      return await customerService.updateBuildingInfo(customerProfileId, buildingData);
    },
    onSuccess: () => {
      // Invalidate customer queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
