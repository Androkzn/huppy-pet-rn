/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/user.context";
import * as styles  from '../components/styles/Meals.css'
import {ButtonImage, ButtonText} from '../components/Buttons.components'
import { getAllFoodForMeal, deleteMeal, deleteFood, updateFood, addMeal } from "../graphql/graphqlUtils";
import { useNavigate } from 'react-router-dom';
import {Image} from '../components/Image.components'
import SwipeToDelete  from '../components/SwipeToDelete.tsx';
import * as colors from '../components/styles/Colors';

function MealCard({ meal, index, updateMeals,  updateFoods }) {
  const { user, currentProfile, isSmallScreen, currentDate, setCurrentPage} = useContext(UserContext);
  const navigate = useNavigate();
  const mealId = meal._id;
  const selectedDate = meal.date
  const _id = meal._id;
  const [isMealsExpanded, setMealsExpanded] = useState(true);
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
    setCurrentPage("searchFood")
    navigate("/searchFood", { state: { mealId, selectedDate } });
  }

    // Function is responsible for creating a new meal
    const addMealForDate = async () => {
      const isAdded = await addMeal(user, currentProfile, currentDate)  
      if (isAdded) {
        updateMeals();
      }
    };
 
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


  // Function to calculate the total weight of food
  function calculateTotalWeight(foodItems) {
    const total = foodItems.reduce((total, foodItem) => total + Number(foodItem.weight), 0);
    return total;
  }

  const FoodItem = ({foodItem}) => {
  
    // Function is responsible for deleting the Food
    const deleteCurrentFood = async () => {
      const isDeleted = await deleteFood(user, foodItem._id);
      if (isDeleted) {
        loadFoodForMeal()
        updateFoods()
     }
   };

   const editCurrentFood = async () => {
      return
   }

    return (
      <SwipeToDelete
        height={50}  
        onLeftSwipe={deleteCurrentFood} 
        leftSwipeComponent={  <Image imageName={`delete_white.svg`} width="30" height="30" />}
        onLeftSwipeConfirm={(onSuccess, onCancel) => {
          if (window.confirm("Do you really want to delete this item ?")) {
            onSuccess();
          } else {
            onCancel();
          }
        }}
        onRightSwipe={editCurrentFood}
        rightSwipeComponent={  <Image imageName={ `edit_white.svg`} width="20" height="20" />}
        className="my-swiper"
        leftSwipeColor={colors.orange}
        rightSwipeColor={colors.lightGreen2}
      >
       <li css={styles.foodListRowStyle} key={foodItem._id}>
          <div css={styles.headerFoodStyle()}>
            <div css={styles.headerTextStyle()}>
              <div css={styles.headingFoodStyle}>{foodItem.name}</div>
              <input
                type="number"
                css={styles.inputFieldStyle}
                value={foodItem.weight}
                onChange={(e) => 
                  handleWeightChange(e, foodItem)}
              />
            </div> 
          </div>
        </li>
      </SwipeToDelete>
    )
  }

  const FoodList = ({data}) => {
    return(
      <ul  css={styles.foodListStyle}>
      {food.map((foodItem) => (
        <FoodItem foodItem={foodItem}  key={foodItem._id}/>
      ))}
    </ul>
    )
  }

  return (
      <div style={styles.childConteinerStyle}> {/* Meals container*/}
        <div style={styles.headerStyle} onClick={() => {isSmallScreen ? setMealsExpanded(!isMealsExpanded) : setMealsExpanded(isMealsExpanded)}}>{/* Header container*/}
          <div style={styles.headerTiteStyle} onClick={() => {isSmallScreen ? setMealsExpanded(!isMealsExpanded) : setMealsExpanded(isMealsExpanded)}}>
            <div style={styles.headerArrowStyle} >
              <Image 
                imageName= {isMealsExpanded ? "arrow_down_green.svg" : "arrow_right_green.svg"}
                width="20" 
                height="20" 
              />
            </div>
            <div style={styles.headingStyle}>MEAL</div>
            <ButtonText
              as="button"
              variant="circleTextTransparentButton"
            >
              {index}
            </ButtonText>
          </div>
          <button
            style={styles.headerAddButtonStyle}
            onClick={() => {
              if (isMealsExpanded) { 
                addMealForDate();
              } else {
                setMealsExpanded(!isMealsExpanded)
              }
            }}
          >
            <Image imageName="plus_round_fill_button.svg" width="30" height="30" />
          </button>
        </div> {/* Header container*/}
        
        <div  style={styles.bodyMealStyle}>  {/* Meal container*/}
          {/* Show meals cards if data avaliable, if not -> show placeholder*/}
          {isMealsExpanded && food && food.length > 0 ? (
            <div>
              <div css={styles.totalWeightContainerStyle}>
                <div css={styles.weightLabellStyle}>Total weight, gram:</div>
                <div css={styles.weightValueStyle}>{calculateTotalWeight(food)}</div>
              </div>
              <FoodList/>
            </div>
          ) : (
            <div style={styles.placeholderStyle}>
              <Image 
                imageName= {isMealsExpanded ? "no_food_placeholder.png"  :  "more_green.svg"}
                width={isMealsExpanded ? "200"  :  "30"}
                height={isMealsExpanded ? "140"  :  "10"}
              />
              
            </div>
          )}

          {isMealsExpanded && <div style={styles.addButtonStyle}>
          <ButtonImage
              variant="addButton"
              width='140px'
              height={30}
              imageName="plus_round_fill_white_button.svg"
              imageSize={20}
              onClick={openAddFoodPage}
            >
              Add Food
          </ButtonImage>
          <ButtonImage
              variant="deleteButton"
              width='140px'
              height={30}
              imageName="delete_orange.svg"
              imageSize={20}
              onClick={deleteCurrentMeal}
            >
              Delete Meal
          </ButtonImage>
          </div>}

        </div> {/* Meals container*/}
        
      </div>  
   );
}

export default MealCard;
