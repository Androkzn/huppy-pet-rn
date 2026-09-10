/**
 * Glass — the Liquid Glass material.
 *
 * On iOS 26 this is the real `UIGlassEffect`: the system lenses the content
 * behind it, bends light at the edges and reacts to motion. Below iOS 26 it
 * degrades to a `UIVisualEffectView` blur, and on the other platforms to a
 * translucent wash. Callers get the same box either way, so layout never
 * depends on which one is in play.
 */

import React from 'react';
import { Platform, StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import {
  GlassContainer as ExpoGlassContainer,
  GlassView,
  isLiquidGlassAvailable,
} from 'expo-glass-effect';
import { useAppTheme } from '@theme/ThemeProvider';

/** True when the OS can draw the real Liquid Glass material. */
export const supportsLiquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

/** True when at least a blur material is available. */
export const supportsBlur = Platform.OS === 'ios';

export interface GlassProps extends ViewProps {
  /**
   * `regular` refracts and adapts to the content behind it — the default for
   * chrome. `clear` is thinner, for glass laid over media.
   */
  variant?: 'regular' | 'clear';
  /** Tints the material, as `UIGlassEffect.tintColor` does. */
  tintColor?: string;
  /**
   * Lets the material respond to touch with the system's own highlight.
   * Reserve it for surfaces that are themselves a control.
   */
  interactive?: boolean;
  /** Corner radius; applied to the material itself so the lens is clipped. */
  radius?: number;
  /** Draws the rim hairline that separates glass from what is behind it. */
  bordered?: boolean;
  /** Blur strength used by the pre-iOS-26 fallback. */
  fallbackIntensity?: number;
  children?: React.ReactNode;
}

export const Glass: React.FC<GlassProps> = ({
  variant = 'regular',
  tintColor,
  interactive = false,
  radius = 0,
  bordered = false,
  fallbackIntensity = 40,
  style,
  children,
  ...rest
}) => {
  const { colors, blurTint, glassScheme } = useAppTheme();

  const shape: ViewStyle = {
    borderRadius: radius,
    borderCurve: 'continuous',
    overflow: 'hidden',
  };

  const rim: ViewStyle | null = bordered
    ? { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.glassBorder }
    : null;

  if (supportsLiquidGlass) {
    return (
      <GlassView
        glassEffectStyle={variant}
        tintColor={tintColor}
        isInteractive={interactive}
        colorScheme={glassScheme}
        style={[shape, rim, style]}
        {...rest}
      >
        {children}
      </GlassView>
    );
  }

  if (supportsBlur) {
    return (
      <View style={[shape, rim, style]} {...rest}>
        <BlurView
          tint={blurTint}
          intensity={variant === 'clear' ? fallbackIntensity * 0.6 : fallbackIntensity}
          style={StyleSheet.absoluteFill}
        />
        {tintColor ? (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { backgroundColor: tintColor }]}
          />
        ) : null}
        {children}
      </View>
    );
  }

  return (
    <View
      style={[shape, rim, { backgroundColor: tintColor ?? colors.glassFallback }, style]}
      {...rest}
    >
      {children}
    </View>
  );
};

/**
 * Groups sibling glass surfaces so they merge and separate as one system, the
 * way the system's own toolbars do. Outside iOS 26 it is a plain view.
 */
export const GlassGroup: React.FC<
  ViewProps & { spacing?: number; children?: React.ReactNode }
> = ({ spacing, style, children, ...rest }) => {
  if (supportsLiquidGlass) {
    return (
      <ExpoGlassContainer spacing={spacing} style={style} {...rest}>
        {children}
      </ExpoGlassContainer>
    );
  }
  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
};

export default Glass;
