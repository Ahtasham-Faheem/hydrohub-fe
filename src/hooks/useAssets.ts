import { useMutation } from '@tanstack/react-query';
import { assetsService } from '../services/api';

// Upload File Mutation
export const useUploadFile = () => {
  return useMutation({
    mutationFn: (file: File) => assetsService.uploadFile(file),
    onError: (error) => {
      console.error('Failed to upload file:', error);
    },
  });
};