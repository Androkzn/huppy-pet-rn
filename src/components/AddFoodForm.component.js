/** @jsxImportSource @emotion/react */

import PageContainer from "./PageContainer.component";
import * as styles  from './styles/AddFood.css'
import {TitleAndDropdown, TitleButtonsAndTextField} from "./Form.components"
import * as enums from "../helpers/Enums.helper"
import FoodImage from './FoodImage.components'
import {Image} from './Image.components'
import { useState } from "react";
import { ButtonText } from "./Buttons.components"

const AddFoodForm = ({ foodItem, addFoodToMeal, setFoodItem, image, setImage }) => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isNutritionExpanded, setNutritionExpanded] = useState(false);

  const onDDInputChange = (value) => {
    setFoodItem((prevFoodItem) => ({
      ...prevFoodItem,
      units: value,
    }));
  };

  const onButtonInputChange = (name, value) => {
    setFoodItem((prevFoodItem) => ({
      ...prevFoodItem,
      weight: value,
    }));
  };

  const onTextInputChange = (value) => {
    setFoodItem((prevFoodItem) => ({
      ...prevFoodItem,
      weight: value,
    }));
  };

  return (
    <form style={styles.addFoodFormStyle} onSubmit={(e) => {e.preventDefault(); }}>
      <div style={styles.imageContainerStyle}> 
        <FoodImage 
          foodItem={foodItem}
        />
      </div>
  
      <div style={styles.addFoodTitleStyle}>{foodItem?.name}</div>

      <TitleAndDropdown 
        name={"units"} 
        title={"Units"}
        dropdownOptions={Object.values(enums.FoodUnits).map((type) => ({
          rawValue: type,
          title: type,
        }))}  
        onChange={(value) => { onDDInputChange(value)}}
       />
      <TitleButtonsAndTextField
          title={"Select weight"}
          name={"weight"}
          initialValue={foodItem.weight} 
          onChange={(value) => {
            onTextInputChange(value);  
          }}
          onChangeButton={(name, value) => { onButtonInputChange(name, value) }}
        />

      <div style={styles.descriptionContainerStyle}>
        <div  style={styles.rowStyle}>
          <div
            style={styles.nutritionFactsTitleStyle}
            onClick={() => setDescriptionExpanded(!isDescriptionExpanded)}
          >
            Description
          </div>
          <Image
            imageName={isDescriptionExpanded ? "arrow_down.svg" : "arrow_right.svg"}
            width="20"
            height="20"
            onClick={() => setDescriptionExpanded(!isDescriptionExpanded)}
            style={{ cursor: "pointer" }}
          />
        </div>
        {isDescriptionExpanded && <div style={styles.descriptionStyle}>{foodItem?.desc}</div>}
      </div>

      <div style={styles.nutritionContainerStyle}>
        <div  style={styles.rowStyle}>
          <div
            style={styles.nutritionFactsTitleStyle}
            onClick={() => setNutritionExpanded(!isNutritionExpanded)}
          >
            Nutrition Facts
          </div>
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
                <div>{foodItem?.protein}</div> 
              </div> 
              <div  style={styles.nutritionRowStyle}>  
                <div>Fat, %</div>  
                <div>{foodItem?.fat}</div> 
              </div> 
              <div  style={styles.nutritionRowStyle}>  
                <div>Carbohydrates, %</div>  
                <div>{foodItem?.carb}</div> 
              </div> 
              <div  style={styles.nutritionRowStyle}>  
                <div>Fiber, %</div>  
                <div>{foodItem?.fiber}</div> 
              </div> 
              <div  style={styles.nutritionRowStyle}>  
                <div>Ash, %</div>  
                <div>{foodItem?.ash}</div> 
              </div> 
              <div  style={styles.nutritionRowStyle}>  
                <div>Calories in 100g, kcal</div>  
                <div>{foodItem?.calories}</div> 
              </div> 
              <div  style={styles.nutritionRowStyle}>  
                <div>Calories in serving, kcal</div>  
                <div>{foodItem?.caloriesServing}</div> 
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
  )
}

export default AddFoodForm;