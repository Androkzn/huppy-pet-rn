/**
 * Edit Food Screen — changing one of the user's own foods.
 *
 * The photo leads, then the food's identity and its nutrition in grouped lists,
 * and a free-text description at the end. Save sits in the navigation bar and
 * only lights up once something has actually changed, as iOS edit screens do.
 */

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetFoodTemplateById, useUpdateFoodTemplate } from '@hooks/useGraphQL';
import { PageContainer } from '@components/ui/PageContainer';
import { IOSButton } from '@components/ios/Button';
import { Label } from '@components/ios/Text';
import {
  FormGroup,
  TitleAndDropdown,
  TitleAndTextField,
  TitleButtonsAndTextField,
} from '@components/ui/FormRows';
import FoodImage from '@components/FoodImage';
import { ImagePickerDialog } from '@components/dialogs';
import { uploadImageFromUri, deleteImage } from '@services/api/imageApi';
import {
  FoodType,
  FoodUnits,
  FoodCategoryType,
  AddFoodRowType,
  getTitleForAddFoodRowType,
  getTitleUpercased,
} from '@constants/enums';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, spacing, textStyles } from '@theme/tokens';
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
  const { colors } = useAppTheme();
  const { foodId } = route.params;
  const { data: food } = useGetFoodTemplateById(foodId);
  const { mutate: updateFoodTemplate } = useUpdateFoodTemplate();

  const [foodItem, setFoodItem] = useState<Partial<FoodTemplate>>({});
  const [isEdited, setIsEdited] = useState(false);
  const [isImageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

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

  // Save belongs in the navigation bar, and stays inert until there is an edit.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IOSButton
          title="Save"
          variant="glassProminent"
          size="sm"
          haptic="medium"
          disabled={!isEdited}
          onPress={saveFood}
        />
      ),
    });
  }, [navigation, isEdited, foodItem]);

  return (
    <PageContainer>
      <View style={styles.stack}>
        <View style={styles.hero}>
          <FoodImage
            foodItem={food}
            imageDataUrl={imageUri}
            width={128}
            onPress={() => setImageDialogOpen(true)}
          />
          <IOSButton
            title="Change photo"
            variant="tinted"
            size="sm"
            icon="camera"
            onPress={() => setImageDialogOpen(true)}
          />
        </View>

        <FormGroup header="Food">
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
        </FormGroup>

        <FormGroup header="Nutrition facts">
          {Object.values(AddFoodRowType).map((rowType) => (
            <TitleButtonsAndTextField
              key={rowType}
              title={getTitleForAddFoodRowType(rowType)}
              initialValue={(foodItem as any)?.[rowType] ?? 0}
              onChange={(value) => onInputChange(rowType, value)}
              onChangeButton={(value) => onInputChange(rowType, value)}
            />
          ))}
        </FormGroup>

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
            value={(foodItem as any)?.desc ?? ''}
            onChangeText={(value) => onInputChange('desc', value)}
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
          uploadImageFromUri(uri, 'food', `${(food as any)?.userId}/${foodId}`);
          onInputChange('image', new Date().toISOString());
          setImageDialogOpen(false);
        }}
        onDelete={() => {
          setImageUri(null);
          deleteImage('food', `${(food as any)?.userId}/${foodId}`);
          onInputChange('image', '');
          setImageDialogOpen(false);
        }}
        onClose={() => setImageDialogOpen(false)}
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
});
