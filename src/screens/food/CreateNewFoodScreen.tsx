/**
 * Create New Food Screen — port of the web app's CreateNewFood.page.js
 * + NewFoodForm.
 *
 * The photo picker, Name / Food type / Units / Food category rows, the
 * Nutrition Facts rows, the meat-bones ratio slider (meat and bones only), a
 * description box, and the two create buttons.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAddFoodTemplate } from '@hooks/useGraphQL';
import { useAuth } from '@contexts/AuthContext';
import { PageContainer } from '@components/ui/PageContainer';
import { HuppyButton } from '@components/ui/Buttons';
import {
  TitleAndDropdown,
  TitleAndTextField,
  TitleButtonsAndTextField,
} from '@components/ui/FormRows';
import { TitleAndSlider } from '@components/ui/TitleAndSlider';
import FoodImage from '@components/FoodImage';
import {
  FoodType,
  FoodUnits,
  FoodCategoryType,
  AddFoodRowType,
  getTitleForAddFoodRowType,
  getTitleUpercased,
} from '@constants/enums';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';

type FoodStackParamList = {
  SearchFood: { mealId: string };
  AddFood: { mealId: string; foodTemplateId: string };
  EditFood: { foodId: string };
  CreateNewFood: { mealId: string };
};

type Props = NativeStackScreenProps<FoodStackParamList, 'CreateNewFood'>;

const typeOptions = Object.values(FoodType).map((type) => ({
  rawValue: type,
  title: getTitleUpercased(type),
}));

const unitOptions = Object.values(FoodUnits).map((type) => ({
  rawValue: type,
  title: type,
}));

const categoryOptions = Object.values(FoodCategoryType).map((type) => ({
  rawValue: type,
  title: getTitleUpercased(type),
}));

export default function CreateNewFoodScreen({ navigation, route }: Props) {
  const { mealId } = route.params;
  const { user } = useAuth();
  const { mutate: addFoodTemplate } = useAddFoodTemplate();

  // Web's prefilled form state.
  const [foodItem, setFoodItem] = useState<any>({
    _id: '',
    userId: user?.id ?? '',
    name: '',
    image: '',
    type: 'food',
    units: 'gram',
    categoryType: 'meat',
    protein: 0,
    fat: 0,
    fiber: 0,
    ash: 0,
    carb: 0,
    calories: 0,
    servings: 0,
    caloriesServing: 0,
    servingWeight: 0,
    meatRatio: 100,
    bonesRatio: 0,
    desc: '',
    weight: 0,
  });

  const onInputChange = (name: string, value: string | number) => {
    setFoodItem((prev: any) =>
      // Anything that is not plain food is filed under "other".
      name === 'type' && value !== 'food'
        ? { ...prev, [name]: value, categoryType: FoodCategoryType.OTHER }
        : { ...prev, [name]: value }
    );
  };

  // New food needs a name, calories, and at least one macro above zero.
  const isValid =
    foodItem.name.length > 2 &&
    foodItem.calories > 0 &&
    (foodItem.protein > 0 || foodItem.fat > 0 || foodItem.carb > 0);

  const addNewFood = (alsoAddToMeal: boolean) => {
    if (foodItem.name.length === 0 || foodItem.calories === 0) return;

    const { _id, ...rest } = foodItem;
    addFoodTemplate(
      { ...rest, isCustom: true } as any,
      {
        onSuccess: (data: any) => {
          const templateId = data?.templateId ?? data;
          if (alsoAddToMeal && templateId) {
            navigation.navigate('AddFood', {
              mealId,
              foodTemplateId: templateId,
            });
          } else {
            navigation.navigate('SearchFood', { mealId });
          }
        },
        onError: () => {
          Alert.alert('', 'Food template cannot be added. Try again.');
        },
      }
    );
  };

  return (
    <PageContainer>
      {/* Top navigation */}
      <View style={styles.topButtonsContainer}>
        <HuppyButton
          variant="backButton"
          imageName="arrow_left_green.svg"
          imageSize={20}
          onPress={() => navigation.goBack()}
        >
          Back
        </HuppyButton>
        <Text style={styles.title}>Add New Food</Text>
        <View style={styles.topSpacer} />
      </View>

      <View style={styles.form}>
        <View style={styles.imageContainer}>
          <FoodImage foodItem={foodItem} />
        </View>

        <TitleAndTextField
          title="Name"
          placeholder="Enter food name"
          onChange={(value) => onInputChange('name', value)}
        />
        <TitleAndDropdown
          title="Food type"
          initialValue={foodItem.type}
          dropdownOptions={typeOptions}
          onChange={(value) => onInputChange('type', value)}
        />
        <TitleAndDropdown
          title="Units"
          initialValue={foodItem.units}
          dropdownOptions={unitOptions}
          onChange={(value) => onInputChange('units', value)}
        />
        <TitleAndDropdown
          title="Food category"
          initialValue={foodItem.categoryType}
          dropdownOptions={categoryOptions}
          onChange={(value) => onInputChange('categoryType', value)}
          disabled={foodItem.type !== 'food'}
        />

        <Text style={styles.nutritionFactsTitle}>Nutrition Facts</Text>

        {Object.values(AddFoodRowType).map((rowType) => (
          <TitleButtonsAndTextField
            key={rowType}
            title={getTitleForAddFoodRowType(rowType)}
            initialValue={foodItem[rowType]}
            onChange={(value) => onInputChange(rowType, value)}
            onChangeButton={(value) => onInputChange(rowType, value)}
          />
        ))}

        {foodItem.type === 'food' &&
          (foodItem.categoryType === 'meat' ||
            foodItem.categoryType === 'bones') && (
            <TitleAndSlider
              title="Meat / Bones ratio"
              firstValueTitle="Meat"
              secondValueTitle="Bones"
              firstValue={foodItem.meatRatio}
              secondValue={foodItem.bonesRatio}
              onChange={(meatRatio, bonesRatio) =>
                setFoodItem((prev: any) => ({ ...prev, meatRatio, bonesRatio }))
              }
            />
          )}

        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionTitle}>Add Description</Text>
          <TextInput
            style={styles.descriptionInput}
            multiline
            value={foodItem.desc}
            onChangeText={(value) => onInputChange('desc', value)}
          />
        </View>

        <View style={styles.buttonRow}>
          <HuppyButton
            variant="rectangleTextButton"
            width={130}
            onPress={() => addNewFood(false)}
            disabled={!isValid}
          >
            Create Food
          </HuppyButton>
          <HuppyButton
            variant="rectangleTextButton"
            width={200}
            onPress={() => addNewFood(true)}
            disabled={!isValid}
          >
            Create and Add to Meal
          </HuppyButton>
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  topButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  topSpacer: {
    width: 100,
  },
  title: {
    textAlign: 'center',
    color: colors.lightGreen,
    fontSize: 17,
    fontFamily: fontFamily.bold,
  },
  form: {
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  nutritionFactsTitle: {
    textAlign: 'center',
    color: colors.lightGreen,
    fontFamily: fontFamily.bold,
    fontSize: 17,
    marginVertical: 10,
  },
  descriptionBox: {
    borderRadius: 10,
    backgroundColor: colors.lightBrown,
    margin: 3,
    padding: 10,
  },
  descriptionTitle: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: colors.black,
    marginBottom: 5,
  },
  descriptionInput: {
    minHeight: 80,
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: 10,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
});
