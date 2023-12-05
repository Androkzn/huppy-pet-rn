import React, { useState, useEffect } from 'react';
import axios from "axios";
import {ImageCircle} from './ImageCircle.components'

const Avatar = ({ profile, width = '50px', borderRadius = '50%', borderWidth = '2px', borderColor = 'white', onClick  }) => {
  const [avatar, setAvatar] = useState(profile.avatar)
  const backendEndpoint = process.env.REACT_APP_BACKEND_URL

  useEffect(() => {
     // Function to fetch avatar data when component mounts
   fetchAvatar()  
  }, [profile]);

  // Function to fetch avatar data when component mounts
  const fetchAvatar = async () => {
    try {
      const destination = 'avatar'
      const avatarResult = await axios.get(`${backendEndpoint}/avatar/${profile?._id}?destination=${destination}`);
      setAvatar(avatarResult.data)
      return 
    } catch (error) {
      console.error("Error fetching avatar:", error);
    }
  };


  return (
    <ImageCircle
          imageName={"avatar_placeholder.png"}
          width= {width}
          imageDataUrl={avatar}
          onClick={onClick}
    />
  );
};

export default Avatar ;
