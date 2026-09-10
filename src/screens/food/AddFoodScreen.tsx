/**
 * Add Food Screen — how much of a food goes into the meal.
 *
 * The food's photo and name lead, then the portion, then its description and
 * nutrition in collapsed sections — the detail is there without standing in
 * front of the one decision the screen is asking for.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAddFood, useGetFoodTemplateById } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import { useAuth } from '@contexts/AuthContext';
import { useCurrentDate } from '@contexts/DateContext';
import { PageContainer } from '@components/ui/PageContainer';
import { IOSButton } from '@components/ios/Button';
import { Label } from '@components/ios/Text';
import { ListRow } from '@components/ios/List';
import { Section } from '@components/ui/Section';
import {
  FormGroup,
  TitleAndDropdown,
  TitleButtonsAndTextField,
} from '@components/ui/FormRows';
import { CustomAlert } from '@components/ui/CustomAlert';
import FoodImage from '@components/FoodImage';
import { FoodUnits, AlertType } from '@constants/enums';
import { layout, spacing } from '@theme/tokens';

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

  /** One nutrition figure, stated as a value row. */
  const NutritionRow = ({ label, value }: { label: string; value?: number }) => (
    <ListRow title={label} value={value === undefined ? '—' : String(value)} chevron={false} />
  );

  const description = (foodItem as any)?.desc as string | undefined;

  return (
    <PageContainer>
      <View style={styles.stack}>
        {/* What is being added */}
        <View style={styles.hero}>
          <FoodImage foodItem={foodItem} isEditing={false} width={128} />
          <Label variant="title2" brand numberOfLines={2} style={styles.heroTitle}>
            {foodItem?.name}
          </Label>
          {foodItem?.calories ? (
            <Label variant="subheadline" role="secondary">
              {`${foodItem.calories} kcal / 100 g`}
            </Label>
          ) : null}
        </View>

        {/* The portion */}
        <FormGroup header="Portion">
          <TitleAndDropdown
            title="Units"
            dropdownOptions={unitOptions}
            onChange={setUnits}
          />
          <TitleButtonsAndTextField
            title="Amount"
            initialValue={0}
            step={10}
            onChange={setWeight}
            onChangeButton={setWeight}
          />
        </FormGroup>

        {description ? (
          <Section
            title="Description"
            expanded={isDescriptionExpanded}
            onToggle={() => setDescriptionExpanded(!isDescriptionExpanded)}
          >
            <View style={styles.description}>
              <Label variant="subheadline" role="secondary">
                {description}
              </Label>
            </View>
          </Section>
        ) : null}

        <Section
          title="Nutrition facts"
          expanded={isNutritionExpanded}
          onToggle={() => setNutritionExpanded(!isNutritionExpanded)}
        >
          <NutritionRow label="Protein, %" value={(foodItem as any)?.protein} />
          <NutritionRow label="Fat, %" value={(foodItem as any)?.fat} />
          <NutritionRow label="Carbohydrates, %" value={(foodItem as any)?.carb} />
          <NutritionRow label="Fiber, %" value={(foodItem as any)?.fiber} />
          <NutritionRow label="Ash, %" value={(foodItem as any)?.ash} />
          <NutritionRow label="Calories in 100 g, kcal" value={foodItem?.calories} />
          <NutritionRow
            label="Calories in serving, kcal"
            value={(foodItem as any)?.caloriesServing}
          />
        </Section>

        <View style={styles.action}>
          <IOSButton
            title="Add to meal"
            variant="prominent"
            size="lg"
            fullWidth
            haptic="medium"
            onPress={addFoodToMeal}
            disabled={weight === 0 || showAlert}
          />
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
  stack: {
    gap: spacing.xl,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
  },
  heroTitle: {
    textAlign: 'center',
  },
  description: {
    padding: spacing.base,
  },
  action: {
    paddingHorizontal: layout.screenPadding,
  },
});
