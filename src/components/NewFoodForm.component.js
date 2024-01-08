/** @jsxImportSource @emotion/react */

import { ButtonText } from './Buttons.components';
import * as styles from '../components/styles/CreateNewFood.css';
import {
  TitleAndSlider,
  TitleAndDropdown,
  DescriptionTextBox,
  TitleAndTextInput,
  TitleButtonsAndTextField,
} from './Form.components';
import * as enums from '../helpers/Enums.helper';
import FoodImage from '../components/FoodImage.components';
import { useState, useEffect } from 'react';

const NewFoodForm = ({
  addNewFood,
  foodItem,
  setFoodItem,
  updateImage,
  image,
}) => {
  const [isValid, setIsValid] =useState(false)

  const onInputChange = (name, value) => {
    if (name === 'type' && value !== 'food') {
      setFoodItem({
        ...foodItem,
        [name]: value,
        categoryType: enums.FoodCategoryType.OTHER, // Set to "other" if type is not "food"
      });
    } else {
      setFoodItem({ ...foodItem, [name]: value });
    }
  };

  const onTextInputChange = (event) => {
    const { name, value } = event.target;
    setFoodItem({ ...foodItem, [name]: value });
  };

  const onSliderChange = (newMeatRatio, newBonesRatio) => {
    setFoodItem({
      ...foodItem,
      meatRatio: newMeatRatio,
      bonesRatio: newBonesRatio,
    });
  };

  // Check validation when foodItem is changed
  useEffect(() => {
    isValidForm()
  }, [foodItem]);

  // Responsible for disable/enable add food buttons
  const isValidForm=() => {
    // New food must have name, calories and at least one macros that is more than 0
    const isValid = foodItem.name.length > 2 && foodItem.calories > 0 && (foodItem.protein > 0 || foodItem.fat > 0 || foodItem.carb > 0)
    setIsValid(isValid)
  }

  return (
    <div css={styles.addFoodFormStyle}>
      <form>
        <div style={styles.imageContainerStyle}>
          <FoodImage
            foodItem={foodItem}
            imageName="food_placeholder.png"
            imageDataUrl={image ? URL.createObjectURL(image) : null}
            onClick={updateImage}
          />
        </div>

        <TitleAndTextInput
          name={'name'}
          title={'Name'}
          onChange={(event) => {
            onTextInputChange(event);
          }}
          placeholder={'Enter food name'}
        />

        <TitleAndDropdown
          name={'type'}
          title={'Food type'}
          initialValue={foodItem.type}
          dropdownOptions={Object.values(enums.FoodType).map((type) => ({
            rawValue: type,
            title: enums.getTitleUpercased(type),
          }))}
          onChange={(value) => {
            onInputChange('type', value);
          }}
        />

        <TitleAndDropdown
          name={'units'}
          title={'Units'}
          initialValue={foodItem.units}
          dropdownOptions={Object.values(enums.FoodUnits).map((type) => ({
            rawValue: type,
            title: type,
          }))}
          onChange={(value) => {
            onInputChange('units', value);
          }}
        />

        <TitleAndDropdown
          name={'categoryType'}
          initialValue={foodItem.categoryType}
          title={'Food category'}
          dropdownOptions={Object.values(enums.FoodCategoryType).map(
            (type) => ({
              rawValue: type,
              title: enums.getTitleUpercased(type),
            })
          )}
          onChange={(value) => {
            onInputChange('categoryType', value);
          }}
          disabled={foodItem.type !== 'food'}
        />

        <h3 css={styles.nutritionFactsTitleStyle}>{'Nutrition Facts'}</h3>

        {Object.values(enums.AddFoodRowType).map((rowType, index) => (
          <TitleButtonsAndTextField
            key={index}
            title={enums.getTitleForAddFoodRowType(rowType)}
            name={rowType}
            initialValue={foodItem[rowType]}
            onChange={(value) => {
              onInputChange(rowType, value);
            }}
            onChangeButton={onInputChange}
          />
        ))}
        {/* Show meat and boans ratio slider if Food category selected */}
        {foodItem.type === 'food' && (
          <TitleAndSlider
            title={'Meat / Bones ratio'}
            firstValueTitle={'Meat'}
            secondValueTitle={'Bones'}
            firstValue={foodItem?.meatRatio}
            secondValue={foodItem?.bonesRatio}
            onChange={(newMeatRatio, newBonesRatio) => {
              onSliderChange(newMeatRatio, newBonesRatio);
            }}
          />
        )}

        <DescriptionTextBox
          name={'desc'}
          title={'Add Description'}
          onChange={onTextInputChange}
        />
        <div css={styles.addFoodButtonContainerStyle}>
          <ButtonText
            as="button"
            name="createFood"
            width="130px"
            variant="rectangleTextButton"
            onClick={(e) => addNewFood(e)}
            disabled={!isValid}
          >
            {'Create'} Food
          </ButtonText>
          <ButtonText
            as="button"
            name="createAndAddFood"
            width="200px"
            variant="rectangleTextButton"
            onClick={(e) => addNewFood(e)}
            disabled={!isValid}
          >
            {'Create'} and Add to Meal
          </ButtonText>
        </div>
      </form>
    </div>
  );
};

export default NewFoodForm;
