/** @jsxImportSource @emotion/react */

import { ButtonText } from "./Buttons.components"
import * as styles  from '../components/styles/CreateNewFood.css'
import {TitleAndDropdown, DescriptionTextBox, TitleAndTextInput, TitleButtonsAndTextField} from "./Form.components"
import * as enums from "../helpers/Enums.helper"

const NewFoodForm = ({ addNewFood, foodItem, setFoodItem }) => {
  
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setFoodItem({ ...foodItem, [name]: value });
  };

  const onButtonInputChange = (name, value) => {
    setFoodItem({ ...foodItem, [name]: value });
  };

  return <div css={styles.addFoodFormStyle}>
    <form >
      <h2  css={styles.addFoodTitleStyle}>{"Add New Food"}</h2>
      
      <TitleAndTextInput name={"name"} title={"Name"}  onChange={onFormInputChange} placeholder={"Enter food name"}/>
      
      <TitleAndDropdown 
        name={"type"} title={"Food type"} 
        initialValue={foodItem.type} 
        dropdownOptions={Object.values(enums.FoodType).map((type) => ({
          rawValue: type,
          title: enums.getTitleUpercased(type),
        }))}  
        onChange={onFormInputChange}
      />
      <TitleAndDropdown 
        name={"units"} title={"Units"} 
        initialValue={foodItem.units} 
        dropdownOptions={Object.values(enums.FoodUnits).map((type) => ({
          rawValue: type,
          title: type,
        }))}  
        onChange={onFormInputChange}
      />
      <TitleAndDropdown 
        name={"categoryType"} 
        initialValue={foodItem.categoryType}  
        title={"Food category"} 
        dropdownOptions={Object.values(enums.FoodCategoryType).map((type) => ({
          rawValue: type,
          title: enums.getTitleUpercased(type),
        }))} 
        onChange={onFormInputChange}
      />
      
      <h3 css={styles.nutritionFactsTitleStyle}>{"Nutrition Facts"}</h3>
      
      {Object.values(enums.AddFoodRowType).map((rowType, index) => (
        <TitleButtonsAndTextField
          key={index}
          title={enums.getTitleForAddFoodRowType(rowType) }
          name={rowType}
          initialValue={0} 
          onChange={onFormInputChange}
          onChangeButton={onButtonInputChange}
        />
      ))}

      <DescriptionTextBox name={"desc"} title={"Add Description"} onChange={onFormInputChange} />
       <div css={styles.addFoodButtonContainerStyle}> 
       <ButtonText as= 'button' name="createFood" width= '200px' variant="rectangleTextButton" onClick={(e) => addNewFood(e)}  >
          {"Create"} Food
        </ButtonText> 
        <ButtonText  as= 'button' name="createAndAddFood" width= '200px' variant="rectangleTextButton" onClick={(e) => addNewFood(e)}  >
          {"Create"} and Add to Meal
        </ButtonText>
      </div>
    </form>
  </div>;
}

export default NewFoodForm;