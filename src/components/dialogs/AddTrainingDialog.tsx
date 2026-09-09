/**
 * Add Training Dialog
 * Add training session with category and duration
 */

import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Modal, Portal, useTheme } from 'react-native-paper';
import { Title, Body, Button, TextInput, RadioButton } from '@components/ui';
import { useAddTraining } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddTrainingDialogProps {
  visible: boolean;
  onDismiss: () => void;
  selectedDate?: Date;
}

const TRAINING_CATEGORIES = [
  { value: 'obedience', label: 'Obedience' },
  { value: 'tricks', label: 'Tricks' },
  { value: 'agility', label: 'Agility' },
  { value: 'socialization', label: 'Socialization' },
];

export const AddTrainingDialog: React.FC<AddTrainingDialogProps> = ({
  visible,
  onDismiss,
  selectedDate = new Date(),
}) => {
  const theme = useTheme();
  const { currentProfile } = useProfile();
  const { mutate: addTraining, isLoading } = useAddTraining();

  const [category, setCategory] = useState('obedience');
  const [duration, setDuration] = useState('30');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddTraining = () => {
    if (!currentProfile) return;

    const durationNum = parseFloat(duration) || 0;

    addTraining(
      {
        userId: currentProfile.userId,
        profileId: currentProfile._id,
        category,
        desc: notes.trim(),
        isCompleted: false,
        type: category,
        customCategory: '',
        customType: '',
        date,
      },
      {
        onSuccess: () => {
          onDismiss();
          setCategory('obedience');
          setDuration('30');
          setNotes('');
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
        <Title style={styles.title}>Add Training Session</Title>

        <Body style={styles.label}>Category</Body>
        <RadioButton.Group onValueChange={setCategory} value={category}>
          {TRAINING_CATEGORIES.map((cat) => (
            <RadioButton.Item
              key={cat.value}
              label={cat.label}
              value={cat.value}
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

        <TextInput
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          disabled={isLoading}
          style={styles.input}
        />

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
            onPress={handleAddTraining}
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
