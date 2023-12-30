/** @jsxImportSource @emotion/react */

import * as styles from './styles/AddFood.css';
import { TitleAndDropdown, TitleButtonsAndTextField } from './Form.components';
import * as enums from '../helpers/Enums.helper';
import FoodImage from './FoodImage.components';
import { Image } from './Image.components';
import { useState } from 'react';
import { ButtonText } from './Buttons.components';

const AddFoodForm = ({ foodItem, addFoodToMeal }) => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isNutritionExpanded, setNutritionExpanded] = useState(false);
  const [units, setUnits] = useState(foodItem?.units);
  const [weight, setWeight] = useState(0);

  const onDDInputChange = (value) => {
    setUnits(value);
  };

  const onButtonInputChange = (name, value) => {
    setWeight(value);
  };

  const onTextInputChange = (value) => {
    setWeight(value);
  };

  return (
    <form
      style={styles.addFoodFormStyle}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div style={styles.imageContainerStyle}>
        <FoodImage foodItem={foodItem} isEditing={false} />
      </div>

      <div style={styles.addFoodTitleStyle}>{foodItem?.name}</div>

      <TitleAndDropdown
        name={'units'}
        title={'Units'}
        dropdownOptions={Object.values(enums.FoodUnits).map((type) => ({
          rawValue: type,
          title: type,
        }))}
        onChange={(value) => {
          onDDInputChange(value);
        }}
      />
      <TitleButtonsAndTextField
        title={'Select weight'}
        name={'weight'}
        initialValue={foodItem?.weight || 0}
        onChange={(value) => {
          onTextInputChange(value);
        }}
        onChangeButton={(name, value) => {
          onButtonInputChange(name, value);
        }}
      />
      {/* Hide empty description */}
      {foodItem && foodItem?.desc !== '' && (
        <div style={styles.descriptionContainerStyle}>
          <div style={styles.rowStyle}>
            <div
              style={styles.nutritionFactsTitleStyle}
              onClick={() => setDescriptionExpanded(!isDescriptionExpanded)}
            >
              Description
            </div>
            <div>
              <Image
                imageName={
                  isDescriptionExpanded
                    ? 'arrow_down_green.svg'
                    : 'arrow_right_green.svg'
                }
                width="20"
                height="20"
                onClick={() => setDescriptionExpanded(!isDescriptionExpanded)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
          {isDescriptionExpanded && (
            <div style={styles.descriptionStyle}>{foodItem?.desc}</div>
          )}
        </div>
      )}

      <div style={styles.nutritionContainerStyle}>
        <div style={styles.rowStyle}>
          <div
            style={styles.nutritionFactsTitleStyle}
            onClick={() => setNutritionExpanded(!isNutritionExpanded)}
          >
            Nutrition Facts
          </div>
          <div>
            <Image
              imageName={
                isNutritionExpanded
                  ? 'arrow_down_green.svg'
                  : 'arrow_right_green.svg'
              }
              width="20"
              height="20"
              onClick={() => setNutritionExpanded(!isNutritionExpanded)}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
        {isNutritionExpanded && (
          <div style={styles.descriptionStyle}>
            <div style={styles.columnStyle}>
              <div style={styles.nutritionRowStyle}>
                <div>Protein, %</div>
                <div>{foodItem?.protein}</div>
              </div>
              <div style={styles.nutritionRowStyle}>
                <div>Fat, %</div>
                <div>{foodItem?.fat}</div>
              </div>
              <div style={styles.nutritionRowStyle}>
                <div>Carbohydrates, %</div>
                <div>{foodItem?.carb}</div>
              </div>
              <div style={styles.nutritionRowStyle}>
                <div>Fiber, %</div>
                <div>{foodItem?.fiber}</div>
              </div>
              <div style={styles.nutritionRowStyle}>
                <div>Ash, %</div>
                <div>{foodItem?.ash}</div>
              </div>
              <div style={styles.nutritionRowStyle}>
                <div>Calories in 100g, kcal</div>
                <div>{foodItem?.calories}</div>
              </div>
              <div style={styles.nutritionRowStyle}>
                <div>Calories in serving, kcal</div>
                <div>{foodItem?.caloriesServing}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={styles.rowStyle}>
        <ButtonText
          as="button"
          width="200px"
          variant="rectangleTextButton"
          onClick={() => addFoodToMeal(units, weight)}
          disabled={weight === 0}
        >
          Add to Meal
        </ButtonText>
      </div>
    </form>
  );
};

export default AddFoodForm;
