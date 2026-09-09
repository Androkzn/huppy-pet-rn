/**
 * CustomDatePicker — port of the web component of the same name:
 * a 120px gray field with a floating label, in bold Balsamiq Sans.
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

interface Props {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const CustomDatePicker: React.FC<Props> = ({
  label,
  value,
  onChange,
  style,
  disabled,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatted =
    `${value.getMonth() + 1}`.padStart(2, '0') +
    '/' +
    `${value.getDate()}`.padStart(2, '0') +
    '/' +
    value.getFullYear();

  return (
    <View style={style}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        style={styles.field}
        onPress={() => !disabled && setShowPicker(true)}
      >
        <Text style={styles.fieldText}>{formatted}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_event, selected) => {
            setShowPicker(false);
            if (selected) onChange(selected);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.gray,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 4,
  },
  field: {
    backgroundColor: colors.grayBackground,
    borderRadius: 10,
    width: 120,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.lightBrown,
  },
  fieldText: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
});

export default CustomDatePicker;
