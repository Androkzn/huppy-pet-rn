/**
 * Date field.
 *
 * The iOS form treatment: a label beside a tinted value pill that opens the
 * system picker in a sheet, rather than a bordered text box.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '@theme/ThemeProvider';
import { radius, spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Label } from './ios/Text';
import { Sheet } from './ios/Sheet';

interface Props {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  /** Also offers a time picker in the sheet. */
  mode?: 'date' | 'time' | 'datetime';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const CustomDatePicker: React.FC<Props> = ({
  label,
  value,
  onChange,
  mode = 'date',
  style,
  disabled,
}) => {
  const { colors, isDark } = useAppTheme();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  const formatted =
    mode === 'time'
      ? value.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
      : value.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

  return (
    <View style={[styles.row, style]}>
      {label ? (
        <Label variant="body" role="secondary">
          {label}
        </Label>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label ?? 'Date'}: ${formatted}`}
        disabled={disabled}
        onPress={() => {
          haptics.light();
          setDraft(value);
          setOpen(true);
        }}
        style={({ pressed }) => [
          styles.pill,
          { backgroundColor: colors.tertiaryFill },
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        <Label variant="subheadline" weight="600" role="tint">
          {formatted}
        </Label>
      </Pressable>

      <Sheet
        open={open}
        onDismiss={() => setOpen(false)}
        title={label ?? 'Select date'}
        confirmLabel="Done"
        onConfirm={() => {
          onChange(draft);
          setOpen(false);
        }}
        scrollable={false}
      >
        <View style={styles.pickerBody}>
          <DateTimePicker
            value={draft}
            mode={mode === 'datetime' ? 'datetime' : mode}
            display={mode === 'time' ? 'spinner' : 'inline'}
            themeVariant={isDark ? 'dark' : 'light'}
            accentColor={colors.tint}
            onChange={(_event, selected) => {
              if (selected) setDraft(selected);
            }}
            style={styles.picker}
          />
        </View>
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.capsule,
    borderCurve: 'continuous',
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.4,
  },
  pickerBody: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
  },
  picker: {
    alignSelf: 'stretch',
  },
});

export default CustomDatePicker;
