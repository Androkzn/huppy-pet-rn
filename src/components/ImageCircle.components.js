import React from 'react';

const ImageCircle = ({ imageName, width = '150', height = '150', borderRadius = '50%', borderWidth = '2px', borderColor = 'white' }) => {
  const imageStyle = {
    width: '100%', // Ensure the image takes up the entire container
    height: 'auto', // Maintain the aspect ratio
    borderRadius: borderRadius,
    border: `${borderWidth} solid ${borderColor}`,
  };

  return (
    <img
      src={require(`./assets/${imageName}`)} // Images are in the 'assets' directory
      alt={imageName.replace(/\.[^/.]+$/, '')} // Remove file extension from alt text
      style={imageStyle}
    />
  );
};

export { ImageCircle };
