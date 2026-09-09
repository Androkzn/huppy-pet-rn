/**
 * TrainingCard — port of the web app's TrainingCard.component.js
 * (its small-screen branch): a 60px row that turns lightGreen2 with a trophy
 * once completed, swiped right to toggle and left to delete.
 */

import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useDeleteTraining, useUpdateTraining } from '@hooks/useGraphQL';
import * as colors from '../theme/colors';
import { fontFamily } from '../theme';
import { Asset } from './ui/Asset';
import {
  getTitleForTrainingCategory,
  getTitleForTrainingType,
} from '@constants/enums';
import type { Training } from '../types';

interface TrainingCardProps {
  training: Training;
}

export const TrainingCard: React.FC<TrainingCardProps> = ({ training }) => {
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

  const toggleCompleted = () =>
    updateTraining({
      trainingId: training._id,
      updateData: { isCompleted: !training.isCompleted },
    });

  return (
    <Swipeable
      containerStyle={styles.swipeContainer}
      renderLeftActions={() => (
        <View style={styles.deleteAction}>
          <Asset imageName="delete_white.svg" width={25} height={25} />
        </View>
      )}
      renderRightActions={() => (
        <View
          style={[
            styles.checkAction,
            {
              backgroundColor: training.isCompleted
                ? colors.brown
                : colors.lightGreen2,
            },
          ]}
        >
          <Asset
            imageName={
              training.isCompleted ? 'cancel_green.svg' : 'checkmark_white.svg'
            }
            width={20}
            height={20}
          />
        </View>
      )}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') {
          Alert.alert('', 'Do you really want to delete this item ?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: () => deleteTraining(training._id) },
          ]);
        } else {
          toggleCompleted();
        }
      }}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: training.isCompleted
              ? colors.lightGreen2
              : colors.lightBrown2,
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Asset
            imageName={`training_${training.category}.svg`}
            width={40}
            height={40}
          />
        </View>

        <View style={styles.column}>
          <Text style={styles.textTitle}>{category}</Text>
          <Text style={styles.text}>{type}</Text>
        </View>

        {training.isCompleted && (
          <Asset imageName="trophy.svg" width={35} height={35} />
        )}
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  swipeContainer: {
    borderRadius: 10,
    margin: 5,
    overflow: 'hidden',
  },
  deleteAction: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.orange,
  },
  checkAction: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 60,
  },
  iconContainer: {
    minWidth: '20%',
    marginLeft: 5,
    alignItems: 'center',
  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
  textTitle: {
    paddingTop: 10,
    paddingHorizontal: 5,
    textAlign: 'left',
    fontSize: 17,
    color: colors.green,
    fontFamily: fontFamily.bold,
  },
  text: {
    padding: 5,
    textAlign: 'left',
    fontSize: 15,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
});

export default TrainingCard;
