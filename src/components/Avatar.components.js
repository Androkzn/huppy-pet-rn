import React, { useState, useEffect } from 'react';
import {ImageCircle} from './ImageCircle.components'
import {useFetchImage} from "../hooks/query.hooks"

const Avatar = ({ profile, width = '50px', borderRadius = '50%', borderWidth = '2px', borderColor = 'white', onClick  }) => {
  const backendEndpoint = process.env.REACT_APP_BACKEND_URL
  const type = 'url';
  const url = `${backendEndpoint}/avatar/${profile?._id}?type=${type}`

  const { data: avatar, isLoading: isLoadingAvatar, isError: isErrorAvatar } = useFetchImage(url, profile, {
    refetchOnMount: false
  });
   
  return (
    <div> 
      {(isLoadingAvatar || isErrorAvatar ) ? 
        (
        <div>
          <ImageCircle
            imageName={"avatar_placeholder.png"}
            width= {width}
            imageDataUrl={null}
            onClick={onClick}
          />
        </div>
        ) : 
        (
        <ImageCircle
              imageName={"avatar_placeholder.png"}
              width= {width}
              imageDataUrl={avatar}
              onClick={onClick}
        />
      )}
    </div>
  );
};

export default Avatar ;
