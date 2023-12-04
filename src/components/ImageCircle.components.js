import React, { useState, useEffect } from 'react';

const ImageCircle = ({ imageName, imageDataUrl, width = '50px', borderRadius = '50%', borderWidth = '2px', borderColor = 'white', onClick  }) => {
  const imageStyle = {
    maxWidth: width,  
    height: width,  
    borderRadius: borderRadius,
    border: `${borderWidth} solid ${borderColor}`,
  };

  const [errorLoadingImage, setErrorLoadingImage] = useState(false);
  const handleImageError = () => {
    console.log("ImageCircle handleImageError", true) 
    setErrorLoadingImage(true);
  };

  useEffect(() => {
    // Cleanup function to reset the state when the component unmounts
    return () => {
      setErrorLoadingImage(false);
    };
  }, [imageDataUrl]);

  console.log("ImageCircle", imageDataUrl) 
  console.log("ImageCircle errorLoadingImage", errorLoadingImage) 

  return (
    <div onClick={onClick}>
    { errorLoadingImage || imageDataUrl === null ? (
    <img
      src={require(`./assets/${imageName}`)} // Images are in the 'assets' directory
      alt={imageName.replace(/\.[^/.]+$/, '')} // Remove file extension from alt text
      style={imageStyle}
    />
    ) : (
    <img
      src={imageDataUrl}  
      alt={imageName.replace(/\.[^/.]+$/, '')}
      style={imageStyle}
      onError={handleImageError}
    />
    )}
    </div>
  );
};

export { ImageCircle };
