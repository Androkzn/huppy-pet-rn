/**
 * Card — a rounded content surface.
 *
 * Wraps the iOS card and keeps the `Card.Title` / `Card.Content` shape the
 * earlier code used, so existing composition still reads the same.
 */

import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Card as IOSCard, type CardProps as IOSCardProps } from '@components/ios/Card';
import { Label } from '@components/ios/Text';
import { spacing } from '@theme/tokens';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: IOSCardProps['variant'];
  style?: StyleProp<ViewStyle>;
  /** Kept for compatibility; elevation is expressed by the variant. */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  edgeToEdge?: boolean;
}

const CardTitle: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <View style={styles.titleBlock}>
    <Label variant="headline">{title}</Label>
    {subtitle ? (
      <Label variant="footnote" role="secondary">
        {subtitle}
      </Label>
    ) : null}
  </View>
);

const CardContent: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => <View style={[styles.content, style]}>{children}</View>;

const CardActions: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => <View style={[styles.actions, style]}>{children}</View>;

const Base: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'surface',
  style,
  elevation,
  edgeToEdge,
}) => (
  <IOSCard
    variant={elevation === 0 ? 'surface' : variant}
    onPress={onPress}
    edgeToEdge={edgeToEdge}
    style={style}
  >
    {children}
  </IOSCard>
);

export const Card = Object.assign(Base, {
  Title: CardTitle,
  Content: CardContent,
  Actions: CardActions,
});

const styles = StyleSheet.create({
  titleBlock: {
    gap: 2,
    marginBottom: spacing.sm,
  },
  content: {
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
