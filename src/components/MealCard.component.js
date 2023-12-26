/** @jsxImportSource @emotion/react */

import { useContext, useState, Fragment } from "react";
import { UserContext } from "../contexts/user.context";
import * as styles  from '../components/styles/Meals.css'
import {ButtonImage, ButtonText} from '../components/Buttons.components'
import { useNavigate } from 'react-router-dom';
import {Image} from '../components/Image.components'
import Swipe  from './Swipe.components.tsx';
import * as colors from '../components/styles/Colors';
import {useGetAllFoodForMeal, useUpdateFood, useAddMeal, useDeleteFood, useDeleteMeal} from "../hooks/query.hooks"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { styled, alpha } from '@mui/material/styles';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
 
function MealCard({ meal, index, mealsCount }) {
  const { user, currentProfile, isSmallScreen, currentDate, setCurrentPage} = useContext(UserContext);
  const navigate = useNavigate();
  const mealId = meal._id;
  const selectedDate = meal.date
  const [isMealsExpanded, setMealsExpanded] = useState(true);

  const { data: food, isLoading: isLoadingFood, isError: isErrorFood} = useGetAllFoodForMeal(user, currentProfile, mealId);
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

   // Function is responsible for showing options for current meal
   const copyMealToDate = async () => {
    
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
    setCurrentPage("searchFood")
    navigate("/searchFood", { state: { mealId, selectedDate } });
  }


  // Function to calculate the total weight of food for entire meal
  const calculateTotalWeight= (foodItems) => {
    const total = foodItems.reduce((total, foodItem) => total + Number(foodItem.weight), 0);
    return Math.floor(total);
  }
   // Function to calculate the total calories of food for entire meal
  const calculateTotalCalories= (foodItems) => {
    const total = foodItems.reduce((total, foodItem) => total + Number(foodItem.calories/100 * foodItem.weight), 0);
    return Math.floor(total);
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

    const getcaloriesForFood = (foodItem) => {
      return Math.floor(foodItem.calories / 100 * foodItem.weight)
    }

    return (
      <Swipe
        height={50}  
        onLeftSwipe={deleteCurrentFood} 
        leftSwipeComponent={  <Image imageName={`delete_white.svg`} width="25" height="25" />}
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
        className="swiper"
        leftSwipeColor={colors.orange}
        rightSwipeColor={colors.lightGreen2}
      >
       <div style={styles.foodListRowStyle} key={foodItem._id}>
          <div style={styles.headerFoodStyle()}>
            <div style={styles.headerTextStyle()}>
              <div style={styles.headingFoodStyle}>{foodItem.name}</div>
              <div  style={styles.caloriesAndWeightContainerStyle}> 
                <div style={styles.caloriesValueStyle}>{getcaloriesForFood(foodItem)}</div>
                <input
                  type="number"
                  style={styles.inputFieldStyle}
                  value={foodItem.weight}
                  onChange={(e) => 
                    handleWeightChange(e, foodItem)}
                />
              </div>
            </div> 
          </div>
        </div>
      </Swipe>
    )
  }

  const FoodList = ({data}) => {
    return(
      <div  css={styles.foodListStyle}>
      {food.map((foodItem) => (
        <FoodItem foodItem={foodItem}  key={foodItem._id}/>
      ))}
    </div>
    )
  }

  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 10,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color: colors.green,
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '0px 0px',
      },
      '& .MuiMenuItem-root': {
        '&:active': {
          backgroundColor: alpha(colors.lightOrange, 0.5 ),
        },
      },
    },
  }));
  

  return (
      <div style={styles.childConteinerStyle}> {/* Meals container*/}
        <div style={styles.headerStyle} onClick={() => {isSmallScreen ? setMealsExpanded(!isMealsExpanded) : setMealsExpanded(isMealsExpanded)}}>{/* Header container*/}
          <div style={styles.headerTiteStyle}>
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
            <div style={styles.columnStyle}>
              <div css={styles.totalWeightContainerStyle}>
                <div css={styles.weightLabellStyle}></div>
                <div  style={styles.caloriesAndWeightContainerStyle}> 
                  <div css={styles.unitCaloriesStyle}>{"kcal"}</div>
                  <div css={styles.unitWeightStyle}>{"g"}</div>
                </div>
              </div>
              <div css={styles.totalWeightContainerStyle}>
                <div style={styles.weightLabellStyle}>{"Total"}</div>
                <div  style={styles.caloriesAndWeightContainerStyle}> 
                  <div css={styles.caloriesTotalStyle}>{calculateTotalCalories(food)}</div>
                  <div css={styles.weightTotalStyle}>{calculateTotalWeight(food)}</div>
                </div>
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
              margin={0}
              padding={0}
              imageName="plus_round_fill_white_button.svg"
              imageSize={20}
              onClick={openAddFoodPage}
            >
              Add Food
          </ButtonImage>
          
       
            <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <Fragment>
                  <ButtonImage
                      variant="addButton"
                      width='60px'
                      height={30}
                      margin={0}
                      padding={0}
                      imageName="more_white.svg"
                      imageSize={20}
                      {...bindTrigger(popupState)}
                    >
                  </ButtonImage>
                  <StyledMenu {...bindMenu(popupState)}>
                    <MenuItem onClick={() => 
                      {
                        popupState.close()
                        copyMealToDate()
                      }
                    }>
                      <div style={{marginRight: "15px"}}>
                        <Image 
                          imageName= {"copy_green.svg"}
                          width="15" 
                          height="15" 
                        />
                      </div>
                      <div style={{fontFamily: "'Balsamiq Sans', sans-serif",}}>Copy from date</div> 
                    </MenuItem>
                    { mealsCount > 1 &&
                     <div>
                      <Divider sx={{ my: 0.1 }} />
                      <MenuItem onClick={() => 
                        {
                          popupState.close()
                          deleteCurrentMeal()
                        }
                      }>
                        <div style={{marginRight: "15px"}}>
                          <Image 
                            imageName= {"delete_orange.svg"}
                            width="17" 
                            height="17" 
                          />
                        </div>
                        <div style={{color: colors.orange, fontFamily: "'Balsamiq Sans', sans-serif",}}>Delete meal</div>
                      </MenuItem>
                      </div>
                    }
                  </StyledMenu>
                </Fragment>
              )}
            </PopupState>
        
     
          </div>}

        </div> {/* Meals container*/}
        
      </div>  
   );
}

export default MealCard;
