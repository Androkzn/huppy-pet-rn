/**
 * FoodCard — one food in the search results.
 *
 * A grouped list row: the category's artwork, the food's name with its energy
 * underneath, and a disclosure chevron. Food the user created carries a small
 * tinted paw so their own entries are recognisable, and only those rows swipe —
 * left to delete the template, right to edit it.
 */

import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useNavigation } from '@react-navigation/native';
import { useDeleteFoodTemplate } from '@hooks/useGraphQL';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Asset } from './ui/Asset';
import { Icon } from './ios/Icon';
import { Label } from './ios/Text';
import type { FoodTemplate } from '../types';

interface FoodCardProps {
  food: FoodTemplate;
  openAddFoodPage: (food: FoodTemplate) => void;
  /** Hides the separator on the last row of a group. */
  last?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  openAddFoodPage,
  last = false,
}) => {
  const navigation = useNavigation<any>();
  const { colors } = useAppTheme();
  const { mutate: deleteFoodTemplate } = useDeleteFoodTemplate();

  const row = (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${food.name}, ${food.calories} kcal`}
        onPress={() => {
          haptics.light();
          openAddFoodPage(food);
        }}
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: colors.groupedSurface },
          pressed && styles.pressed,
        ]}
      >
        {food.categoryType ? (
          <View style={[styles.iconTile, { backgroundColor: colors.tintSoft }]}>
            <Asset
              imageName={`${food.categoryType}.png`}
              width={22}
              height={22}
            />
          </View>
        ) : null}

        <View style={styles.rowLabel}>
          <Label variant="body" numberOfLines={1}>
            {food.name}
          </Label>
          <Label variant="footnote" role="secondary">
            {`${food.calories} kcal / 100 g`}
          </Label>
        </View>

        {food.isCustom ? (
          <View style={[styles.badge, { backgroundColor: colors.tintSoft }]}>
            <Asset imageName="paw_white.png" width={13} height={13} />
          </View>
        ) : null}

        <Icon name="chevron.right" size={13} weight="semibold" color={colors.tertiaryLabel} />
      </Pressable>

      {last ? null : (
        <View
          style={[
            styles.separator,
            { backgroundColor: colors.separator, height: layout.hairline },
          ]}
        />
      )}
    </>
  );

  // Only the user's own food can be edited or deleted.
  if (!food.isCustom) return row;

  return (
    <Swipeable
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
          Alert.alert(`Delete ${food.name}?`, 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => deleteFoodTemplate(food._id),
            },
          ]);
        } else {
          haptics.light();
          navigation.navigate('EditFood', { foodId: food._id });
        }
      }}
    >
      {row}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.sm,
    minHeight: 56,
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: radius.xs,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    gap: 1,
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: radius.capsule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    marginLeft: layout.screenPadding + 34 + spacing.md,
  },
  swipeAction: {
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});

export default FoodCard;
