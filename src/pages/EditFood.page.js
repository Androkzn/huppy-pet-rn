/** @jsxImportSource @emotion/react */

import { useContext, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import EditFoodForm from "../components/EditFoodForm.component";
import {ButtonLink} from '../components/Buttons.components'
import { updateFoodTemplate } from "../graphql/graphqlUtils";
import * as styles  from '../components/styles/CreateNewFood.css'
import { useNavigate, useLocation } from "react-router-dom";

const EditFood = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { food } = location.state || {};

  console.log("EditFood  food",food)

  const [foodItem, setFoodItem] = useState({
    _id : food?._id,
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
  });

  // addFood function is responsible for editing the Food
  const editFood = async () => {
    if ( foodItem.name.length === 0 || foodItem.calories  === 0   ) {
      return;
    }
    const isUpdated = await updateFoodTemplate(user, foodItem)  
    console.log("updateFoodTemplate isSuccess", isUpdated )
   
    if (isUpdated) {
        navigate("/searchFood");
      } else {
        
      }     


  };

  return <PageContainer>
    <div  style={styles.topButtonsContainerStyle}>
      <ButtonLink
          variant="backButton"
          to="/searchFood"
          imageName="arrow_left.svg"
          imageSize={20}
        >
         Back
      </ButtonLink>
      <div  css={styles.addFoodTitleStyle}>{"Edit Food"}</div>
      <div style={{width: '100px'}}></div>
    </div>
    <EditFoodForm editFood={editFood} foodItem={foodItem} setFoodItem={setFoodItem}/>
  </PageContainer>
}

export default EditFood;