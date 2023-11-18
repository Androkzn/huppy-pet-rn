/** @jsxImportSource @emotion/react */

import { useContext, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import EditFoodForm from "../components/NewFoodForm.component";
import {ButtonWithImage} from '../components/Buttons.components'
import { addFoodTemplate } from "../graphql/graphqlUtils";
import * as styles  from '../components/styles/CreateNewFood.css'
import { useNavigate, useLocation } from "react-router-dom";

const EditFood = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { mealId } = location.state || {};

  // Some prefilled form state
  const [foodItem, setFoodItem] = useState({
    _id : "",
    name: "",
    type: "",
    units: "",
    categoryType: "",
    protein: 0,
    fat: 0,
    fiber: 0,
    ash: 0,
    carb: 0,
    calories: 0,
    servings: 0,
    caloriesServing: 0,
    servingWeight: 0,
    meatRatio: 0,
    bonesRatio: 0,
    desc: "",
    weight: 0,
  });

  // addFood function is responsible for adding the Food
  const addNewFood = async (event) => {
    const { name} = event.target;

    if ( foodItem.name.length === 0 || foodItem.calories  === 0   ) {
      return;
    }
    const {success, templateId }= await addFoodTemplate(user, foodItem)  
    
    if (success) {
      // Function to open the AddFoodPage when a food item is clicked
      if (name === 'createAndAddFood') {
        foodItem._id = templateId
        console.log("CreateNewFood", foodItem)
        console.log("mealId", mealId)
        navigate("/addFood", { state: { mealId, foodItem } });
      } else {
        navigate("/searchFood");
      }
     


    }
  };

  return <PageContainer>
    <div  style={styles.topButtonsContainerStyle}>
      <ButtonWithImage
          variant="backButton"
          navigateTo="/searchFood"
          imageName="back_arrow.svg"
          imageSize={20}
        >
         Back
      </ButtonWithImage>
    </div>
    <EditFoodForm addNewFood={addNewFood} foodItem={foodItem} setFoodItem={setFoodItem} title="Add Food" />
  </PageContainer>
}

export default EditFood;