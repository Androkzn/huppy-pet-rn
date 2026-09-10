/**
 * MealCard — one meal in the day's diary.
 *
 * A grouped card: a header naming the meal and its totals, a row per food item,
 * and an "Add food" row at the end — the shape iOS uses for an editable list.
 * Rows swipe to delete or edit, the way Mail and Reminders do; the meal's own
 * actions (copy from, copy to, delete) live behind the ellipsis in a sheet.
 *
 * All of the meal arithmetic and the mutations are the ones the app already
 * used; only the presentation is new.
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Pressable } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  useGetAllFoodForMeal,
  useGetFoodForDate,
  useAddMeal,
  useDeleteMeal,
  useAddFood,
  useDeleteFood,
  useUpdateFood,
} from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import { useAuth } from '@contexts/AuthContext';
import { useCurrentDate } from '@contexts/DateContext';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, motion, radius, spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Asset, LoadingAndError } from './ui/Asset';
import { Checkbox } from './ui/Checkbox';
import { Icon } from './ios/Icon';
import { Label } from './ios/Text';
import { Sheet } from './ios/Sheet';
import { ListRow, ListSection } from './ios/List';
import { Stepper } from './ios/Stepper';
import { IOSButton } from './ios/Button';
import { EmptyState } from './ios/Feedback';
import type { Food, Meal } from '../types';

interface MealCardProps {
  meal: Meal;
  /** 1-based position, shown in the header. */
  index: number;
  mealsCount: number;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, index, mealsCount }) => {
  const navigation = useNavigation<any>();
  const { currentProfile } = useProfile();
  const { user } = useAuth();
  const { currentDate } = useCurrentDate();
  const { colors } = useAppTheme();

  const mealId = meal._id;
  const [isMealsExpanded, setMealsExpanded] = useState(true);
  const [isMoreOpen, setMoreOpen] = useState(false);
  const [isCopyFromMealExpanded, setCopyFromMealExpanded] = useState(false);
  const [copyFromDate, setCopyFromDate] = useState(new Date());
  const [showCopyDatePicker, setShowCopyDatePicker] = useState(false);
  const [copyDateDraft, setCopyDateDraft] = useState(new Date());
  const [isCopyTo, setIsCopyTo] = useState(false);
  const [checkedMealsIds, setCheckedMeals] = useState<string[]>([]);
  const [checkedFoodsIds, setCheckedFoods] = useState<string[]>([]);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  // The portion being edited in the sheet, committed on save.
  const [editingWeight, setEditingWeight] = useState(0);

  const { data: food } = useGetAllFoodForMeal(mealId, currentProfile?._id || '');
  const {
    data: foodForDate,
    isLoading: isLoadingFoodForDate,
    isError: isErrorFoodForDate,
  } = useGetFoodForDate(user?.id || '', currentProfile?._id || '', copyFromDate);

  const { mutate: addMeal } = useAddMeal();
  const { mutate: deleteMeal } = useDeleteMeal();
  const { mutate: deleteFood } = useDeleteFood();
  const { mutate: addFood } = useAddFood();
  const { mutate: updateFood } = useUpdateFood();

  const foodItems: Food[] = food ?? [];

  const chevron = useSharedValue(isMealsExpanded ? 0 : -90);
  useEffect(() => {
    chevron.value = withSpring(isMealsExpanded ? 0 : -90, motion.smooth);
  }, [isMealsExpanded, chevron]);
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevron.value}deg` }],
  }));

  // The selection is cleared whenever the copy-from date changes.
  useEffect(() => {
    setCheckedMeals([]);
    setCheckedFoods([]);
  }, [copyFromDate]);

  const addMealForDate = () => {
    if (!currentProfile || !user) return;
    addMeal({ date: currentDate, profileId: currentProfile._id, userId: user.id });
  };

  const deleteCurrentMeal = () => {
    const doDelete = () => {
      deleteMeal(mealId);
      foodItems.forEach((foodItem) => deleteFood(foodItem._id));
    };

    if (foodItems.length > 0) {
      Alert.alert(
        `Delete meal ${index}?`,
        'Its food will be removed from the day.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: doDelete },
        ]
      );
      return;
    }
    doDelete();
  };

  const openAddFoodPage = () => {
    navigation.navigate('Food', {
      screen: 'SearchFood',
      params: { mealId, selectedDate: meal.date },
    });
  };

  const calculateTotalWeight = (items: Food[]) =>
    Math.floor(items.reduce((total, item) => total + Number(item.weight), 0));

  const calculateTotalCalories = (items: Food[]) =>
    Math.floor(
      items.reduce(
        (total, item) => total + Number((item.calories / 100) * item.weight),
        0
      )
    );

  const getCaloriesForFood = (item: Food) =>
    Math.floor((item.calories / 100) * item.weight);

  /** Groups the copy-source day's food by meal. */
  const getGroupedFood = (): Food[][] => {
    if (!foodForDate || foodForDate.length === 0) return [];
    return foodForDate.reduce((result: Food[][], item: Food) => {
      const groupIndex = result.findIndex((group) => group[0]?.mealId === item.mealId);
      if (groupIndex !== -1) {
        result[groupIndex].push(item);
      } else {
        result.push([item]);
      }
      return result;
    }, []);
  };

  const copyMeal = () => {
    if (!currentProfile || !user || !foodForDate) return;
    const checkedFoods = foodForDate.filter((item: Food) =>
      checkedFoodsIds.includes(item._id)
    );

    const addAllTo = (targetMealId: string) => {
      checkedFoods.forEach((item: Food) => {
        const { _id, ...rest } = item;
        addFood({
          ...rest,
          mealId: targetMealId,
          profileId: currentProfile._id,
          userId: user.id,
          date: currentDate,
        } as any);
      });
    };

    if (isCopyTo) {
      // Copy into a brand new meal on the selected date.
      addMeal(
        { date: currentDate, profileId: currentProfile._id, userId: user.id },
        { onSuccess: (newMealId: string) => addAllTo(newMealId) }
      );
    } else {
      addAllTo(mealId);
    }
    haptics.success();
  };

  const handleMealCheckboxChange = (checked: boolean, checkedMealId: string) => {
    const mealFoods = (foodForDate ?? []).filter(
      (item: Food) => item.mealId === checkedMealId
    );

    if (checked) {
      setCheckedMeals((prev) => [...prev, checkedMealId]);
      setCheckedFoods((prev) => [...prev, ...mealFoods.map((f: Food) => f._id)]);
    } else {
      setCheckedMeals((prev) => prev.filter((id) => id !== checkedMealId));
      setCheckedFoods((prev) =>
        prev.filter((id) => !mealFoods.some((f: Food) => f._id === id))
      );
    }
  };

  const handleFoodCheckboxChange = (checked: boolean, foodId: string) => {
    setCheckedFoods((prev) =>
      checked ? [...prev, foodId] : prev.filter((id) => id !== foodId)
    );
  };

  /** A food row: name, then its weight and calories, swipeable both ways. */
  const FoodItem: React.FC<{ foodItem: Food; last: boolean }> = ({
    foodItem,
    last,
  }) => (
    <Swipeable
      containerStyle={styles.swipeContainer}
      friction={1.6}
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={() => (
        <View style={[styles.swipeAction, { backgroundColor: colors.red }]}>
          <Icon name="trash" size={20} color={colors.onTint} />
        </View>
      )}
      renderRightActions={() => (
        <View style={[styles.swipeAction, { backgroundColor: colors.tint }]}>
          <Icon name="pencil" size={20} color={colors.onTint} />
        </View>
      )}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') {
          haptics.warning();
          Alert.alert(`Remove ${foodItem.name}?`, undefined, [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Remove',
              style: 'destructive',
              onPress: () => deleteFood(foodItem._id),
            },
          ]);
        } else {
          haptics.light();
          setEditingWeight(foodItem.weight);
          setEditingFood(foodItem);
        }
      }}
    >
      <View style={[styles.foodRow, { backgroundColor: colors.groupedSurface }]}>
        <Label variant="body" numberOfLines={1} style={styles.foodName}>
          {foodItem.name}
        </Label>
        <Label variant="subheadline" role="secondary">
          {foodItem.weight} g
        </Label>
        <Label variant="subheadline" role="secondary" style={styles.foodCalories}>
          {getCaloriesForFood(foodItem)} kcal
        </Label>
      </View>
      {last ? null : (
        <View
          style={[
            styles.separator,
            { backgroundColor: colors.separator, height: layout.hairline },
          ]}
        />
      )}
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      {/* Header: the meal, its totals, and its actions. */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isMealsExpanded }}
          accessibilityLabel={`Meal ${index}`}
          style={styles.headerTitle}
          hitSlop={6}
          onPress={() => {
            haptics.light();
            setMealsExpanded(!isMealsExpanded);
          }}
        >
          <Animated.View style={chevronStyle}>
            <Icon name="chevron.down" size={12} weight="bold" color={colors.tertiaryLabel} />
          </Animated.View>
          <Label variant="footnote" role="secondary" sectionHeader>
            {`Meal ${index}`}
          </Label>
          {foodItems.length > 0 ? (
            <Label variant="footnote" role="tertiary">
              {`${calculateTotalWeight(foodItems)} g · ${calculateTotalCalories(
                foodItems
              )} kcal`}
            </Label>
          ) : null}
        </Pressable>

        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Meal ${index} options`}
            hitSlop={8}
            onPress={() => {
              haptics.light();
              setMoreOpen(true);
            }}
            style={({ pressed }) => [
              styles.headerButton,
              { backgroundColor: colors.tintSoft },
              pressed && styles.pressed,
            ]}
          >
            <Icon name="ellipsis" size={14} weight="bold" color={colors.tint} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add meal"
            hitSlop={8}
            onPress={() => {
              haptics.light();
              if (isMealsExpanded) {
                addMealForDate();
              } else {
                setMealsExpanded(true);
              }
            }}
            style={({ pressed }) => [
              styles.headerButton,
              { backgroundColor: colors.tintSoft },
              pressed && styles.pressed,
            ]}
          >
            <Icon name="plus" size={14} weight="bold" color={colors.tint} />
          </Pressable>
        </View>
      </View>

      {/* Body */}
      {isMealsExpanded ? (
        <View style={[styles.body, { backgroundColor: colors.groupedSurface }]}>
          {foodItems.length > 0 ? (
            foodItems.map((foodItem, foodIndex) => (
              <FoodItem
                key={foodItem._id}
                foodItem={foodItem}
                last={foodIndex === foodItems.length - 1}
              />
            ))
          ) : (
            <EmptyState
              symbol="fork.knife"
              title="Nothing in this meal yet"
              illustration={
                <Asset imageName="no_food_placeholder.png" width={170} height={120} />
              }
              style={styles.emptyState}
            />
          )}

          <View
            style={[
              styles.separator,
              { backgroundColor: colors.separator, height: layout.hairline },
            ]}
          />

          {/* The trailing "add" row, as iOS ends an editable list. */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add food"
            onPress={openAddFoodPage}
            style={({ pressed }) => [
              styles.addRow,
              pressed && { backgroundColor: colors.quaternaryFill },
            ]}
          >
            <Icon name="plus.circle.fill" size={20} color={colors.tint} />
            <Label variant="body" role="tint">
              Add food
            </Label>
          </Pressable>
        </View>
      ) : null}

      {/* Meal actions */}
      <Sheet
        open={isMoreOpen}
        onDismiss={() => setMoreOpen(false)}
        title={`Meal ${index}`}
        detent="medium"
      >
        <View style={styles.sheetBody}>
          <ListSection>
            <ListRow
              title="Copy food from another day"
              symbol="square.and.arrow.down"
              chevron={false}
              onPress={() => {
                setIsCopyTo(false);
                setMoreOpen(false);
                setCopyDateDraft(copyFromDate);
                setShowCopyDatePicker(true);
              }}
            />
            {foodItems.length > 0 ? (
              <ListRow
                title="Copy this meal to another day"
                symbol="doc.on.doc"
                chevron={false}
                onPress={() => {
                  setIsCopyTo(true);
                  setMoreOpen(false);
                  setCopyDateDraft(copyFromDate);
                  setShowCopyDatePicker(true);
                }}
              />
            ) : null}
          </ListSection>

          {mealsCount > 1 ? (
            <ListSection>
              <ListRow
                title="Delete meal"
                symbol="trash"
                symbolBackground={colors.red + '1F'}
                destructive
                chevron={false}
                onPress={() => {
                  setMoreOpen(false);
                  deleteCurrentMeal();
                }}
              />
            </ListSection>
          ) : null}
        </View>
      </Sheet>

      {/* Which day to copy from */}
      <Sheet
        open={showCopyDatePicker}
        onDismiss={() => setShowCopyDatePicker(false)}
        title={isCopyTo ? 'Copy to' : 'Copy from'}
        confirmLabel="Next"
        onConfirm={() => {
          setCopyFromDate(copyDateDraft);
          setShowCopyDatePicker(false);
          setCopyFromMealExpanded(true);
        }}
        scrollable={false}
      >
        <View style={styles.pickerBody}>
          <DateTimePicker
            value={copyDateDraft}
            mode="date"
            display="inline"
            accentColor={colors.tint}
            onChange={(_event, selected) => {
              if (selected) setCopyDateDraft(selected);
            }}
            style={styles.picker}
          />
        </View>
      </Sheet>

      {/* Adjust a portion */}
      <Sheet
        open={!!editingFood}
        onDismiss={() => setEditingFood(null)}
        title={editingFood?.name}
        confirmLabel="Save"
        onConfirm={() => {
          if (editingFood) {
            updateFood({
              foodId: editingFood._id,
              updateData: { weight: editingWeight },
            });
          }
          setEditingFood(null);
        }}
        scrollable={false}
      >
        <EditFoodSheet
          food={editingFood}
          value={editingWeight}
          onChange={setEditingWeight}
        />
      </Sheet>

      {/* Choose what to copy */}
      <Sheet
        open={isCopyFromMealExpanded}
        onDismiss={() => {
          setCopyFromMealExpanded(false);
          setCheckedMeals([]);
          setCheckedFoods([]);
        }}
        title={copyFromDate.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
        })}
        confirmLabel="Copy"
        confirmDisabled={checkedFoodsIds.length === 0}
        onConfirm={() => {
          copyMeal();
          setCopyFromMealExpanded(false);
        }}
      >
        <View style={styles.sheetBody}>
          {isLoadingFoodForDate || isErrorFoodForDate ? (
            <View style={styles.centered}>
              <LoadingAndError
                isLoading={isLoadingFoodForDate}
                isError={isErrorFoodForDate}
              />
            </View>
          ) : getGroupedFood().length > 0 ? (
            getGroupedFood().map((group, groupIndex) => (
              <ListSection key={group[0].mealId} header={`Meal ${groupIndex + 1}`}
                headerAccessory={
                  <Checkbox
                    checked={checkedMealsIds.includes(group[0].mealId)}
                    size={22}
                    onChange={(checked) =>
                      handleMealCheckboxChange(checked, group[0].mealId)
                    }
                  />
                }
              >
                {group.map((item) => (
                  <ListRow
                    key={item._id}
                    title={item.name}
                    value={`${item.weight} g`}
                    chevron={false}
                    leading={
                      <Checkbox
                        checked={checkedFoodsIds.includes(item._id)}
                        size={22}
                        onChange={(checked) =>
                          handleFoodCheckboxChange(checked, item._id)
                        }
                      />
                    }
                    onPress={() =>
                      handleFoodCheckboxChange(
                        !checkedFoodsIds.includes(item._id),
                        item._id
                      )
                    }
                  />
                ))}
              </ListSection>
            ))
          ) : (
            <EmptyState
              symbol="fork.knife"
              title="Nothing was logged that day"
              message="Pick another day to copy from."
              illustration={
                <Asset imageName="no_food_placeholder.png" width={170} height={120} />
              }
            />
          )}
        </View>
      </Sheet>
    </View>
  );
};

