/** @jsxImportSource @emotion/react */

import * as colors from './styles/Colors'
import { useState } from 'react';
import styled from '@emotion/styled/macro'
import Switch from '@mui/material/Switch';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import {Image} from '../components/Image.components'
import * as Constants from "../helpers/Constants.helper"
import { getStartAndEndOfToday } from "../helpers/Date.helper";

function calculateTotalDataForCategory(dataType, foodType, foodData, categories) {
  let totalData = foodData
    .filter((food) => {
      if (
        (doesHaveMeatAndBones(categories) &&
          foodType === 'bones' &&
          dataType === 'weight' &&
          (food.categoryType === 'bones' || food.categoryType === 'meat')) ||
        (doesHaveMeatAndBones(categories) &&
          foodType === 'meat' &&
          dataType === 'weight' &&
          (food.categoryType === 'bones' || food.categoryType === 'meat'))
      ) {
        return foodType === 'bones' || foodType === 'meat';
      }
      return food.categoryType === foodType;
    })
    .reduce((sum, food) => {
      switch (dataType) {
        case 'weight':
          if (doesHaveMeatAndBones(categories) && foodType === 'bones') {
            return (
              sum +
              (food.units === 'serving'
                ? food.servings * food.servingWeight * (food.bonesRatio / 100)
                : food.weight * (food.bonesRatio / 100))
            );
          } else if (doesHaveMeatAndBones(categories) && foodType === 'meat') {
            return (
              sum +
              (food.units === 'serving'
                ? food.servings * food.servingWeight * (food.meatRatio / 100)
                : food.weight * (food.meatRatio / 100))
            );
          } else {
            return sum + (food.units === 'serving' ? food.servings * food.servingWeight : food.weight);
          }
        case 'calories':
          return sum + (food.units === 'serving' ? food.servings * food.caloriesServing : (food.weight / 100) * food.calories);
        case 'nutrients':
          return sum + food.weight;
        default:
          return sum;
      }
    }, 0);

  return Math.floor(totalData);
}

function calculateGoalForCategory(category, currentProfile, isToday) {
  const weight  = Math.floor(currentProfile?.dailyPortion * category?.percentage / 100)
  return isToday ?  weight : weight * 7;
}
 
function calculatePercentage(value, goal) {
  if (goal === 0) {
    return 0;
  } else { 
  return  Math.floor(Math.max((value / goal) * 100, 0));
  }
}

function doesHaveMeatAndBones(categories) {
    return (
      categories.filter((category) => category.type === 'bones').length > 0 &&
      categories.filter((category) => category.type === 'meat').length > 0
    );
}

function calculateTotalConsumedCalories(currentProfile, food, categories, activities) {
  if (currentProfile) {

    let totalCalories = 0;

    for (const category of categories) {
      totalCalories += calculateTotalDataForCategory("calories", category.type, food, categories);
    }
    
    if (currentProfile && currentProfile.deductCalories && totalCalories > 0) {
      totalCalories -= getTotalCaloriesBurnedFor(currentProfile, activities);
    }

    return  Math.floor(totalCalories);
  }
  return 0;
}

function getTotalCaloriesBurnedFor(currentProfile, activities) {
 
  if (currentProfile && currentProfile.deductCalories) {
    const totalCalories = activities
      .reduce((result, activity) => {
        const value = activity.metric === 'distance' ? activity.distance : activity.duration;
        return result + getCaloriesBurnedFor(activity.metric, value);
      }, 0);

    return  Math.floor(totalCalories);
  }

  return 0;
}

function getCaloriesBurnedFor(metricType, value, currentProfile) {
  if (currentProfile) {
    if (metricType === 'distance') {
      // To calculate the number of calories burned during a walk,
      // multiply the dog’s weight in pounds by the number of miles walked and then multiply by 0.8.
      return currentProfile.weight * value * 0.8;
    } else {
      // For other metrics, such as duration, use a fixed value (e.g., 2 calories per minute).
      return value * 2;
    }
  }

  return 0;
}

function getCaloriesGoal(currentProfile, isToday) {
  if (currentProfile) {
    const multiplier = isToday ? 1 : 7;
     return Math.floor(Constants.estCalories * currentProfile.weight * currentProfile.dailyRatio * multiplier);
  } 

  return 0;
}

function filterFoodForToday(foodData, currentDate) {
  // Get the start and end of today
  const todayRange = getStartAndEndOfToday(currentDate);

  // Filter food items for today
  const foodForToday = foodData.filter((foodItem) => {
    // Check if the food item's date is within today's range
    return foodItem.date >= todayRange.start && foodItem.date <= todayRange.end;
  }); 

  return foodForToday;
}


