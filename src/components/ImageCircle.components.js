import React, { useState, useEffect } from 'react';

const ImageCircle = ({ imageName, imageDataUrl, width = '50px', borderRadius = '50%', borderWidth = '2px', borderColor = 'white', onClick  }) => {
  const containertyle = {
     display: 'flex',
     flexDirection: 'row',
     justifyContent: "center",
     width: "100%",
     margin: "3px 0px", 
  };

  const imageStyle = {
    maxWidth: width,  
    height: width,  
    borderRadius: borderRadius,
    border: `${borderWidth} solid ${borderColor}`,
  };

  const [errorLoadingImage, setErrorLoadingImage] = useState(false);
  const handleImageError = () => {
    
    setErrorLoadingImage(true);
  };

  useEffect(() => {
    // Cleanup function to reset the state when the component unmounts
    return () => {
      setErrorLoadingImage(false);
    };
  }, [imageDataUrl]); 
 

  return (
    <div onClick={onClick} style={containertyle}>
    { errorLoadingImage || imageDataUrl === null || imageDataUrl === undefined ? (
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
