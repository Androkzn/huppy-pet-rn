import React, { useState, useEffect } from 'react';

// Define an array of image sources
const imageSources = [
  './assets/activity_indicator1.png',
  './assets/activity_indicator2.png',
  './assets/activity_indicator3.png',
  './assets/activity_indicator4.png',
  './assets/activity_indicator5.png',
];

function PawActivityIndicatorView() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    // Set up a timer to change the image index every 200ms
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageSources.length);
    }, 200);

    // Clean up the timer when the component unmounts to prevent memory leaks
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <img
        src={require(`${imageSources[currentImageIndex]}`)}
        alt={'Activity indicator'}
        style={{ width: '60px', height: '60px', objectFit: 'contain' }}
      />
    </div>
  );
}

export default PawActivityIndicatorView;

