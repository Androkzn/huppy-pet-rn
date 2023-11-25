/** @jsxImportSource @emotion/react */

import { Delete } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/user.context";
import * as styles  from '../components/styles/Meals.css'
import {ButtonWithImage} from '../components/Buttons.components'
import { getAllFoodForMeal, deleteMeal, deleteFood } from "../graphql/graphqlUtils";
import { useNavigate } from 'react-router-dom';

function MealCard({ meal, updateMeals }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const mealId = meal._id;
  const _id = meal._id;

  // Define 'food' as a state variable using useState
  const [food, setFood] = useState([]);

  function handleWeightChange(e, foodItem) {
    const newValue = e.target.value;
    // Update the foodItem's weight with the new value
    foodItem.weight = newValue;
    // You may want to save the updated foodItem to your state or API here
  }
  
  const openAddFoodPage = () => {
    console.log("Navigate to searchFood mealId", mealId)
    navigate("/searchFood", { state: { mealId } });
  }
 
  useEffect(() => {
    loadFoodForMeal(); // Load food data when the component mounts
  }, [meal]); // Empty dependency array to ensure it runs only once on mount

  async function loadFoodForMeal() {
    const results = await getAllFoodForMeal(user, mealId);
      // Update the 'food' state with the fetched data
      setFood(results);
     
  }


  // Function is responsible for deleting the Meal
  const deleteCurrentMeal = async () => {
     const isDeleted = await deleteMeal(user, _id);
     if (isDeleted) {
        updateMeals()
     }
  };

    // Function is responsible for deleting the Food
    const deleteCurrentFood = async (id) => {
      console.log("deleteCurrentFood _id", id)
      const isDeleted = await deleteFood(user, id);
      console.log("isDeleted _id", isDeleted)
      if (isDeleted) {
        loadFoodForMeal()
     }
   };

 
  // Function to calculate the total weight of food
  function calculateTotalWeight(foodItems) {
    return foodItems.reduce((total, foodItem) => total + foodItem.weight, 0);
  }

  return (
      <div css={styles.childConteinerStyle} >
        <div css={styles.headerMealStyle}>
          <div css={styles.headerTextStyle}>
            <h3 css={styles.headingMealStyle}>MEALS</h3>
            <h4 css={styles.headingTotalStyle}>Total: {calculateTotalWeight(food)}g</h4>
            <div css={styles.headingDeleteButonStyle}><Delete onClick={deleteCurrentMeal} /></div>
          </div> 
        </div>
        <ul  css={styles.foodListStyle}>
          {food.map((foodItem) => (
            <li css={styles.foodListRowStyle} key={foodItem._id}>
              <div css={styles.headerFoodStyle}>
                <div css={styles.headerTextStyle}>
                  <h4 css={styles.headingFoodStyle}>{foodItem.name}, {foodItem.units}</h4>
                  <input
                    type="text"
                    css={styles.inputFieldStyle}
                    value={foodItem.weight}
                    onChange={(e) => handleWeightChange(e, foodItem)}
                  />
                  <div css={styles.headingDeleteButonStyle}><Delete onClick={() => deleteCurrentFood(foodItem._id)} /></div>
                </div> 
              </div>
            </li>
          ))}
        </ul>
        <ButtonWithImage
          variant="addButton"
          width='180px'
          imageName="plus_round_fill_white_button.svg"
          imageSize={20}
          onClick={openAddFoodPage}
          as= 'button'
        >
          Add Food to Meal
        </ButtonWithImage>
      </div>
   );
}

export default MealCard;
