/**
 * Add Activity Dialog
 * Add activity (walk, run, play) with duration/distance
 */

import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Modal, Portal, useTheme } from 'react-native-paper';
import { Title, Body, Button, TextInput, RadioButton } from '@components/ui';
import { useAddActivity } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddActivityDialogProps {
  visible: boolean;
  onDismiss: () => void;
  selectedDate?: Date;
}

const ACTIVITY_TYPES = [
  { value: 'walk', label: 'Walk' },
  { value: 'run', label: 'Run' },
  { value: 'play', label: 'Play' },
];

export const AddActivityDialog: React.FC<AddActivityDialogProps> = ({
  visible,
  onDismiss,
  selectedDate = new Date(),
}) => {
  const theme = useTheme();
  const { currentProfile } = useProfile();
  const { mutate: addActivity, isLoading } = useAddActivity();

  const [activityType, setActivityType] = useState('walk');
  const [duration, setDuration] = useState('30');
  const [distance, setDistance] = useState('2');
  const [date, setDate] = useState(selectedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddActivity = () => {
    if (!currentProfile) return;

    const durationNum = parseFloat(duration) || 0;
    const distanceNum = parseFloat(distance) || 0;

    // Simple calorie calculation
    const caloriesPerMinute = activityType === 'run' ? 10 : activityType === 'walk' ? 5 : 7;
    const burnedCalories = Math.round(durationNum * caloriesPerMinute);

    addActivity(
      {
        userId: currentProfile.userId,
        profileId: currentProfile._id,
        type: activityType,
        duration: durationNum,
        distance: distanceNum,
        burnedCalories,
        date,
      },
      {
        onSuccess: () => {
          onDismiss();
          setActivityType('walk');
          setDuration('30');
          setDistance('2');
        },
      }
    );
  };

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
        <Title style={styles.title}>Add Activity</Title>

        <Body style={styles.label}>Activity Type</Body>
        <RadioButton.Group onValueChange={setActivityType} value={activityType}>
          {ACTIVITY_TYPES.map((type) => (
            <RadioButton.Item
              key={type.value}
              label={type.label}
              value={type.value}
              disabled={isLoading}
            />
          ))}
        </RadioButton.Group>

        <TextInput
          label="Duration (minutes)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          disabled={isLoading}
          style={styles.input}
        />

        {(activityType === 'walk' || activityType === 'run') && (
          <TextInput
            label="Distance (km)"
            value={distance}
            onChangeText={setDistance}
            keyboardType="numeric"
            disabled={isLoading}
            style={styles.input}
          />
        )}

        <Button onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          {date.toLocaleDateString()}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) setDate(selectedDate);
            }}
            maximumDate={new Date()}
          />
        )}

        <View style={styles.actions}>
          <Button onPress={onDismiss} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleAddActivity}
            loading={isLoading}
            disabled={isLoading}
          >
            Add
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    marginBottom: 12,
  },
  dateButton: {
    marginVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
});
