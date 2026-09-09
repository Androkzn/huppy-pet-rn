/**
 * CustomAlert — port of the web app's CustomAlert.component.js.
 *
 * A 350x70 banner that slides down from the top, coloured by alert type, with
 * the message on the left and a white close button on the right. Hides itself
 * after `timeout`, as the web Snackbar's autoHideDuration does.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';
import { AlertType } from '@constants/enums';
import { Asset } from './Asset';

interface CustomAlertProps {
  message: string;
  type: string;
  show: boolean;
  setAppearance: (show: boolean) => void;
  timeout?: number;
}

const backgroundFor = (type: string): string => {
  if (type === AlertType.SUCCESS) return colors.lightGreen2;
  if (type === AlertType.ERROR) return colors.orange;
  return colors.gray;
};

export const CustomAlert: React.FC<CustomAlertProps> = ({
  message,
  type,
  show,
  setAppearance,
  timeout = 3000,
}) => {
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: show ? 0 : -120,
      duration: 225,
      useNativeDriver: true,
    }).start();

    if (!show) return;
    const timer = setTimeout(() => setAppearance(false), timeout);
    return () => clearTimeout(timer);
  }, [show, timeout]);

  if (!show) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { top: insets.top + 8, transform: [{ translateY: slide }] },
      ]}
    >
      <View style={[styles.alert, { backgroundColor: backgroundFor(type) }]}>
        <Text style={styles.message}>{message}</Text>
        <Asset
          imageName="close_round_white.svg"
          width={30}
          height={30}
          onPress={() => setAppearance(false)}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    width: 350,
    maxWidth: '95%',
    height: 70,
    paddingRight: 10,
    // boxShadow: 0px 4px 4px rgba(0,0,0,0.25)
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  message: {
    flex: 1,
    marginHorizontal: 15,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.white,
  },
});

export default CustomAlert;
