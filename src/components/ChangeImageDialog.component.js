/** @jsxImportSource @emotion/react */

import { useRef, useState, useEffect } from 'react';
import * as styles from './styles/Profile.css';
import { ButtonImage } from './Buttons.components';
import { Image } from './Image.components';
import { Cropper, RectangleStencil } from 'react-mobile-cropper';
import 'react-mobile-cropper/dist/style.css';
import Spiner from './Spinner.components';
import axios from 'axios';
import '../components/styles/styles.css';

const ChangeImageDialog = ({ foodItem, onClose, setFoodItem }) => {
  const [imageSelected, setImageSelected] = useState(null);
  const backendEndpoint = process.env.REACT_APP_BACKEND_URL;
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

  const compressImage = async (
    file,
    { quality = 0.2, type = 'image/jpeg', maxWidth = 1000, maxHeight = 1000 }
  ) => {
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
  const fetchImage = async () => {
    if (foodItem?.userId && foodItem?._id)
      try {
        const type = 'url';
        const avatarResult = await axios.get(
          `${backendEndpoint}/food/${foodItem.userId}/${foodItem?._id}?type=${type}`
        );
        const url = avatarResult.data;
        return;
      } catch (error) {
        console.log('Error fetching avatar:', error);
      }
  };

  // Handles dialog submission
  const saveImage = async (file) => {
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
        data.append('name', foodItem._id);
        data.append('destination', `food/${foodItem.userId}`);
        // Use Axios to send the FormData to the server
        const result = await axios.post(
          `${backendEndpoint}/food/${foodItem.userId}/${foodItem?._id}`,
          data
        );
        setFoodItem({ ...foodItem, image: new Date().toISOString() });
        await fetchImage();
      } catch (error) {
        console.log('Error uploading file:', error);
      }
    }
    onClose();
  };

  // Handles dialog submission
  const deleteImage = async () => {
    const destination = 'food';
    // const avatarResult = await axios.delete(`${backendEndpoint}/avatar/${profile?._id}?destination=${destination}`);
    try {
      const avatarResult = await axios.delete(
        `${backendEndpoint}/food/${foodItem.userId}/${foodItem?._id}?destination=${destination}`
      );
      setFoodItem({ ...foodItem, image: new Date().toISOString() });
      onClose();
    } catch (error) {
      console.log('Error deleting image:', error);
    }
  };

  useEffect(() => {
    // Function to fetch avatar data when component mounts
    convertUrlToImageFile();
    fetchImage();
  }, []);

  const convertUrlToImageFile = async () => {
    // Fetch the image from the URL and convert it to a file
    const url = await getImageUrl();
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
  const getImageUrl = async () => {
    if (!foodItem.userId || !foodItem._id) return;
    try {
      const type = 'url';
      const result = await axios.get(
        `${backendEndpoint}/food/${foodItem.userId}/${foodItem?._id}?type=${type}`
      );
      const data = result.data;
      return data;
    } catch (error) {
      console.log('Error fetching image:', error);
      return null;
    }
  };

  const isImageEmpty = () => {
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
              {isImageEmpty() ? (
                <Image
                  imageName={'food_placeholder.png'}
                  width="150px"
                  height="150px"
                  imageDataUrl={null}
                />
              ) : (
                // Display loading spinner while waiting for fetchUser or login
                <Spiner />
              )}
            </div>
          )}
        </div>
        <div style={styles.dialogButtonContainerStyle(isImageEmpty())}>
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
          {!isImageEmpty() && (
            <ButtonImage
              variant="iconButton"
              imageName="delete_orange.svg"
              imageSize={30}
              onClick={deleteImage}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default ChangeImageDialog;
