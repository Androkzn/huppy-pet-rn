import React from 'react';

const Image = ({ imageName, width = '48', height = '48' }) => {
  return (
    <img
      src={require(`./assets/${imageName}`)} // Images are in the 'assets' directory
      alt={imageName.replace(/\.[^/.]+$/, '')} // Remove file extension from alt text
      width={width}
      height={height}
    />
  );
};

export { Image };