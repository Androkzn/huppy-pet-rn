/**
 * ActivityCard — port of the web app's ActivityCard.component.js.
 *
 * An 80px header (icon, activity-type dropdown, burned calories) over a 60px
 * body (metric dropdown, minus / value / plus), both on lightBrown2, wrapped in
 * a left-swipe-to-delete container.
 */

import React from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useDeleteActivity, useUpdateActivity } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import * as colors from '../theme/colors';
import { fontFamily } from '../theme';
import { Asset } from './ui/Asset';
import { HuppyButton } from './ui/Buttons';
import { Dropdown } from './ui/Dropdown';
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
  const { mutate: deleteActivity } = useDeleteActivity();
  const { mutate: updateActivity } = useUpdateActivity();

  const getActivityValue = () =>
    activity.metric === ActivityMetric.DISTANCE
      ? activity.distance
      : activity.duration;

  // Distance steps by 1km, duration by 10min — as on the web.
  const changeStep = activity.metric === ActivityMetric.DISTANCE ? 1 : 10;

  const getCaloriesBurnedFor = (value: number) => {
    const weight = currentProfile?.weight ?? 0;
    return activity.metric === ActivityMetric.DISTANCE
      ? Math.floor(weight * value * 0.8)
      : Math.floor(value * 2);
  };

  const updateCurrentActivity = (newValue: number) => {
    updateActivity({
      activityId: activity._id,
      updateData: {
        burnedCalories: getCaloriesBurnedFor(newValue),
        [activity.metric === ActivityMetric.DISTANCE ? 'distance' : 'duration']:
          newValue,
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert('', 'Do you really want to delete this item ?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: () => deleteActivity(activity._id) },
    ]);
  };

  return (
    <Swipeable
      containerStyle={styles.swipeContainer}
      renderLeftActions={() => (
        <View style={styles.deleteAction}>
          <Asset imageName="delete_white.svg" width={25} height={25} />
        </View>
      )}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') confirmDelete();
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Asset
            imageName={`activity_${activity.type}.svg`}
            width={40}
            height={40}
          />
        </View>
        <View style={styles.headerColumn}>
          <View style={styles.topRow}>
            <Dropdown
              value={activity.type}
              options={activityTypeOptions}
              onChange={(value) =>
                updateActivity({
                  activityId: activity._id,
                  updateData: { type: value.toLowerCase() },
                })
              }
            />
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.burned}>
              Burned calories: {getCaloriesBurnedFor(getActivityValue())} kcal
            </Text>
          </View>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.bodyRow}>
          <Dropdown
            value={activity.metric}
            options={activityMetricOptions}
            onChange={(value) =>
              updateActivity({
                activityId: activity._id,
                updateData: { metric: value },
              })
            }
          />

          <View style={styles.stepper}>
            <HuppyButton
              variant="circleTextButton"
              onPress={() =>
                updateCurrentActivity(Math.max(0, getActivityValue() - changeStep))
              }
            >
              -
            </HuppyButton>
            <TextInput
              style={styles.inputField}
              value={String(getActivityValue())}
              keyboardType="number-pad"
              onChangeText={(text) =>
                updateCurrentActivity(text === '' ? 0 : parseInt(text, 10) || 0)
              }
            />
            <HuppyButton
              variant="circleTextButton"
              onPress={() =>
                updateCurrentActivity(getActivityValue() + changeStep)
              }
            >
              +
            </HuppyButton>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  // .swiper-activity: 10px radius, 5px margins
  swipeContainer: {
    borderRadius: 10,
    margin: 5,
    overflow: 'hidden',
  },
  deleteAction: {
    backgroundColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 80,
    backgroundColor: colors.lightBrown2,
  },
  iconContainer: {
    width: '20%',
    alignItems: 'center',
  },
  headerColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  burned: {
    color: colors.orange,
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  body: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    backgroundColor: colors.lightBrown2,
  },
  bodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginLeft: 10,
    paddingRight: 10,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    borderWidth: 2,
    borderColor: colors.grayDark,
    width: 40,
    textAlign: 'center',
    marginHorizontal: 15,
    borderRadius: 10,
    height: 30,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
});

export default ActivityCard;
