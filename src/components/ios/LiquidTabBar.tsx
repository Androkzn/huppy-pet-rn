/**
 * LiquidTabBar — the iOS 26 tab bar.
 *
 * The bar is no longer a slab pinned to the bottom edge: it floats above the
 * content as a Liquid Glass capsule, inset from the edges and clear of the home
 * indicator, so the page keeps scrolling visibly beneath it. Selection is a
 * tinted capsule that springs from tab to tab, the chosen glyph swaps to its
 * filled variant, and the whole thing answers a tap with a selection haptic.
 */

import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, motion, radius, textStyles } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Glass } from './Glass';
import { Icon, type SFSymbol } from './Icon';

interface TabSpec {
  label: string;
  symbol: SFSymbol;
  symbolSelected: SFSymbol;
  /** Used where SF Symbols are unavailable. */
  fallbackAsset: string;
}

/** Route name → the bar's presentation of it. */
const TABS: Record<string, TabSpec> = {
  Home: {
    label: 'Diary',
    symbol: 'fork.knife',
    symbolSelected: 'fork.knife',
    fallbackAsset: 'diary_tab_icon_unselected.svg',
  },
  Dashboard: {
    label: 'Dashboard',
    symbol: 'chart.pie',
    symbolSelected: 'chart.pie.fill',
    fallbackAsset: 'dashboard_tab_icon_unselected.svg',
  },
  Training: {
    label: 'Training',
    symbol: 'figure.run',
    symbolSelected: 'figure.run',
    fallbackAsset: 'training_tab_icon_unselected.svg',
  },
  More: {
    label: 'More',
    symbol: 'ellipsis.circle',
    symbolSelected: 'ellipsis.circle.fill',
    fallbackAsset: 'more_tab_icon_unselected.svg',
  },
};

const SIDE_INSET = 16;
const BAR_PADDING = 6;
const ICON_SIZE = 24;

/** Height the content must clear to scroll out from under the floating bar. */
export const tabBarClearance = (bottomInset: number) =>
  layout.tabBarHeight + layout.tabBarInset + Math.max(bottomInset, 10);

interface TabItemProps {
  spec: TabSpec;
  focused: boolean;
  width: number;
  onPress: () => void;
  onLongPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({
  spec,
  focused,
  width,
  onPress,
  onLongPress,
}) => {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);
  const press = useSharedValue(1);

  // The glyph acknowledges selection with a single small rebound.
  useEffect(() => {
    if (!focused) return;
    scale.value = withSequence(
      withSpring(1.18, motion.bouncy),
      withSpring(1, motion.smooth)
    );
  }, [focused, scale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * press.value }],
  }));

  const color = focused ? colors.tint : colors.secondaryLabel;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={spec.label}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        press.value = withSpring(0.92, motion.snappy);
      }}
      onPressOut={() => {
        press.value = withSpring(1, motion.snappy);
      }}
      style={[styles.item, { width }]}
      hitSlop={8}
    >
      <Animated.View style={iconStyle}>
        <Icon
          name={focused ? spec.symbolSelected : spec.symbol}
          size={ICON_SIZE}
          color={color}
          weight={focused ? 'semibold' : 'regular'}
          fallbackAsset={spec.fallbackAsset}
        />
      </Animated.View>
      <Animated.Text
        numberOfLines={1}
        style={[
          styles.label,
          { color },
          focused ? styles.labelSelected : null,
        ]}
      >
        {spec.label}
      </Animated.Text>
    </Pressable>
  );
};

export const LiquidTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
  descriptors,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const [barWidth, setBarWidth] = useState(0);

  const routes = state.routes.filter((route) => TABS[route.name]);
  const count = routes.length || 1;
  const itemWidth = barWidth > 0 ? (barWidth - BAR_PADDING * 2) / count : 0;

  // Index of the focused route within the *rendered* set.
  const focusedIndex = Math.max(
    0,
    routes.findIndex((route) => route.key === state.routes[state.index]?.key)
  );

  const position = useSharedValue(focusedIndex);
  const ready = useSharedValue(0);

  useEffect(() => {
    position.value = withSpring(focusedIndex, motion.smooth);
  }, [focusedIndex, position]);

  useEffect(() => {
    if (itemWidth > 0) ready.value = withTiming(1, { duration: motion.duration.fast });
  }, [itemWidth, ready]);

  const pillStyle = useAnimatedStyle(() => ({
    width: Math.max(itemWidth - 8, 0),
    opacity: ready.value,
    transform: [{ translateX: BAR_PADDING + 4 + position.value * itemWidth }],
  }));

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.host,
        {
          paddingBottom: Math.max(insets.bottom, 10),
          paddingHorizontal: SIDE_INSET,
        },
      ]}
    >
      <Glass
        variant="regular"
        radius={radius.capsule}
        bordered
        style={[
          styles.bar,
          {
            height: layout.tabBarHeight,
            // The floating capsule needs a shadow to read as lifted off the page.
            shadowColor: colors.shadow,
            shadowOpacity: isDark ? 0.5 : 0.16,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 8 },
            elevation: 12,
          },
        ]}
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
      >
        {/* Selection capsule, travelling under the active tab. */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pill,
            {
              backgroundColor: colors.tintSoft,
              top: BAR_PADDING,
              bottom: BAR_PADDING,
            },
            pillStyle,
          ]}
        />

        <View style={styles.row}>
          {routes.map((route) => {
            const spec = TABS[route.name];
            const focused = state.routes[state.index]?.key === route.key;
            const options = descriptors[route.key]?.options;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (event.defaultPrevented) return;
              if (focused) {
                // Repeat taps scroll to top / pop to root, as on iOS.
                navigation.emit({ type: 'tabLongPress', target: route.key });
                return;
              }
              haptics.selection();
              navigation.navigate(route.name as never);
            };

            return (
              <TabItem
                key={route.key}
                spec={{ ...spec, label: (options?.title as string) ?? spec.label }}
                focused={focused}
                width={itemWidth || 0}
                onPress={onPress}
                onLongPress={() =>
                  navigation.emit({ type: 'tabLongPress', target: route.key })
                }
              />
            );
          })}
        </View>
      </Glass>
    </View>
  );
};

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: layout.tabBarInset,
    backgroundColor: 'transparent',
  },
  bar: {
    justifyContent: 'center',
    // Glass clips its material; the shadow has to escape it, so it is drawn on
    // the same view only because iOS renders the layer shadow outside the mask.
    ...Platform.select({ android: { overflow: 'hidden' }, default: {} }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BAR_PADDING,
  },
  pill: {
    position: 'absolute',
    left: 0,
    borderRadius: radius.capsule,
    borderCurve: 'continuous',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: '100%',
  },
  label: {
    ...textStyles.tabLabel,
  },
  labelSelected: {
    fontWeight: '600',
  },
});

export default LiquidTabBar;
