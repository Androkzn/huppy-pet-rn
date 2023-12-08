/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect } from 'react';
import { UserContext } from "../contexts/user.context";
import * as styles  from './styles/Profile.css'
import {ButtonImage} from "./Buttons.components"
import {ImageCircle} from './ImageCircle.components'
import { Cropper, CircleStencil } from 'react-mobile-cropper';
import 'react-mobile-cropper/dist/style.css'
import Spiner from '../components/Spinner.components'
import axios from "axios";
import '../index.css'
import './styles/styles.css';

const ChangeAvatarDialog = ({onSave, onDelete, onClose, avatar, profileId }) => {
    const [imageSelected, setImageSelected] = useState( null);
    const [croppedImage, setCroppedImage] = useState(null); 

    // Updates  the cropped image in the state
    const onChange = (cropper) => {
      setCroppedImage(cropper.getCanvas());
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
      onSave(croppedImage || imageSelected);
      console.log('imageSelected:', imageSelected);
      console.log('croppedImage:', croppedImage);
    };

   useEffect(() => {
      // Function to fetch avatar data when component mounts
      convertUrlToImageFile()  
   }, [avatar]);

   const convertUrlToImageFile = async () => {
    console.log('avatar:', avatar);


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
  console.log(`Fetch Avatar for`, profileId);
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

  return <div>
    <form style={styles.dialogLargeContainerStyle}>
      <div style={styles.closeDialogButtonContainer}>
        <ButtonImage
          variant="iconButton"
          imageName="cancel_orange.svg"
          imageSize={15}
          onClick={onClose}
        />
      </div>
      <h2  style={styles.dialogTitleStyle}>{"Edit avatar"}</h2>
      <div style={styles.avatarContainerStyle}>
      { imageSelected ? 
      (
         <Cropper
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
        { (avatar === null || avatar === "") ? 
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
      <div style={styles.dialogButtonContainerStyle(avatar === null || avatar === "")}> 
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
        { avatar !== null && avatar !== "" && 
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

export default ChangeAvatarDialog;



 
