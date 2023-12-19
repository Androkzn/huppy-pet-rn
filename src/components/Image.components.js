/** @jsxImportSource @emotion/react */

import React, { useState, useEffect } from 'react';

const Image = ({ imageName, imageDataUrl, width = '48', height = '48', onClick }) => {
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

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
  };

  const imageStyle = {
    width: width,
    height: height,
  };

  return (
    <div style={containerStyle}>
    { errorLoadingImage || imageDataUrl === null || imageDataUrl === undefined ? (
    <img
      src={require(`./assets/${imageName}`)} // Images are in the 'assets' directory
      alt={imageName.replace(/\.[^/.]+$/, '')} // Remove file extension from alt text
      width={width}
      height={height}
      onClick={onClick}
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

export { Image };