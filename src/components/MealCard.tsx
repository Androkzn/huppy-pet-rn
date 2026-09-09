/**
 * MealCard — port of the web app's MealCard.component.js.
 *
 * A brown header strip (arrow, MEAL, meal number, add-meal button) over a gray
 * body listing the meal's food: a units row, a totals row, then one swipeable
 * white row per item. Beneath sit the Add Food button and the "more" menu with
 * copy-from / copy-to / delete-meal.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
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
import * as colors from '../theme/colors';
import { fontFamily, layout } from '../theme';
import { Asset, LoadingAndError } from './ui/Asset';
import { HuppyButton } from './ui/Buttons';
import { BottomSheet } from './ui/BottomSheet';
import { Checkbox } from './ui/Checkbox';
import { ButtonsAndTextField } from './ui/ButtonsAndTextField';
import CustomDatePickerWithArrows from './CustomDatePickerWithArrows';
import type { Food, Meal } from '../types';

interface MealCardProps {
  meal: Meal;
  /** 1-based position, shown in the header badge. */
  index: number;
  mealsCount: number;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, index, mealsCount }) => {
  const navigation = useNavigation<any>();
  const { currentProfile } = useProfile();
  const { user } = useAuth();
  const { currentDate } = useCurrentDate();

  const mealId = meal._id;
  const [isMealsExpanded, setMealsExpanded] = useState(true);
  const [isMoreOpen, setMoreOpen] = useState(false);
  const [isCopyFromMealExpanded, setCopyFromMealExpanded] = useState(false);
  const [copyFromDate, setCopyFromDate] = useState(new Date());
  const [showCopyDatePicker, setShowCopyDatePicker] = useState(false);
  const [isCopyTo, setIsCopyTo] = useState(false);
  const [checkedMealsIds, setCheckedMeals] = useState<string[]>([]);
  const [checkedFoodsIds, setCheckedFoods] = useState<string[]>([]);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  const { data: food } = useGetAllFoodForMeal(mealId, currentProfile?._id || '');
  const {
    data: foodForDate,
    isLoading: isLoadingFoodForDate,
    isError: isErrorFoodForDate,
  } = useGetFoodForDate(
    user?.id || '',
    currentProfile?._id || '',
    copyFromDate
  );

  const { mutate: addMeal } = useAddMeal();
  const { mutate: deleteMeal } = useDeleteMeal();
  const { mutate: deleteFood } = useDeleteFood();
  const { mutate: addFood } = useAddFood();
  const { mutate: updateFood } = useUpdateFood();

  const foodItems: Food[] = food ?? [];

  // The web clears the selection whenever the copy-from date changes.
  useEffect(() => {
    setCheckedMeals([]);
    setCheckedFoods([]);
  }, [copyFromDate]);

  const addMealForDate = () => {
    if (!currentProfile || !user) return;
    addMeal({
      date: currentDate,
      profileId: currentProfile._id,
      userId: user.id,
    });
  };

  const deleteCurrentMeal = () => {
    const doDelete = () => {
      deleteMeal(mealId);
      foodItems.forEach((foodItem) => deleteFood(foodItem._id));
    };

    if (foodItems.length > 0) {
      Alert.alert('', 'Do you really want to delete this meal?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: doDelete },
      ]);
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

  /** Groups the copy-source day's food by meal, as the web's getGroopedFood. */
  const getGroupedFood = (): Food[][] => {
    if (!foodForDate || foodForDate.length === 0) return [];
    return foodForDate.reduce((result: Food[][], item: Food) => {
      const groupIndex = result.findIndex(
        (group) => group[0]?.mealId === item.mealId
      );
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

  const FoodItem: React.FC<{ foodItem: Food }> = ({ foodItem }) => (
    <Swipeable
      containerStyle={styles.foodSwipeContainer}
      renderLeftActions={() => (
        <View style={styles.deleteAction}>
          <Asset imageName="delete_white.svg" width={25} height={25} />
        </View>
      )}
      renderRightActions={() => (
        <View style={styles.editAction}>
          <Asset imageName="edit_white.svg" width={20} height={20} />
        </View>
      )}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') {
          Alert.alert('', 'Do you really want to delete this item ?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: () => deleteFood(foodItem._id) },
          ]);
        } else {
          setEditingFood(foodItem);
        }
      }}
    >
      <View style={styles.foodListRow}>
        <View style={styles.headerText}>
          <Text style={styles.headingFood}>{foodItem.name}</Text>
          <View style={styles.caloriesAndWeight}>
            <Text style={styles.caloriesValue}>
              {getCaloriesForFood(foodItem)}
            </Text>
            <Text style={styles.weightValue}>{foodItem.weight}</Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerTitle}
          onPress={() => setMealsExpanded(!isMealsExpanded)}
        >
          <View style={styles.headerArrow}>
            <Asset
              imageName={
                isMealsExpanded ? 'arrow_down_green.svg' : 'arrow_right_green.svg'
              }
              width={20}
              height={20}
            />
          </View>
          <Text style={styles.heading}>MEAL</Text>
          <HuppyButton variant="circleTextTransparentButton">
            {String(index)}
          </HuppyButton>
        </Pressable>

        <View style={styles.headerAddButton}>
          <Asset
            imageName="add_round_orange.svg"
            width={30}
            height={30}
            onPress={() => {
              if (isMealsExpanded) {
                addMealForDate();
              } else {
                setMealsExpanded(true);
              }
            }}
          />
        </View>
      </View>

      {/* Body */}
      <View style={styles.bodyMeal}>
        {isMealsExpanded && foodItems.length > 0 ? (
          <View style={styles.column}>
            <View style={styles.totalWeightContainer}>
              <Text style={styles.weightLabel} />
              <View style={styles.caloriesAndWeight}>
                <Text style={styles.unitCalories}>kcal</Text>
                <Text style={styles.unitWeight}>g</Text>
              </View>
            </View>
            <View style={styles.totalWeightContainer}>
              <Text style={styles.weightLabel}>Total</Text>
              <View style={styles.caloriesAndWeight}>
                <Text style={styles.caloriesTotal}>
                  {calculateTotalCalories(foodItems)}
                </Text>
                <Text style={styles.weightTotal}>
                  {calculateTotalWeight(foodItems)}
                </Text>
              </View>
            </View>
            <View style={styles.foodList}>
              {foodItems.map((foodItem) => (
                <FoodItem foodItem={foodItem} key={foodItem._id} />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Asset
              imageName={
                isMealsExpanded ? 'no_food_placeholder.png' : 'more_green.svg'
              }
              width={isMealsExpanded ? 200 : 30}
              height={isMealsExpanded ? 140 : 10}
            />
          </View>
        )}

        {isMealsExpanded && (
          <View style={styles.addButtonRow}>
            <HuppyButton
              variant="addButton"
              width={140}
              height={30}
              imageName="add_round_orange.svg"
              imageSize={20}
              onPress={openAddFoodPage}
            >
              Add Food
            </HuppyButton>

            <HuppyButton
              variant="addButton"
              width={60}
              height={30}
              imageName="more_white.svg"
              imageSize={20}
              imageMargin={0}
              onPress={() => setMoreOpen(true)}
            />
          </View>
        )}
      </View>

      {/* "More" menu */}
      <Modal visible={isMoreOpen} transparent animationType="fade">
        <Pressable style={styles.menuBackdrop} onPress={() => setMoreOpen(false)}>
          <View style={styles.menu}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setIsCopyTo(false);
                setMoreOpen(false);
                setShowCopyDatePicker(true);
              }}
            >
              <Asset imageName="copy_green.svg" width={15} height={15} />
              <Text style={styles.menuItemText}>Copy from</Text>
            </Pressable>

            {foodItems.length > 0 && (
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setIsCopyTo(true);
                  setMoreOpen(false);
                  setShowCopyDatePicker(true);
                }}
              >
                <Asset imageName="copy_green.svg" width={15} height={15} />
                <Text style={styles.menuItemText}>Copy to</Text>
              </Pressable>
            )}

            {mealsCount > 1 && (
              <>
                <View style={styles.menuDivider} />
                <Pressable
                  style={styles.menuItem}
                  onPress={() => {
                    setMoreOpen(false);
                    deleteCurrentMeal();
                  }}
                >
                  <Asset imageName="delete_orange.svg" width={17} height={17} />
                  <Text style={[styles.menuItemText, { color: colors.orange }]}>
                    Delete meal
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </Pressable>
      </Modal>

      {showCopyDatePicker && (
        <DateTimePicker
          value={copyFromDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_event, selected) => {
            setShowCopyDatePicker(false);
            if (selected) {
              setCopyFromDate(selected);
              setCopyFromMealExpanded(true);
            }
          }}
        />
      )}

      {/* Edit food weight */}
      <BottomSheet
        open={!!editingFood}
        onDismiss={() => setEditingFood(null)}
      >
        <EditFoodSheet
          food={editingFood}
          onClose={() => setEditingFood(null)}
          onSave={(weight) => {
            if (editingFood) {
              updateFood({ foodId: editingFood._id, updateData: { weight } });
            }
            setEditingFood(null);
          }}
        />
      </BottomSheet>

      {/* Copy meal */}
      <BottomSheet
        open={isCopyFromMealExpanded}
        onDismiss={() => setCopyFromMealExpanded(false)}
      >
        <View style={styles.sheetRow}>
          <Asset
            imageName="close_round_green.svg"
            width={30}
            height={30}
            onPress={() => {
              setCopyFromMealExpanded(false);
              setCheckedMeals([]);
              setCheckedFoods([]);
            }}
          />
          <CustomDatePickerWithArrows
            value={copyFromDate}
            onChange={setCopyFromDate}
            backgroundColor={colors.white}
            disabled
          />
          <Asset
            imageName="add_round_orange.svg"
            width={30}
            height={30}
            onPress={
              checkedFoodsIds.length === 0
                ? undefined
                : () => {
                    copyMeal();
                    setCopyFromMealExpanded(false);
                  }
            }
          />
        </View>

        {isLoadingFoodForDate || isErrorFoodForDate ? (
          <View style={styles.placeholder}>
            <LoadingAndError
              isLoading={isLoadingFoodForDate}
              isError={isErrorFoodForDate}
            />
          </View>
        ) : getGroupedFood().length > 0 ? (
          <View>
            {getGroupedFood().map((group, groupIndex) => (
              <View key={group[0].mealId} style={styles.mealContainer}>
                <View style={styles.checkRow}>
                  <Checkbox
                    checked={checkedMealsIds.includes(group[0].mealId)}
                    onChange={(checked) =>
                      handleMealCheckboxChange(checked, group[0].mealId)
                    }
                  />
                  <Text style={styles.mealTitle}>{`Meal ${groupIndex + 1}`}</Text>
                </View>
                {group.map((item) => (
                  <View key={item._id} style={[styles.checkRow, styles.foodCheckRow]}>
                    <Checkbox
                      checked={checkedFoodsIds.includes(item._id)}
                      onChange={(checked) =>
                        handleFoodCheckboxChange(checked, item._id)
                      }
                    />
                    <Text style={styles.mealTitle}>{item.name}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Asset
              imageName="no_food_placeholder.png"
              width={200}
              height={140}
            />
          </View>
        )}
      </BottomSheet>
    </View>
  );
};

/** The web's ButtonSheetCopyMeal body: name, live calories, and a stepper. */
const EditFoodSheet: React.FC<{
  food: Food | null;
  onClose: () => void;
  onSave: (weight: number) => void;
}> = ({ food, onClose, onSave }) => {
  const [value, setValue] = useState(food?.weight ?? 0);

  useEffect(() => {
    setValue(food?.weight ?? 0);
  }, [food]);

  return (
    <View>
      <View style={styles.sheetSelection}>
        <Asset
          imageName="close_round_green.svg"
          width={30}
          height={30}
          onPress={onClose}
        />
        <Asset
          imageName="checkmark_orange.svg"
          width={25}
          height={25}
          onPress={() => onSave(value)}
        />
      </View>
      <Text style={styles.editFoodTitle}>{food?.name}</Text>
      <Text style={styles.editFoodCalories}>
        {`${Math.floor(((food?.calories ?? 0) / 100) * value)}, kcal`}
      </Text>
      <View style={styles.editTextFieldAndButtons}>
        <ButtonsAndTextField
          initialValue={value}
          onChange={setValue}
          onChangeButton={setValue}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: layout.radius,
    minWidth: 300,
    width: '100%',
  },
  // Meals.css.js headerStyle
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.brown,
    height: layout.sectionHeaderHeight,
    borderTopLeftRadius: layout.radius,
    borderTopRightRadius: layout.radius,
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerArrow: {
    marginTop: 3,
    marginRight: 20,
    marginLeft: 30,
  },
  heading: {
    color: colors.green,
    fontFamily: fontFamily.bold,
    fontSize: 16,
    marginRight: 10,
  },
  headerAddButton: {
    marginRight: 10,
  },
  bodyMeal: {
    flexDirection: 'column',
    width: '100%',
    backgroundColor: colors.grayBackground,
    borderBottomLeftRadius: layout.radius,
    borderBottomRightRadius: layout.radius,
  },
  column: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalWeightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  weightLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.black,
  },
  caloriesAndWeight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitCalories: {
    marginVertical: 5,
    fontFamily: fontFamily.bold,
    width: 50,
    fontSize: 12,
    color: colors.green,
    textAlign: 'center',
  },
  unitWeight: {
    marginVertical: 5,
    marginRight: 5,
    fontFamily: fontFamily.bold,
    width: 50,
    fontSize: 12,
    color: colors.green,
    textAlign: 'center',
  },
  caloriesTotal: {
    color: colors.orange,
    fontFamily: fontFamily.bold,
    width: 50,
    fontSize: 15,
    textAlign: 'center',
  },
  weightTotal: {
    marginRight: 5,
    fontFamily: fontFamily.bold,
    width: 50,
    fontSize: 15,
    color: colors.black,
    textAlign: 'center',
  },
  foodList: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 5,
    marginBottom: 10,
  },
  // .swiper: 10px radius, 5px margin
  foodSwipeContainer: {
    borderRadius: layout.radius,
    marginHorizontal: 5,
    marginTop: 5,
    overflow: 'hidden',
  },
  foodListRow: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  headerText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    height: 50,
  },
  headingFood: {
    color: colors.green,
    flex: 1,
    textAlign: 'left',
    fontFamily: fontFamily.bold,
    fontSize: 16,
  },
  caloriesValue: {
    color: colors.orange,
    textAlign: 'center',
    fontSize: 15,
    width: 50,
    fontFamily: fontFamily.regular,
  },
  weightValue: {
    color: colors.green,
    textAlign: 'center',
    fontSize: 15,
    width: 50,
    fontFamily: fontFamily.regular,
  },
  deleteAction: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.orange,
  },
  editAction: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGreen2,
  },
  placeholder: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 10,
  },
  addButtonRow: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: colors.grayBackground,
    borderRadius: 10,
    minWidth: 180,
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.green,
    marginLeft: 10,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.lightBrown,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  sheetSelection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  editFoodTitle: {
    textAlign: 'center',
    margin: 10,
    color: colors.green,
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  editFoodCalories: {
    textAlign: 'center',
    margin: 10,
    color: colors.orange,
    fontFamily: fontFamily.regular,
    fontSize: 16,
  },
  editTextFieldAndButtons: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  mealContainer: {
    borderWidth: 2,
    borderColor: colors.green,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 5,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodCheckRow: {
    marginLeft: 20,
  },
  mealTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.green,
  },
});

export default MealCard;
