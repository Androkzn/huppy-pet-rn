/**
 * Add Training Dialog — port of the web app's NewTrainingForm.component.js.
 *
 * The close button, the "Add Training" title, a Category dropdown, then either
 * the custom name/type fields or the Type dropdown for that category, a
 * description box, and the Add Training button.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput } from 'react-native';
import { useAddTraining } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import { useAuth } from '@contexts/AuthContext';
import { HuppyButton } from '@components/ui/Buttons';
import { TitleAndDropdown, TitleAndTextField } from '@components/ui/FormRows';
import {
  TrainingCategory,
  TrainingType,
  getTitleForTrainingCategory,
  getTitleForTrainingType,
  getTypesForTrainingCategory,
} from '@constants/enums';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';

interface AddTrainingDialogProps {
  visible: boolean;
  onDismiss: () => void;
  selectedDate?: Date;
}

const categoryOptions = Object.values(TrainingCategory).map((type) => ({
  rawValue: type,
  title: getTitleForTrainingCategory(type),
}));

export const AddTrainingDialog: React.FC<AddTrainingDialogProps> = ({
  visible,
  onDismiss,
  selectedDate = new Date(),
}) => {
  const { currentProfile } = useProfile();
  const { user } = useAuth();
  const { mutate: addTraining } = useAddTraining();

  const [form, setForm] = useState({
    category: TrainingCategory.OBEDIENCE as string,
    type: TrainingType.SIT as string,
    customCategory: '',
    customType: '',
    description: '',
  });

  const typeOptions = getTypesForTrainingCategory(form.category).map((type) => ({
    rawValue: type,
    title: getTitleForTrainingType(type),
  }));

  const handleCreate = () => {
    if (!currentProfile || !user) return;

    // A custom type under a named category inherits that category's title.
    let customCategory = form.customCategory;
    if (
      form.category !== TrainingCategory.CUSTOM &&
      form.type === TrainingType.CUSTOM
    ) {
      customCategory = getTitleForTrainingCategory(form.category);
    }

    addTraining({
      category: form.category,
      type: form.type,
      customCategory,
      customType: form.customType,
      desc: form.description,
      date: selectedDate,
      profileId: currentProfile._id,
      userId: user.id,
    } as any);
    onDismiss();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <View style={styles.closeButtonContainer}>
            <HuppyButton variant="circleTextButton" onPress={onDismiss}>
              x
            </HuppyButton>
          </View>

          <Text style={styles.title}>Add Training</Text>

          <TitleAndDropdown
            title="Category"
            initialValue={form.category}
            dropdownOptions={categoryOptions}
            onChange={(value) =>
              setForm({
                ...form,
                category: value,
                type: getTypesForTrainingCategory(value)[0],
              })
            }
          />

          {form.category === TrainingCategory.CUSTOM ? (
            <View>
              <Text style={styles.subtitle}>Add your custom training:</Text>
              <TitleAndTextField
                title="Name"
                onChange={(value) => setForm({ ...form, customCategory: value })}
              />
              <TitleAndTextField
                title="Type"
                onChange={(value) => setForm({ ...form, customType: value })}
              />
            </View>
          ) : form.type === TrainingType.CUSTOM ? (
            <View>
              <TitleAndDropdown
                title="Type"
                initialValue={form.type}
                dropdownOptions={typeOptions}
                onChange={(value) => setForm({ ...form, type: value })}
              />
              <TitleAndTextField
                title="Name"
                onChange={(value) => setForm({ ...form, customType: value })}
              />
            </View>
          ) : (
            <TitleAndDropdown
              title="Type"
              initialValue={form.type}
              dropdownOptions={typeOptions}
              onChange={(value) => setForm({ ...form, type: value })}
            />
          )}

          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionTitle}>Add Description</Text>
            <TextInput
              style={styles.descriptionInput}
              multiline
              value={form.description}
              onChangeText={(value) => setForm({ ...form, description: value })}
            />
          </View>

          <View style={styles.buttonContainer}>
            <HuppyButton variant="rectangleTextButton" onPress={handleCreate}>
              Add Training
            </HuppyButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    maxWidth: 450,
    minWidth: 250,
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
  },
  closeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title: {
    textAlign: 'center',
    color: colors.lightGreen,
    fontSize: 20,
    fontFamily: fontFamily.bold,
    marginVertical: 20,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.lightGreen,
    fontSize: 16,
    fontFamily: fontFamily.bold,
    marginVertical: 10,
  },
  descriptionBox: {
    borderRadius: 10,
    backgroundColor: colors.lightBrown,
    margin: 3,
    padding: 10,
  },
  descriptionTitle: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: colors.black,
    marginBottom: 5,
  },
  descriptionInput: {
    minHeight: 60,
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: 10,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});
