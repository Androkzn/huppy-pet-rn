/**
 * Screen — the scaffold every page sits in.
 *
 * It does the three things iOS 26 expects of a scrolling screen: the content
 * runs edge to edge and passes *under* the glass chrome rather than stopping at
 * it, the large title leads the content and scrolls away into the bar, and the
 * scroll offset is published so the bar can react to it.
 */

import React, { useContext } from 'react';
import {
  RefreshControl,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, spacing } from '@theme/tokens';
import { LargeTitle } from './NavigationBar';
import { tabBarClearance } from './LiquidTabBar';
import { useScrollOffset } from './scrollRegistry';

export interface ScreenProps {
  /** Large title shown at the top of the content. */
  title?: string;
  subtitle?: string;
  /** Trailing control on the large-title row. */
  titleAccessory?: React.ReactNode;
  /** Fixed content between the title and the scrolling body, e.g. a segmented control. */
  header?: React.ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** `grouped` is the inset-list background; `plain` is a flat page. */
  background?: 'grouped' | 'plain';
  /** Content is centred and capped, as a regular-width iOS layout is. */
  maxWidth?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /** Extra room under the content, on top of the chrome clearance. */
  bottomSpacing?: number;
  children?: React.ReactNode;
}

const AnimatedScrollView = Animated.ScrollView;

export const Screen: React.FC<ScreenProps> = ({
  title,
  subtitle,
  titleAccessory,
  header,
  scroll = true,
  refreshing,
  onRefresh,
  background = 'grouped',
  maxWidth = 700,
  style,
  contentStyle,
  bottomSpacing = 0,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const route = useRoute();
  const scrollY = useScrollOffset(route.key);
  // Present only inside the tab navigator; the floating bar needs clearance
  // exactly there and nowhere else.
  const hasTabBar = useContext(BottomTabBarHeightContext) !== undefined;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const paddingTop = insets.top + layout.navBarHeight;
  const paddingBottom =
    (hasTabBar ? tabBarClearance(insets.bottom) : insets.bottom + spacing.base) +
    bottomSpacing;

  const backgroundColor =
    background === 'grouped' ? colors.groupedBackground : colors.systemBackground;

  const body = (
    <>
      {title ? (
        <LargeTitle title={title} subtitle={subtitle} accessory={titleAccessory} />
      ) : null}
      {header}
      <View style={[styles.body, { maxWidth }, contentStyle]}>{children}</View>
    </>
  );

  if (!scroll) {
    return (
      <View style={[styles.root, { backgroundColor }, style]}>
        <View style={{ paddingTop, paddingBottom, flex: 1 }}>{body}</View>
      </View>
    );
  }

  return (
    <AnimatedScrollView
      style={[styles.root, { backgroundColor }, style]}
      contentContainerStyle={[styles.content, { paddingTop, paddingBottom }]}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      // The chrome is translucent, so the indicators must clear it too.
      scrollIndicatorInsets={{ top: paddingTop - insets.top, bottom: paddingBottom }}
      contentInsetAdjustmentBehavior="never"
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={colors.secondaryLabel}
            progressViewOffset={paddingTop}
          />
        ) : undefined
      }
    >
      {body}
    </AnimatedScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  body: {
    width: '100%',
    alignSelf: 'center',
    gap: spacing.lg,
  },
});

export default Screen;
