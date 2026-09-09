/**
 * Dropdown — stands in for the web app's styled <select>.
 *
 * Matches the web's dropdownStyle: a 150px white field, 35px tall, 10px radius,
 * green 15px label. Tapping it opens the option list.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  ViewStyle,
  StyleProp,
} from 'react-native';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';

export interface DropdownOption {
  rawValue: string;
  title: string;
}

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  options,
  onChange,
  disabled,
  style,
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.rawValue === value);

  return (
    <>
      <Pressable
        style={[styles.field, style]}
        onPress={() => !disabled && setOpen(true)}
      >
        <Text style={styles.fieldText} numberOfLines={1}>
          {selected?.title ?? value}
        </Text>
        <Text style={styles.caret}>▾</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.rawValue}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item.rawValue);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.rawValue === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.title}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  field: {
    width: 150,
    maxWidth: 150,
    height: 35,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldText: {
    fontFamily: fontFamily.regular,
    color: colors.green,
    fontSize: 15,
    flexShrink: 1,
  },
  caret: {
    color: colors.green,
    fontSize: 12,
    marginLeft: 6,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: 10,
    minWidth: 220,
    maxHeight: '60%',
    paddingVertical: 8,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  optionText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.green,
  },
  optionTextSelected: {
    fontFamily: fontFamily.bold,
    color: colors.orange,
  },
});

export default Dropdown;
