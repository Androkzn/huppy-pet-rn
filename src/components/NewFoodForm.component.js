/** @jsxImportSource @emotion/react */

import { ButtonText } from "./Buttons.components"
import PageContainer from "./PageContainer.component";
import * as styles  from '../components/styles/CreateNewFood.css'
import {TitleAndDropdown, DescriptionTextBox, TitleAndTextInput, TitleButtonsAndTextField} from "./Form.components"
import * as enums from "../helpers/Enums.helper"

const NewFoodForm = ({ addNewFood, foodItem, setFoodItem, isEditingMode }) => {
  
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setFoodItem({ ...foodItem, [name]: value });
  };

  const onButtonInputChange = (name, value) => {
    setFoodItem({ ...foodItem, [name]: value });
  };

  return <PageContainer>
    <form css={styles.addFoodFormStyle}>
      <h2  css={styles.addFoodTitleStyle}>{isEditingMode ? "Edit Food" : "Add New Food"}</h2>
      
      <TitleAndTextInput name={"name"} title={"Name"}  onChange={onFormInputChange} placeholder={"Enter food name"}/>
      
      <TitleAndDropdown name={"type"} title={"Food type"} dropdownOptions={Object.values(enums.FoodType)}  onChange={onFormInputChange}/>
      <TitleAndDropdown name={"units"} title={"Units"} dropdownOptions={Object.values(enums.FoodUnits)}  onChange={onFormInputChange}/>
      <TitleAndDropdown name={"categoryType"} title={"Food category"} dropdownOptions={Object.values(enums.FoodCategoryType)}  onChange={onFormInputChange}/>
     
      <h3 css={styles.nutritionFactsTitleStyle}>{"Nutrition Facts"}</h3>
      
      {Object.values(enums.AddFoodRowType).map((rowType, index) => (
        <TitleButtonsAndTextField
          key={index}
          title={enums.AddFoodRowType.title(rowType) }
          name={rowType}
          initialValue={0} 
          onChange={onFormInputChange}
          onChangeButton={onButtonInputChange}
        />
      ))}

      <DescriptionTextBox name={"desc"} title={"Add Description"} onChange={onFormInputChange} />
       <div css={styles.addFoodButtonContainerStyle}> 
       <ButtonText as= 'button' name="createFood" width= '200px' variant="rectangleTextButton" onClick={(e) => addNewFood(e)}  >
          {isEditingMode ? "Update" : "Create"} Food
        </ButtonText> 
        <ButtonText  as= 'button' name="createAndAddFood" width= '200px' variant="rectangleTextButton" onClick={(e) => addNewFood(e)}  >
          {isEditingMode ? "Update" : "Create"} and Add to Meal
        </ButtonText>
      </div>
    </form>
  </PageContainer>;
}

export default NewFoodForm;