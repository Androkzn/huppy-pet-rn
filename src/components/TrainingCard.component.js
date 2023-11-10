/** @jsxImportSource @emotion/react */

import { Delete, Edit } from "@mui/icons-material";
import request, { gql } from "graphql-request";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import * as styles  from './styles/Meals.css'
import {Image} from './Image.components'
import {Button, IconButton} from '@mui/material';
import { getAllFoodForMeal, deleteMeal } from "../graphql/graphqlUtils";

function MealCard({ meal, updateMeals }) {
  const { user } = useContext(UserContext);
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
  
  useEffect(() => {
    loadFoodForMeal(); // Load food data when the component mounts
  }, []); // Empty dependency array to ensure it runs only once on mount

  async function loadFoodForMeal() {
    const results = await getAllFoodForMeal(user, mealId);
      // Update the 'food' state with the fetched data
      setFood(results);
     
  }

  
  // deleteMeal function is responsible for deleting the
  // meal based on the expense-id provided and then calling the
  // updateMeals function to do the cleanup. 
  const deleteCurrentMeal = async () => {
     const isDeleted = await deleteMeal(user, _id);
     if (isDeleted) {
        updateMeals()
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
                  <div css={styles.headingDeleteButonStyle}><Delete/></div>
                </div> 
              </div>
            </li>
          ))}
        </ul>
        <Button
          startIcon={<Image imageName="plus_round_fill_white_button.svg" width="25" height="25" />}
          component={Link}
          to="/searchFood"
          css={styles.addButtonStyle}
        >
          Add Food
        </Button>
      </div>
   );
}

export default MealCard;
