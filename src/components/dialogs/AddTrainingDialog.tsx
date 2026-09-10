/**
 * Add Training — a sheet for planning a training session.
 *
 * Category and type in a grouped list, with the custom-name fields appearing
 * only where they apply, and a free-text note at the end. Cancel and Add sit in
 * the sheet's toolbar, as iOS puts them.
 */

import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useAddTraining } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import { useAuth } from '@contexts/AuthContext';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, spacing, textStyles } from '@theme/tokens';
import { Sheet } from '@components/ios/Sheet';
import { Label } from '@components/ios/Text';
import {
  FormGroup,
  TitleAndDropdown,
  TitleAndTextField,
} from '@components/ui/FormRows';
import {
  TrainingCategory,
  TrainingType,
  getTitleForTrainingCategory,
  getTitleForTrainingType,
  getTypesForTrainingCategory,
} from '@constants/enums';

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
  const { colors } = useAppTheme();
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

  const isCustomCategory = form.category === TrainingCategory.CUSTOM;
  const isCustomType = form.type === TrainingType.CUSTOM;

  const handleCreate = () => {
    if (!currentProfile || !user) return;

    // A custom type under a named category inherits that category's title.
    let customCategory = form.customCategory;
    if (!isCustomCategory && isCustomType) {
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
    <Sheet
      open={visible}
      onDismiss={onDismiss}
      title="Add training"
      confirmLabel="Add"
      onConfirm={handleCreate}
    >
      <View style={styles.body}>
        <FormGroup>
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

          {isCustomCategory ? (
            <TitleAndTextField
              title="Name"
              placeholder="What are you training?"
              onChange={(value) => setForm({ ...form, customCategory: value })}
            />
          ) : (
            <TitleAndDropdown
              title="Type"
              initialValue={form.type}
              dropdownOptions={typeOptions}
              onChange={(value) => setForm({ ...form, type: value })}
            />
          )}

          {isCustomCategory || isCustomType ? (
            <TitleAndTextField
              title={isCustomCategory ? 'Type' : 'Name'}
              placeholder="Add a name"
              onChange={(value) => setForm({ ...form, customType: value })}
            />
          ) : null}
        </FormGroup>

        <View style={styles.noteGroup}>
          <Label variant="footnote" role="secondary" sectionHeader style={styles.noteHeader}>
            Note
          </Label>
          <TextInput
            style={[
              styles.note,
              { backgroundColor: colors.groupedSurface, color: colors.label },
            ]}
            multiline
            placeholder="What to work on, how it went…"
            placeholderTextColor={colors.tertiaryLabel}
            selectionColor={colors.tint}
            value={form.description}
            onChangeText={(value) => setForm({ ...form, description: value })}
          />
        </View>
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: spacing.xl,
    paddingBottom: spacing.base,
  },
  noteGroup: {
    gap: 7,
  },
  noteHeader: {
    paddingHorizontal: layout.screenPadding + 4,
  },
  note: {
    marginHorizontal: layout.screenPadding,
    minHeight: 92,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    textAlignVertical: 'top',
    ...textStyles.body,
  },
});
