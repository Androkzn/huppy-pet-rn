/**
 * Edit Training Dialog
 * Edit or delete existing training session
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Portal, Modal, useTheme } from 'react-native-paper';
import { Title, Body, Button, TextInput, RadioButton } from '@components/ui';
import { useUpdateTraining, useDeleteTraining } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import type { Training } from '../../types';

interface EditTrainingDialogProps {
  visible: boolean;
  onDismiss: () => void;
  training: Training | null;
}

export const EditTrainingDialog: React.FC<EditTrainingDialogProps> = ({
  visible,
  onDismiss,
  training,
}) => {
  const theme = useTheme();
  const { currentProfile } = useProfile();

  const [category, setCategory] = useState('obedience');
  const [notes, setNotes] = useState('');

  const { mutate: updateTraining, isLoading: isUpdating } = useUpdateTraining();
  const { mutate: deleteTraining, isLoading: isDeleting } = useDeleteTraining();

  const isLoading = isUpdating || isDeleting;

  useEffect(() => {
    if (training) {
      setCategory(training.category || 'obedience');
      setNotes(training.desc || '');
    }
  }, [training]);

  const handleUpdateTraining = () => {
    if (!training || !currentProfile) return;

    updateTraining(
      {
        trainingId: training._id,
        updateData: {
          category,
          desc: notes.trim(),
          type: category,
        },
      },
      {
        onSuccess: () => {
          onDismiss();
        },
        onError: (error: any) => {
          Alert.alert('Error', error?.message || 'Failed to update training');
        },
      }
    );
  };

  const handleDeleteTraining = () => {
    if (!training) return;

    Alert.alert(
      'Delete Training',
      'Are you sure you want to delete this training session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTraining(training._id, {
              onSuccess: () => {
                onDismiss();
              },
              onError: (error: any) => {
                Alert.alert('Error', error?.message || 'Failed to delete training');
              },
            });
          },
        },
      ]
    );
  };

  if (!training) return null;

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
          <Title style={styles.title}>Edit Training</Title>

          {/* Training Category */}
          <Body style={styles.label}>Training Category</Body>
          <RadioButton.Group onValueChange={setCategory} value={category}>
            <View style={styles.radioContainer}>
              <RadioButton.Item label="Obedience" value="obedience" />
              <RadioButton.Item label="Tricks" value="tricks" />
              <RadioButton.Item label="Agility" value="agility" />
              <RadioButton.Item label="Socialization" value="socialization" />
            </View>
          </RadioButton.Group>

          {/* Notes */}
          <TextInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          {/* Buttons */}
          <Button
            mode="contained"
            onPress={handleUpdateTraining}
            loading={isUpdating}
            disabled={isLoading}
            style={styles.button}
          >
            Update Training
          </Button>

          <Button
            mode="outlined"
            onPress={handleDeleteTraining}
            disabled={isLoading}
            style={styles.button}
          >
            Delete Training
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
