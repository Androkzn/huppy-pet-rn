/** @jsxImportSource @emotion/react */

import { useContext, useState, Fragment, useEffect } from "react";
import { UserContext } from "../contexts/user.context";
import * as styles  from '../components/styles/Meals.css'
import {ButtonImage, ButtonText} from '../components/Buttons.components'
import { useNavigate } from 'react-router-dom';
import {Image} from '../components/Image.components'
import Swipe  from './Swipe.components.tsx';
import * as colors from '../components/styles/Colors';
import {useGetAllFoodForMeal, useGetFoodForDate, useUpdateFood, useAddMeal, useDeleteFood, useDeleteMeal} from "../hooks/query.hooks"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { styled, alpha } from '@mui/material/styles';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import CustomDatePickerWithArrows from "../components/CustomDatePickerWithArrows.component";
import CustomDatePicker from "../components/CustomDatePicker.component";
import LoadingAndError from "../components/LoadingAndError.components"
import CustomCheckbox from "./Checkbox.component";
import {useAddFood} from "../hooks/query.hooks"


function MealCard({ meal, index, mealsCount }) {
  const { user, currentProfile, isSmallScreen, currentDate, setCurrentPage} = useContext(UserContext);
  const navigate = useNavigate();
  const mealId = meal._id;
  const selectedDate = meal.date
  const [isMealsExpanded, setMealsExpanded] = useState(true);
  const [isCopyFromMealExpanded, setCopyFromMealExpanded] = useState(false)
  const [copyFromDate, setCopyFromDate]  = useState(Date())
  const [checkedMealsIds, setCheckedMeals] = useState([]);
  const [checkedFoodsIds, setCheckedFoods] = useState([]);
  const [isCopyTo, setIsCopyTo] = useState(false);
 

  const { data: food, isLoading: isLoadingFood, isError: isErrorFood} = useGetAllFoodForMeal(user, currentProfile, mealId);
  const { data: foodForDate, isLoading: isLoadingFoodForDate, isError: isErrorFoodForDate} = useGetFoodForDate(user, currentProfile, copyFromDate, true);

  const {mutate: addMealMutation} = useAddMeal()
  const {mutate: deleteMealMutation} = useDeleteMeal()
  const {mutate: deleteFoodMutation} = useDeleteFood()
  const {mutate: addFoodMutation} = useAddFood()

  // Function is responsible for creating a new meal
  const addMealForDate = async () => {
    addMealMutation({
      user:user, 
      currentProfile:currentProfile, 
      currentDate: currentDate
    })
  };

   // Function 
   const copyMeal = async () => {
    const checkedFoods = foodForDate.filter(food => checkedFoodsIds.includes(food._id));
 
    if (isCopyTo) {
    // Create a meal first
      addMealMutation({
        user:user, 
        currentProfile:currentProfile, 
        currentDate: currentDate
      },
      {
        onSuccess: (data) => {
          const id = data
           // Add selected food to just created meal
          for (const food of checkedFoods) {
            addFoodMutation({
              user: user,
              mealId: id,
              currentProfile: currentProfile,
              foodItem: food,
              selectedDate: currentDate,
            });
          }
        },
      })
    } else {
      // Add selected food to the current meal
      for (const food of checkedFoods) {
        addFoodMutation({
          user: user,
          mealId: mealId,
          currentProfile: currentProfile,
          foodItem: food,
          selectedDate: currentDate,
        });
      }
    }
  };

  //Clear aaray of selected meals and food when date is changed
  useEffect(() => {
    clearSelectedFood()
  }, [copyFromDate]);

   //Clear aaray of selected meals and food for copy 
  const clearSelectedFood=() => {
    setCheckedMeals([])
    setCheckedFoods([])
  }

  // Function to handle checkbox change for meals
  const handleMealCheckboxChange = (event, mealId) => {
    const isChecked = event.target.checked

    if (isChecked) {
      // Add mealId to the list of checked meals
      setCheckedMeals((prevCheckedMeals) => [...prevCheckedMeals, mealId]);

      // Add all food items of the checked meal to the list of checked foods
      const mealFoods = foodForDate.filter((food) => food.mealId === mealId);
      setCheckedFoods((prevCheckedFoods) => [
        ...prevCheckedFoods,
        ...mealFoods.map((food) => food._id),
      ]);
    } else {
      // Remove mealId from the list of checked meals
      setCheckedMeals((prevCheckedMeals) =>
        prevCheckedMeals.filter((id) => id !== mealId)
      );

      //console.log("prevCheckedMeals", prevCheckedMeals)
  

      // Remove all food items of the unchecked meal from the list of checked foods
      const mealFoods = foodForDate.filter((food) => food.mealId === mealId);
      console.log("mealFoods", mealFoods)
      console.log("mealId", mealId)
      setCheckedFoods((prevCheckedFoods) =>
        prevCheckedFoods.filter((id) => !mealFoods.some((food) => food._id === id))
      );
    }
    

  };

    // Function to handle checkbox change for foods
    const handleFoodCheckboxChange = (event, foodId) => {
      const isChecked = event.target.checked

      if (isChecked) {
        // Add foodId to the list of checked foods
        setCheckedFoods((prevCheckedFoods) => [...prevCheckedFoods, foodId]);
      } else {
        // Remove foodId from the list of checked foods
        setCheckedFoods((prevCheckedFoods) =>
          prevCheckedFoods.filter((id) => id !== foodId)
        );
      }
    };

  const getGroopedFood = () => {
    if (!foodForDate || foodForDate.length === 0) return [];
  
    const groupedFoods = foodForDate.reduce((result, food) => {
      const mealId = food.mealId;
  
      // Find the index of the array with the corresponding mealId
      const index = result.findIndex((group) => group[0]?.mealId === mealId);
  
      if (index !== -1) {
        // If the array with the mealId exists, push the food to it
        result[index].push(food);
      } else {
        // If the array with the mealId doesn't exist, create a new array
        result.push([food]);
      }
  
      return result;
    }, []);
  
    console.log("getFoodForMeal groupedFoods", groupedFoods);
  
    return groupedFoods;
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
          <div style={styles.headerAddButtonStyle}>
            <ButtonImage
              variant="iconButton"
              imageName="add_round_orange.svg"
              imageSize={30}
              onClick={() => {
                if (isMealsExpanded) { 
                  addMealForDate();
                } else {
                  setMealsExpanded(!isMealsExpanded)
                }
              }}
              />
            </div>
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
              imageName="add_round_orange.svg"
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
                    {/* Copy from date  */}
                    <MenuItem onClick={() => {}
                    }>
                      <div style={{marginRight: "10px"}}>
                        <Image 
                          imageName= {"copy_green.svg"}
                          width="15" 
                          height="15" 
                        />
                      </div>
                      <div style={{fontFamily: "'Balsamiq Sans', sans-serif", width: "80px"}}>Copy from</div> 
                      <div style={styles.pickerContainerStyle}> 
                        <CustomDatePicker
                          value={copyFromDate}
                          onChange={(date) => {
                            setCopyFromDate(date)
                            setIsCopyTo(false)
                            popupState.close()
                            setCopyFromMealExpanded(true)
                          }}
                         
                          styleContainer= {styles.pickerStyle}
                          backgroundColor={colors.white}
                        />
                      </div>
                    </MenuItem>
                    {/* Copy to date  */}
                    <MenuItem onClick={() => {}
                    }>
                        
                      <div style={{marginRight: "10px"}}>
                        <Image 
                          imageName= {"copy_green.svg"}
                          width="15" 
                          height="15" 
                        />
                      </div>
                        <div style={{fontFamily: "'Balsamiq Sans', sans-serif", width: "80px"}}>Copy to</div> 
                        <div style={styles.pickerContainerStyle}> 
                          <CustomDatePicker
                            value={copyFromDate}
                            onChange={(date) => {
                              setIsCopyTo(true)
                              setCopyFromDate(date)
                              popupState.close()
                              setCopyFromMealExpanded(true)
                            }}
                         
                            styleContainer= {styles.pickerStyle}
                            backgroundColor={colors.white}
                          />
                        </div>
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
                        <div style={{marginRight: "10px"}}>
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
           
            <BottomSheet open={isCopyFromMealExpanded} >
              <div style={styles.rowStyle}>
                <div style={styles.closeButtonContainer}>
                <ButtonImage
                  variant="iconButton"
                  imageName="add_round_orange.svg"
                  imageSize={30}
                  onClick={() => {
                    copyMeal()
                    setCopyFromMealExpanded(false)
                  }}
                  disabled={checkedFoodsIds.length === 0}
                  />
                </div>
                <div style={styles.pickerContainerStyle}> 
                  <CustomDatePickerWithArrows
                    value={copyFromDate}
                    onChange={(date) => setCopyFromDate(date) }
                    styleContainer= {styles.pickerStyle}
                    backgroundColor={colors.white}
                    disabled={true}
                  />
                </div>
                <div style={styles.closeButtonContainer}>
                  <ButtonImage
                    variant="iconButton"
                    imageName="close_round_green.svg"
                    imageSize={30}
                    onClick={() => {
                      setCopyFromMealExpanded(false)
                      clearSelectedFood()
                    }}
                  />
                </div>
              </div>
              <div >  {/* Meals list container*/}
              { ( isLoadingFoodForDate|| isErrorFoodForDate)? 
                (
                <div style={styles.placeholderStyle}>
                  <LoadingAndError isLoading = {isLoadingFoodForDate} isError = {isErrorFoodForDate}/>
                </div>
                ) : 
                (
                <div>  {/* Meals list container*/}
                    { (getGroopedFood().length > 0) ?   
                      (
                      <div>
                      {  getGroopedFood().map((meal, index) => 
                        <div key={meal[0].mealId} style={styles.mealContainerStyle}>
                          <CustomCheckbox
                            checked={checkedMealsIds.includes(meal[0].mealId)}
                            onChange={(isChecked) =>
                              handleMealCheckboxChange(isChecked, meal[0].mealId)
                            }
                          />
                          {"Meal " + (index + 1)}
                        <div>  {/* Food list container*/}
                          {  
                            meal.map((food, index) => 
                            <div key={food._id} style = {{marginLeft: "20px"}}>
                              <CustomCheckbox
                              checked={checkedFoodsIds.includes(food._id)}
                              onChange={(isChecked) =>
                                handleFoodCheckboxChange(isChecked, food._id)
                              }
                            />
                              {food.name}
                          
                            </div>)
                          }
                        </div>  
                      </div>

                      )}
                      </div>
                      ) : (
                        <div >
                          <Image 
                            imageName= {"no_food_placeholder.png"}
                            width={"200px" }
                            height={"140px"}
                          />
                        </div>
                      )
                    }
                </div>  
                )
              }
              </div>
            </BottomSheet>
     
          </div>}

        </div> {/* Meals container*/}
      </div>  
   );
}

export default MealCard;
