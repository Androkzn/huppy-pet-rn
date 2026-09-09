/**
 * Form rows — ports of the labelled controls in the web app's
 * Form.components.js. Each is a lightBrown pill with the title on the left and
 * the control on the right (dropdown, stepper, toggle, text field or date).
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  ViewStyle,
  StyleProp,
} from 'react-native';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';
import { HuppyButton } from './Buttons';
import { Dropdown, DropdownOption } from './Dropdown';
import CustomDatePicker from '../CustomDatePicker';

const upperFirst = (value: string) =>
  String(value).charAt(0).toUpperCase() + String(value).slice(1);

interface RowProps {
  title: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** The shared lightBrown row. */
export const FormRow: React.FC<RowProps> = ({ title, children, style }) => (
  <View style={[styles.container, style]}>
    <Text style={styles.title}>{title}</Text>
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
        <Text style={styles.disabledValue}>{upperFirst(value)}</Text>
      ) : (
        <Dropdown
          value={value}
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
  /** Web steps this control by 1. */
  step?: number;
  onChange: (value: number) => void;
  onChangeButton: (value: number) => void;
}

export const TitleButtonsAndTextField: React.FC<
  TitleButtonsAndTextFieldProps
> = ({ title, initialValue = 0, step = 1, onChange, onChangeButton }) => {
  const [count, setCount] = useState(initialValue);

  useEffect(() => {
    setCount(initialValue);
  }, [initialValue]);

  return (
    <FormRow title={title}>
      <View style={styles.controlGroup}>
        <HuppyButton
          variant="circleTextButton"
          disabled={count === 0}
          onPress={() => {
            const next = count - step;
            setCount(next);
            onChangeButton(next);
          }}
        >
          -
        </HuppyButton>
        <TextInput
          style={styles.textField}
          keyboardType="number-pad"
          value={String(count)}
          onChangeText={(text) => {
            const value = text === '' ? 0 : parseInt(text, 10) || 0;
            setCount(value);
            onChange(value);
          }}
        />
        <HuppyButton
          variant="circleTextButton"
          onPress={() => {
            const next = count + step;
            setCount(next);
            onChangeButton(next);
          }}
        >
          +
        </HuppyButton>
      </View>
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
  const [checked, setChecked] = useState(initialValue);

  useEffect(() => {
    setChecked(initialValue);
  }, [initialValue]);

  return (
    <FormRow title={title}>
      <Switch
        value={checked}
        onValueChange={(value) => {
          setChecked(value);
          onChange(value);
        }}
        trackColor={{ false: colors.olive, true: colors.orange }}
        thumbColor={colors.white}
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
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <FormRow title={title}>
      <TextInput
        style={styles.wideTextField}
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
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

/**
 * Web: TitleTooltipAndValue — a read-only row whose "?" badge explains the
 * number beside it.
 */
export const TitleTooltipAndValue: React.FC<TitleTooltipAndValueProps> = ({
  title,
  value,
  tipText,
}) => {
  const [showTip, setShowTip] = useState(false);

  return (
    <View style={styles.plainRow}>
      <View style={styles.tooltipTitleRow}>
        <Text style={styles.plainTitle}> {title} </Text>
        <HuppyButton
          variant="circleTextButtonSmall"
          onPress={() => setShowTip(!showTip)}
        >
          ?
        </HuppyButton>
      </View>
      <Text style={styles.plainTitle}>{value}</Text>
      {showTip && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{tipText}</Text>
        </View>
      )}
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

/**
 * Web: TitleToggleAndButtons — a toggle that reveals a stepper, used for the
 * daily ratio. Stacks vertically on a small screen, as it does on the web.
 */
export const TitleToggleAndButtons: React.FC<TitleToggleAndButtonsProps> = ({
  title,
  toggleValue,
  value,
  onChangeToggle,
  onChangeValue,
  maxCountValue = 9999,
}) => {
  const [checked, setChecked] = useState(toggleValue);
  const [count, setCount] = useState(value);

  useEffect(() => setChecked(toggleValue), [toggleValue]);
  useEffect(() => setCount(value), [value]);

  const commit = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), maxCountValue);
    setCount(clamped);
    onChangeValue(clamped);
  };

  return (
    <View style={styles.stackedContainer}>
      <View style={styles.controlGroup}>
        <Text style={styles.title}>{title}</Text>
        <Switch
          value={checked}
          onValueChange={(next) => {
            setChecked(next);
            onChangeToggle(next);
          }}
          trackColor={{ false: colors.olive, true: colors.orange }}
          thumbColor={colors.white}
        />
      </View>

      {checked && (
        <View style={styles.controlGroup}>
          <HuppyButton
            variant="circleTextButton"
            disabled={count === 0}
            onPress={() => commit(count - 1)}
          >
            -
          </HuppyButton>
          <TextInput
            style={styles.textField}
            keyboardType="number-pad"
            value={String(count)}
            onChangeText={(text) =>
              commit(text === '' ? 0 : parseInt(text, 10) || 0)
            }
          />
          <HuppyButton
            variant="circleTextButton"
            onPress={() => commit(count + 1)}
          >
            +
          </HuppyButton>
        </View>
      )}
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
  <FormRow title={title}>
    <CustomDatePicker value={value} onChange={onChange} />
  </FormRow>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    margin: 3,
    backgroundColor: colors.lightBrown,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    marginRight: 10,
    color: colors.black,
  },
  disabledValue: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
    marginRight: '30%',
  },
  dropdown: {
    maxWidth: 210,
    backgroundColor: colors.oliveLight,
  },
  controlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textField: {
    width: 50,
    textAlign: 'center',
    marginHorizontal: 15,
    borderRadius: 10,
    height: 30,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
    backgroundColor: colors.white,
  },
  wideTextField: {
    flex: 1,
    maxWidth: 210,
    textAlign: 'right',
    borderRadius: 10,
    height: 35,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
    backgroundColor: colors.white,
  },
  // TitleTooltipAndValue sits directly on the page, without the pill.
  plainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 5,
    paddingVertical: 6,
    flexWrap: 'wrap',
  },
  tooltipTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plainTitle: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
  tooltip: {
    width: '100%',
    backgroundColor: colors.green,
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  tooltipText: {
    color: colors.white,
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },
  stackedContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: colors.lightBrown,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 3,
  },
});
