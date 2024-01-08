/** @jsxImportSource @emotion/react */

import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer.component';
import { DataContext } from '../contexts/data.context';
import AddFoodForm from '../components/AddFoodForm.component';
import { ButtonImage } from '../components/Buttons.components';
import * as styles from '../components/styles/AddFood.css';
import { useAddFood } from '../hooks/query.hooks';
import CustomAlert from '../components/CustomAlert.component';

const AddFood = ({}) => {
  const { user, currentProfile, setCurrentPage, currentDate } =
    useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  let foodItem = location.state?.foodItem;
  let mealId = location.state?.mealId;

  const { mutate: addFoodMutation } = useAddFood();
  // States for displaying alert
  const [ showAlert, setShowAlert] = useState(false);
  const [ message, setMessage] = useState('')
  const [ alertType, setAlertType] = useState('error')
  
  // Navigation
  const navigateTo = async (link, state = {}) => {
    setCurrentPage(link);
    navigate('/' + link, { state });
  };

  // addFood function is responsible for adding the Food
  const addFoodToMeal = (units, weight) => {
    foodItem.units = units;
    foodItem.weight = weight;

    addFoodMutation({
      user: user,
      mealId: mealId,
      currentProfile: currentProfile,
      foodItem: foodItem,
      selectedDate: currentDate,
    },
    {
      onSuccess: (data) => {
        handleMutation(
          " added to your meal.", 
          "success"
        )
      },
      onError: (error) => {
        handleMutation(
          " cannot be added. Try again.", 
          "error"
        )
      },
    },
  )};

  const handleMutation=(messageNew, alertTypeNew) => {
    setMessage(foodItem.name + messageNew)
    setAlertType(alertTypeNew)
    setShowAlert(true)
  }

  useEffect(() => {
    if (!showAlert && alertType === "success") {
      navigateTo('searchFood')  
    }
  }, [showAlert]);


  useEffect(() => {
    // Fetch or set foodItem if it's not available
    if (!foodItem && !mealId && location.state) {
      foodItem = location.state.foodItem;
      mealId = location.state.mealId;
    }
  }, [location.state]);

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
          <div css={styles.addFoodTitleStyle}>{'Add to meal'}</div>
          <div style={{ width: '100px' }}></div>
        </div>
      </div>

      {/* Add food form */}
      <AddFoodForm foodItem={foodItem} addFoodToMeal={addFoodToMeal} />
      
      {/* Alert */}
      <CustomAlert message={message} type={alertType} show={showAlert} setApperance={setShowAlert}/>
    </PageContainer>
  );
};

export default AddFood;
