/**
 * Container Component
 * Provides consistent padding and layout
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  center?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  padding = 16,
  center = false,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { padding },
        center && styles.center,
        { backgroundColor: theme.colors.background },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
