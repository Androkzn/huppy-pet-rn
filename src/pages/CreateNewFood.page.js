/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer.component';
import { DataContext } from '../contexts/data.context';
import NewFoodForm from '../components/NewFoodForm.component';
import { ButtonImage } from '../components/Buttons.components';
import * as styles from '../components/styles/CreateNewFood.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent } from '@mui/material';
import AddImageDialog from '../components/AddImageDialog.component';
import { useAddFoodTemplate } from '../hooks/query.hooks';
import CustomAlert from '../components/CustomAlert.component';
import * as Enums from '../helpers/Enums.helper'
import axios from 'axios';

const CreateNewFood = () => {
  const { user } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mealId, setMealId] = useState(location.state?.mealId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('addActivity');
  const [image, setImage] = useState(null);
  const { mutate: addFoodTemplateMutation } = useAddFoodTemplate();
  // States for displaying alert
  const [ showAlert, setShowAlert] = useState(false);
  const [ message, setMessage] = useState('')
  const [ alertType, setAlertType] = useState('error')
  const [ state, setState] = useState(null)
  const backendEndpoint = process.env.REACT_APP_BACKEND_URL;

  // Navigation
  const navigateTo = async (link, state = {}) => {
    navigate('/' + link, { state });
  };

  // Opens dialog
  const openDialog = (dialogTypeNew) => {
    setDialogType(dialogTypeNew);
    setDialogOpen(true);
  };

  // Closes dialog
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Returns dialog component based on dialog type
  const getDialogContent = () => {
    if (dialogType === 'image') {
      return (
        <AddImageDialog
          foodItem={foodItem}
          onClose={closeDialog}
          setFoodItem={setFoodItem}
          image={image}
          setImage={setImage}
        />
      );
    } 
  };

  // Some prefilled form state
  const [foodItem, setFoodItem] = useState({
    _id: '',
    userId: user.id,
    name: '',
    image: '',
    type: 'food',
    units: 'gram',
    categoryType: 'meat',
    protein: 0,
    fat: 0,
    fiber: 0,
    ash: 0,
    carb: 0,
    calories: 0,
    servings: 0,
    caloriesServing: 0,
    servingWeight: 0,
    meatRatio: 100,
    bonesRatio: 0,
    desc: '',
    weight: 0,
  });

  useEffect(() => {
    // Fetch or set foodItem if it's not available
    if (!foodItem && !mealId && location.state) {
      setMealId(location.state.mealId);
    }
  }, [location.state]);

  // addFood function is responsible for adding the Food
  const addNewFood = async (event) => {
    const { name } = event.target;

    if (foodItem.name.length === 0 || foodItem.calories === 0) {
      return;
    }

    addFoodTemplateMutation(
      {
        user: user,
        foodItem: foodItem,
      },
      {
        onSuccess: (data) => {
          const templateId = data?.templateId;
          foodItem._id = templateId;
          setFoodItem({ ...foodItem, "_id": templateId });
          if (name === 'createAndAddFood') {
            const state = { mealId, foodItem } 
            setState(state)
          }
          handleMutation(
            "Food template created", 
            Enums.AlertType.SUCCESS
          )
          saveImage(image, templateId)
        },
        onError: (error) => {
          handleMutation(
            "Food template cannot be added. Try again.", 
            Enums.AlertType.ERROR
          )
        },
      }
    );
  };

  useEffect(() => {
    if (!showAlert && alertType === Enums.AlertType.SUCCESS) {
      if (state) { 
        navigateTo('addFood', state)
      } else {
        navigateTo('searchFood')
      }
    }
  }, [showAlert]);

  // Function to open alert
  const handleMutation=(messageNew, alertTypeNew) => {
    setMessage(messageNew)
    setAlertType(alertTypeNew)
    setShowAlert(true)
  }

  //Callback func that opens image dialog
  const updateImage = async () => {
    openDialog('image');
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

  // Handles dialog submission
  const saveImage = async (file, templateId) => {
    if (file) {
      try {
        const compressedFile = await compressImage(file, {
          type: 'image/jpeg',
        });
        // Create a new FormData object
        const data = new FormData();
        // Append the compressed file as a Blob
        data.append('image', compressedFile);
        
        // Use Axios to send the FormData to the server
        const result = await axios.post(
          `${backendEndpoint}/food/${foodItem.userId}/${templateId}`,
          data
        );
      } catch (error) {
        console.log('Error uploading file:', error);
      }
    }
  };

  return (
    <PageContainer>
      {/* Top navigation container */}
      <div style={styles.fixedTopContainer}>
        <div style={styles.topButtonsContainerStyle}>
          <ButtonImage
            variant="backButton"
            onClick={ () => navigateTo('searchFood') }
            imageName="arrow_left_green.svg"
            imageSize={20}
          >
            Back
          </ButtonImage>
          <div css={styles.addFoodTitleStyle}>{'Add New Food'}</div>
          <div style={{ width: '100px' }}></div>
        </div>
      </div>

      {/* Add new food form */}
      <NewFoodForm
        addNewFood={addNewFood}
        foodItem={foodItem}
        setFoodItem={setFoodItem}
        updateImage={updateImage}
        image={image}
      />

      {/* Dialog */}
      {dialogOpen && (
        <Dialog open={dialogOpen}>
          <DialogContent>{getDialogContent()}</DialogContent>
        </Dialog>
      )}

      {/* Alert */}
      <CustomAlert message={message} type={alertType} show={showAlert} setApperance={setShowAlert}/>
    </PageContainer>
  );
};

export default CreateNewFood;
