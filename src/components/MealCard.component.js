/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/user.context";
import * as styles  from '../components/styles/Meals.css'
import {ButtonImage, ButtonText} from '../components/Buttons.components'
import { useNavigate } from 'react-router-dom';
import {Image} from '../components/Image.components'
import Swipe  from './Swipe.components.tsx';
import * as colors from '../components/styles/Colors';
import {useGetAllFoodForMeal, useUpdateFood, useAddMeal, useDeleteFood, useDeleteMeal} from "../hooks/query.hooks"
import Spiner from "../components/Spinner.components"

function MealCard({ meal, index, mealsCount }) {
  const { user, currentProfile, isSmallScreen, currentDate, setCurrentPage} = useContext(UserContext);
  const navigate = useNavigate();
  const mealId = meal._id;
  const selectedDate = meal.date
  const [isMealsExpanded, setMealsExpanded] = useState(true);

  const { data: food, isLoading: isLoadingFood, isError: isErrorFood} = useGetAllFoodForMeal(user,mealId);
  const {mutate: addMealMutation} = useAddMeal()
  const {mutate: deleteMealMutation} = useDeleteMeal()
  const {mutate: deleteFoodMutation} = useDeleteFood()

  // Function is responsible for creating a new meal
  const addMealForDate = async () => {
    addMealMutation({
      user:user, 
      currentProfile:currentProfile, 
      currentDate: currentDate
    })
  };

  // Function is responsible for deleting the Meal
  const deleteCurrentMeal = async () => {
    deleteMealMutation({
      user: user,
      _id: mealId,
    })
    await Promise.all(food.map(async foodItem => {
      deleteFoodMutation({
        user: user, 
        _id: foodItem._id,
      });
    }));
    
  }

  const openAddFoodPage = () => {
    console.log("Navigate to searchFood mealId", mealId)
    setCurrentPage("searchFood")
    navigate("/searchFood", { state: { mealId, selectedDate } });
  }


  // Function to calculate the total weight of food
  function calculateTotalWeight(foodItems) {
    const total = foodItems.reduce((total, foodItem) => total + Number(foodItem.weight), 0);
    return total;
  }

  const FoodItem = ({foodItem}) => {
    const {mutate: updateFoodMutation} = useUpdateFood()
    // Function is responsible for deleting the Food
    const deleteCurrentFood = async () => {
        deleteFoodMutation({
          user: user, 
          _id: foodItem._id,
        });
    };

    async function handleWeightChange(e, foodItem) {
      const newValue = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
      // Update the foodItem's weight with the new value
      const data = {
        weight: newValue
      }
      updateFoodMutation({
        user: user,
        foodId: foodItem._id,
        updateData: data,
      })
    }
  

    const editCurrentFood = async () => {
          
    }

    return (
      <Swipe
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
        distructiveLeftSwipe = {true}
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
      </Swipe>
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
          
          {mealsCount > 1 && 
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
          }
          </div>}

        </div> {/* Meals container*/}
        
      </div>  
   );
}

export default MealCard;
