import React, { useState, useEffect } from 'react';
import axios from "axios";
import {ImageCircle} from './ImageCircle.components'

const FoodImage = ({ foodItem, imageDataUrl, width = '150px', height='150px',  borderWidth = '2px', borderColor = 'white', onClick  }) => {
  const [image, setImage] = useState(foodItem.image)
  const backendEndpoint = process.env.REACT_APP_BACKEND_URL

  useEffect(() => {
    console.log("FoodImage foodItem.image", foodItem.image);
    console.log("FoodImage imageDataUrl", imageDataUrl);
     // Function to fetch image data when component mounts
     if (imageDataUrl) {
       setImage(imageDataUrl)
     } else {
        fetchImage()  
     }
  }, [foodItem, image]);

  // Function to fetch image data when component mounts
  const fetchImage = async () => {
    try {
      const type = 'url'
      const result = await axios.get(`${backendEndpoint}/food/${foodItem?.userId}/${foodItem?._id}?type=${type}`);
      if (result.data) {
        setImage(result.data)
      }
      console.log("FoodImage", result.data);
      return 
    } catch (error) {
      console.log("Error fetching image:", error);
    }
  };

  console.log("FoodImage  image",  image);
  return (
    <div onClick={onClick}>
      <ImageCircle
            imageName={"add_food_placeholder_green.png"}
            width= {width}
            height={height}
            imageDataUrl={imageDataUrl ? imageDataUrl : image}
      />
    </div>
  );
};

export default FoodImage ;