/** The portion editor: the food, the calories it comes to, and a stepper. */
const EditFoodSheet: React.FC<{
  food: Food | null;
  value: number;
  onChange: (weight: number) => void;
}> = ({ food, value, onChange }) => {
  return (
    <View style={styles.editSheet}>
      <View style={styles.editSummary}>
        <Label variant="largeTitle" brand>
          {value}
          <Label variant="title3" role="secondary">
            {' g'}
          </Label>
        </Label>
        <Label variant="subheadline" role="secondary">
          {`${Math.floor(((food?.calories ?? 0) / 100) * value)} kcal`}
        </Label>
      </View>

      <Stepper
        value={value}
        step={10}
        min={1}
        onChange={onChange}
        style={styles.editStepper}
      />

      {/* Common portions, so a typical amount is one tap away. */}
      <View style={styles.quickAmounts}>
        {[25, 50, 100, 200].map((amount) => (
          <IOSButton
            key={amount}
            title={`${amount} g`}
            variant="tinted"
            size="sm"
            onPress={() => onChange(amount)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: layout.screenPadding + 4,
    minHeight: 26,
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerButton: {
    width: 26,
    height: 26,
    borderRadius: radius.capsule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    marginHorizontal: layout.screenPadding,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  swipeContainer: {
    width: '100%',
  },
  swipeAction: {
    flex: 1,
    width: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 46,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 10,
  },
  foodName: {
    flex: 1,
  },
  foodCalories: {
    minWidth: 66,
    textAlign: 'right',
  },
  separator: {
    marginLeft: layout.screenPadding,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 46,
    paddingHorizontal: layout.screenPadding,
  },
  emptyState: {
    paddingVertical: spacing.lg,
  },
  sheetBody: {
    gap: spacing.lg,
    paddingBottom: spacing.base,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  pickerBody: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
  },
  picker: {
    alignSelf: 'stretch',
  },
  editSheet: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.lg,
  },
  editSummary: {
    alignItems: 'center',
    gap: 2,
  },
  editStepper: {
    height: 44,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.6,
  },
});

export default MealCard;
