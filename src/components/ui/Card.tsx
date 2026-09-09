/**
 * Custom Card Component
 */

import React from 'react';
import { Card as PaperCard, useTheme } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  mode?: 'elevated';
  style?: ViewStyle;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

interface CardComponent extends React.FC<CardProps> {
  Title: typeof PaperCard.Title;
  Content: typeof PaperCard.Content;
  Cover: typeof PaperCard.Cover;
  Actions: typeof PaperCard.Actions;
}

const CardComponent: CardComponent = ({
  children,
  onPress,
  mode = 'elevated',
  style,
  elevation = 2,
}) => {
  const theme = useTheme();

  return (
    <PaperCard
      mode={mode}
      onPress={onPress}
      style={[styles.card, style]}
      elevation={elevation}
    >
      {children}
    </PaperCard>
  );
};

// Card sub-components
CardComponent.Title = PaperCard.Title;
CardComponent.Content = PaperCard.Content;
CardComponent.Cover = PaperCard.Cover;
CardComponent.Actions = PaperCard.Actions;

export const Card = CardComponent as CardComponent;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
});
