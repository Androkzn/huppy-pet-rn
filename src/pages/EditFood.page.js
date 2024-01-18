/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer.component';
import { DataContext } from '../contexts/data.context';
import EditFoodForm from '../components/EditFoodForm.component';
import { ButtonImage, ButtonText } from '../components/Buttons.components';
import * as styles from '../components/styles/CreateNewFood.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent } from '@mui/material';
import ChangeImageDialog from '../components/ChangeImageDialog.component';
import { useUpdateFoodTemplate } from '../hooks/query.hooks';
import FoodImage from '../components/FoodImage.components';

const EditFood = () => {
  const { user } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { food } = location.state || {};
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('addActivity');
  const { mutate: updateFoodTemplateMutation } = useUpdateFoodTemplate();
  const [isEdited, setIsEdited] = useState(false);

  // Function to load state from localStorage
  const loadState = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  // Function to save state to localStorage
  const saveState = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
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

  // Navigation
  const navigateTo = async (link, state = {}) => {
    // Ask user to save changes when back button is pressed
    if (isEdited) {
      const userResponse = window.confirm(
        'You have unsaved changes. Do you want to save them before leaving?'
      );

      if (userResponse) {
        editFood();
      }
      navigate('/' + link, { state });
    } else {
      navigate('/' + link, { state });
    }
  };

  // Returns dialog component based on dialog type
  const getDialogContent = () => {
    if (dialogType === 'image') {
      return (
        <ChangeImageDialog
          foodItem={foodItem}
          onClose={closeDialog}
          setFoodItem={setFoodItem}
        />
      );
    } else if (dialogType === 'error') {
    }
  };

  const cachedFood = loadState('foodEdited', {
    _id: food?._id,
    name: food?.name,
    type: food?.type,
    units: food?.units,
    categoryType: food?.categoryType,
    protein: food?.protein,
    fat: food?.fat,
    fiber: food?.fiber,
    ash: food?.ash,
    carb: food?.carb,
    calories: food?.calories,
    servings: food?.servings,
    caloriesServing: food?.caloriesServing,
    servingWeight: food?.servingWeight,
    meatRatio: food?.meatRatio,
    bonesRatio: food?.bonesRatio,
    desc: food?.desc,
    weight: food?.weight,
    userId: food?.userId,
    image: food?.image,
    isCustom: food?.isCustom,
  });

  const [foodItem, setFoodItem] = useState(food || cachedFood);

  // addFood function is responsible for editing the Food
  const editFood = async () => {
    if (foodItem.name.length === 0 || foodItem.calories === 0) {
      return;
    }
    updateFoodTemplateMutation(
      {
        user: user,
        foodItem: foodItem,
      },
      {
        onSuccess: () => {
          navigate('/searchFood');
        },
      }
    );
  };

  //Callback func that opens image dialog
  const updateImage = async () => {
    openDialog('image');
  };

  // Updates food
  const getFood = async () => {
    if (food) {
      setFoodItem(food);
      saveState('foodEdited', food);
      return food;
    } else {
      setFoodItem(cachedFood);
      return cachedFood;
    }
  };

  //Set initial food
  useEffect(() => {
    getFood();
  }, [food]);

  // Set isEdited flag
  useEffect(() => {
    // Change the flag only ones
    if (!isEdited && food !== foodItem) {
      setIsEdited(true);
    }
  }, [foodItem]);

  return (
    <PageContainer>
      <div style={styles.fixedTopContainer}>
        <div style={styles.topButtonsContainerStyle}>
          <ButtonImage
            variant="backButton"
            onClick={() => navigateTo('searchFood')}
            imageName="arrow_left_green.svg"
            imageSize={20}
          >
            Back
          </ButtonImage>
          <div css={styles.addFoodTitleStyle}>{'Edit Food'}</div>
          <ButtonImage
            variant="actionNavigationButton"
            onClick={() => editFood()}
            imageName="checkmark_orange.svg"
            imageSize={15}
            disabled={!isEdited}
          >
            Save
          </ButtonImage>
        </div>
      </div>
      <div style={styles.imageContainerStyle}>
        <FoodImage foodItem={foodItem} onClick={updateImage} />
      </div>
      <EditFoodForm
        foodItem={foodItem}
        setFoodItem={setFoodItem}
        isEdited={isEdited}
        setIsEdited={setIsEdited}
      />

      {/* Dialog */}
      {dialogOpen && (
        <Dialog open={dialogOpen}>
          <DialogContent>{getDialogContent()}</DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
};

export default EditFood;
