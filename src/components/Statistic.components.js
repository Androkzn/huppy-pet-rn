/** @jsxImportSource @emotion/react */

import * as colors from './styles/Colors'
import { useState } from 'react';
import styled from '@emotion/styled/macro'
import Switch from '@mui/material/Switch';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import {Image} from '../components/Image.components'


function calculateTotalData(dataType, foodType, mealsToday, mealsThisWeek, isThisWeekSelected) {
  let totalData = 0;

  if (isThisWeekSelected) {
    const currentDate = new Date();
    const calendar = new Date(currentDate);
    const dateComponents = {
      year: calendar.getFullYear(),
      month: calendar.getMonth(),
      day: calendar.getDate(),
      hour: calendar.getHours(),
      minute: calendar.getMinutes(),
      second: calendar.getSeconds(),
    };

    // Calculate the start of the week (Monday)
    const todayWeekday = calendar.getDay();
    const daysUntilMonday = (todayWeekday + 6) % 7; // 0 represents Monday, 1 for Tuesday, and so on
    dateComponents.day = dateComponents.day - daysUntilMonday;
    dateComponents.hour = 0;
    dateComponents.minute = 0;
    dateComponents.second = 0;

    // Calculate the end of the week (Saturday)
    dateComponents.day = dateComponents.day + 6;
    dateComponents.hour = 23;
    dateComponents.minute = 59;
    dateComponents.second = 59;

    totalData = mealsThisWeek.reduce((result, meal) => {
      return (
        result +
        meal.food
          .filter((food) => {
            // If has both types meat and bones
            // For bones add to calculations meat
            if (
              (doesHaveMeatAndBones() &&
                foodType === 'bones' &&
                dataType === 'weight' &&
                (food.categoryType === 'bones' || food.categoryType === 'meat')) ||
              (doesHaveMeatAndBones() &&
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
                if (doesHaveMeatAndBones() && foodType === 'bones') {
                  return (
                    sum +
                    (food.units === 'serving'
                      ? food.servings * food.servingWeight * (food.bonesRatio / 100)
                      : food.weight * (food.bonesRatio / 100))
                  );
                } else if (doesHaveMeatAndBones() && foodType === 'meat') {
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
          }, 0)
      );
    }, 0);
  } else {
    // Calculate the total weight for the specified food type
    totalData = mealsToday.reduce((result, meal) => {
      const foodForType = meal.food.filter((food) => {
        // If has both types meat and bones
        // For bones add to calculations meat
        if (
          (doesHaveMeatAndBones() &&
            foodType === 'bones' &&
            dataType === 'weight' &&
            (food.categoryType === 'bones' || food.categoryType === 'meat')) ||
          (doesHaveMeatAndBones() &&
            foodType === 'meat' &&
            dataType === 'weight' &&
            (food.categoryType === 'bones' || food.categoryType === 'meat'))
        ) {
          return foodType === 'bones' || foodType === 'meat';
        }
        return food.categoryType === foodType;
      });

      const weightForType = foodForType.reduce((sum, food) => {
        // Sum the data of food for the food type
        switch (dataType) {
          case 'weight':
            if (doesHaveMeatAndBones() && foodType === 'bones') {
              return (
                sum +
                (food.units === 'serving'
                  ? food.servings * food.servingWeight * (food.bonesRatio / 100)
                  : food.weight * (food.bonesRatio / 100))
              );
            } else if (doesHaveMeatAndBones() && foodType === 'meat') {
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

      return result + weightForType;
    }, 0);
  }
  return totalData;
}

function doesHaveMeatAndBones(currentProfile) {
  if (!currentProfile) {
    return false;
  }

  if (currentProfile.preset === 'custom') {
    return (
      currentProfile.categories.filter((category) => category.type === 'bones').length > 0 &&
      currentProfile.categories.filter((category) => category.type === 'meat').length > 0
    );
  } else {
    const presetCategories = currentProfile.preset.categories(currentProfile.dailyPortion, currentProfile._id.toString());
    return (
      presetCategories.filter((category) => category.type === 'bones').length > 0 &&
      presetCategories.filter((category) => category.type === 'meat').length > 0
    );
  }
}


const CaloriesStatisticSection = ({name, percentage, calories, total }) => { 
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
    minWidth: '100px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.green,
  };

  const valuesStyle = {
     minWidth: '100px',
  };

  return (
    <div style={statisticCaloriesSectionStyle}>
        <div style={imageStyle}> <Image imageName={`calories.png`} width="40" height="40" /></div>
        <div style={nameStyle}>{"Calories"}</div>
        <ProgressBar
          completed={percentage}
        />
        <div style={valuesStyle}>{calories} g /{total}  </div>

    </div>
  )
}

const CategoriesStatisticSection = ({name, type, percentage, weight, total}) => { 
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
    minWidth: '100px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.green,
  };

  const valuesStyle = {
     minWidth: '100px'
  };


  return (
    <div style={statisticCategoriesSectionStyle}>
      <div style={imageStyle}> <Image imageName={`${type}.png`} width="40" height="40" /></div>
        <div style={nameStyle}>{name}</div>
        <ProgressBar
          completed={percentage}
        />
        <div style={valuesStyle}>{weight} g /{total} </div>
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
      fontSize: '18px',
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

  const ProgressBar = (props) => {
    const { bgcolor, completed } = props;
  
    const containerStyles = {
      height: 20,
      width: '100%',
      backgroundColor: "#e0e0de",
      borderRadius: 50,
      margin: 50,
    }
  
    const fillerStyles = {
      height: '100%',
      width: `${completed}%`,
      backgroundColor: colors.green,
      transition: 'width 1s ease-in-out',
      borderRadius: 'inherit',
      textAlign: 'right',
    }
  
    const labelStyles = {
      padding: 5,
      color: 'white',
      fontWeight: 'bold',
    }
  
    return (
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}>{`${completed}%`}</span>
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
  };
  