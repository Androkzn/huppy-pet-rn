/**
 * Day stepper.
 *
 * A glass capsule holding two chevrons around the day in view — the compact
 * control iOS uses for stepping through dated content. It names the day the way
 * the system does ("Today", "Yesterday", then a short date), and tapping the
 * label opens the system date picker in a sheet.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '@theme/ThemeProvider';
import { radius, spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Glass } from './ios/Glass';
import { Icon } from './ios/Icon';
import { Label } from './ios/Text';
import { Sheet } from './ios/Sheet';
import { IOSButton } from './ios/Button';

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** "Today" / "Yesterday" / "Tomorrow", else a short weekday-and-date. */
const describe = (value: Date): string => {
  const today = startOfDay(new Date());
  const days = Math.round((startOfDay(value) - today) / DAY_MS);
  if (days === 0) return 'Today';
  if (days === -1) return 'Yesterday';
  if (days === 1) return 'Tomorrow';

  return value.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(value.getFullYear() === new Date().getFullYear() ? {} : { year: 'numeric' }),
  });
};

interface Props {
  value: Date;
  onChange: (date: Date) => void;
  containerStyle?: StyleProp<ViewStyle>;
  /** Kept for the call sites that styled the old field. */
  pickerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  disabled?: boolean;
}

export const CustomDatePickerWithArrows: React.FC<Props> = ({
  value,
  onChange,
  containerStyle,
  disabled,
}) => {
  const { colors, isDark } = useAppTheme();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  const step = (days: number) => {
    haptics.selection();
    onChange(new Date(value.getTime() + days * DAY_MS));
  };

  const isToday = startOfDay(value) === startOfDay(new Date());

  return (
    <>
      <Glass
        variant="regular"
        radius={radius.capsule}
        bordered
        style={[styles.capsule, containerStyle]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous day"
          disabled={disabled}
          hitSlop={6}
          onPress={() => step(-1)}
          style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
        >
          <Icon
            name="chevron.left"
            size={15}
            weight="semibold"
            color={colors.tint}
            fallbackAsset="arrow_left_black.svg"
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Date: ${describe(value)}. Tap to change`}
          disabled={disabled}
          onPress={() => {
            haptics.light();
            setDraft(value);
            setPickerOpen(true);
          }}
          style={({ pressed }) => [styles.label, pressed && styles.pressed]}
        >
          <Label variant="subheadline" weight="600" numberOfLines={1}>
            {describe(value)}
          </Label>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next day"
          disabled={disabled}
          hitSlop={6}
          onPress={() => step(1)}
          style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
        >
          <Icon
            name="chevron.right"
            size={15}
            weight="semibold"
            color={colors.tint}
            fallbackAsset="arrow_right_black.svg"
          />
        </Pressable>
      </Glass>

      <Sheet
        open={pickerOpen}
        onDismiss={() => setPickerOpen(false)}
        title="Select date"
        confirmLabel="Done"
        onConfirm={() => {
          onChange(draft);
          setPickerOpen(false);
        }}
        scrollable={false}
      >
        <View style={styles.pickerBody}>
          <DateTimePicker
            value={draft}
            mode="date"
            display="inline"
            themeVariant={isDark ? 'dark' : 'light'}
            accentColor={colors.tint}
            onChange={(_event, selected) => {
              if (selected) setDraft(selected);
            }}
            style={styles.picker}
          />
          {!isToday ? (
            <IOSButton
              title="Jump to today"
              variant="tinted"
              size="sm"
              onPress={() => setDraft(new Date())}
            />
          ) : null}
        </View>
      </Sheet>
    </>
  );
};

const styles = StyleSheet.create({
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 4,
  },
  arrow: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    minWidth: 96,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    height: 32,
  },
  pressed: {
    opacity: 0.5,
  },
  pickerBody: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
    alignItems: 'center',
    gap: spacing.md,
  },
  picker: {
    alignSelf: 'stretch',
  },
});

export default CustomDatePickerWithArrows;
