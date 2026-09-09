/**
 * TabBar — port of the web app's TabBar.component.js.
 *
 * A fixed 65px brown bar with four tabs (Diary, Dashboard, Training, More).
 * The selected tab turns orange, gains bold text and a 3px orange underline;
 * the others stay green.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as colors from '../theme/colors';
import { fontFamily, layout } from '../theme';
import { svgAssets } from './assets';

/** Route name → web label and icon asset. */
const TABS: Record<string, { label: string; icon: string }> = {
  Home: { label: 'Diary', icon: 'diary_tab_icon_unselected.svg' },
  Dashboard: { label: 'Dashboard', icon: 'dashboard_tab_icon_unselected.svg' },
  Training: { label: 'Training', icon: 'training_tab_icon_unselected.svg' },
  More: { label: 'More', icon: 'more_tab_icon_unselected.svg' },
};

// isSmallScreen sizing from the web component.
const ICON_SIZE = 25;
const FONT_SIZE = 11;

export const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        { height: layout.tabBarHeight + insets.bottom, paddingBottom: insets.bottom },
      ]}
    >
      {state.routes.map((route, index) => {
        const tab = TABS[route.name];
        if (!tab) return null;

        const isSelected = state.index === index;
        const color = isSelected ? colors.orange : colors.green;
        const Icon = svgAssets[tab.icon];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isSelected && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={isSelected ? { selected: true } : {}}
            accessibilityLabel={tab.label}
            style={[styles.tab, isSelected && styles.tabSelected]}
          >
            {Icon && <Icon width={ICON_SIZE} height={ICON_SIZE} fill={color} />}
            <Text
              style={[
                styles.label,
                {
                  color,
                  fontFamily: isSelected ? fontFamily.bold : fontFamily.regular,
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.brown,
    padding: 5,
    // boxShadow: 0px -3px 10px rgba(0,0,0,0.1)
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  tab: {
    minWidth: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSelected: {
    borderBottomWidth: 3,
    borderBottomColor: colors.orange,
  },
  label: {
    fontSize: FONT_SIZE,
    marginTop: 2,
  },
});

export default TabBar;
