/**
 * Add Activity Dialog — port of the web app's NewActivityForm.component.js.
 *
 * The close button, the "Add Activity" title, the Activity and Metric
 * dropdowns, the stepper for the chosen metric, the Add Activity button, and
 * the burned-calories strip once there is a value.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput } from 'react-native';
import { useAddActivity } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import { useAuth } from '@contexts/AuthContext';
import { HuppyButton } from '@components/ui/Buttons';
import { TitleAndDropdown } from '@components/ui/FormRows';
import {
  ActivityType,
  ActivityMetric,
  getTitleForActivityType,
  getTitleForActivityMetric,
} from '@constants/enums';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';

interface AddActivityDialogProps {
  visible: boolean;
  onDismiss: () => void;
  selectedDate?: Date;
}

const typeOptions = Object.values(ActivityType).map((type) => ({
  rawValue: type,
  title: getTitleForActivityType(type),
}));

const metricOptions = Object.values(ActivityMetric).map((metric) => ({
  rawValue: metric,
  title: getTitleForActivityMetric(metric),
}));

export const AddActivityDialog: React.FC<AddActivityDialogProps> = ({
  visible,
  onDismiss,
  selectedDate = new Date(),
}) => {
  const { currentProfile } = useProfile();
  const { user } = useAuth();
  const { mutate: addActivity } = useAddActivity();

  const [value, setValue] = useState(0);
  const [form, setForm] = useState({
    type: ActivityType.WALK as string,
    metric: ActivityMetric.DISTANCE as string,
    distance: 0,
    duration: 0,
    burnedCalories: 0,
  });

  const getCaloriesBurnedFor = (amount: number) => {
    const weight = currentProfile?.weight ?? 0;
    return form.metric === ActivityMetric.DISTANCE
      ? Math.floor(weight * amount * 0.8)
      : Math.floor(amount * 2);
  };

  const setAmount = (amount: number) => {
    setValue(amount);
    setForm((prev) => ({
      ...prev,
      [prev.metric === ActivityMetric.DISTANCE ? 'distance' : 'duration']: amount,
      burnedCalories: getCaloriesBurnedFor(amount),
    }));
  };

  // Distance steps by 1, duration by 10 — as on the web.
  const step = form.metric === ActivityMetric.DISTANCE ? 1 : 10;

  const handleCreate = () => {
    if (!currentProfile || !user) return;
    addActivity({
      type: form.type,
      metric: form.metric,
      distance: form.distance,
      duration: form.duration,
      burnedCalories: form.burnedCalories,
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

          <Text style={styles.title}>Add Activity</Text>

          <TitleAndDropdown
            title="Activity"
            initialValue={form.type}
            dropdownOptions={typeOptions}
            onChange={(newValue) => setForm({ ...form, type: newValue })}
          />
          <TitleAndDropdown
            title="Metric"
            initialValue={form.metric}
            dropdownOptions={metricOptions}
            onChange={(newValue) => {
              setForm({ ...form, metric: newValue });
              setValue(
                newValue === ActivityMetric.DISTANCE
                  ? form.distance
                  : form.duration
              );
            }}
          />

          <View style={styles.column}>
            <Text style={styles.metricTitle}>
              {getTitleForActivityMetric(form.metric)}
            </Text>
            <View style={styles.circleButtonsGroup}>
              <HuppyButton
                variant="circleTextButton"
                onPress={() => setAmount(Math.max(0, value - step))}
              >
                -
              </HuppyButton>
              <TextInput
                style={styles.textField}
                keyboardType="number-pad"
                value={String(value)}
                onChangeText={(text) =>
                  setAmount(text === '' ? 0 : parseInt(text, 10) || 0)
                }
              />
              <HuppyButton
                variant="circleTextButton"
                onPress={() => setAmount(value + step)}
              >
                +
              </HuppyButton>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <HuppyButton
              variant="rectangleTextButton"
              onPress={handleCreate}
              disabled={value === 0}
            >
              Add Activity
            </HuppyButton>
          </View>

          {form.burnedCalories > 0 && (
            <View style={styles.estimatedCaloriesContainer}>
              <Text style={styles.burnedCalories}>Burned calories:</Text>
              <Text style={styles.burnedCaloriesValue}>
                {form.burnedCalories} kcal
              </Text>
            </View>
          )}
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
  column: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  metricTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.black,
    marginBottom: 8,
  },
  circleButtonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textField: {
    borderWidth: 2,
    borderColor: colors.green,
    width: 50,
    textAlign: 'center',
    marginHorizontal: 15,
    borderRadius: 10,
    height: 30,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  estimatedCaloriesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.lightBrown2,
    padding: 8,
  },
  burnedCalories: {
    marginRight: 5,
    color: colors.orange,
    fontFamily: fontFamily.bold,
    fontSize: 16,
  },
  burnedCaloriesValue: {
    color: colors.orange,
    fontFamily: fontFamily.regular,
    fontSize: 16,
  },
});
