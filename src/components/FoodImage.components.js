import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ImageCircle } from './ImageCircle.components';
import Spinner from './Spinner.components'; // Import your Spinner component
import * as colors from './styles/Colors'
import {useFetchImage} from "../hooks/query.hooks"
import LoadingAndError from "../components/LoadingAndError.components"

const FoodImage = ({ foodItem, imageDataUrl, width = '150px', borderRadius, borderWidth, borderColor, onClick , isEditing = true }) => {
 
  //const [loading, setLoading] = useState(true); // Added loading state
  const backendEndpoint = process.env.REACT_APP_BACKEND_URL;
  const type = 'url';
  const url = `${backendEndpoint}/food/${foodItem?.userId}/${foodItem?._id}?type=${type}`
  const { data: image, isLoading: isImageLoading, isError: isImageError } = useFetchImage(url, foodItem);

  // useEffect(() => {
  //   // Function to fetch image data when component mounts
  //   if (imageDataUrl) {
  //     setImage(imageDataUrl);
  //     setLoading(false);  
  //   } else if (foodItem?.image && foodItem?.image !== ""){
  //     setImage(foodItem?.image);
  //     setLoading(false);
  //   } else {
  //      fetchImage();
  //   }
  // }, [foodItem, image, imageDataUrl]);

  // Function to fetch image data when component mounts
  // const fetchImage = async () => {
  //   if (foodItem?.userId && foodItem?._id) {
  //     try {
  //       const type = 'url';
  //       const result = await axios.get(`${backendEndpoint}/food/${foodItem?.userId}/${foodItem?._id}?type=${type}`);
  //       if (result.data) {
  //         setImage(result.data);
  //       }
  //       setLoading(false);
  //       return;
  //     } catch (error) {
  //       console.log("Error fetching image:", error);
  //       setLoading(false); 
  //       return; 
  //     }
  //   } else {
  //     setLoading(false);
  //   }
  // };

  return (
    <div onClick={onClick}>
      {isImageLoading || isImageError ? (
        <LoadingAndError isLoading={isImageLoading} isError={isImageError}/>
      ) : (
        <ImageCircle
          imageName={isEditing ? "add_food_placeholder_orange.png" : "food_placeholder.png"}
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
