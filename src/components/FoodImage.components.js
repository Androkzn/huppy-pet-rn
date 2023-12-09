import React, { useState, useEffect } from 'react';
import axios from "axios";
import {Image} from './Image.components'

const FoodImage = ({ foodItem, width = '150px', height='150px',  borderWidth = '2px', borderColor = 'white', onClick  }) => {
  const [image, setImage] = useState(foodItem.image)
  const backendEndpoint = process.env.REACT_APP_BACKEND_URL

  useEffect(() => {
     // Function to fetch avatar data when component mounts
   fetchImage()  
  }, [foodItem]);

  // Function to fetch avatar data when component mounts
  const fetchImage = async () => {
    try {
     
      const type = 'url'
      const result = await axios.get(`${backendEndpoint}/food/${foodItem?.userId}/${foodItem?._id}?type=${type}`);
      setImage(result.data)
      console.log("FoodImage", result.data);
      return 
    } catch (error) {
      console.log("Error fetching image:", error);
    }
  };

  return (
    <div onClick={onClick}>
      <Image
            imageName={"food_placeholder.png"}
            width= {width}
            height={height}
            imageDataUrl={image}
      />
    </div>
  );
};

export default FoodImage ;
