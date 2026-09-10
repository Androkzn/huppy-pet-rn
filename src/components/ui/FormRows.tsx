/**
 * Form rows — labelled controls, in the iOS grouped-list shape.
 *
 * A row is transparent and 44pt tall, with its title on the leading edge and
 * its control on the trailing edge; `FormGroup` supplies the rounded surface
 * and the hairlines between rows. That is how iOS lays out a form, and it lets
 * a screen group related settings simply by wrapping them.
 */

import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  TextInput,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, spacing, textStyles } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Icon } from '@components/ios/Icon';
import { Label } from '@components/ios/Text';
import { Stepper } from '@components/ios/Stepper';
import { Dropdown, DropdownOption } from './Dropdown';
import CustomDatePicker from '../CustomDatePicker';

const upperFirst = (value: string) =>
  String(value).charAt(0).toUpperCase() + String(value).slice(1);

interface GroupProps {
  header?: string;
  footer?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Groups inside a card or sheet supply their own margins. */
  inset?: boolean;
}

/** The rounded surface a run of rows sits on. */
export const FormGroup: React.FC<GroupProps> = ({
  header,
  footer,
  children,
  style,
  inset = true,
}) => {
  const { colors } = useAppTheme();
  const rows = React.Children.toArray(children).filter(Boolean);

  return (
    <View style={[styles.group, style]}>
      {header ? (
        <Label
          variant="footnote"
          role="secondary"
          sectionHeader
          style={styles.groupHeader}
        >
          {header}
        </Label>
      ) : null}

      <View
        style={[
          styles.groupSurface,
          { backgroundColor: colors.groupedSurface },
          inset && { marginHorizontal: layout.screenPadding },
        ]}
      >
        {rows.map((row, index) => (
          <React.Fragment key={index}>
            {index > 0 ? (
              <View
                style={[
                  styles.separator,
                  { backgroundColor: colors.separator, height: layout.hairline },
                ]}
              />
            ) : null}
            {row}
          </React.Fragment>
        ))}
      </View>

      {footer ? (
        <Label variant="footnote" role="secondary" style={styles.groupFooter}>
          {footer}
        </Label>
      ) : null}
    </View>
  );
};

interface RowProps {
  title: string;
  /** Second line under the title. */
  subtitle?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Stacks the control under the title, for controls that need the width. */
  stacked?: boolean;
}

export const FormRow: React.FC<RowProps> = ({
  title,
  subtitle,
  children,
  style,
  stacked = false,
}) => (
  <View style={[stacked ? styles.rowStacked : styles.row, style]}>
    <View style={styles.rowLabel}>
      <Label variant="body" numberOfLines={stacked ? 1 : 2}>
        {title}
      </Label>
      {subtitle ? (
        <Label variant="footnote" role="secondary">
          {subtitle}
        </Label>
      ) : null}
    </View>
    {children}
  </View>
);

interface TitleAndDropdownProps {
  title: string;
  initialValue?: string;
  dropdownOptions: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const TitleAndDropdown: React.FC<TitleAndDropdownProps> = ({
  title,
  initialValue,
  dropdownOptions,
  onChange,
  disabled,
}) => {
  const [value, setValue] = useState(
    initialValue ?? dropdownOptions[0]?.rawValue ?? ''
  );

  useEffect(() => {
    if (initialValue !== undefined) setValue(initialValue);
  }, [initialValue]);

  return (
    <FormRow title={title}>
      {disabled ? (
        <Label variant="body" role="secondary" numberOfLines={1}>
          {upperFirst(value)}
        </Label>
      ) : (
        <Dropdown
          value={value}
          label={title}
          options={dropdownOptions}
          onChange={(newValue) => {
            setValue(newValue);
            onChange(newValue);
          }}
          style={styles.dropdown}
        />
      )}
    </FormRow>
  );
};

interface TitleButtonsAndTextFieldProps {
  title: string;
  initialValue?: number;
  step?: number;
  onChange: (value: number) => void;
  onChangeButton: (value: number) => void;
}

export const TitleButtonsAndTextField: React.FC<TitleButtonsAndTextFieldProps> = ({
  title,
  initialValue = 0,
  step = 1,
  onChange,
  onChangeButton,
}) => {
  const [count, setCount] = useState(initialValue);

  useEffect(() => {
    setCount(initialValue);
  }, [initialValue]);

  return (
    <FormRow title={title}>
      <Stepper
        value={count}
        step={step}
        onChange={(next) => {
          setCount(next);
          onChange(next);
        }}
        onStep={onChangeButton}
      />
    </FormRow>
  );
};

interface TitleAndToggleProps {
  title: string;
  initialValue?: boolean;
  onChange: (value: boolean) => void;
}

export const TitleAndToggle: React.FC<TitleAndToggleProps> = ({
  title,
  initialValue = false,
  onChange,
}) => {
  const { colors } = useAppTheme();
  const [checked, setChecked] = useState(initialValue);

  useEffect(() => {
    setChecked(initialValue);
  }, [initialValue]);

  return (
    <FormRow title={title}>
      <Switch
        value={checked}
        onValueChange={(value) => {
          haptics.soft();
          setChecked(value);
          onChange(value);
        }}
        trackColor={{ false: colors.fill, true: colors.tint }}
        ios_backgroundColor={colors.fill}
      />
    </FormRow>
  );
};

interface TitleAndTextFieldProps {
  title: string;
  initialValue?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad';
}

export const TitleAndTextField: React.FC<TitleAndTextFieldProps> = ({
  title,
  initialValue = '',
  placeholder,
  onChange,
  keyboardType = 'default',
}) => {
  const { colors } = useAppTheme();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <FormRow title={title}>
      {/* iOS puts the editable value flush right in a form row, without a box. */}
      <TextInput
        style={[styles.inlineField, { color: colors.label }]}
        placeholder={placeholder}
        placeholderTextColor={colors.tertiaryLabel}
        selectionColor={colors.tint}
        keyboardType={keyboardType}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          onChange(text);
        }}
      />
    </FormRow>
  );
};

