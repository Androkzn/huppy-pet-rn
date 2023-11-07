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

function MealCard({ meal }) {
  const { user } = useContext(UserContext);
  const userId = user.id;
  const accessToken = user._accessToken;
  const mealId = meal._id;
  const profileId = meal.profileId;
  
  // Define 'food' as a state variable using useState
  const [food, setFood] = useState([]);
      // GraphQL query to fetch all  food for specificmeal
      const getAllFood = gql`
      query getAllFood($mealId: String!) {
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
    loadFood(); // Load food data when the component mounts
  }, []); // Empty dependency array to ensure it runs only once on mount

  async function loadFood() {
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      const resp = await request(GRAPHQL_ENDPOINT, getAllFood, {
        "mealId": mealId,
      }, headers);
      
      // Update the 'food' state with the fetched data
      setFood(resp.foods);
    } catch (error) {
      alert(error);
    }
  }

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
            <div css={styles.headingDeleteButonStyle}><Delete/></div>
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
        {/* Other components and UI elements */}
      </div>
   );
}

export default MealCard;
