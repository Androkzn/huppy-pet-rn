/**
 * CustomDatePickerWithArrows — port of the web component of the same name:
 * a back arrow, a tappable date field, and a forward arrow, each arrow
 * stepping one day.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ViewStyle,
  StyleProp,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as colors from '../theme/colors';
import { fontFamily } from '../theme';
import { Asset } from './ui/Asset';

const DAY_MS = 24 * 60 * 60 * 1000;

interface Props {
  value: Date;
  onChange: (date: Date) => void;
  /** Wrapper style — the web's `styleContainer`. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Field style — the web's `stylePicker`. */
  pickerStyle?: StyleProp<ViewStyle>;
  /** Field fill — the web's `backgroundColor` prop. */
  backgroundColor?: string;
  disabled?: boolean;
}

export const CustomDatePickerWithArrows: React.FC<Props> = ({
  value,
  onChange,
  containerStyle,
  pickerStyle,
  backgroundColor,
  disabled,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // The web's MUI picker renders MM/DD/YYYY.
  const label = `${value.getMonth() + 1}`.padStart(2, '0') +
    '/' +
    `${value.getDate()}`.padStart(2, '0') +
    '/' +
    value.getFullYear();

  return (
    <View style={[styles.container, containerStyle]}>
      <Asset
        imageName="arrow_left_black.svg"
        width={20}
        height={20}
        onPress={disabled ? undefined : () => onChange(new Date(value.getTime() - DAY_MS))}
      />

      <Pressable
        onPress={() => !disabled && setShowPicker(true)}
        style={[
          styles.field,
          backgroundColor ? { backgroundColor } : null,
          pickerStyle,
        ]}
      >
        <Text style={styles.fieldText}>{label}</Text>
      </Pressable>

      <Asset
        imageName="arrow_right_black.svg"
        width={20}
        height={20}
        onPress={disabled ? undefined : () => onChange(new Date(value.getTime() + DAY_MS))}
      />

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_event, selected) => {
            setShowPicker(Platform.OS === 'ios' ? false : false);
            if (selected) onChange(selected);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Web CustomTextField: 10px padding, 16px text, 100px wide, 10px radius,
  // 1px white border, 15px side margins.
  field: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 100,
    borderWidth: 1,
    borderColor: colors.white,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  fieldText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.black,
  },
});

export default CustomDatePickerWithArrows;
