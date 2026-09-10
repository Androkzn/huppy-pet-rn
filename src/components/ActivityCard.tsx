/**
 * ActivityCard — one logged activity in the day's diary.
 *
 * Two rows on a grouped surface: what the activity was and what it burned, then
 * the metric and its amount on a stepper. Swiping left removes it, the way Mail
 * and Reminders delete a row.
 *
 * The calorie arithmetic and the mutations are the ones the app already used;
 * only the presentation is the system's.
 */

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useDeleteActivity, useUpdateActivity } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Asset } from './ui/Asset';
import { Dropdown } from './ui/Dropdown';
import { Icon } from './ios/Icon';
import { Label } from './ios/Text';
import { Stepper } from './ios/Stepper';
import {
  ActivityType,
  ActivityMetric,
  getTitleForActivityType,
  getTitleForActivityMetric,
} from '@constants/enums';
import type { Activity } from '../types';

const activityTypeOptions = Object.values(ActivityType).map((type) => ({
  rawValue: type,
  title: getTitleForActivityType(type),
}));

const activityMetricOptions = Object.values(ActivityMetric).map((metric) => ({
  rawValue: metric,
  title: getTitleForActivityMetric(metric),
}));

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { currentProfile } = useProfile();
  const { colors } = useAppTheme();
  const { mutate: deleteActivity } = useDeleteActivity();
  const { mutate: updateActivity } = useUpdateActivity();

  const isDistance = activity.metric === ActivityMetric.DISTANCE;
  const value = isDistance ? activity.distance : activity.duration;
  // Distance steps by 1km, duration by 10min.
  const step = isDistance ? 1 : 10;

  const getCaloriesBurnedFor = (amount: number) => {
    const weight = currentProfile?.weight ?? 0;
    return isDistance
      ? Math.floor(weight * amount * 0.8)
      : Math.floor(amount * 2);
  };

  const updateCurrentActivity = (newValue: number) => {
    updateActivity({
      activityId: activity._id,
      updateData: {
        burnedCalories: getCaloriesBurnedFor(newValue),
        [isDistance ? 'distance' : 'duration']: newValue,
      },
    });
  };

  const confirmDelete = () => {
    haptics.warning();
    Alert.alert(
      `Remove this ${getTitleForActivityType(activity.type).toLowerCase()}?`,
      undefined,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteActivity(activity._id),
        },
      ]
    );
  };

  return (
    <Swipeable
      containerStyle={styles.swipeContainer}
      friction={1.6}
      overshootLeft={false}
      renderLeftActions={() => (
        <View style={[styles.swipeAction, { backgroundColor: colors.red }]}>
          <Icon name="trash" size={20} color={colors.onTint} />
        </View>
      )}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') confirmDelete();
      }}
    >
      <View style={[styles.card, { backgroundColor: colors.groupedSurface }]}>
        {/* What it was, and what it burned. */}
        <View style={styles.row}>
          <View style={[styles.iconTile, { backgroundColor: colors.tintSoft }]}>
            <Asset
              imageName={`activity_${activity.type}.svg`}
              width={24}
              height={24}
            />
          </View>

          <View style={styles.rowLabel}>
            <Dropdown
              value={activity.type}
              label="Activity"
              options={activityTypeOptions}
              onChange={(newValue) =>
                updateActivity({
                  activityId: activity._id,
                  updateData: { type: newValue.toLowerCase() },
                })
              }
              style={styles.typeDropdown}
            />
            <Label variant="footnote" role="secondary">
              {`${getCaloriesBurnedFor(value)} kcal burned`}
            </Label>
          </View>
        </View>

        <View
          style={[
            styles.separator,
            { backgroundColor: colors.separator, height: layout.hairline },
          ]}
        />

        {/* How it is measured, and how much of it. */}
        <View style={styles.row}>
          <Dropdown
            value={activity.metric}
            label="Metric"
            options={activityMetricOptions}
            onChange={(newValue) =>
              updateActivity({
                activityId: activity._id,
                updateData: { metric: newValue },
              })
            }
            style={styles.metricDropdown}
          />
          <Stepper
            value={value}
            step={step}
            min={0}
            onChange={updateCurrentActivity}
            onStep={updateCurrentActivity}
            style={styles.stepper}
          />
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  swipeContainer: {
    // Each activity is its own card in the list, inset like a grouped section.
    marginHorizontal: layout.screenPadding,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  card: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    minHeight: 56,
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
    gap: 2,
  },
  typeDropdown: {
    alignSelf: 'flex-start',
  },
  metricDropdown: {
    flex: 1,
  },
  stepper: {
    marginLeft: 'auto',
  },
  separator: {
    marginLeft: layout.screenPadding,
  },
  swipeAction: {
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ActivityCard;
