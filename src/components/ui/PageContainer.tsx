/**
 * PageContainer — the page scaffold the screens are written against.
 *
 * It delegates to `Screen`, which places content under the floating glass
 * chrome, publishes the scroll offset the navigation bar reacts to, and clears
 * the tab bar at the bottom.
 */

import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Screen } from '@components/ios/Screen';

interface PageContainerProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /** Set false for screens that manage their own scrolling (e.g. lists). */
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Large title shown at the top of the content. */
  title?: string;
  subtitle?: string;
  /** Trailing control on the large-title row. */
  titleAccessory?: React.ReactNode;
  /** `plain` drops the grouped background, for full-bleed screens. */
  background?: 'grouped' | 'plain';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  style,
  contentStyle,
  scroll = true,
  refreshing,
  onRefresh,
  title,
  subtitle,
  titleAccessory,
  background = 'grouped',
}) => (
  <Screen
    title={title}
    subtitle={subtitle}
    titleAccessory={titleAccessory}
    scroll={scroll}
    refreshing={refreshing}
    onRefresh={onRefresh}
    background={background}
    style={style}
    contentStyle={contentStyle}
  >
    {children}
  </Screen>
);

export default PageContainer;
