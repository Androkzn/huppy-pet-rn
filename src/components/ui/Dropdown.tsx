/**
 * Dropdown — choosing one value from a list.
 *
 * The field is the iOS pop-up-button shape: a tinted capsule showing the
 * current value next to up/down chevrons. Choosing happens in a sheet, where
 * the selected row carries a checkmark — the platform's pattern for a list of
 * options that is too long for a segmented control.
 */

import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useAppTheme } from '@theme/ThemeProvider';
import { radius, spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Icon } from '@components/ios/Icon';
import { Label } from '@components/ios/Text';
import { ListRow, ListSection } from '@components/ios/List';
import { Sheet } from '@components/ios/Sheet';

export interface DropdownOption {
  rawValue: string;
  title: string;
}

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Sheet heading, so the choice has a name. */
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  options,
  onChange,
  disabled,
  label,
  style,
}) => {
  const { colors } = useAppTheme();
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.rawValue === value);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label ?? 'Selection'}: ${selected?.title ?? value}`}
        disabled={disabled}
        onPress={() => {
          haptics.light();
          setOpen(true);
        }}
        style={({ pressed }) => [
          styles.field,
          { backgroundColor: colors.tertiaryFill },
          pressed && styles.pressed,
          disabled && styles.disabled,
          style,
        ]}
      >
        <Label variant="subheadline" weight="600" numberOfLines={1} style={styles.fieldText}>
          {selected?.title ?? value}
        </Label>
        <Icon name="chevron.up.chevron.down" size={12} weight="semibold" color={colors.tertiaryLabel} />
      </Pressable>

      <Sheet
        open={open}
        onDismiss={() => setOpen(false)}
        title={label ?? 'Select'}
        detent="medium"
      >
        <View style={styles.sheetBody}>
          <ListSection>
            {options.map((option) => (
              <ListRow
                key={option.rawValue}
                title={option.title}
                chevron={false}
                trailing={
                  option.rawValue === value ? (
                    <Icon name="checkmark" size={15} weight="semibold" color={colors.tint} />
                  ) : undefined
                }
                onPress={() => {
                  haptics.selection();
                  onChange(option.rawValue);
                  setOpen(false);
                }}
              />
            ))}
          </ListSection>
        </View>
      </Sheet>
    </>
  );
};

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    minWidth: 140,
    height: 34,
    paddingHorizontal: 14,
    borderRadius: radius.capsule,
    borderCurve: 'continuous',
  },
  fieldText: {
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.4,
  },
  sheetBody: {
    paddingBottom: spacing.base,
  },
});

export default Dropdown;
