/** @jsxImportSource @emotion/react */

import { useState, useEffect, useRef } from 'react'
import * as styles  from './styles/Profile.css'
import {ButtonImage} from "./Buttons.components"
import {ImageCircle} from './ImageCircle.components'
import { Cropper, CircleStencil } from 'react-mobile-cropper'
import 'react-mobile-cropper/dist/style.css'
import Spiner from '../components/Spinner.components'
import axios from "axios"
import '../components/styles/styles.css'

const ChangeAvatarDialog = ({updateCurrentProfile, onClose, profile }) => {
    const [imageSelected, setImageSelected] = useState( null);
    // const [croppedImage, setCroppedImage] = useState(null); 
    const backendEndpoint = process.env.REACT_APP_BACKEND_URL
    const cropperRef = useRef(null);
    let croppedImage = null; 

    // Updates the cropped image in the state
    const onChange = (cropper) => {
      if (cropperRef.current) {
        const canvas = cropperRef.current.getCanvas();
        if (canvas) {
          // Convert the canvas to a Blob
          canvas.toBlob((blob) => {
            if (blob) {
              // Create a File from the Blob
              const file = new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' });

              // Update the state with the cropped image File
              croppedImage = file
            }
          }, 'image/jpeg');
        }
      }
    };

    const handleSelect = () => {
      try {
        // Create an input element to trigger file selection
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event) => {
          const file = event.target.files[0] 
          setImageSelected(file)
          console.log('file:', file);
        };
        // Trigger the file input click programmatically
        input.click();
      } catch (error) {
        console.log('Error selecting file:', error);
      }
    }

    const handleSave = () => {
      // Use the cropped image when saving
      saveAvatar(croppedImage || imageSelected);
      console.log('imageSelected:', imageSelected);
      console.log('croppedImage:', croppedImage);
    };

    const compressImage = async (file, { quality = 0.2, type = 'image/jpeg', maxWidth = 1000, maxHeight = 1000 }) => {
      // Get as image data
      const imageBitmap = await createImageBitmap(file);
  
      // Calculate new dimensions while maintaining the aspect ratio
      let newWidth, newHeight;
      if (imageBitmap.width > imageBitmap.height) {
          newWidth = maxWidth;
          newHeight = (maxWidth / imageBitmap.width) * imageBitmap.height;
      } else {
          newHeight = maxHeight;
          newWidth = (maxHeight / imageBitmap.height) * imageBitmap.width;
      }
  
      // Draw to canvas with new dimensions
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);
  
      // Turn into Blob
      return await new Promise((resolve) =>
          canvas.toBlob(resolve, type, quality)
      );
    };
  
        
  // Function to fetch avatar data when component mounts
  const fetchAvatar = async () => {
    console.log(`Fetch Avatar for`, profile._id)
    try {
      const type = 'url'
      const avatarResult = await axios.get(`${backendEndpoint}/avatar/${profile?._id}?type=${type}`);
      const url = avatarResult.data
      console.log(`avatar url`, url)
      updateCurrentProfile("avatar", new Date().toISOString())
      return 
    } catch (error) {
      console.log("Error fetching avatar:", error);
    }
  };
  
  // Handles dialog submission
  const saveAvatar = async (file) => {
    if (file) {
      try {
        const compressedFile = await compressImage(file, {
          type: 'image/jpeg',
      });
        // Create a new FormData object
        const data = new FormData();
        // Append the compressed file as a Blob
        data.append('image', compressedFile);
        // Append other form data fields
        data.append('name', profile._id);
        data.append('destination', 'avatar');
        // Use Axios to send the FormData to the server
        const result = await axios.post(`${backendEndpoint}/avatar/${profile._id}`, data);
        await fetchAvatar();
      } catch (error) {
        console.log('Error uploading file:', error);
      }
    }
    onClose(); 
  };
  
  // Handles dialog submission
  const deleteAvatar = async () => {
    const destination = 'avatar'
    // const avatarResult = await axios.delete(`${backendEndpoint}/avatar/${profile?._id}?destination=${destination}`);  
    try {
      const avatarResult = await axios.delete(`${backendEndpoint}/avatar/${profile?._id}?destination=${destination}`); 
      console.log(` deleteAvatar avatar url`,)
      updateCurrentProfile("avatar", new Date().toISOString())
      onClose();
    } catch (error) {
      console.log("Error deleting avatar:", error);
    }
  };

   useEffect(() => {
      // Function to fetch avatar data when component mounts
      convertUrlToImageFile()  
   }, [profile.avatar]);

   const convertUrlToImageFile = async () => {
    console.log('avatar:', profile.avatar);

    // Fetch the image from the URL and convert it to a file
    const url = await getAvatarUrl();
    if (url) {
      try {
        console.log('url:', url);
        const response = await fetch(url);
        console.log('response:', response);
        const blob = await response.blob();
        const imageFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        console.log('imageFile:', imageFile);
        setImageSelected(imageFile);
      } catch (error) {
        console.error('Error converting stream to blob:', error);
      }
    }
   }

// Function to fetch avatar data when the component mounts
const getAvatarUrl = async () => {
  console.log(`Fetch Avatar for`, profile._id);
  const backendEndpoint = process.env.REACT_APP_BACKEND_URL;
  try {
    const type = 'url';
    const avatarResult = await axios.get(`${backendEndpoint}/avatar/${profile._id}?type=${type}`);
    const avatarData = avatarResult.data;

    return avatarData;
  } catch (error) {
    console.log("Error fetching avatar:", error);
    return null;
  }
};

const isAvatarEmpty = () => {
  return profile.avatar === null || profile.avatar === ""
}

  return <div>
    <form style={styles.dialogLargeContainerStyle} onSubmit={(e) => {e.preventDefault()}}>
      <div style={styles.closeDialogButtonContainer}>
        <ButtonImage
          variant="iconButton"
          imageName="cancel_orange.svg"
          imageSize={15}
          onClick={() => {onClose()}}
        />
      </div>
      <h2  style={styles.dialogTitleStyle}>{isAvatarEmpty() ? "Add avatar" : "Edit avatar"}</h2>
      <div style={styles.avatarContainerStyle}>
      { imageSelected ? 
      (
         <Cropper
            ref={cropperRef}
            src={URL.createObjectURL(imageSelected)}
            onChange={() => {onChange()}}
            className="cropper"
            stencilProps={{ 
              aspectRatio: 1 
            }}
            stencilComponent={CircleStencil}
            backgroundProps={{color: "red"}}
        /> 
      ) : (  
        <div>
        { (isAvatarEmpty()) ? 
          (
            <ImageCircle
              imageName={"avatar_placeholder.png"}
              width="150px"
              imageDataUrl={null}
            />
          ) : (  
            // Display loading spinner while waiting for fetchUser or login
            <Spiner/>
          )}
          </div>
    
      )}
      </div>
      <div style={styles.dialogButtonContainerStyle(isAvatarEmpty())}> 
        <ButtonImage
          variant="iconButton"
          imageName="save_green.svg"
          imageSize={25}
          onClick={() => {handleSave()}}
        />
        <ButtonImage
          variant="iconButton"
          imageName="add_green.svg"
          imageSize={25}
          onClick={() => {handleSelect()}}
        />
        { !isAvatarEmpty() && 
          <ButtonImage
            variant="iconButton"
            imageName="delete_orange.svg"
            imageSize={30}
            onClick={() => {deleteAvatar()}}
          />
        }
     </div>
    </form>
  </div>;
}

export default ChangeAvatarDialog;



 
