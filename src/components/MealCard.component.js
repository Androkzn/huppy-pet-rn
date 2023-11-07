/** @jsxImportSource @emotion/react */

import { Delete, Edit } from "@mui/icons-material";
import { Card, CardContent, Grid, IconButton, Typography } from "@mui/material";
import request, { gql } from "graphql-request";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import * as styles  from '../components/styles/Meals.css'
import {Image} from '../components/Image.components'

function MealCard({ meal, updateMeals }) {
  const { user } = useContext(UserContext);
  const userId = user.id;
  const accessToken = user._accessToken;
  const mealId = meal._id;
  const _id = meal._id;
  const profileId = meal.profileId;
  
  // Define 'food' as a state variable using useState
  const [food, setFood] = useState([]);
      // GraphQL query to fetch all  food for specificmeal
      const getAllFoodForMeal = gql`
      query getAllFoodForMeal($mealId: String!) {
        foods(query: { mealId: $mealId}) {
          _id
          bonesRatio
          calories
          caloriesServing
          categoryType
          image
          mealId
          meatRatio
          name
          servingWeight
          servings
          templateId
          units
          weight
          type
          userId
        }
      }
    `;

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
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      const resp = await request(GRAPHQL_ENDPOINT, getAllFoodForMeal, {
        "mealId": mealId,
      }, headers);
      
      // Update the 'food' state with the fetched data
      setFood(resp.foods);
    } catch (error) {
      alert(error);
    }
  }

  // GraphQL query to delete an meal
  const deleteMealQuery = gql`
  mutation DeleteMeal($query: MealQueryInput!) {
    deleteOneMeal(query: $query) {
      _id
    }
  }
  `;

  // deleteThisMeal function is responsible for deleting the
  // meal based on the expense-id provided and then calling the
  // updateMeals function to do the cleanup. 
  const deleteThisMeal = async () => {
    const headers = { Authorization: `Bearer ${accessToken}` };
    const queryVariables = { query: { _id } };
    // Confirming the user's action
    const resp = window.confirm("Are you sure you want to delete this meal?");
    if (!resp) return;

    try {
      await request(GRAPHQL_ENDPOINT, deleteMealQuery, queryVariables, headers);
      updateMeals();
    } catch (error) {
      alert(error);
    }
  };

 
  // addFood function is responsible for adding the food
  const addFood = async () => {
    const headers = { Authorization: `Bearer ${accessToken}` };
   
    // GraphQL query to create food
    const createFoodQuery = gql`
    mutation AddFood($data: FoodInsertInput!) {
      insertOneFood(data: $data) {
        _id
      }
    }
    `;

    // All the data that needs to be sent to the GraphQL endpoint
    // to create food will be passed through queryVariablesCreateFood.
    const queryVariablesCreateFood = {
      data: {
        profileId: profileId,
        userId: userId
      }
    };

    try {
      await request(GRAPHQL_ENDPOINT, createFoodQuery, queryVariablesCreateFood, headers);
      loadFoodForMeal();
    } catch (error) {
      alert(error);
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
            <div css={styles.headingDeleteButonStyle}><Delete onClick={deleteThisMeal} /></div>
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
        <button
          css={styles.addButtonStyle}
          onClick={addFood}
        >
          <div css={styles.addButtonContentStyle}>
            <Image imageName="plus_round_fill_white_button.svg" width="25" height="25"/>
            <h4 css={styles.addButtonTitleStyle}>Add Food</h4>
          </div>
        </button>
      </div>
   );
}

export default MealCard;
