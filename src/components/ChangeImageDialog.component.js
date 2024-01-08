/** @jsxImportSource @emotion/react */

import { useRef, useState, useEffect } from 'react';
import * as styles from './styles/Profile.css';
import { ButtonImage } from './Buttons.components';
import { Image } from './Image.components';
import { Cropper, RectangleStencil } from 'react-mobile-cropper';
import 'react-mobile-cropper/dist/style.css';
import Spiner from './Spinner.components';
import '../components/styles/styles.css';
import { uploadImage, deleteImage, getImageUrl } from '../hooks/query.hooks';

const ChangeImageDialog = ({ 
  foodItem, 
  onClose, 
  setFoodItem 
}) => {
  const [imageSelected, setImageSelected] = useState(null);
  const cropperRef = useRef(null);
  let croppedImage = null;
  const destination = "food"
  const key = `${foodItem.userId}/${foodItem?._id}`

  // Updates the cropped image in the state
  const onChange = (cropper) => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        // Convert the canvas to a Blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a File from the Blob
            const file = new File([blob], 'cropped_image.jpg', {
              type: 'image/jpeg',
            });

            // Update the state with the cropped image File
            croppedImage = file;
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
        const file = event.target.files[0];
        setImageSelected(file);
      };
      // Trigger the file input click programmatically
      input.click();
    } catch (error) {
      console.log('Error selecting file:', error);
    }
  };

  const handleSave = () => {
    // Use the cropped image when saving
    saveImage(croppedImage || imageSelected);
  };

  // Handles dialog submission
  const saveImage = async (file) => {
    if (file) {
      try {
        const isUploaded = await uploadImage(file,destination, key )
        if (isUploaded) {
          await setFoodItem({ ...foodItem, image: new Date().toISOString() });
        }

      } catch (error) {
        console.log('Error uploading file:', error);
      }
    }
    onClose();
  };

  // Handles dialog submission
  const deleteFoodImage = async () => {
    try {
      const isDeleted = await deleteImage(destination, key)
        if (isDeleted) {
          setFoodItem({ ...foodItem, image:"" });
          onClose();
        }
    } catch (error) {
      console.log('Error deleting image:', error);
    }
  };

  useEffect(() => {
    // Function to fetch avatar data when component mounts
    convertUrlToImageFile();
    //fetchImage();
  }, []);

  const convertUrlToImageFile = async () => {
    // Fetch the image from the URL and convert it to a file
    const url = await getUrl();
    if (url) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const imageFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
        setImageSelected(imageFile);
      } catch (error) {
        console.error('Error converting stream to blob:', error);
      }
    }
  };

  // Function to fetch avatar data when the component mounts
  const getUrl = async () => {
    if (!foodItem.userId || !foodItem._id) return;
    try {
      const data = await getImageUrl(destination, key)
      return data;
    } catch (error) {
      console.log('Error fetching image url:', error);
      return null;
    }
  };

  const isImageEmpty = () => {
    console.log('foodItem.image:', foodItem.image);
    return foodItem.image === null || foodItem.image === '';
  };

  return (
    <div>
      <form
        style={styles.dialogLargeContainerStyle}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div style={styles.closeDialogButtonContainer}>
          <ButtonImage
            variant="iconButton"
            imageName="close_round_orange.svg"
            imageSize={30}
            onClick={onClose}
          />
        </div>
        <h2 style={styles.dialogTitleStyle}>
          {isImageEmpty() ? 'Add image' : 'Edit image'}
        </h2>
        <div style={styles.avatarContainerStyle}>
          {imageSelected ? (
            <Cropper
              ref={cropperRef}
              src={URL.createObjectURL(imageSelected)}
              onChange={onChange}
              className="cropper"
              stencilProps={{
                aspectRatio: 1,
              }}
              stencilComponent={RectangleStencil}
              backgroundProps={{ color: 'red' }}
            />
          ) : (
            <div>
                <Image
                  imageName={'food_placeholder.png'}
                  width="150px"
                  height="150px"
                  imageDataUrl={null}
                />
            </div>
          )}
        </div>
        <div style={styles.dialogButtonContainerStyle(isImageEmpty())}>
          {imageSelected && (
            <ButtonImage
              variant="iconButton"
              imageName="save_green.svg"
              imageSize={25}
              onClick={handleSave}
            />
          )}
          <ButtonImage
            variant="iconButton"
            imageName="add_green.svg"
            imageSize={25}
            onClick={handleSelect}
          />
          {!isImageEmpty() && (
            <ButtonImage
              variant="iconButton"
              imageName="delete_orange.svg"
              imageSize={30}
              onClick={deleteFoodImage}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default ChangeImageDialog;
