/**
 * TrainingCard — one training session in the day's list.
 *
 * A grouped row: the category's artwork, what is being trained, and a check
 * that marks it done — the shape iOS uses for a checklist. Completed work is
 * stated by a filled tint check and a struck-through title rather than by
 * recolouring the whole row, so the list stays quiet as items are finished.
 *
 * Swiping left removes the session; swiping right toggles it, as before.
 */

import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useDeleteTraining, useUpdateTraining } from '@hooks/useGraphQL';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Asset } from './ui/Asset';
import { Icon } from './ios/Icon';
import { Label } from './ios/Text';
import {
  getTitleForTrainingCategory,
  getTitleForTrainingType,
} from '@constants/enums';
import type { Training } from '../types';

interface TrainingCardProps {
  training: Training;
  /** Hides the separator on the last row of a group. */
  last?: boolean;
}

export const TrainingCard: React.FC<TrainingCardProps> = ({
  training,
  last = false,
}) => {
  const { colors } = useAppTheme();
  const { mutate: deleteTraining } = useDeleteTraining();
  const { mutate: updateTraining } = useUpdateTraining();

  const isCustom =
    (training.customCategory?.length ?? 0) > 0 &&
    (training.customType?.length ?? 0) > 0;

  const category = isCustom
    ? training.customCategory
    : getTitleForTrainingCategory(training.category);
  const type = isCustom
    ? training.customType
    : getTitleForTrainingType(training.type);

  const toggleCompleted = () => {
    haptics.light();
    updateTraining({
      trainingId: training._id,
      updateData: { isCompleted: !training.isCompleted },
    });
  };

  const confirmDelete = () => {
    haptics.warning();
    Alert.alert(`Remove ${category}?`, undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => deleteTraining(training._id),
      },
    ]);
  };

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
          <Icon
            name={training.isCompleted ? "arrow.uturn.backward" : "checkmark"}
            size={20}
            color={colors.onTint}
          />
        </View>
      )}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') {
          confirmDelete();
        } else {
          toggleCompleted();
        }
      }}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: training.isCompleted }}
        accessibilityLabel={`${category}, ${type}`}
        onPress={toggleCompleted}
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: colors.groupedSurface },
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.iconTile, { backgroundColor: colors.tintSoft }]}>
          <Asset
            imageName={`training_${training.category}.svg`}
            width={24}
            height={24}
          />
        </View>

        <View style={styles.rowLabel}>
          <Label
            variant="body"
            numberOfLines={1}
            role={training.isCompleted ? 'secondary' : 'primary'}
            style={training.isCompleted ? styles.completedTitle : undefined}
          >
            {category}
          </Label>
          <Label variant="footnote" role="secondary" numberOfLines={1}>
            {type}
          </Label>
        </View>

        <Icon
          name={training.isCompleted ? 'checkmark.circle.fill' : 'circle'}
          size={22}
          color={training.isCompleted ? colors.tint : colors.tertiaryLabel}
          fallbackAsset={
            training.isCompleted ? 'checkmark_orange.svg' : undefined
          }
        />
      </Pressable>

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
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    minHeight: 60,
  },
  iconTile: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    gap: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  separator: {
    marginLeft: layout.screenPadding + 38 + spacing.md,
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

export default TrainingCard;
