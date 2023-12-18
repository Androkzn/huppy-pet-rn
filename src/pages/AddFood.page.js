/** @jsxImportSource @emotion/react */

import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import AddFoodForm from "../components/AddFoodForm.component";
import {ButtonLink} from '../components/Buttons.components'
import * as styles  from '../components/styles/AddFood.css'
import {useAddFood} from "../hooks/query.hooks"

const AddFood = ({ }) => {
  const { user, setCurrentPage, currentDate } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState(location.state?.foodItem);
  const [mealId, setMealId] = useState(location.state?.mealId);
  const {mutate: addFoodMutation} = useAddFood()

  // addFood function is responsible for adding the Food
  const addFoodToMeal =  (event) => {
    event.preventDefault();

    addFoodMutation({
      user: user,
      mealId: mealId,
      foodItem: foodItem,
      selectedDate: currentDate,
    }) 
     
    setCurrentPage("searchFood");
    navigate("/searchFood");
  
  };

  useEffect(() => {
    // Fetch or set foodItem if it's not available
    if (!foodItem && !mealId && location.state) {
      setFoodItem(location.state.foodItem);
      setMealId(location.state.mealId)
    }
  }, [foodItem, location.state]);

  
  return <PageContainer>
    <div style={styles.fixedTopContainer}> 
      <div  style={styles.topButtonsContainerStyle}>
        <ButtonLink
            variant="backButton"
            to="/searchFood"
            imageName="arrow_left_green.svg"
            imageSize={20}
          >
          Back
        </ButtonLink>
        <div  css={styles.addFoodTitleStyle}>{"Add to meal"}</div>
        <div style={{width: '100px'}}></div>
      </div>
    </div>
      <AddFoodForm 
        foodItem={foodItem} 
        addFoodToMeal={addFoodToMeal} 
        setFoodItem={setFoodItem} 
      />
  </PageContainer>
}

export default AddFood;