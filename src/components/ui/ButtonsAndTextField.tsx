/**
 * ButtonsAndTextField — the portion stepper.
 *
 * The iOS stepper, stepping by 10 and floored at 1, as the meal editor expects.
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stepper } from '@components/ios/Stepper';

const STEP = 10;
const MIN_VALUE = 1;

interface Props {
  initialValue?: number;
  /** Fires while typing. */
  onChange?: (value: number) => void;
  /** Fires on the − / + buttons. */
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

  return (
    <View style={styles.container}>
      <Stepper
        value={count}
        step={STEP}
        min={MIN_VALUE}
        onChange={(next) => {
          setCount(next);
          onChange?.(next);
        }}
        onStep={(next) => onChangeButton?.(next)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ButtonsAndTextField;
