/**
 * NavigationBar — the iOS 26 top chrome.
 *
 * The bar is Liquid Glass and floats over the page: content scrolls underneath
 * it and is lensed by the material, instead of stopping at an opaque strip. It
 * starts clear at the top of a screen and, as the large title scrolls away,
 * fades in its compact title and the hairline that separates it from the
 * content — the standard iOS transition.
 *
 * Leading and trailing accessories are circular glass buttons, which is how
 * iOS 26 presents bar controls.
 */

import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, textStyles } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Glass } from './Glass';
import { Icon, type SFSymbol } from './Icon';
import { Label } from './Text';
import { LARGE_TITLE_COLLAPSE, useScrollOffset } from './scrollRegistry';

export interface BarButtonProps {
  symbol: SFSymbol;
  onPress: () => void;
  accessibilityLabel: string;
  tint?: string;
  fallbackAsset?: string;
}

/** A circular glass control, the iOS 26 shape for a bar button. */
export const BarButton: React.FC<BarButtonProps> = ({
  symbol,
  onPress,
  accessibilityLabel,
  tint,
  fallbackAsset,
}) => {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={() => {
        haptics.light();
        onPress();
      }}
      style={({ pressed }) => [styles.barButtonHost, pressed && styles.pressed]}
    >
      <Glass variant="regular" radius={radius.capsule} interactive style={styles.barButton}>
        <Icon
          name={symbol}
          size={19}
          weight="semibold"
          color={tint ?? colors.tint}
          fallbackAsset={fallbackAsset}
        />
      </Glass>
    </Pressable>
  );
};

export interface NavigationBarProps {
  /** Route key the screen writes its scroll offset under. */
  scrollKey?: string;
  /** Compact title; fades in as the large title scrolls under the bar. */
  title?: string;
  /** Always show the title, for screens without a large title. */
  staticTitle?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Centre content that replaces the title, e.g. the day stepper. */
  center?: React.ReactNode;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  scrollKey = 'default',
  title,
  staticTitle = false,
  leading,
  trailing,
  center,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const scrollY = useScrollOffset(scrollKey);

  // Both the material and the separator arrive together, once the page has
  // moved far enough that content would otherwise collide with the bar.
  const chromeStyle = useAnimatedStyle(() => ({
    opacity: staticTitle
      ? 1
      : interpolate(scrollY.value, [0, LARGE_TITLE_COLLAPSE], [0, 1], Extrapolation.CLAMP),
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: staticTitle
      ? 1
      : interpolate(
          scrollY.value,
          [LARGE_TITLE_COLLAPSE * 0.55, LARGE_TITLE_COLLAPSE],
          [0, 1],
          Extrapolation.CLAMP
        ),
    transform: [
      {
        translateY: staticTitle
          ? 0
          : interpolate(
              scrollY.value,
              [LARGE_TITLE_COLLAPSE * 0.55, LARGE_TITLE_COLLAPSE],
              [8, 0],
              Extrapolation.CLAMP
            ),
      },
    ],
  }));

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { height: insets.top + layout.navBarHeight }]}
    >
      {/* The material only materialises once content is behind it. */}
      <Animated.View style={[StyleSheet.absoluteFill, chromeStyle]} pointerEvents="none">
        <Glass variant="regular" style={StyleSheet.absoluteFill} />
        <View
          style={[
            styles.separator,
            { backgroundColor: colors.separator, height: layout.hairline },
          ]}
        />
      </Animated.View>

      <View style={[styles.content, { marginTop: insets.top }]}>
        <View style={styles.side}>{leading}</View>

        <View style={styles.center} pointerEvents="box-none">
          {center ?? (
            <Animated.View style={titleStyle} pointerEvents="none">
              <Label variant="headline" numberOfLines={1} style={styles.title}>
                {title}
              </Label>
            </Animated.View>
          )}
        </View>

        <View style={[styles.side, styles.sideTrailing]}>{trailing}</View>
      </View>
    </View>
  );
};

export interface LargeTitleProps {
  title: string;
  subtitle?: string;
  /** Trailing control on the title row, e.g. an add button. */
  accessory?: React.ReactNode;
}

/**
 * The large title lives in the scroll content, so it slides away under the bar
 * exactly as `UINavigationBar.prefersLargeTitles` does.
 */
export const LargeTitle: React.FC<LargeTitleProps> = ({
  title,
  subtitle,
  accessory,
}) => (
  <View style={styles.largeTitleRow}>
    <View style={styles.largeTitleText}>
      <Label variant="largeTitle" brand numberOfLines={1}>
        {title}
      </Label>
      {subtitle ? (
        <Label variant="subheadline" role="secondary" numberOfLines={1}>
          {subtitle}
        </Label>
      ) : null}
    </View>
    {accessory}
  </View>
);

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  content: {
    height: layout.navBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding - 4,
    gap: 8,
  },
  side: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 44,
  },
  sideTrailing: {
    justifyContent: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  separator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  barButtonHost: {
    borderRadius: radius.capsule,
  },
  barButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: Platform.OS === 'ios' ? 0.75 : 0.6,
  },
  largeTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 4,
    paddingBottom: 10,
  },
  largeTitleText: {
    flex: 1,
    gap: 2,
  },
});

export default NavigationBar;
