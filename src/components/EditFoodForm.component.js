/** @jsxImportSource @emotion/react */

import { ButtonText } from "./Buttons.components"
import * as styles  from '../components/styles/CreateNewFood.css'
import {TitleAndDropdown, DescriptionTextBox, TitleAndTextInput, TitleButtonsAndTextField} from "./Form.components"
import * as enums from "../helpers/Enums.helper"


const EditFoodForm = ({ editFood, foodItem, setFoodItem }) => {
  console.log("editFood foodItem",foodItem)
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setFoodItem({ ...foodItem, [name]: value });
  };

  const onButtonInputChange = (name, value) => {
    setFoodItem({ ...foodItem, [name]: value });
  };

  const getInitialValue = (rawType) => {
    switch (rawType) {
      case 'protein': return foodItem.protein;
      case 'fat': return foodItem.fat;
      case 'fiber': return foodItem.fiber;
      case 'ash': return foodItem.ash;
      case 'carb': return foodItem.carb;
      case 'calories': return foodItem.calories;
      case 'servings':return foodItem.servings;
      case 'caloriesServing': return foodItem.caloriesServing;
      case 'servingWeight':return foodItem.servingWeight;
      case 'meatRatioo':return foodItem.meatRatio;
      case 'bonesRatio':return foodItem.bonesRatio;
      default: return 0;
    } 

  }
  
  return <div  css={styles.addFoodFormStyle}>
    <form >
      <h2  css={styles.addFoodTitleStyle}>{"Edit Food"}</h2>
      
      <TitleAndTextInput name={"name"} title={"Name"} initialValue={foodItem.name} onChange={onFormInputChange} placeholder={"Enter food name"}/>
      
      <TitleAndDropdown name={"type"} title={"Food type"} initialValue={foodItem.type} dropdownOptions={Object.values(enums.FoodType)}  onChange={onFormInputChange}/>
      <TitleAndDropdown name={"units"} title={"Units"} initialValue={foodItem.units} dropdownOptions={Object.values(enums.FoodUnits)}  onChange={onFormInputChange}/>
      <TitleAndDropdown name={"categoryType"} initialValue={foodItem.categoryType}  title={"Food category"} dropdownOptions={Object.values(enums.FoodCategoryType)}  onChange={onFormInputChange}/>
     
      <h3 css={styles.nutritionFactsTitleStyle}>{"Nutrition Facts"}</h3>
      
      {Object.values(enums.AddFoodRowType).map((rawType, index) => (
        <TitleButtonsAndTextField
          key={index}
          title={enums.getTitleForAddFoodRowType(rawType) }
          name={rawType}
          initialValue={getInitialValue(rawType)} 
          onChange={onFormInputChange}
          onChangeButton={onButtonInputChange}
        />
      ))}

      <DescriptionTextBox  initialValue={foodItem.desc} name={"desc"} title={"Add Description"} onChange={onFormInputChange} />
       <div css={styles.addFoodButtonContainerStyle}> 
       <ButtonText as= 'button' name="createFood" width= '200px' variant="rectangleTextButton" onClick={(e) => editFood(e)}  >
          {"Save changes"} Food
        </ButtonText> 
      </div>
    </form>
  </div>;
}

export default EditFoodForm;