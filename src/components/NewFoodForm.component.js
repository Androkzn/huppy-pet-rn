/** @jsxImportSource @emotion/react */

import { ButtonText } from "./Buttons.components"
import * as styles  from '../components/styles/CreateNewFood.css'
import {TitleAndDropdown, DescriptionTextBox, TitleAndTextInput, TitleButtonsAndTextField} from "./Form.components"
import * as enums from "../helpers/Enums.helper"

const NewFoodForm = ({ addNewFood, foodItem, setFoodItem }) => {
  
  const onInputChange = (name, value) => {
    setFoodItem({ ...foodItem, [name]: value });
  };

  const onTextInputChange = (event) => {
    const {name, value} = event.target
    setFoodItem({ ...foodItem, [name]: value });
  };

  return <div css={styles.addFoodFormStyle}>
    <form >
      <h2  css={styles.addFoodTitleStyle}>{"Add New Food"}</h2>
      
      <TitleAndTextInput name={"name"} title={"Name"}  onChange={(event) => { onTextInputChange(event)}} placeholder={"Enter food name"}/>
      
      <TitleAndDropdown 
        name={"type"} title={"Food type"} 
        initialValue={foodItem.type} 
        dropdownOptions={Object.values(enums.FoodType).map((type) => ({
          rawValue: type,
          title: enums.getTitleUpercased(type),
        }))}  
        onChange={(value) => { onInputChange("type", value)}}
      />
      <TitleAndDropdown 
        name={"units"} title={"Units"} 
        initialValue={foodItem.units} 
        dropdownOptions={Object.values(enums.FoodUnits).map((type) => ({
          rawValue: type,
          title: type,
        }))}  
        onChange={(value) => { onInputChange("units", value)}}
      />
      <TitleAndDropdown 
        name={"categoryType"} 
        initialValue={foodItem.categoryType}  
        title={"Food category"} 
        dropdownOptions={Object.values(enums.FoodCategoryType).map((type) => ({
          rawValue: type,
          title: enums.getTitleUpercased(type),
        }))} 
        onChange={(value) => { onInputChange("categoryType", value)}}
      />
      
      <h3 css={styles.nutritionFactsTitleStyle}>{"Nutrition Facts"}</h3>
      
      {Object.values(enums.AddFoodRowType).map((rowType, index) => (
        <TitleButtonsAndTextField
          key={index}
          title={enums.getTitleForAddFoodRowType(rowType) }
          name={rowType}
          initialValue={foodItem[rowType]} 
          onChange={(value) => { onInputChange(rowType, value) }}
          onChangeButton={onInputChange}
        />
      ))}

      <DescriptionTextBox name={"desc"} title={"Add Description"} onChange={onTextInputChange} />
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