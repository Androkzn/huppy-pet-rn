/** @jsxImportSource @emotion/react */

import { useRef, useState, useEffect } from 'react';
import * as styles  from './styles/Profile.css'
import {ButtonImage} from "./Buttons.components"
import {ImageCircle} from './ImageCircle.components'
import { Cropper, CircleStencil } from 'react-mobile-cropper';
import 'react-mobile-cropper/dist/style.css'
import Spiner from './Spinner.components'
import axios from "axios";
import '../components/styles/styles.css'

const AddAvatarDialog = ({onSave, onDelete, onClose, avatar, profileId }) => {
    const [imageSelected, setImageSelected] = useState( null);
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
        };
        // Trigger the file input click programmatically
        input.click();
      } catch (error) {
        console.log('Error selecting file:', error);
      }
    }

    const handleSave = () => {
      // Use the cropped image when saving
      onSave(croppedImage || imageSelected);
    };

   useEffect(() => {
      // Function to fetch avatar data when component mounts
      convertUrlToImageFile()  
   }, [avatar]);

   const convertUrlToImageFile = async () => {
    // Fetch the image from the URL and convert it to a file
    const url = await getAvatarUrl();
    if (url) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const imageFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        setImageSelected(imageFile);
      } catch (error) {
        console.error('Error converting stream to blob:', error);
      }
    }
   }

// Function to fetch avatar data when the component mounts
const getAvatarUrl = async () => {
  const backendEndpoint = process.env.REACT_APP_BACKEND_URL;
  try {
    const type = 'url';
    const avatarResult = await axios.get(`${backendEndpoint}/avatar/${profileId}?type=${type}`);
    const avatarData = avatarResult.data;

    return avatarData;
  } catch (error) {
    console.log("Error fetching avatar:", error);
    return null;
  }
};

const isAvatarEmpty = () => {
  return avatar === null || avatar === ""
}

  return <div>
    <form style={styles.dialogLargeContainerStyle} onSubmit={(e) => {e.preventDefault()}}>
      <div style={styles.closeDialogButtonContainer}>
        <ButtonImage
          variant="iconButton"
          imageName="close_round_orange.svg"
          imageSize={30}
          onClick={onClose}
        />
      </div>
      <h2  style={styles.dialogTitleStyle}>{isAvatarEmpty() ? "Add avatar" : "Edit avatar"}</h2>
      <div style={styles.avatarContainerStyle}>
      { imageSelected ? 
      (
         <Cropper
            ref={cropperRef}
            src={URL.createObjectURL(imageSelected)}
            onChange={onChange}
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
          onClick={handleSave}
        />
        <ButtonImage
          variant="iconButton"
          imageName="add_green.svg"
          imageSize={25}
          onClick={handleSelect}
        />
        { !isAvatarEmpty() && 
          <ButtonImage
            variant="iconButton"
            imageName="delete_orange.svg"
            imageSize={30}
            onClick={onDelete}
          />
        }
     </div>
   
    </form>
  </div>;
}

export default AddAvatarDialog;



 
