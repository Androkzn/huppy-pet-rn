import React, { useState, useEffect } from 'react';
import Spiner from '../components/Spinner.components';

const ImageCircle = ({
  imageName,
  imageDataUrl,
  width = 50,
  borderRadius = '50%',
  borderWidth = '2px',
  borderColor = 'white',
  onClick,
}) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    margin: '3px 0px',
  };

  const imageStyle = {
    maxWidth: width,
    height: width,
    borderRadius: borderRadius,
    border: `${borderWidth} solid ${borderColor}`,
  };

  const [errorLoadingImage, setErrorLoadingImage] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setErrorLoadingImage(true);
  };

  useEffect(() => {
    // Cleanup function to reset the state when the component unmounts
    return () => {
      setErrorLoadingImage(false);
    };
  }, [imageDataUrl]);

  return (
    <div onClick={onClick} style={containerStyle}>
      {loading && <Spiner width={width > 60 ? 60 : width} />}
      {errorLoadingImage || !imageDataUrl ? (
        <img
          src={require(`./assets/${imageName}`)}
          alt={imageName.replace(/\.[^/.]+$/, '')}
          style={{ ...imageStyle, display: loading ? 'none' : 'block' }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <img
          src={imageDataUrl}
          alt={imageName.replace(/\.[^/.]+$/, '')}
          style={{ ...imageStyle, display: loading ? 'none' : 'block' }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

export { ImageCircle };
