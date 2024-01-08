import React, { useState, useEffect } from 'react';
import { ImageCircle } from './ImageCircle.components';
import * as colors from './styles/Colors';
import { useFetchImage } from '../hooks/query.hooks';
import LoadingAndError from '../components/LoadingAndError.components';

const FoodImage = ({
  foodItem,
  imageDataUrl,
  width = 150,
  borderRadius,
  borderWidth,
  borderColor,
  onClick,
  isEditing = true,
}) => {
  const backendEndpoint = process.env.REACT_APP_BACKEND_URL;
  const type = 'url';
  const url = `${backendEndpoint}/food/${foodItem?.userId}/${foodItem?._id}?type=${type}`;

  const {
    data: image,
    isLoading: isImageLoading,
    isError: isImageError,
  } = useFetchImage(url, foodItem?.image);

  const placeholder =  isEditing ? 'add_food_placeholder_orange.png' : 'food_placeholder.png'

  return (
    <div onClick={onClick}>
      {(isImageLoading || isImageError) && (foodItem?._id !== '' && foodItem?.image !== '') ? (
        <LoadingAndError isLoading={isImageLoading} isError={isImageError}/>
      ) : (
        <ImageCircle
          imageName={placeholder}
          width={width}
          height={width}
          imageDataUrl={imageDataUrl ? imageDataUrl : image}
          borderRadius={borderRadius}
          borderWidth={borderWidth}
          borderColor={colors.lightOrange}
        />
      )}
    </div>
  );
};

export default FoodImage;
