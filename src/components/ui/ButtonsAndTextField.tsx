/**
 * ButtonsAndTextField — port of the control of the same name in the web app's
 * Form.components.js: a circle minus, a 50px numeric field, and a circle plus.
 * Steps by 10, floors at 1 on the minus side.
 */

import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';
import { HuppyButton } from './Buttons';

const STEP = 10;
const MIN_VALUE = 1;

interface Props {
  initialValue?: number;
  /** Fires on typing, as the web's `onChange`. */
  onChange?: (value: number) => void;
  /** Fires on the +/- buttons, as the web's `onChangeButton`. */
  onChangeButton?: (value: number) => void;
}

export const ButtonsAndTextField: React.FC<Props> = ({
  initialValue = 0,
  onChange,
  onChangeButton,
}) => {
  const [count, setCount] = useState(initialValue);

  useEffect(() => {
    setCount(initialValue);
  }, [initialValue]);

  const decrement = () => {
    const next = Math.max(count - STEP, MIN_VALUE);
    setCount(next);
    onChangeButton?.(next);
  };

  const increment = () => {
    const next = count + STEP;
    setCount(next);
    onChangeButton?.(next);
  };

  return (
    <View style={styles.container}>
      <HuppyButton
        variant="circleTextButton"
        onPress={decrement}
        disabled={count === 0}
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
          onChange?.(value);
        }}
      />
      <HuppyButton variant="circleTextButton" onPress={increment}>
        +
      </HuppyButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    margin: 3,
  },
  textField: {
    borderWidth: 2,
    borderColor: colors.gray,
    width: 50,
    textAlign: 'center',
    marginHorizontal: 15,
    borderRadius: 10,
    height: 30,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
});

export default ButtonsAndTextField;
