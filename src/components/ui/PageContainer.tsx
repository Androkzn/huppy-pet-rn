/**
 * PageContainer — port of the web app's PageContainer.component.js:
 * a centered column, 95% wide, capped at 900px, clear of the fixed chrome.
 *
 * The web reserved 60px at the top for the AppBar and 100px at the bottom for
 * the TabBar; in React Native both are supplied by the navigators, so only the
 * bottom breathing room is kept.
 */

import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  RefreshControl,
  ViewStyle,
  StyleProp,
} from 'react-native';
import * as colors from '../../theme/colors';

interface PageContainerProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /** Set false for screens that manage their own scrolling (e.g. lists). */
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  style,
  contentStyle,
  scroll = true,
  refreshing,
  onRefresh,
}) => {
  const inner = <View style={[styles.page, contentStyle]}>{children}</View>;

  if (!scroll) {
    return <View style={[styles.root, style]}>{inner}</View>;
  }

  return (
    <ScrollView
      style={[styles.root, style]}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    >
      {inner}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '95%',
    maxWidth: 900,
    alignSelf: 'center',
  },
});

export default PageContainer;
