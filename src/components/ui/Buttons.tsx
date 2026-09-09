/**
 * Buttons — port of the web app's Buttons.components.js.
 *
 * Same variant names, same geometry, same colors, and the same orange
 * pressed state (the web used `&:active`).
 */

import React from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';
import { Asset } from './Asset';

export type ButtonVariant =
  | 'addButton'
  | 'deleteButton'
  | 'iconButton'
  | 'circleTextButton'
  | 'circleTextTransparentButton'
  | 'circleTextButtonSmall'
  | 'rectangleTextButton'
  | 'chartTextButton'
  | 'login'
  | 'backButton'
  | 'actionNavigationButton';

interface VariantSpec {
  container: ViewStyle;
  text: TextStyle;
  /** Background applied while pressed — the web's `&:active`. */
  pressedBackground?: string;
  /** SVG tint, and its pressed counterpart. */
  fill?: string;
  pressedFill?: string;
}

// 0px 4px 4px rgba(0,0,0,0.25), the web's recurring button shadow.
const buttonShadow: ViewStyle = {
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 4,
};

export const buttonVariants: Record<ButtonVariant, VariantSpec> = {
  addButton: {
    container: {
      backgroundColor: colors.gray,
      borderRadius: 10,
      width: 130,
      height: 35,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      ...buttonShadow,
    },
    text: { color: colors.white, fontFamily: fontFamily.bold, fontSize: 14 },
    pressedBackground: colors.orange,
    fill: colors.white,
  },

  deleteButton: {
    container: {
      backgroundColor: colors.gray,
      borderRadius: 10,
      width: 130,
      height: 35,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      ...buttonShadow,
    },
    text: { color: colors.white, fontFamily: fontFamily.bold, fontSize: 14 },
    pressedBackground: colors.orange,
    fill: colors.white,
  },

  iconButton: {
    container: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: { color: colors.green, fontFamily: fontFamily.bold, fontSize: 14 },
    fill: colors.green,
    pressedFill: colors.orange,
  },

  circleTextButton: {
    container: {
      backgroundColor: colors.lightGreen,
      width: 35,
      height: 35,
      borderRadius: 17.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: { color: colors.white, fontFamily: fontFamily.bold, fontSize: 20 },
    pressedBackground: colors.orange,
  },

  circleTextTransparentButton: {
    container: {
      backgroundColor: 'transparent',
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.lightGreen,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: { color: colors.lightGreen, fontFamily: fontFamily.bold, fontSize: 18 },
  },

  circleTextButtonSmall: {
    container: {
      backgroundColor: colors.lightGreen,
      width: 25,
      height: 25,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: { color: colors.white, fontFamily: fontFamily.bold, fontSize: 18 },
    pressedBackground: colors.orange,
  },

  rectangleTextButton: {
    container: {
      backgroundColor: colors.lightGreen,
      borderRadius: 10,
      width: 150,
      height: 40,
      marginVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: { color: colors.white, fontFamily: fontFamily.bold, fontSize: 14 },
    pressedBackground: colors.orange,
  },

  chartTextButton: {
    container: {
      backgroundColor: colors.olive,
      borderRadius: 10,
      width: 100,
      height: 20,
      marginVertical: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: { color: colors.white, fontFamily: fontFamily.bold, fontSize: 13 },
    pressedBackground: colors.orange,
  },

  login: {
    container: {
      backgroundColor: colors.olive,
      borderRadius: 10,
      width: 150,
      height: 50,
      marginVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: { color: colors.white, fontFamily: fontFamily.bold, fontSize: 18 },
    pressedBackground: colors.lightGreen,
  },

  backButton: {
    container: {
      backgroundColor: colors.brown,
      borderRadius: 10,
      height: 35,
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 10,
      ...buttonShadow,
    },
    text: { color: colors.green, fontFamily: fontFamily.bold, fontSize: 14 },
    pressedBackground: colors.orange,
    fill: colors.green,
  },

  actionNavigationButton: {
    container: {
      backgroundColor: colors.lightGreen,
      borderRadius: 10,
      height: 35,
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 10,
      ...buttonShadow,
    },
    text: { color: colors.white, fontFamily: fontFamily.bold, fontSize: 14 },
    pressedBackground: colors.orange,
  },
};

interface HuppyButtonProps {
  variant: ButtonVariant;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  width?: number;
  height?: number;
  background?: string;
  style?: StyleProp<ViewStyle>;
  /** Leading icon, as the web's ButtonImage/ButtonLink `imageName`. */
  imageName?: string;
  imageSize?: number;
  /** Web default: `margin: 0 10px`. */
  imageMargin?: number;
}

/**
 * Web: ButtonText / ButtonImage / ButtonLink — one component here, since
 * navigation is handled by the caller in React Navigation.
 */
export const HuppyButton: React.FC<HuppyButtonProps> = ({
  variant,
  children,
  onPress,
  disabled,
  width,
  height,
  background,
  style,
  imageName,
  imageSize = 20,
  imageMargin = 10,
}) => {
  const spec = buttonVariants[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        spec.container,
        width !== undefined && { width },
        height !== undefined && { height },
        background !== undefined && { backgroundColor: background },
        pressed && spec.pressedBackground
          ? { backgroundColor: spec.pressedBackground }
          : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      {({ pressed }: { pressed: boolean }) => (
        <>
          {imageName && (
            <View style={{ marginHorizontal: imageMargin }}>
              <Asset
                imageName={imageName}
                width={imageSize}
                height={imageSize}
                fill={pressed ? spec.pressedFill ?? spec.fill : spec.fill}
              />
            </View>
          )}
          {typeof children === 'string' ? (
            <Text style={spec.text}>{children}</Text>
          ) : (
            children
          )}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.4,
  },
});
