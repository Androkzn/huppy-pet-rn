/**
 * FoodCard — port of the web app's FoodCard.component.js.
 *
 * A search result row: the category icon, the food name, its calories, a paw
 * badge on custom entries, and a green arrow. Custom entries can be swiped —
 * left to delete the template, right to edit it.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useNavigation } from '@react-navigation/native';
import { useDeleteFoodTemplate } from '@hooks/useGraphQL';
import * as colors from '../theme/colors';
import { fontFamily } from '../theme';
import { Asset } from './ui/Asset';
import type { FoodTemplate } from '../types';

interface FoodCardProps {
  food: FoodTemplate;
  openAddFoodPage: (food: FoodTemplate) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, openAddFoodPage }) => {
  const navigation = useNavigation<any>();
  const { mutate: deleteFoodTemplate } = useDeleteFoodTemplate();

  const body = (
    <View style={styles.header}>
      <Pressable
        style={styles.nameContainer}
        onPress={() => openAddFoodPage(food)}
      >
        {!!food.categoryType && (
          <View style={styles.foodIconContainer}>
            <Asset
              imageName={`${food.categoryType}.png`}
              width={25}
              height={25}
            />
          </View>
        )}
        <Text style={styles.textTitle}>{food.name}</Text>
        <Text style={styles.textCalories}>{food.calories} kcal</Text>
      </Pressable>

      {food.isCustom && (
        <View style={styles.buttonsContainer}>
          <View style={styles.customContainer}>
            <Asset imageName="paw_white.png" width={20} height={20} />
          </View>
        </View>
      )}

      <Asset
        imageName="arrow_right_green.svg"
        width={20}
        height={20}
        onPress={() => openAddFoodPage(food)}
      />
    </View>
  );

  // Only custom templates are swipeable on the web's small-screen layout.
  if (!food.isCustom) {
    return <View style={styles.mainContainer}>{body}</View>;
  }

  return (
    <View style={styles.mainContainer}>
      <Swipeable
        containerStyle={styles.swipeContainer}
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
            Alert.alert('', 'Do you really want to delete this food?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'OK', onPress: () => deleteFoodTemplate(food._id) },
            ]);
          } else {
            Alert.alert('', 'Do you want to edit this food?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'OK',
                onPress: () =>
                  navigation.navigate('EditFood', { foodId: food._id }),
              },
            ]);
          }
        }}
      >
        {body}
      </Swipeable>
    </View>
  );
};

const styles = StyleSheet.create({
  // AddFoodCard.css.js mainConteinerStyle
  mainContainer: {
    alignItems: 'center',
    marginTop: 5,
    borderRadius: 10,
    width: '100%',
    backgroundColor: colors.lightBrown,
  },
  // .swiper-food
  swipeContainer: {
    borderRadius: 10,
    margin: 5,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    width: '100%',
    minHeight: 50,
    backgroundColor: colors.lightBrown2,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  foodIconContainer: {
    height: 25,
    marginHorizontal: 5,
  },
  textTitle: {
    flex: 1,
    padding: 5,
    textAlign: 'left',
    fontSize: 15,
    color: colors.green,
    fontFamily: fontFamily.bold,
  },
  textCalories: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.orange,
    padding: 5,
    minWidth: 65,
    fontFamily: fontFamily.regular,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  customContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: colors.lightGreen2,
    marginRight: 5,
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
});

export default FoodCard;
