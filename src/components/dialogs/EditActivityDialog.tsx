/**
 * Edit Activity Dialog
 * Edit or delete existing activity
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Portal, Modal, useTheme, RadioButton as PaperRadioButton } from 'react-native-paper';
import { Title, Body, Button, TextInput, RadioButton } from '@components/ui';
import { useUpdateActivity, useDeleteActivity } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import type { Activity } from '../../types';

interface EditActivityDialogProps {
  visible: boolean;
  onDismiss: () => void;
  activity: Activity | null;
}

export const EditActivityDialog: React.FC<EditActivityDialogProps> = ({
  visible,
  onDismiss,
  activity,
}) => {
  const theme = useTheme();
  const { currentProfile } = useProfile();

  const [activityType, setActivityType] = useState('walk');
  const [duration, setDuration] = useState('30');
  const [distance, setDistance] = useState('');

  const { mutate: updateActivity, isLoading: isUpdating } = useUpdateActivity();
  const { mutate: deleteActivity, isLoading: isDeleting } = useDeleteActivity();

  const isLoading = isUpdating || isDeleting;

  useEffect(() => {
    if (activity) {
      setActivityType(activity.type || 'walk');
      setDuration(String(activity.duration || 30));
      setDistance(String(activity.distance || ''));
    }
  }, [activity]);

  const handleUpdateActivity = () => {
    if (!activity || !currentProfile) return;

    const durationNum = parseFloat(duration);
    const distanceNum = parseFloat(distance) || 0;

    if (!durationNum || durationNum <= 0) {
      Alert.alert('Error', 'Please enter a valid duration');
      return;
    }

    const caloriesPerMinute = activityType === 'run' ? 10 : activityType === 'walk' ? 5 : 7;
    const burnedCalories = Math.round(durationNum * caloriesPerMinute);

    updateActivity(
      {
        activityId: activity._id,
        updateData: {
          type: activityType,
          duration: durationNum,
          distance: distanceNum,
          burnedCalories,
        },
      },
      {
        onSuccess: () => {
          onDismiss();
        },
        onError: (error: any) => {
          Alert.alert('Error', error?.message || 'Failed to update activity');
        },
      }
    );
  };

  const handleDeleteActivity = () => {
    if (!activity) return;

    Alert.alert(
      'Delete Activity',
      'Are you sure you want to delete this activity?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteActivity(activity._id, {
              onSuccess: () => {
                onDismiss();
              },
              onError: (error: any) => {
                Alert.alert('Error', error?.message || 'Failed to delete activity');
              },
            });
          },
        },
      ]
    );
  };

  if (!activity) return null;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modal,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <ScrollView style={styles.scrollView}>
          <Title style={styles.title}>Edit Activity</Title>

          {/* Activity Type */}
          <Body style={styles.label}>Activity Type</Body>
          <RadioButton.Group onValueChange={setActivityType} value={activityType}>
            <View style={styles.radioContainer}>
              <RadioButton.Item label="Walk" value="walk" />
              <RadioButton.Item label="Run" value="run" />
              <RadioButton.Item label="Play" value="play" />
            </View>
          </RadioButton.Group>

          {/* Duration */}
          <TextInput
            label="Duration (minutes) *"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            style={styles.input}
          />

          {/* Distance (optional for walk/run) */}
          {(activityType === 'walk' || activityType === 'run') && (
            <TextInput
              label="Distance (km)"
              value={distance}
              onChangeText={setDistance}
              keyboardType="numeric"
              style={styles.input}
            />
          )}

          {/* Buttons */}
          <Button
            mode="contained"
            onPress={handleUpdateActivity}
            loading={isUpdating}
            disabled={isLoading}
            style={styles.button}
          >
            Update Activity
          </Button>

          <Button
            mode="outlined"
            onPress={handleDeleteActivity}
            disabled={isLoading}
            style={styles.button}
          >
            Delete Activity
          </Button>

          <Button
            mode="text"
            onPress={onDismiss}
            disabled={isLoading}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  scrollView: {
    maxHeight: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 8,
  },
  radioContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
  },
  cancelButton: {
    marginTop: 4,
  },
});
