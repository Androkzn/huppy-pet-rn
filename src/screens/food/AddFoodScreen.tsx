/**
 * Add Food Screen — port of the web app's AddFood.page.js + AddFoodForm.
 *
 * A Back / "Add to meal" header, the food photo and name, the Units and Select
 * weight rows, the collapsible Description and Nutrition Facts panels, and the
 * Add to Meal button.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAddFood, useGetFoodTemplateById } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import { useAuth } from '@contexts/AuthContext';
import { useCurrentDate } from '@contexts/DateContext';
import { PageContainer } from '@components/ui/PageContainer';
import { Asset } from '@components/ui/Asset';
import { HuppyButton } from '@components/ui/Buttons';
import {
  TitleAndDropdown,
  TitleButtonsAndTextField,
} from '@components/ui/FormRows';
import { CustomAlert } from '@components/ui/CustomAlert';
import FoodImage from '@components/FoodImage';
import { FoodUnits, AlertType } from '@constants/enums';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';

type FoodStackParamList = {
  SearchFood: { mealId: string };
  AddFood: { mealId: string; foodTemplateId: string };
  EditFood: { foodId: string };
  CreateNewFood: { mealId: string };
};

type Props = NativeStackScreenProps<FoodStackParamList, 'AddFood'>;

const unitOptions = Object.values(FoodUnits).map((type) => ({
  rawValue: type,
  title: type,
}));

export default function AddFoodScreen({ navigation, route }: Props) {
  const { mealId, foodTemplateId } = route.params;
  const { currentProfile } = useProfile();
  const { user } = useAuth();
  const { currentDate } = useCurrentDate();

  const { data: foodItem } = useGetFoodTemplateById(foodTemplateId);
  const { mutate: addFood } = useAddFood();

  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isNutritionExpanded, setNutritionExpanded] = useState(false);
  const [units, setUnits] = useState<string>(FoodUnits.GRAM);
  const [weight, setWeight] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState<string>(AlertType.ERROR);

  const addFoodToMeal = () => {
    if (!foodItem || !currentProfile || !user) return;
    const { _id, ...rest } = foodItem as any;

    addFood(
      {
        ...rest,
        units,
        weight,
        mealId,
        templateId: _id,
        profileId: currentProfile._id,
        userId: user.id,
        date: currentDate,
      } as any,
      {
        onSuccess: () => {
          setMessage(`${foodItem.name} added to your meal.`);
          setAlertType(AlertType.SUCCESS);
          setShowAlert(true);
          navigation.navigate('SearchFood', { mealId });
        },
        onError: () => {
          setMessage(`${foodItem.name} cannot be added . Try again.`);
          setAlertType(AlertType.ERROR);
          setShowAlert(true);
        },
      }
    );
  };

  const NutritionRow = ({ label, value }: { label: string; value?: number }) => (
    <View style={styles.nutritionRow}>
      <Text style={styles.nutritionText}>{label}</Text>
      <Text style={styles.nutritionText}>{value}</Text>
    </View>
  );

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
        <Text style={styles.addFoodTitle}>Add to meal</Text>
        <View style={styles.topSpacer} />
      </View>

      <View style={styles.form}>
        <View style={styles.imageContainer}>
          <FoodImage foodItem={foodItem} isEditing={false} />
        </View>

        <Text style={styles.addFoodTitle}>{foodItem?.name}</Text>

        <TitleAndDropdown
          title="Units"
          dropdownOptions={unitOptions}
          onChange={setUnits}
        />
        <TitleButtonsAndTextField
          title="Select weight"
          initialValue={0}
          onChange={setWeight}
          onChangeButton={setWeight}
        />

        {/* Description */}
        {!!(foodItem as any)?.desc && (
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Text
                style={styles.panelTitle}
                onPress={() => setDescriptionExpanded(!isDescriptionExpanded)}
              >
                Description
              </Text>
              <Asset
                imageName={
                  isDescriptionExpanded
                    ? 'arrow_down_green.svg'
                    : 'arrow_right_green.svg'
                }
                width={20}
                height={20}
                onPress={() => setDescriptionExpanded(!isDescriptionExpanded)}
              />
            </View>
            {isDescriptionExpanded && (
              <View style={styles.panelBody}>
                <Text style={styles.nutritionText}>
                  {(foodItem as any)?.desc}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Nutrition facts */}
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text
              style={styles.panelTitle}
              onPress={() => setNutritionExpanded(!isNutritionExpanded)}
            >
              Nutrition Facts
            </Text>
            <Asset
              imageName={
                isNutritionExpanded
                  ? 'arrow_down_green.svg'
                  : 'arrow_right_green.svg'
              }
              width={20}
              height={20}
              onPress={() => setNutritionExpanded(!isNutritionExpanded)}
            />
          </View>
          {isNutritionExpanded && (
            <View style={styles.panelBody}>
              <NutritionRow label="Protein, %" value={(foodItem as any)?.protein} />
              <NutritionRow label="Fat, %" value={(foodItem as any)?.fat} />
              <NutritionRow
                label="Carbohydrates, %"
                value={(foodItem as any)?.carb}
              />
              <NutritionRow label="Fiber, %" value={(foodItem as any)?.fiber} />
              <NutritionRow label="Ash, %" value={(foodItem as any)?.ash} />
              <NutritionRow
                label="Calories in 100g, kcal"
                value={foodItem?.calories}
              />
              <NutritionRow
                label="Calories in serving, kcal"
                value={(foodItem as any)?.caloriesServing}
              />
            </View>
          )}
        </View>

        <View style={styles.row}>
          <HuppyButton
            variant="rectangleTextButton"
            width={200}
            onPress={addFoodToMeal}
            disabled={weight === 0 || showAlert}
          >
            Add to Meal
          </HuppyButton>
        </View>
      </View>

      <CustomAlert
        message={message}
        type={alertType}
        show={showAlert}
        setAppearance={setShowAlert}
        timeout={2000}
      />
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
  form: {
    maxWidth: 450,
    minWidth: 250,
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  addFoodTitle: {
    textAlign: 'center',
    color: colors.lightGreen,
    fontSize: 17,
    fontFamily: fontFamily.bold,
    margin: 10,
  },
  panel: {
    flexDirection: 'column',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    margin: 3,
    marginTop: 10,
    backgroundColor: colors.lightBrown,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  panelTitle: {
    textAlign: 'center',
    color: colors.lightGreen,
    margin: 10,
    fontSize: 17,
    fontFamily: fontFamily.bold,
    padding: 5,
  },
  panelBody: {
    width: '90%',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    margin: 5,
  },
  nutritionText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.black,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
