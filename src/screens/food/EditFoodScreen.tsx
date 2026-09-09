/**
 * Edit Food Screen — port of the web app's EditFood.page.js + EditFoodForm.
 *
 * A Back / "Edit Food" / Save header, the food photo, then Name, Food type,
 * Units and Food category rows, the Nutrition Facts rows, and a description box.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetFoodTemplateById, useUpdateFoodTemplate } from '@hooks/useGraphQL';
import { PageContainer } from '@components/ui/PageContainer';
import { HuppyButton } from '@components/ui/Buttons';
import {
  TitleAndDropdown,
  TitleAndTextField,
  TitleButtonsAndTextField,
} from '@components/ui/FormRows';
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
import type { FoodTemplate } from '../../types';

type FoodStackParamList = {
  SearchFood: { mealId: string };
  AddFood: { mealId: string; foodTemplateId: string };
  EditFood: { foodId: string };
  CreateNewFood: { mealId: string };
};

type Props = NativeStackScreenProps<FoodStackParamList, 'EditFood'>;

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

export default function EditFoodScreen({ navigation, route }: Props) {
  const { foodId } = route.params;
  const { data: food } = useGetFoodTemplateById(foodId);
  const { mutate: updateFoodTemplate } = useUpdateFoodTemplate();

  const [foodItem, setFoodItem] = useState<Partial<FoodTemplate>>({});
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (food) setFoodItem(food);
  }, [food]);

  const onInputChange = (name: string, value: string | number) => {
    setFoodItem((prev) => ({ ...prev, [name]: value }));
    setIsEdited(true);
  };

  const saveFood = () => {
    if (!foodItem.name || foodItem.name.length === 0 || !foodItem.calories) {
      return;
    }
    updateFoodTemplate(
      { templateId: foodId, updateData: foodItem },
      { onSuccess: () => navigation.goBack() }
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
        <Text style={styles.title}>Edit Food</Text>
        <HuppyButton
          variant="actionNavigationButton"
          imageName="checkmark_orange.svg"
          imageSize={15}
          onPress={saveFood}
          disabled={!isEdited}
        >
          Save
        </HuppyButton>
      </View>

      <View style={styles.imageContainer}>
        <FoodImage foodItem={food} />
      </View>

      <View style={styles.form}>
        <TitleAndTextField
          title="Name"
          initialValue={foodItem.name ?? ''}
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
        />

        <Text style={styles.nutritionFactsTitle}>Nutrition Facts</Text>

        {Object.values(AddFoodRowType).map((rowType) => (
          <TitleButtonsAndTextField
            key={rowType}
            title={getTitleForAddFoodRowType(rowType)}
            initialValue={(foodItem as any)?.[rowType] ?? 0}
            onChange={(value) => onInputChange(rowType, value)}
            onChangeButton={(value) => onInputChange(rowType, value)}
          />
        ))}

        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionTitle}>Add Description</Text>
          <TextInput
            style={styles.descriptionInput}
            multiline
            value={(foodItem as any)?.desc ?? ''}
            onChangeText={(value) => onInputChange('desc', value)}
          />
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
  title: {
    textAlign: 'center',
    color: colors.lightGreen,
    fontSize: 17,
    fontFamily: fontFamily.bold,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  form: {
    width: '100%',
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
});
