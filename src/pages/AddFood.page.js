/** @jsxImportSource @emotion/react */

import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import PageContainer from '../components/PageContainer.component';
import { DataContext } from '../contexts/data.context';
import AddFoodForm from '../components/AddFoodForm.component';
import { ButtonLink } from '../components/Buttons.components';
import * as styles from '../components/styles/AddFood.css';
import { useAddFood } from '../hooks/query.hooks';

const AddFood = ({}) => {
  const { user, currentProfile, setCurrentPage, currentDate } =
    useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  let foodItem = location.state?.foodItem;
  let mealId = location.state?.mealId;
  const { mutate: addFoodMutation } = useAddFood();

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
    });

    setCurrentPage('searchFood');
    navigate('/searchFood');
  };

  useEffect(() => {
    // Fetch or set foodItem if it's not available
    if (!foodItem && !mealId && location.state) {
      foodItem = location.state.foodItem;
      mealId = location.state.mealId;
    }
  }, [location.state]);

  return (
    <PageContainer>
      <div style={styles.fixedTopContainer}>
        <div style={styles.topButtonsContainerStyle}>
          <ButtonLink
            variant="backButton"
            to="/searchFood"
            imageName="arrow_left_green.svg"
            imageSize={20}
          >
            Back
          </ButtonLink>
          <div css={styles.addFoodTitleStyle}>{'Add to meal'}</div>
          <div style={{ width: '100px' }}></div>
        </div>
      </div>
      <AddFoodForm foodItem={foodItem} addFoodToMeal={addFoodToMeal} />
    </PageContainer>
  );
};

export default AddFood;
