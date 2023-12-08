/** @jsxImportSource @emotion/react */

import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import AddFoodForm from "../components/AddFoodForm.component";
import {ButtonLink} from '../components/Buttons.components'
import { addFood } from "../graphql/graphqlUtils";
import * as styles  from '../components/styles/AddFood.css'

const AddFood = ({ }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
   
  const [foodItem, setFoodItem] = useState(location.state?.foodItem);
  const [mealId, setMealId] = useState(location.state?.mealId);
  const [selectedDate, setSelectedDate] = useState(location.state?.selectedDate);

  console.log('AddFood',foodItem)

  // addFood function is responsible for adding the Food
  const addFoodToMeal = async () => {
    console.log("selectedDate", selectedDate)
    const isAdded = await addFood(user, mealId, foodItem, selectedDate)  
    if (isAdded) {
      navigate("/searchFood");
    }
  };

  useEffect(() => {
    // Fetch or set foodItem if it's not available
    if (!foodItem && !mealId && location.state) {
      setFoodItem(location.state.foodItem);
      setMealId(location.state.mealId)
      setSelectedDate(location.state.selectedDate)
    }
  }, [foodItem, location.state]);

  return <PageContainer>
    <div  style={styles.topButtonsContainerStyle}>
      <ButtonLink
          variant="backButton"
          to="/searchFood"
          imageName="arrow_left.svg"
          imageSize={20}
          width='100px'
        >
         Back
      </ButtonLink>
    </div>
    <AddFoodForm foodItem={foodItem} addFoodToMeal={addFoodToMeal} setFoodItem={setFoodItem} />
  </PageContainer>
}

export default AddFood;