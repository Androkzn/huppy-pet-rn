/**
 * Image utility functions
 */

interface CompressImageOptions {
  quality?: number;
  type?: string;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Compress image to reduce file size
 */
export const compressImage = async (
  file: Blob | File,
  {
    quality = 0.2,
    type = 'image/jpeg',
    maxWidth = 1000,
    maxHeight = 1000,
  }: CompressImageOptions = {}
): Promise<Blob> => {
  // Get as image bitmap
  const imageBitmap = await createImageBitmap(file);

  // Calculate new dimensions while maintaining the aspect ratio
  let newWidth: number;
  let newHeight: number;

  if (imageBitmap.width > imageBitmap.height) {
    newWidth = maxWidth;
    newHeight = (maxWidth / imageBitmap.width) * imageBitmap.height;
  } else {
    newHeight = maxHeight;
    newWidth = (maxHeight / imageBitmap.height) * imageBitmap.width;
  }

  // Draw to canvas with new dimensions
  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);

  // Turn into Blob
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      type,
      quality
    );
  });
};
