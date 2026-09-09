/**
 * FoodImage — port of the web app's FoodImage.components.js:
 * the food photo fetched from the backend, on a lightOrange ring, falling back
 * to the add-food (editing) or plain food placeholder.
 */

import React from 'react';
import { useFetchImage } from '@hooks/useImage';
import { ImageCircle, LoadingAndError } from './ui/Asset';
import * as colors from '../theme/colors';
import type { Food, FoodTemplate } from '../types';

const BACKEND_ENDPOINT = process.env.EXPO_PUBLIC_BACKEND_URL || '';

interface FoodImageProps {
  foodItem?: Food | FoodTemplate | null;
  imageDataUrl?: string | null;
  width?: number;
  onPress?: () => void;
  isEditing?: boolean;
}

export const FoodImage: React.FC<FoodImageProps> = ({
  foodItem,
  imageDataUrl,
  width = 150,
  onPress,
  isEditing = true,
}) => {
  const url = `${BACKEND_ENDPOINT}/food/${(foodItem as any)?.userId}/${foodItem?._id}?type=url`;
  const {
    data: image,
    isLoading,
    isError,
  } = useFetchImage(url, (foodItem as any)?.image, !!foodItem?._id);

  const placeholder = isEditing
    ? 'add_food_placeholder_orange.png'
    : 'food_placeholder.png';

  if (isLoading && foodItem?._id && (foodItem as any)?.image) {
    return <LoadingAndError isLoading={isLoading} isError={isError} />;
  }

  return (
    <ImageCircle
      imageName={placeholder}
      width={width}
      imageDataUrl={imageDataUrl ?? (image as string)}
      borderColor={colors.lightOrange}
      onPress={onPress}
    />
  );
};

export default FoodImage;
