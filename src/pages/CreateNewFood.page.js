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

const CreateNewFood = () => {
  const { user, setCurrentPage } = useContext(DataContext);
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

  // Navigation
  const navigateTo = async (link, state = {}) => {
    setCurrentPage(link);
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
    } else if (dialogType === 'error') {
    }
  };

  // Some prefilled form state
  const [foodItem, setFoodItem] = useState({
    _id: '',
    name: '',
    image: new Date().toISOString(),
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
          if (name === 'createAndAddFood') {
            const templateId = data?.templateId;
            foodItem._id = templateId;
            const state = { mealId, foodItem } 
            setState(state)
          }
          handleMutation(
            "Food template created", 
            "success"
          )
        },
        onError: (error) => {
          handleMutation(
            "Food template cannot be added. Try again.", 
            "error"
          )
        },
      }
    );
  };

  useEffect(() => {
    if (!showAlert && alertType === "success") {
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
