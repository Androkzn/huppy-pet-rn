/**
 * Add Activity — a sheet for logging a walk, run, swim or game of fetch.
 *
 * Presented the way iOS presents a short creation task: a sheet with Cancel on
 * the left and Add on the right, the choices in a grouped list, and the figure
 * being entered stated large above its stepper so it stays readable while the
 * value changes.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAddActivity } from '@hooks/useGraphQL';
import { useProfile } from '@contexts/ProfileContext';
import { useAuth } from '@contexts/AuthContext';
import { Sheet } from '@components/ios/Sheet';
import { Label } from '@components/ios/Text';
import { Stepper } from '@components/ios/Stepper';
import { FormGroup, TitleAndDropdown } from '@components/ui/FormRows';
import {
  ActivityType,
  ActivityMetric,
  getTitleForActivityType,
  getTitleForActivityMetric,
} from '@constants/enums';
import { spacing } from '@theme/tokens';

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

  const isDistance = form.metric === ActivityMetric.DISTANCE;

  const getCaloriesBurnedFor = (amount: number) => {
    const weight = currentProfile?.weight ?? 0;
    return isDistance ? Math.floor(weight * amount * 0.8) : Math.floor(amount * 2);
  };

  const setAmount = (amount: number) => {
    setValue(amount);
    setForm((prev) => ({
      ...prev,
      [prev.metric === ActivityMetric.DISTANCE ? 'distance' : 'duration']: amount,
      burnedCalories: getCaloriesBurnedFor(amount),
    }));
  };

  // Distance steps by 1, duration by 10.
  const step = isDistance ? 1 : 10;
  const unit = isDistance ? 'km' : 'min';

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
    <Sheet
      open={visible}
      onDismiss={onDismiss}
      title="Add activity"
      confirmLabel="Add"
      confirmDisabled={value === 0}
      onConfirm={handleCreate}
    >
      <View style={styles.body}>
        <FormGroup>
          <TitleAndDropdown
            title="Activity"
            initialValue={form.type}
            dropdownOptions={typeOptions}
            onChange={(newValue) => setForm({ ...form, type: newValue })}
          />
          <TitleAndDropdown
            title="Measured in"
            initialValue={form.metric}
            dropdownOptions={metricOptions}
            onChange={(newValue) => {
              setForm({ ...form, metric: newValue });
              setValue(
                newValue === ActivityMetric.DISTANCE ? form.distance : form.duration
              );
            }}
          />
        </FormGroup>

        <View style={styles.amount}>
          <Label variant="largeTitle" brand>
            {value}
            <Label variant="title3" role="secondary">
              {` ${unit}`}
            </Label>
          </Label>
          <Stepper value={value} step={step} onChange={setAmount} style={styles.stepper} />
          {form.burnedCalories > 0 ? (
            <Label variant="subheadline" role="tint" weight="600">
              {`${form.burnedCalories} kcal burned`}
            </Label>
          ) : (
            <Label variant="subheadline" role="tertiary">
              Set an amount to log the activity
            </Label>
          )}
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
  amount: {
    alignItems: 'center',
    gap: spacing.md,
  },
  stepper: {
    height: 44,
  },
});