const CaloriesStatisticSection = ({foodData, categories, activities, currentProfile, isStatisticToday, currentDate }) => { 
  const food = isStatisticToday ? filterFoodForToday(foodData, currentDate) : foodData
  
  const calories= calculateTotalConsumedCalories(currentProfile, food, categories, activities)
  const totalCalories = getCaloriesGoal(currentProfile, isStatisticToday)
  const percentage = calculatePercentage(calories, totalCalories)

  const statisticCaloriesSectionStyle = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    height: '50px',
    marginBottom: '15px',
    marginTop: '15px',
    borderRadius: '10px',
    padding: '0px',
    border: `2px solid  ${colors.green || "none"}`,
  };

  const imageStyle = {
    
  };

  const nameStyle = {
    minWidth: '70px',
    fontSize: '15px',
    fontWeight: 'bold',
    color: colors.green,
  };

  const valuesStyle = {
     minWidth: '90px',
     fontSize: '15px',
     fontWeight: 'bold',
     color: progressBarColor(percentage),

  };

  return (
    <div style={statisticCaloriesSectionStyle}>
        <div style={imageStyle}> <Image imageName={`calories.png`} width="40" height="40" /></div>
        <div style={nameStyle}>{"Calories"}</div>
        <ProgressBar
          percentage={percentage}
        />
        <div style={valuesStyle}>{calories} / {totalCalories} kcal</div>

    </div>
  )
}

const CategoriesStatisticSection = ({category, categories, currentProfile, foodData, isStatisticToday, currentDate}) => { 
  const food = isStatisticToday ? filterFoodForToday(foodData, currentDate) : foodData

  const weight= calculateTotalDataForCategory("weight", category.type, food, categories)
  const total= calculateGoalForCategory(category, currentProfile, isStatisticToday)
  const percentage = calculatePercentage(weight, total)

  const statisticCategoriesSectionStyle = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    height: '50px'
  };

  const imageStyle = {
    
  };

  const nameStyle = {
    minWidth: '70px',
    fontSize: '15px',
    fontWeight: 'bold',
    color: colors.green,
  };

  const valuesStyle = {
     minWidth: '90px',
     fontSize: '15px',
     fontWeight: 'bold',
     color: progressBarColor(percentage),

  };

  return (
    <div style={statisticCategoriesSectionStyle}>
      <div style={imageStyle}> <Image imageName={`${category.type}.png`} width="40" height="40" /></div>
        <div style={nameStyle}>{category.name}</div>
        <ProgressBar
          percentage={percentage}
        />
        <div style={valuesStyle}>{weight} / {total} g </div>
    </div>
  )
}

 const ToggleStatisticSection = ({initialValue, onChange}) => { 
  const [checked, setChecked] =  useState(initialValue);

    const handleChange = (event) => {
      setChecked(event.target.checked);
      onChange()
    };

    const statisticToggleLabelStyle = {
      padding: '10px',
      margin: '10px',
      textAlign: 'left',
      fontSize: '16px',
      fontWeight: "bold",
      color: colors.green,
    };
    
    const statisticToggleSectionStyle = {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    };

    return (
      <div style={statisticToggleSectionStyle}>
            <div style={statisticToggleLabelStyle}>Today</div>
            <div  >
              <Switch
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
                color='warning'
                style={{ color: colors.green }}
              />
            </div>
            <div style={statisticToggleLabelStyle}>This Week</div>
          </div>
    )
 }


  const FoodCategoryRow = ({ name, value, color, weight }) => {
    const containerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      textAlign: 'center',
      borderRadius: '10px',
      height: '40px',
      marginRight: '10px',
      width: '100%',
    };
  
    const nameStyle = {
      fontSize: '18px',
      fontWeight: "bold",
      minWidth: '100px',
      borderRadius: '5px',
      padding: '5px',
      color: colors.white,
      backgroundColor: `${color}`, 
       
    };

    const weightStyle = {
      padding: '5px',
      minWidth: '80px',
    };

    const valueStyle = {
      padding: '5px',
      minWidth: '50px',
    };

    return (
      <div style={containerStyle}>
        <div style={nameStyle} >{name}</div>  
        <div style={weightStyle} >{weight} g</div>  
        <div style={valueStyle} >{value}%</div>  
      </div>
    );
  };

  function progressBarColor(value) {
    if (value <= 100) {
        return colors.green;
    } else if (value <= 125) {
      return colors.yellow;
    }  else if (value <= 150) {
      return colors.orange;
    } else   {
      return colors.red;
    }
  }


  const ProgressBar = (props) => {
    const { bgcolor, percentage } = props;
    const containerStyles = {
      height: 25,
      backgroundColor: "#e0e0de",
      borderRadius: '10px',
      borderBottomLeftRadius: '10px',
      minWidth:  '120px',
    }
  
    const fillerStyles = {
      height: '100%',
      width: percentage <= 100 ? `${percentage}%`: '100%',
      backgroundColor: progressBarColor(percentage),
      transition: 'width 1s ease-in-out',
      borderTopLeftRadius: '10px',
      borderBottomLeftRadius: '10px',
      borderTopRightRadius: percentage < 95 ? '0px' : '10px',
      borderBottomRightRadius: percentage < 95 ? '0px' : '10px',
      textAlign: 'right',
    }
  
    const labelStyles = {
      padding: 5,
      fontSize: '15px',
      color: percentage <= 30 ? 'black' : 'white',
      fontWeight: 'bold',
      marginLeft: percentage <= 30? `${percentage +5}px` : '0px',
    }
  
    return (
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}>{`${percentage}%`}</span>
        </div>
      </div>
    );
  };
  
  export  {
    CaloriesStatisticSection,
    CategoriesStatisticSection,
    ToggleStatisticSection,
    FoodCategoryRow,
    ProgressBar,
    calculateTotalDataForCategory,
    calculateGoalForCategory,
    calculateTotalConsumedCalories,
    getCaloriesGoal,
  };
  