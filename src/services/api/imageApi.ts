/**
 * Image API Service
 * Handles image upload, fetch, and delete operations
 */

import axios from 'axios';
import { compressImage } from '@utils/image';

const BACKEND_ENDPOINT = process.env.EXPO_PUBLIC_BACKEND_URL || '';

if (!BACKEND_ENDPOINT) {
  console.warn('BACKEND_URL not found in environment variables');
}

/**
 * Fetch image data from URL
 */
export const fetchImage = async (url: string): Promise<any> => {
  try {
    const response = await axios.get(url);
    console.log('Fetched image:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};

/**
 * Delete image from server
 */
export const deleteImage = async (
  destination: string,
  key: string
): Promise<boolean> => {
  const url = `${BACKEND_ENDPOINT}/${destination}/${key}`;
  try {
    console.log('Deleting image at:', url);
    const result = await axios.delete(url);
    console.log('Delete image result:', result);
    return true;
  } catch (error) {
    console.error('Error deleting image with url:', url, error);
    return false;
  }
};

/**
 * Upload image to server
 */
export const uploadImage = async (
  file: Blob | File,
  destination: string,
  key: string
): Promise<boolean> => {
  const url = `${BACKEND_ENDPOINT}/${destination}/${key}`;

  try {
    // Compress image
    const compressedFile = await compressImage(file, {
      type: 'image/jpeg',
    });

    // Create FormData
    const formData = new FormData();
    formData.append('image', compressedFile);

    console.log('Uploading image to:', url);
    const result = await axios.post(url, formData);
    console.log('Upload image result:', result);
    return true;
  } catch (error) {
    console.error('Error uploading image with url:', url, error);
    return false;
  }
};

/**
 * Get image URL from server
 */
export const getImageUrl = async (
  destination: string,
  key: string
): Promise<string | null> => {
  const type = 'url';
  const url = `${BACKEND_ENDPOINT}/${destination}/${key}?type=${type}`;

  try {
    console.log('Getting image URL:', url);
    const result = await axios.get(url);
    const data = result.data;
    console.log('Image URL result:', result);
    return data;
  } catch (error) {
    console.error('Error fetching image URL:', error);
    return null;
  }
};
