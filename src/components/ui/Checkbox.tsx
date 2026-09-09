/**
 * Checkbox — port of the web app's Checkbox.component.js:
 * a white box that shows an orange checkmark when selected.
 */

import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import * as colors from '../../theme/colors';
import { Asset } from './Asset';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => (
  <Pressable style={styles.box} onPress={() => onChange(!checked)}>
    {checked ? (
      <Asset imageName="checkmark_orange.svg" width={18} height={18} />
    ) : (
      <View />
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  box: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.gray,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
  },
});

export default Checkbox;
