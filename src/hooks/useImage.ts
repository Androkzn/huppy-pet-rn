/**
 * React Query hooks for image operations
 */

import { useQuery } from '@tanstack/react-query';
import * as imageApi from '@services/api/imageApi';

/**
 * Hook to fetch image data
 */
export const useFetchImage = (url: string, key: string, enabled = true) => {
  return useQuery({
    queryKey: [key],
    queryFn: () => imageApi.fetchImage(url),
    enabled: enabled && (!!key || key === ''),
    refetchOnMount: false,
    retry: 1,
  });
};

/**
 * Export image API functions for direct use
 * (Not using mutations since these are typically called directly)
 */
export { deleteImage, uploadImage, getImageUrl } from '@services/api/imageApi';
