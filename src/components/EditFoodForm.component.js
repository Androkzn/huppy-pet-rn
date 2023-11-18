/** @jsxImportSource @emotion/react */

import PageContainer from "./PageContainer.component";
import * as styles  from './styles/AddFood.css'
import {TitleAndDropdown, TitleButtonsAndTextField} from "./Form.components"
import * as enums from "../helpers/Enums.helper"
import {Image} from './Image.components'
import { useState } from "react";
import { ButtonText } from "./Buttons.components"

const AddFoodForm = ({ foodItem, addFoodToMeal }) => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isNutritionExpanded, setNutritionExpanded] = useState(false);
 
  const onDDInputChange = (event) => {
    const { name, value } = event.target;
    foodItem.units = value
  };

  const onButtonInputChange = (name, value) => {
    foodItem.weight = value
  };

  const onTextInputChange = (event) => {
    const { value } = event.target;
    foodItem.weight = value
  };

  return <PageContainer>
    <form style={styles.addFoodFormStyle} onSubmit={(e) => {e.preventDefault(); }}>
      <h2  style={styles.addFoodTitleStyle}>{"Add Food To Meal"}</h2>
  
      <div style={styles.imageContainerStyle}> 
          <Image imageName="food_placeholder.png" width="150" height="150" />
      </div>
  
      <TitleAndDropdown 
        name={"units"} 
        title={"Units"}
        dropdownOptions={Object.values(enums.FoodUnits)}  
        onChange={onDDInputChange}
       />
      <TitleButtonsAndTextField
          title={"Select weight"}
          name={"weight"}
          initialValue={0} 
          onChange={(e) => {
            onTextInputChange(e);  
          }}
          onSubmit={(e) => {
            onTextInputChange(e);
          }}
          onChangeButton={onButtonInputChange}
        />

      <div style={styles.descriptionContainerStyle}>
        <div  style={styles.rowStyle}>
          <h3
            style={styles.nutritionFactsTitleStyle}
            onClick={() => setDescriptionExpanded(!isDescriptionExpanded)}
          >
            {"Description"}
          </h3>
          <Image
            imageName={isDescriptionExpanded ? "arrow_down.svg" : "arrow_right.svg"}
            width="20"
            height="20"
            onClick={() => setDescriptionExpanded(!isDescriptionExpanded)}
            style={{ cursor: "pointer" }}
          />
        </div>
        {isDescriptionExpanded && <div style={styles.descriptionStyle}>{foodItem.desc}</div>}
      </div>

      <div style={styles.nutritionContainerStyle}>
        <div  style={styles.rowStyle}>
          <h3
            style={styles.nutritionFactsTitleStyle}
            onClick={() => setNutritionExpanded(!isNutritionExpanded)}
          >
            {"Nutrition Facts"}
          </h3>
          <Image
            imageName={isNutritionExpanded ? "arrow_down.svg" : "arrow_right.svg"}
            width="20"
            height="20"
            onClick={() => setNutritionExpanded(!isNutritionExpanded)}
            style={{ cursor: "pointer" }}
          />
        </div>
        {isNutritionExpanded && <div  style={styles.descriptionStyle}>
            <div style={styles.columnStyle}>
              <div  style={styles.nutritionRowStyle}>  
                <div>Protein, %</div>  
                <div>{foodItem.protein}</div> 
              </div> 
              <div  style={styles.nutritionRowStyle}>  
                <div>Fat, %</div>  
                <div>{foodItem.fat}</div> 
              </div> 
              <div  style={styles.nutritionRowStyle}>  
                <div>Carbohydrates, %</div>  
                <div>{foodItem.carb}</div> 
              </div> 
              <div  style={styles.nutritionRowStyle}>  
                <div>Fiber, %</div>  
                <div>{foodItem.fiber}</div> 
              </div> 
              <div  style={styles.nutritionRowStyle}>  
                <div>Ash, %</div>  
                <div>{foodItem.ash}</div> 
              </div> 
              <div  style={styles.nutritionRowStyle}>  
                <div>Calories in 100g, kcal</div>  
                <div>{foodItem.calories}</div> 
              </div> 
              <div  style={styles.nutritionRowStyle}>  
                <div>Calories in serving, kcal</div>  
                <div>{foodItem.caloriesServing}</div> 
              </div> 
            </div>

          </div>}
      </div>
      <div style={styles.rowStyle}> 
        <ButtonText  as= 'button'  width= '200px' variant="rectangleTextButton" onClick={() => addFoodToMeal()}  >
          Add to Meal
        </ButtonText>
      </div>
    </form>
  </PageContainer>;
}

export default AddFoodForm;