interface TitleTooltipAndValueProps {
  title: string;
  value: number | string;
  tipText: string;
}

/** A read-only row whose info button explains the number beside it. */
export const TitleTooltipAndValue: React.FC<TitleTooltipAndValueProps> = ({
  title,
  value,
  tipText,
}) => {
  const { colors } = useAppTheme();
  const [showTip, setShowTip] = useState(false);

  return (
    <View style={styles.tooltipRow}>
      <View style={styles.row}>
        <View style={styles.tooltipTitle}>
          <Label variant="body" numberOfLines={1}>
            {title}
          </Label>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`About ${title}`}
            accessibilityState={{ expanded: showTip }}
            hitSlop={8}
            onPress={() => {
              haptics.light();
              setShowTip((current) => !current);
            }}
          >
            <Icon
              name="info.circle"
              size={16}
              color={showTip ? colors.tint : colors.tertiaryLabel}
            />
          </Pressable>
        </View>
        <Label variant="body" role="secondary" weight="600">
          {value}
        </Label>
      </View>

      {showTip ? (
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(120)}
          style={[styles.tooltip, { backgroundColor: colors.tintSoft }]}
        >
          <Label variant="footnote" role="secondary">
            {tipText}
          </Label>
        </Animated.View>
      ) : null}
    </View>
  );
};

interface TitleToggleAndButtonsProps {
  title: string;
  toggleValue: boolean;
  value: number;
  onChangeToggle: (value: boolean) => void;
  onChangeValue: (value: number) => void;
  maxCountValue?: number;
}

/** A toggle that reveals a stepper, used for the daily ratio. */
export const TitleToggleAndButtons: React.FC<TitleToggleAndButtonsProps> = ({
  title,
  toggleValue,
  value,
  onChangeToggle,
  onChangeValue,
  maxCountValue = 9999,
}) => {
  const { colors } = useAppTheme();
  const [checked, setChecked] = useState(toggleValue);
  const [count, setCount] = useState(value);

  useEffect(() => setChecked(toggleValue), [toggleValue]);
  useEffect(() => setCount(value), [value]);

  const commit = (next: number) => {
    setCount(next);
    onChangeValue(next);
  };

  return (
    <View>
      <FormRow title={title}>
        <Switch
          value={checked}
          onValueChange={(next) => {
            haptics.soft();
            setChecked(next);
            onChangeToggle(next);
          }}
          trackColor={{ false: colors.fill, true: colors.tint }}
          ios_backgroundColor={colors.fill}
        />
      </FormRow>

      {checked ? (
        <Animated.View entering={FadeIn.duration(160)} exiting={FadeOut.duration(120)}>
          <View
            style={[
              styles.separator,
              { backgroundColor: colors.separator, height: layout.hairline },
            ]}
          />
          <FormRow title="Amount">
            <Stepper value={count} max={maxCountValue} onChange={commit} />
          </FormRow>
        </Animated.View>
      ) : null}
    </View>
  );
};

interface TitleAndDatePickerProps {
  title: string;
  value: Date;
  onChange: (date: Date) => void;
}

export const TitleAndDatePicker: React.FC<TitleAndDatePickerProps> = ({
  title,
  value,
  onChange,
}) => (
  <View style={styles.row}>
    <CustomDatePicker label={title} value={value} onChange={onChange} style={styles.fullWidth} />
  </View>
);

const styles = StyleSheet.create({
  group: {
    width: '100%',
    gap: 7,
  },
  groupHeader: {
    paddingHorizontal: layout.screenPadding + 4,
  },
  groupFooter: {
    paddingHorizontal: layout.screenPadding + 4,
  },
  groupSurface: {
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  separator: {
    marginLeft: layout.screenPadding,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    minHeight: 46,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 8,
  },
  rowStacked: {
    gap: spacing.sm,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 12,
  },
  rowLabel: {
    flexShrink: 1,
    gap: 1,
  },
  fullWidth: {
    flex: 1,
  },
  dropdown: {
    maxWidth: 220,
  },
  inlineField: {
    flex: 1,
    maxWidth: 220,
    textAlign: 'right',
    paddingVertical: 6,
    ...textStyles.body,
  },
  tooltipRow: {
    paddingBottom: 2,
  },
  tooltipTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  tooltip: {
    marginHorizontal: layout.screenPadding,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderCurve: 'continuous',
  },
});
