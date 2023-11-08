/** @jsxImportSource @emotion/react */

import { Button, TextField } from "@mui/material";
import CustomDatePicker from "./CustomDatePicker.component";
import PageContainer from "./PageContainer.component";
import * as styles  from '../components/styles/CreateNewFood.css'
import TitleAndDropdown from "./AddFoodTitleAndDropdown.component"
import AddFoodTitleButtonsAndTextField from "./AddFoodTitleButtonsAndTextField.component"
import AddFoodTitleAndTextInput from "./AddFoodTitleAndTextInput.componet"
import AddFoodTitleDescriptionAndTextBox from "./AddFoodTitleDescriptionAndTextBox.component"
import * as enums from "../helpers/Enums.helper"

const NewFoodForm = ({ onSubmit, form, setForm, editing }) => {
  
  const onFormInputChange = (event) => {
 
    console.log(event)
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const onButtonInputChange = (name, value) => {
    console.log(name)
    console.log(value)
    setForm({ ...form, [name]: value });
  };

  return <PageContainer>
    <form css={styles.addFoodFormStyle}>
      <h2  css={styles.addFoodTitleStyle}>{editing ? "Edit Food" : "Add Food"}</h2>
      
      <AddFoodTitleAndTextInput name={"name"} title={"Name"}  onChange={onFormInputChange}/>
      
      <TitleAndDropdown name={"type"} title={"Food type"} dropdownOptions={Object.values(enums.FoodType)}  onChange={onFormInputChange}/>
      <TitleAndDropdown name={"units"} title={"Units"} dropdownOptions={Object.values(enums.FoodUnits)}  onChange={onFormInputChange}/>
      <TitleAndDropdown name={"category"} title={"Food category"} dropdownOptions={Object.values(enums.FoodCategoryType)}  onChange={onFormInputChange}/>
     
      <h3 css={styles.nutritionFactsTitleStyle}>{"Nutrition Facts"}</h3>
      
      {Object.values(enums.AddFoodRowType).map((rowType, index) => (
        <AddFoodTitleButtonsAndTextField
          key={index}
          title={enums.mapAddFoodRowType(rowType)}
          name={rowType}
          initialValue={0} 
          onChange={onFormInputChange}
          onChangeButton={onButtonInputChange}
        />
      ))}

      <AddFoodTitleDescriptionAndTextBox name={"description"} title={"Add Description"} />
       <div css={styles.addFoodButtonContainerStyle}> 
        <Button variant="contained" color="primary" onClick={onSubmit} type="submit" css={styles.addFoodButtonStyle}>
          {editing ? "Update" : "Create"} Food
        </Button>
      </div>
    </form>
  </PageContainer>;
}

export default NewFoodForm;