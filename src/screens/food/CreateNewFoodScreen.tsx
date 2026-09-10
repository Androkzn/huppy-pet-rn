/**
 * Create New Food Screen — adding a food of the user's own.
 *
 * The photo, the food's identity, its nutrition, the meat/bones split where it
 * applies, and a description. The two ways to finish sit together at the end:
 * create it, or create it and put it straight into the meal.
 */

import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAddFoodTemplate } from '@hooks/useGraphQL';
import { useAuth } from '@contexts/AuthContext';
import { PageContainer } from '@components/ui/PageContainer';
import { IOSButton } from '@components/ios/Button';
import { Label } from '@components/ios/Text';
import {
  FormGroup,
  TitleAndDropdown,
  TitleAndTextField,
  TitleButtonsAndTextField,
} from '@components/ui/FormRows';
import { TitleAndSlider } from '@components/ui/TitleAndSlider';
import { CustomAlert } from '@components/ui/CustomAlert';
import { ImagePickerDialog } from '@components/dialogs';
import { uploadImageFromUri } from '@services/api/imageApi';
import FoodImage from '@components/FoodImage';
import {
  FoodType,
  FoodUnits,
  FoodCategoryType,
  AddFoodRowType,
  getTitleForAddFoodRowType,
  getTitleUpercased,
  AlertType,
} from '@constants/enums';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, spacing, textStyles } from '@theme/tokens';

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
  const { colors } = useAppTheme();
  const { mealId } = route.params;
  const { user } = useAuth();
  const { mutate: addFoodTemplate } = useAddFoodTemplate();

  const [isImageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState<string>(AlertType.ERROR);

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

          // Web: the picked image is uploaded once the template has an id.
          if (imageUri && templateId) {
            uploadImageFromUri(imageUri, 'food', `${foodItem.userId}/${templateId}`);
          }

          setMessage('Food template created');
          setAlertType(AlertType.SUCCESS);
          setShowAlert(true);

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
          setMessage('Food template cannot be added. Try again.');
          setAlertType(AlertType.ERROR);
          setShowAlert(true);
        },
      }
    );
  };

  const showRatioSlider =
    foodItem.type === 'food' &&
    (foodItem.categoryType === 'meat' || foodItem.categoryType === 'bones');

  return (
    <PageContainer>
      <View style={styles.stack}>
        <View style={styles.hero}>
          <FoodImage
            foodItem={foodItem}
            imageDataUrl={imageUri}
            width={128}
            onPress={() => setImageDialogOpen(true)}
          />
          <IOSButton
            title={imageUri ? 'Change photo' : 'Add photo'}
            variant="tinted"
            size="sm"
            icon="camera"
            onPress={() => setImageDialogOpen(true)}
          />
        </View>

        <FormGroup header="Food">
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
        </FormGroup>

        <FormGroup
          header="Nutrition facts"
          footer="Calories per 100 g are needed to work the food into the day's total."
        >
          {Object.values(AddFoodRowType).map((rowType) => (
            <TitleButtonsAndTextField
              key={rowType}
              title={getTitleForAddFoodRowType(rowType)}
              initialValue={foodItem[rowType]}
              onChange={(value) => onInputChange(rowType, value)}
              onChangeButton={(value) => onInputChange(rowType, value)}
            />
          ))}
        </FormGroup>

        {showRatioSlider ? (
          <FormGroup header="Composition">
            <TitleAndSlider
              title="Meat / bones ratio"
              firstValueTitle="Meat"
              secondValueTitle="Bones"
              firstValue={foodItem.meatRatio}
              secondValue={foodItem.bonesRatio}
              onChange={(meatRatio, bonesRatio) =>
                setFoodItem((prev: any) => ({ ...prev, meatRatio, bonesRatio }))
              }
            />
          </FormGroup>
        ) : null}

        <View style={styles.noteGroup}>
          <Label
            variant="footnote"
            role="secondary"
            sectionHeader
            style={styles.noteHeader}
          >
            Description
          </Label>
          <TextInput
            style={[
              styles.note,
              { backgroundColor: colors.groupedSurface, color: colors.label },
            ]}
            multiline
            placeholder="What is in it, how it is served…"
            placeholderTextColor={colors.tertiaryLabel}
            selectionColor={colors.tint}
            value={foodItem.desc}
            onChangeText={(value) => onInputChange('desc', value)}
          />
        </View>

        <View style={styles.actions}>
          <IOSButton
            title="Create and add to meal"
            variant="prominent"
            size="lg"
            fullWidth
            haptic="medium"
            onPress={() => addNewFood(true)}
            disabled={!isValid}
          />
          <IOSButton
            title="Create only"
            variant="tinted"
            size="md"
            fullWidth
            onPress={() => addNewFood(false)}
            disabled={!isValid}
          />
        </View>
      </View>

      <ImagePickerDialog
        visible={isImageDialogOpen}
        imageUri={imageUri}
        placeholderName="food_placeholder.png"
        emptyTitle="Add image"
        onSave={(uri) => {
          setImageUri(uri);
          setImageDialogOpen(false);
        }}
        onDelete={() => {
          setImageUri(null);
          setImageDialogOpen(false);
        }}
        onClose={() => setImageDialogOpen(false)}
      />

      <CustomAlert
        message={message}
        type={alertType}
        show={showAlert}
        setAppearance={setShowAlert}
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
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  noteGroup: {
    gap: 7,
  },
  noteHeader: {
    paddingHorizontal: layout.screenPadding + 4,
  },
  note: {
    marginHorizontal: layout.screenPadding,
    minHeight: 96,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    textAlignVertical: 'top',
    ...textStyles.body,
  },
  actions: {
    gap: spacing.sm,
    paddingHorizontal: layout.screenPadding,
  },
});
