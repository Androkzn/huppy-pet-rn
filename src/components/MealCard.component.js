/** @jsxImportSource @emotion/react */

import { Delete } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/user.context";
import * as styles  from '../components/styles/Meals.css'
import {ButtonWithImage} from '../components/Buttons.components'
import { getAllFoodForMeal, deleteMeal, deleteFood, updateFood } from "../graphql/graphqlUtils";
import { useNavigate } from 'react-router-dom';

function MealCard({ meal, updateMeals,  updateFoods }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const mealId = meal._id;
  const selectedDate = meal.date
  const _id = meal._id;

  // Define 'food' as a state variable using useState
  const [food, setFood] = useState([]);

  async function handleWeightChange(e, foodItem) {
    const newValue = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
    // Update the foodItem's weight with the new value
    const data = {
      weight: newValue
    }
    const isUpdated = await updateFood(user, foodItem._id, data);
    if (isUpdated) {
      setFood(prevFood => prevFood.map(item => (item._id === foodItem._id ? { ...item, weight: newValue } : item)));
      updateFoods()
    }
  }
  
  const openAddFoodPage = () => {
    console.log("Navigate to searchFood mealId", mealId)
    navigate("/searchFood", { state: { mealId, selectedDate } });
  }
 
  useEffect(() => {
    let isMounted = true;
    // Load food data when the component mounts
    const loadFoodForMeal = async () => {
      try {
        const results = await getAllFoodForMeal(user, mealId);
        // Update the 'food' state with the fetched data only if the component is still mounted
        if (isMounted) {
          setFood(results);
        }
      } catch (error) {
        // Handle errors here
      }
    };
  
    loadFoodForMeal();
    // Cleanup function to set isMounted to false when the component is unmounted
    return () => {
      isMounted = false;
    };
  }, [meal]);
  

  async function loadFoodForMeal() {
    const results = await getAllFoodForMeal(user, mealId);
      // Update the 'food' state with the fetched data
      setFood(results);
     
  }

  // Function is responsible for deleting the Meal
  const deleteCurrentMeal = async () => {
     const isDeleted = await deleteMeal(user, _id);
     if (isDeleted) {
      // Delete all associated food items
      await Promise.all(food.map(async foodItem => {
        await deleteFood(user, foodItem._id);
      }));
        updateMeals()
        updateFoods()
     }
  };

    // Function is responsible for deleting the Food
    const deleteCurrentFood = async (id) => {
      const isDeleted = await deleteFood(user, id);
      if (isDeleted) {
        loadFoodForMeal()
        updateFoods()
     }
   };
 
  // Function to calculate the total weight of food
  function calculateTotalWeight(foodItems) {
    const total = foodItems.reduce((total, foodItem) => total + Number(foodItem.weight), 0);
    return total;
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
                    type="number"
                    css={styles.inputFieldStyle}
                    value={foodItem.weight}
                    onChange={(e) => 
                      handleWeightChange(e, foodItem)}
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
