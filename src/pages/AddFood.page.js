/** @jsxImportSource @emotion/react */

import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import AddFoodForm from "../components/AddFoodForm.component";
import {ButtonWithImage} from '../components/Buttons.components'
import { addFood } from "../graphql/graphqlUtils";
import * as styles  from '../components/styles/AddFood.css'

const AddFood = ({ }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { mealId, foodItem } = location.state || {};

  // addFood function is responsible for adding the Food
  const addFoodToMeal = async () => {
    console.log("mealId",mealId)
    const isAdded = await addFood(user, mealId, foodItem)  
    if (isAdded) {
      navigate("/searchFood");
    }
  };

  return <PageContainer>
    <div  style={styles.topButtonsContainerStyle}>
      <ButtonWithImage
          variant="backButton"
          to="/searchFood"
          imageName="back_arrow.svg"
          imageSize={20}
        >
         Back
      </ButtonWithImage>
    </div>
    <AddFoodForm foodItem={foodItem} addFoodToMeal={addFoodToMeal}/>
  </PageContainer>
}

export default AddFood;